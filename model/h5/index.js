//数据库配置
const db= require('../../config/db')
const index = {
	// SQL执行语句
	query(sql,arr){   
		return new Promise((resolve,reject)=>{
           db.query(sql,arr,function(data,err){
                resolve(data)
            })
        })
	},
	// 添加地址
	addAddress: async function(data){
		let sql = "insert into modeladdress(address_name,address_phone,address_province,address_city,address_county,address_addressDetail,address_userid,address_areacode) values(?,?,?,?,?,?,?,?)"
		let arr = []
			arr.push(data.address_name)
			arr.push(data.address_phone)
			arr.push(data.address_province)
			arr.push(data.address_city)
			arr.push(data.address_county)
			arr.push(data.address_addressDetail)
			arr.push(data.userId)
			arr.push(data.address_areacode)
		return this.query(sql,arr)
	},
	// 修该地址
	editAddress: async function(data){
		
		let sql = "update modeladdress set address_name=?,address_phone=?,address_province=?,address_city=?,address_county=?,address_addressDetail=?,address_areacode=?  where id=?"
		let arr = []
			arr.push(data.address_name)
			arr.push(data.address_phone)
			arr.push(data.address_province)
			arr.push(data.address_city)
			arr.push(data.address_county)
			arr.push(data.address_addressDetail)
			arr.push(data.address_areacode)
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 查询 收货地址
	searchAddress: async function(data){
		let sql = "select * from modeladdress where address_userid=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)
	},
	// 根据ID 查询收货地址
	searchAddressId: async function(data){
		let sql = "select * from modeladdress where address_userid=? and id=?"
		let arr = []
			arr.push(data.userId)
			arr.push(data.id)
			console.log(arr);
		return this.query(sql,arr)
	},
	// 提交订单
	addOrder: async function(data){
		let sql = "insert into modelorder(order_address,order_time,order_order,order_price,order_delivery,order_payment,order_message,order_userid,order_createtime,order_code) values(?,?,?,?,?,?,?,?,?,?)"
		let date = new Date
		let orderCode = "DD"+date.getTime()+''+parseInt(Math.random()*1000)
		let arr = []	
			arr.push(JSON.stringify(data.order_address)) 
			arr.push(data.order_time)
			arr.push(JSON.stringify(data.order_order))
			arr.push(data.order_price)
			arr.push(data.order_delivery)
			arr.push(data.order_payment)
			arr.push(data.order_message)
			arr.push(data.userId)
			arr.push(new Date)
			arr.push(orderCode)
		return this.query(sql,arr)
	},
	// 查询订单金额
	searchPay: async function(data){
		let sql = "select id,order_delivery,order_price from modelorder where id=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)	
	},
	// 查询用户金额
	searchPriceUser: async function(data){
		let sql = "select id,money,integral from modelusers where id=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)	
	},
	// 改变订单状态
	setOrderState: async function(data){
		let sql = "update modelorder set order_states=? where id=?"
		let arr = []
			arr.push(data.state)
			arr.push(data.id)
			console.log(arr);
		return this.query(sql,arr)
	},
	// 修该账户金额
	setUserMoney: async function(data){
		let sql = "update modelusers set money=?,integral=? where id=?"
		let arr = []
			arr.push(data.money.toFixed(2))
			arr.push(parseFloat(data.integral))
			arr.push(data.userId)
			console.log(arr);
		return this.query(sql,arr)
	},
	// 获取个人信息
	getHome: async function(data){
		let sql = "select id,money,integral,phone,image from modelusers where id=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)
	},
	// 获取所有订单数量
	getOrderNumber: async function(data){
		let sql = "select id,order_states from modelorder where order_states<7 and order_userid=?"
		let arr = []
			arr.push(data)
		return this.query(sql,arr)
	},
	// 获取所有订单信息
	getOrderNumberAll: async function(data){
		let sql = "select id,order_order,order_price,order_delivery,order_states,order_createtime from modelorder where order_userid=? order by id desc limit ?,?"
		let arr = []
			arr.push(data.userId)
			arr.push(data.start)
			arr.push(data.nums)
		return this.query(sql,arr)
	},
}


module.exports = index;