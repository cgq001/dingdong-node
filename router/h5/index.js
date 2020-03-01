// 含Token 路由
const express = require('express');
const jwt = require('jsonwebtoken')
const Routers = express.Router();

// 全局验证Token是否合法
const tokens = require('../../token/H5/index')

Routers.use(tokens)

// // 引入含Token函数
const indexFn = require('../../model/h5/index')

// 如果token过期或者 错误的处理
Routers.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {   
        //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
      // res.status(401).send('非法token');
        res.json({
            code: 400,
            msg: '无效Token'
        })
    }
  })

// 添加或修该地址信息
Routers.post('/address',function(req,res){
	req.body.userId = req.user.id
	if(req.body.id){
		indexFn.editAddress(req.body)
				.then(idea=>{
					res.json({
						code: 0 ,
						msg:'修该成功'
					})
				})
				.catch(err=>{
					res.json({
						code: 4,
						msg: '修该失败'
					})
				})
	}else{
		indexFn.addAddress(req.body)
			.then(ides=>{
				res.json({
					code: 0,
					msg: '添加成功'
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '添加失败'
				})
			})
	}
})

// 查询 所有收货地址
Routers.get('/searchAddress',function(req,res){
	let id = req.user.id 
	indexFn.searchAddress(id)
			.then(idea=>{
				res.json({
					code: 0,
					data: idea
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '获取信息错误'
				})
			})
})
// 根据ID 查询 收货地址信息
Routers.get('/searchAddressId',function(req,res){
	let src = {
				userId: req.user.id ,
				id: req.query.id
			}

	indexFn.searchAddressId(src)
			.then(idea=>{
				res.json({
					code: 0,
					data: idea[0]
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '获取信息错误'
				})
			})
})

// 提交订单
Routers.post('/addOrder',function(req,res){
	req.body.userId = req.user.id 

	indexFn.addOrder(req.body)
			.then(ides=>{
				res.json({
					code: 0,
					data:{
						id: ides.insertId,
						price: (parseFloat(req.body.order_price)+parseFloat(req.body.order_delivery)).toFixed(2)
					}
				})
			})
			.catch(err=>{
				console.log(err);
				res.json({
					code: 4,
					msg: '订单提交失败'
				})
			})
})
// 支付 
Routers.post('/addPays',function(req,res){
	req.body.userId = req.user.id 
	 let all = async function (){
	 	let price = await indexFn.searchPay(req.body.id);
	 	let userPrice = await indexFn.searchPriceUser(req.body.userId);
	 	return {
	 		price: price[0],
	 		userPrice: userPrice[0]
	 	}
	 }

	 all()
	 	.then(idea=>{
	 		if(idea.price.order_price){
	 			let allPay = (parseFloat(idea.price.order_delivery) + parseFloat(idea.price.order_price)).toFixed(2)
	 			let userPrice = parseFloat(idea.userPrice.money)

	 				console.log(parseFloat(idea.userPrice.integral),allPay,allPay+parseFloat(idea.userPrice.integral));
	 				if ((userPrice - allPay) > 0) {
	 					indexFn.setOrderState({
	 						state: 2,
	 						id: req.body.id
	 					})
	 					.then(ideas=>{
	 						indexFn.setUserMoney({
	 							money: userPrice - allPay,
	 							integral: (parseFloat(allPay)+parseFloat(idea.userPrice.integral)).toFixed(2),
	 							userId: req.body.userId
	 						})
	 						.then(ideal=>{
	 							res.json({
	 								code: 0,
	 								msg: '支付成功'
	 							})
	 						})
	 						.catch(err=>{
	 							res.json({
						 				code: 4,
						 				msg: '订单错误'
						 			})
	 						})
	 					})
	 					.catch(err=>{
	 						console.log(err);
	 						res.json({
				 				code: 4,
				 				msg: '订单错误'
				 			})
	 					})

	 				}else{
	 					res.json({
			 				code: 1,
			 				msg: '余额不足'
			 			})
	 				}
	 		}else{
	 			res.json({
	 				code: 4,
	 				msg: '订单错误'
	 			})
	 		}
	 	})
})

// 个人信息
Routers.get('/getHome',function(req,res){
	req.body.userId = req.user.id 
	
	let all = async function(){
		let userList = await indexFn.getHome(req.body.userId)
		let orderNumber = await indexFn.getOrderNumber(req.body.userId)
		// console.log(userList,orderNumber);
		return {
			userList:userList[0],
			orderNumber
		}
	}
	all()
		.then(idea=>{
			res.json({
				code: 0,
				data: idea
			})
		})
		.catch(err=>{
			res.json({
				code: 4,
				msg: '获取信息失败'
			})
		})
})

// 获取订单信息
Routers.post('/getOrderAlls',function(req,res){
	let src ={
		userId: req.user.id ,
		start: (parseInt(req.body.page)-1)*parseInt(req.body.pageSize),
		nums: req.body.pageSize
	}

	indexFn.getOrderNumberAll(src)
			.then(ides=>{
				res.json({
					code: 0,
					data: ides
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '获取订单信息失败'
				})
			})
})
module.exports = Routers;