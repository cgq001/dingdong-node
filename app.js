
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

// 配置静态目录
app.use(express.static(path.join(__dirname,'public')))

// 配置body-parser
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

// 配置跨域
app.use(cors());

// 引入admin/index路由文件 含token
const adminIndex = require('./router/admin/index')
app.use('/admin/index',adminIndex)

// 引入admin/nottoken路由文件  无token
const adminNottoken = require('./router/admin/nottoken')
app.use('/admin/nottoken',adminNottoken)


// 引入 移动端H5路由文件 无token
const h5Nottoken = require('./router/h5/nottoken')
app.use('/h5/nottoken',h5Nottoken)

//  引入 移动端H5路由文件 含Token
const h5Index = require('./router/h5/index')
app.use('/h5/index',h5Index)

const port = process.env.PORT || 5005

app.listen(port,()=>{
	console.log('开启服务器')
})
