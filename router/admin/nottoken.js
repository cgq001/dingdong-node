// 无Token 路由
const express = require('express');

const Routers = express.Router();
const moment = require('moment');
var path = require('path')
const fs = require('fs')

// 引入加密规则
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

//含Token  数据库操作函数
const fn = require('../../model/admin/user')
// 无token 数据库查询方法
const nottoken = require('../../model/admin/nottoken')
//获取图片等文件
var formidable = require('formidable');

//引入JWT
const jwt = require('jsonwebtoken')
//token 加密内容
const { tokenKey } =require('../../token/admin/constant')


//七牛云配置
const qiniu = require('qiniu')

const accessKey = 'GuYFhWkZSiHVoVZoEx9dN09PHlMZtFj04T9Cvirc'
const secretKey = 'VSfLPuec3e8K9fN9IMDJijLkKHVXAEBGSQGjWjY3'
const bucket = 'bodebook'


// 验证服务是否开启
Routers.get('/', (req,res) => {
    
    console.log(req.user);  //解析token，获取token携带的数据

    setTimeout(function(){
      res.json({
            code: 0,
            msg: '查询成功',
            data:{
                username: '这是首页呀'
            }
        })
    },500);
})



// 七牛云 Token
// Routers.get('/uploadtoken', (req,res) => {
    
//    let mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
//    let options = {
//         scope: bucket,
//         expires: 3600 * 24
//    }

//     let putPolicy = new qiniu.rs.PutPolicy(options)
//     let uploadToken = putPolicy.uploadToken(mac)


//     setTimeout(function(){
//       res.json({
//             code: 0,
//             msg: '查询成功',
//             data:{
//                 username: '这是首页呀',
//                 uploadToken: uploadToken
//             }
//         })
//     },2000);
// })

      
// 七牛云 上传
// Routers.post('/upload', (req,res) => {
//     let form = new formidable.IncomingForm();
//         form.parse(req, function (err, fields, filesa){
//                 console.log(filesa.file);
//                 let MathRoundNumber = Math.round(Math.random()*100000)
//                  let MathRound = moment().format("YYYY_MM_DD_hh_mm_ss")
//                 let key = MathRound+MathRoundNumber+filesa.file.type // MathRound+filesa.file.name
//                 let  path= filesa.file.path


//                let mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
//                let options = {
//                     scope: bucket,
//                     expires: 3600 * 24
//                }

//                 let putPolicy = new qiniu.rs.PutPolicy(options)
//                 let uploadToken = putPolicy.uploadToken(mac)

//                 uploadFile(uploadToken, key, path).then(idea=>{
//                     console.log('上传成功');
//                     res.json({
//                         code: 0,
//                         msg: '上传成功',
//                         data:{
//                             url: "http://img.nodebook.top/"+idea.key
//                         }
//                     })
//                 })
//                 .catch(err=>{
//                     //其实这种情况 也上传了图片,为了严禁起见
//                     if(err.key){
//                         res.json({
//                             code: 4,
//                             msg: '上传失败',
//                             data:{
//                                  url: "http://img.nodebook.top"+err.key
//                             }
//                         })
//                     }else{
//                         res.json({
//                             code: 4,
//                             msg: '上传失败',
//                             data:{
//                                  url: ''
//                             }
//                         })
//                     }          
                    
//                 })
//             //构造上传函数
//               async  function uploadFile(uptoken, key, localFile) {
             
//                      var config = new qiniu.conf.Config();
//                         // 空间对应的机房
//                         config.zone = qiniu.zone.Zone_z0;
//                     var formUploader = new qiniu.form_up.FormUploader(config);
//                     var putExtra = new qiniu.form_up.PutExtra();
//                     return  new Promise((resolve,reject)=>{
//                         // 文件上传
//                             formUploader.putFile(uptoken, key, localFile, putExtra, function(respErr,
//                               respBody, respInfo) {
//                               if (respErr) {
//                                 throw respErr;
//                               }
//                               if (respInfo.statusCode == 200) {
//                                 resolve(respBody)
//                               } else {
//                                 reject(respBody)   //其实这种情况 也上传了图片,为了严禁起见
//                               }
//                             })
//                      })
//                 }  
//         })
// })


// 注册
Routers.post('/registered',(req,res)=>{

      req.body.password = bcrypt.hashSync(req.body.password,salt);

      nottoken.addUser(req.body)
              .then(idea =>{
                if( idea instanceof Array){
                     res.json({
                      code: 4,
                      msg: '注册失败,用户名已存在'
                    })
                }else{
                   res.json({
                      code: 0,
                      msg: '注册成功'
                    })
                }             
              })
              .catch(err=>{
                  res.json({
                      code: 4,
                      msg: '未知错误'
                    })
              })
})

