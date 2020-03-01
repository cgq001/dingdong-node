
// 引入 mysql 数据库连接依赖
const mysql = require("mysql");

// 创建 mysql 连接池并配置参数
const pool = mysql.createPool({
    host: "127.0.0.1",    // 主机地址
    port: 3323,                 // 端口
    user: "root",               // 数据库访问账号
    password: "00000",         // 数据库访问密码
    database: "dingdong",       // 要访问的数据库
    charset: "UTF8_GENERAL_CI", // 字符编码 ( 必须大写 )
    typeCast: true,             // 是否把结果值转换为原生的 javascript 类型
    supportBigNumbers: true,    // 处理大数字 (bigint, decimal), 需要开启 ( 结合 bigNumberStrings 使用 )
    bigNumberStrings: true,     // 大数字 (bigint, decimal) 值转换为javascript字符对象串
    multipleStatements: false,  // 允许每个mysql语句有多条查询, 未防止sql注入不开启
    //connectTimeout: 5000,     // 数据库连接超时时间, 默认无超时
});
// console.log(pool);

pool.connectionLimit = 10;      // 连接池中可以存放的最大连接数量
pool.waitForConnections = true; // 连接使用量超负荷是否等待, false 会报错
pool.queueLimit = 0;            // 每个连接可操作的 列数 上限, 0 为没有上限

// 对外暴漏从连接池中获取数据库连接的方法
exports.query = function(sql, arr, callback){
    //建立链接
    pool.getConnection(function(err,connection){
        if(err){throw err;return;}
        connection.query(sql,arr,function(error,results,fields){
            //将链接返回到连接池中，准备由其他人重复使用
            connection.release();
            if(error) throw error;
            //执行回调函数，将数据返回  callback &amp;&amp;
            callback && callback(results,fields);
        });
    });
};

