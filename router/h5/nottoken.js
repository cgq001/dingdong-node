// 无Token 路由  H5页面
const express = require('express');

const Routers = express.Router();

const jwt = require('jsonwebtoken')


// 引入无token函数
const h5Nottoken = require('../../model/h5/nottoken')

const { tokenKey } =require('../../token/H5/constant')





Routers.get('/',function(req,res){
	res.json({
		code: 0,
		msg: 'H5测试页面'
	})
})

// 查询 首页 猜你喜欢
Routers.get('/homeLive',function(req,res){

	h5Nottoken.homeLive(req.query)
				.then(idea=>{
					res.json({
						code: 0,
						data: idea
					})
				})
				.catch(err=>{
					res.json({
						code: 4,
						msg: '获取数据错误'
					})
				})
})
// 商品详情
Routers.get('/searchGood',function(req,res){
	h5Nottoken.searchGood(req.query)
				.then(idea=>{
					res.json({
						code: 0,
						data: idea[0]
					})
				})
				.catch(err=>{
					console.log(err);
					res.json({
						code: 4,
						msg: '获取数据错误'
					})
				})
})
// 登陆
Routers.post('/login',function(req,res){
	h5Nottoken.searchUser(req.body)
				.then(idea=>{

					if(idea.length > 0){
						
						let tokenObj={   //携带参数
                            id: idea[0].id,
                            phone: idea[0].phone
                        }
                        // let tokenKey = tokenKey  //加密内容
                      
                        
                        let token = jwt.sign(tokenObj,tokenKey,{
                            expiresIn: 60*60*24   // token时长
                        })

                        res.json({
                            code: 0,
                            msg: '登陆成功',
                            data:{
                              token: "Bearer "+token
                            }
                        })


					}else{
						h5Nottoken.addUser(req.body)
								.then(ideas=>{
									console.log(ideas.insertId); //影响的ID
									let tokenObj={   //携带参数
				                            id: ideas.insertId,
				                            phone: req.body.phone
				                        }
				                        // let tokenKey = tokenKey  //加密内容
				                      
				                        
				                        let token = jwt.sign(tokenObj,tokenKey,{
				                            expiresIn: 60*60*24   // token时长
				                        })

				                        res.json({
				                            code: 0,
				                            msg: '登陆成功',
				                            data:{
				                              token: "Bearer "+token
				                            }
				                        })
								})
					}
				})
				.catch(err=>{
					res.json({
						code: 4,
						msg: "未知错误"
					})
				})


})
// 获取首页 分类导航
Routers.get('/getOneClass',function(req,res){
	h5Nottoken.getOneClass()
			.then(ides=>{
				res.json({
					code: 0,
					data: ides
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '获取分类失败'
				})
			})
})
// 疯狂抢购
Routers.get('/getInsane',function(req,res){
	h5Nottoken.getInsane()
			.then(ides=>{
				res.json({
					code: 0,
					data: ides
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '获取分类失败'
				})
			})
})
// 获取关键词和首页轮播图
Routers.get('/getSwipers',function(req,res){
	let all = async function(){
		let swipers = await h5Nottoken.getSwipers()
		let keycode = await h5Nottoken.getKeyCode()
		return {
			swipers,
			keycode
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
// 获取分类
Routers.get('/getAllClass',function(req,res){
	 h5Nottoken.getAllClass()
	 			.then(idea=>{
	 				if(idea.length > 0){
	 					h5Nottoken.getOneAllGoods(idea[0].id)
	 							.then(ideas=>{
	 								res.json({
				 						code: 0,
				 						data: {
				 							class: idea,
				 							goods: ideas
				 						}
				 					})
	 							})
	 				}else{
	 					res.json({
	 						code: 0,
	 						data: {
	 							class: idea,
	 							goods: []
	 						}
	 					})
	 				}
	 			})
	 			.catch(err=>{
	 				res.json({
	 						code: 4,
	 						msg: '获取分类失败'
	 					})
	 			})
})
// 根据ID　获取某一分类下的所有商品
Routers.get('/getOneAllGoods',function(req,res){
	h5Nottoken.getOneAllGoods(req.query.id)
	 			.then(ideas=>{
	 				res.json({
				 		code: 0,
				 		data: ideas
				 	})
	 			})
	 			.catch(err=>{
	 				res.json({
	 						code: 4,
	 						msg: '获取分类失败'
	 					})
	 			})
})
// 获取购物车页的猜你喜欢
Routers.get('/getBuyGoods',function(req,res){
	h5Nottoken.getBuyGoods(req.query)
	 			.then(ideas=>{
	 				res.json({
				 		code: 0,
				 		data: ideas
				 	})
	 			})
	 			.catch(err=>{
	 				res.json({
	 						code: 4,
	 						msg: '获取分类失败'
	 					})
	 			})
})
// 获取订单详情
Routers.get('/getOrderDetails',function(req,res){
	h5Nottoken.getOrderDetails(req.query.id)
			.then(idea=>{
				res.json({
					code: 0,
					data: idea[0]
				})
			})
			.catch(err=>{
				res.json({
					code: 4,
					msg: '为查询到相关订单'
				})
			})
})
module.exports = Routers;