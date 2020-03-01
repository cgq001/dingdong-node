//数据库配置
const db= require('../../config/db')
const notnoken = {
	// SQL执行语句
	query(sql,arr){   
		return new Promise((resolve,reject)=>{
           db.query(sql,arr,function(data,err){
                resolve(data)
            })
        })
	},

	// 查询 首页 猜你喜欢
	homeLive: async function(data){
		let start = (data.current - 1) * data.pageSize
		let pageSize = parseInt(data.pageSize)

		let sql = "select id,name,price,vip_price,propaganda from goods where one_live=1 and removes=1 and shows=1 limit ?,?"
		let arr = []
			arr.push(start)
			arr.push(pageSize)
		return this.query(sql,arr)
	},
	// 查询 商品详情
	searchGood: async function(data){
		let sql = "select * from goods where id=?"
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 查询用户是否存在
	searchUser: async function(data){
		let sql = "select id,phone from modelusers where phone=?"
		let arr = []
			arr.push(data.phone)
		return this.query(sql,arr)
	},
	// 注册 用户
	addUser: async function(data){
		let sql = "insert into modelusers(phone,createtime,image) values(?,?,?)"
		let arr = []
			arr.push(data.phone)
			arr.push(new Date())
			arr.push('http://public.nodebook.top/fd123a3921e910809fba9da0101bf8f6.jpg')
		return this.query(sql,arr)
	},
	// 获取首页 分类导航
	getOneClass: async function(){
		let sql = "select id,name,image from sort where shows=1 and removes=1 and one_sort=1"
		let arr = []

		return this.query(sql,arr)
	},
	// 疯狂抢购
	getInsane: async function(){
		let sql = "select id,name,price,vip_price,propaganda from goods where buy=1 and removes=1 and shows=1"
		let arr = []
		return this.query(sql,arr)
	},
	// 获取轮播图
	getSwipers: async function(){
		let sql = "select * from swipers where removes=1"
		let arr = []
		return this.query(sql,arr)
	},
	// 获取关键词
	getKeyCode: async function(){
		let sql = "select * from keywords"
		let arr = []
		return this.query(sql,arr)
	},
	// 获取所有的分类
	getAllClass: async function(){
		let sql = "select id,name from sort where shows=1 and removes=1"
		let arr = []
		return this.query(sql,arr)
	},
	// 获取某一分类下的商品
	getOneAllGoods: async function(data){
		let sql = "select id,name,bewrite,price,vip_price,propaganda from goods where shows=1 and removes=1 and sort_id=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)
	},
	// 获取分类页的猜你喜欢
	getBuyGoods: async function(data){
		let start = (data.current - 1) * data.pageSize
		let pageSize = parseInt(data.pageSize)

		let sql = "select id,name,price,vip_price,propaganda from goods where car=1 and removes=1 and shows=1 limit ?,?"
		let arr = []
			arr.push(start)
			arr.push(pageSize)
		return this.query(sql,arr)
	},
	getOrderDetails: async function(data){
		let sql = "select * from modelorder where id=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)
	}
}

module.exports = notnoken;