// 登录
Routers.post('/login',(req,res)=>{
    nottoken.searchUser(req.body.user)
            .then(idea => {
              if(idea && idea.length > 0){
                if(bcrypt.compareSync(req.body.password,idea[0].password)){

                    let tokenObj={   //携带参数
                            id: idea[0].id,
                            username: idea[0].user
                        }
                        // let tokenKey = tokenKey  //加密内容
                        console.log(tokenObj);
                        
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
                  res.json({
                    code: 4,
                    msg: '用户名或密码错误'
                  })
                }
              }else{
                  res.json({
                      code: 4,
                      msg: '用户名不存在'
                    })
              }
            })
            .catch(err=>{
                    res.json({
                      code: 4,
                      msg: '网络连接错误'
                    })
            })
})
// 获取分类列表
Routers.get('/getSort',(req,res)=>{
    let all = async function (){
        let datas = await  nottoken.getSort(req.query)
        let total = await nottoken.allSortNum(req.query.msg)
        return data={
            list: datas,
            total : parseInt(total[0].total)
        }
    }
    all()
        .then(ideas => {
            res.json({
                code: 0,
                data: ideas
            })
        })
        .catch(err=>{
          console.log(err);
            res.json({
                code: 4,
                msg: '查询失败'
            })
        })
})
// 查询 某一分类详情
Routers.get('/getSortItem',(req,res)=>{
    nottoken.getSortItem(req.query)
        .then(idea=>{
            if(idea.length>0){
                res.json({
                code: 0,
                    data: idea[0]
                })
            }else{
                res.json({
                    code: 4,
                    msg: '该分类不存在'
                })
            }
            
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '查询失败'
            })
        })
})
// 获取所有分类
Routers.get('/getSortList',(req,res)=>{
    nottoken.getSortList()
            .then(idea=>{
              res.json({
                code: 0,
                data: idea
              })
            })
            .catch(err=>{
                res.json({
                    code: 4,
                    msg: '查询失败'
                })
            })
})
// 获取商品列表
Routers.get('/getGoods',(req,res)=>{
    let all = async function (){
        let datas = await  nottoken.getGoods(req.query)
        let total = await nottoken.allGoodsNum(req.query)
        return data={
            list: datas,
            total : parseInt(total[0].total)
        }
    }
    all()
        .then(ideas => {
            res.json({
                code: 0,
                data: ideas
            })
        })
        .catch(err=>{
          console.log(err);
            res.json({
                code: 4,
                msg: '查询失败'
            })
        })
})
// 获取某一商品详情
Routers.get('/getGoodItem',(req,res)=>{
    let all = async function (){
        let srcList = await  nottoken.getGoodItem(req.query)
        let sortList = await nottoken.getSortList()
        return data={
            srcList,
            sortList
        }
    }
    all()
        .then(ideas => {
          if(ideas.srcList.length>0){
              ideas.srcList = ideas.srcList[0]
              res.json({
                  code: 0,
                  data: ideas
                })
          }else{
              res.json({
                    code: 4,
                    msg: '该分类不存在'
                })
          }
            
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '查询失败'
            })
        })
})

// 获取轮播图列表
Routers.get('/getSwipers',(req,res)=>{
    let all = async function (){
        let datas = await  nottoken.getSwipers(req.query)
        let total = await nottoken.allSwiperNum(req.query)
        return data={
            list: datas,
            total : parseInt(total[0].total)
        }
    }
    all()
        .then(ideas => {
            res.json({
                code: 0,
                data: ideas
            })
        })
        .catch(err=>{
          console.log(err);
            res.json({
                code: 4,
                msg: '查询失败'
            })
        })
})
// 获取 轮播图详情
Routers.get('/getSwiperItem',(req,res)=>{
    nottoken.getSwiperItem(req.query)
            .then(idea=>{
              console.log(idea);
                if (idea.length>0) {
                    res.json({
                        code: 0,
                        data: idea[0]
                    })
                }else{
                  res.json({
                      code: 4,
                      msg: '轮播图不存在'
                    })
                }

            })
            .catch(err=>{
              console.log(err);
              res.json({
                code: 4,
                msg: '未知错误'
              })
            })
})
// 获取关键词列表
Routers.get('/getKeywords',(req,res)=>{
  let all = async function (){
        let datas = await  nottoken.getKeywords(req.query)
        let total = await nottoken.allKeywordsNum(req.query)
        return data={
            list: datas,
            total : parseInt(total[0].total)
        }
    }
    all()
        .then(ideas => {
            res.json({
                code: 0,
                data: ideas
            })
        })
        .catch(err=>{
          console.log(err);
            res.json({
                code: 4,
                msg: '查询失败'
            })
        })
})
module.exports = Routers;