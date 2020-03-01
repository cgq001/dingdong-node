
// 含Token 路由
const express = require('express');
const jwt = require('jsonwebtoken')
const Routers = express.Router();

const moment = require('moment');
var path = require('path')
const fs = require('fs')

//获取图片等文件
var formidable = require('formidable');

//七牛云配置
const qiniu = require('qiniu')

const accessKey = 'GuYFhWkZSiHVoVZoEx9dN09PHlMZtFj04T9Cvirc'
const secretKey = 'VSfLPuec3e8K9fN9IMDJijLkKHVXAEBGSQGjWjY3'
const bucket = 'bodebook'


//含Token  数据库操作函数
const fn = require('../../model/admin/user')
// 无token 数据库查询方法
const nottoken = require('../../model/admin/nottoken')

const { tokenKey } =require('../../token/admin/constant')

// 全局验证Token是否合法
const tokens = require('../../token/admin/index')

Routers.use(tokens)



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


// 验证服务是否开启
Routers.get('/', (req,res) => {
    
    console.log(req.user);  //解析token，获取token携带的数据

    res.json({
        code: 0,
        msg: '查询成功',
        data:{
            username: '这是首页'
        }
    })

    /**
    * 数据库操作
    * fn.loadUser(req.body.email)
    *    .then(ideas=>{})
    */ 
})

// 七牛云 上传
Routers.post('/upload', (req,res) => {
    let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, filesa){
                // console.log(filesa.file);
                let MathRoundNumber = Math.round(Math.random()*100000)
                 let MathRound = moment().format("YYYY_MM_DD_hh_mm_ss")
                let key = MathRound+MathRoundNumber+filesa.file.type // MathRound+filesa.file.name
                let  path= filesa.file.path


               let mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
               let options = {
                    scope: bucket,
                    expires: 3600 * 24
               }

                let putPolicy = new qiniu.rs.PutPolicy(options)
                let uploadToken = putPolicy.uploadToken(mac)

                uploadFile(uploadToken, key, path).then(idea=>{
                    // console.log('上传成功');
                    res.json({
                        code: 0,
                        msg: '上传成功',
                        data:{
                            url: "http://img.nodebook.top/"+idea.key
                        }
                    })
                })
                .catch(err=>{
                    //其实这种情况 也上传了图片,为了严禁起见
                    if(err.key){
                        res.json({
                            code: 4,
                            msg: '上传失败',
                            data:{
                                 url: "http://img.nodebook.top"+err.key
                            }
                        })
                    }else{
                        res.json({
                            code: 4,
                            msg: '上传失败',
                            data:{
                                 url: ''
                            }
                        })
                    }          
                    
                })
            //构造上传函数
              async  function uploadFile(uptoken, key, localFile) {
             
                     var config = new qiniu.conf.Config();
                        // 空间对应的机房
                        config.zone = qiniu.zone.Zone_z0;
                    var formUploader = new qiniu.form_up.FormUploader(config);
                    var putExtra = new qiniu.form_up.PutExtra();
                    return  new Promise((resolve,reject)=>{
                        // 文件上传
                            formUploader.putFile(uptoken, key, localFile, putExtra, function(respErr,
                              respBody, respInfo) {
                              if (respErr) {
                                throw respErr;
                              }
                              if (respInfo.statusCode == 200) {
                                resolve(respBody)
                              } else {
                                reject(respBody)   //其实这种情况 也上传了图片,为了严禁起见
                              }
                            })
                     })
                }  
        })
})


// 获取用户信息
Routers.get('/getUser',(req,res)=>{
    fn.getUser(req.user.id)
        .then(idea => {
            res.json({
                code: 0,
                data: idea[0]
            })
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '获取用户信息失败'
            })
        })
})
// 添加或修改分类
Routers.post('/addSort',(req,res)=>{
    req.body.userid = req.user.id
    if(req.body.id){


        fn.editSort(req.body)
            .then(idea=>{
                console.log(idea);
                res.json({
                    code: 0,
                    msg: '修改分类成功',
                    data: {
                        type: 1 
                    }
                })
            })
            .catch(err=>{
       
                res.json({
                    code: 4,
                    msg: '修改分类失败'
                })
            })
    }else{
        fn.addSort(req.body)
            .then(idea=>{
                res.json({
                    code: 0,
                    msg: '添加分类成功',
                    data: {
                        type: 0 
                    }
                })
            })
            .catch(err=>{
                // console.log(err);
                res.json({
                    code: 4,
                    msg: '添加分类失败'
                })
            })
        
    }
})


// 修改分类 是否上线
Routers.post('/updataSortShows',(req,res)=>{
    fn.updataSortShows(req.body)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '修改成功',
                data: idea
            })
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '修改失败'
            })
        })

})
//  删除 某一分类
Routers.get('/removeSort',(req,res)=>{
    fn.removeSort(req.query)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '删除成功'
            })
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '未知错误'
            })
        })
})

// 添加商品详情
Routers.post('/addGoods',(req,res)=>{
    req.body.userid = req.user.id
    if(req.body.id){
        fn.editGood(req.body)
            .then(idea=>{
                console.log(idea);
                res.json({
                    code: 0,
                    msg: '修改商品成功',
                    data: {
                        type: 1 
                    }
                })
            })
            .catch(err=>{
       
                res.json({
                    code: 4,
                    msg: '修改商品失败'
                })
            })
    }else{
        fn.addGoods(req.body)
            .then(idea=>{
                res.json({
                    code: 0,
                    msg: '添加成功',
                    data: {
                        type: 0
                    }
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
// 删除 某一 商品
Routers.get('/removeGood',(req,res)=>{
    fn.removeGood(req.query)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '删除成功'
            })
        })
        .catch(err=>{
            console.log(err);
            res.json({
                code: 4,
                msg: '未知错误'
            })
        })
})
// 修改商品 是否上线
Routers.post('/updataGoodShows',(req,res)=>{
    fn.updataGoodShows(req.body)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '修改成功',
                data: idea
            })
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '修改失败'
            })
        })
})
// 修改商品 会员价
Routers.post('/updataGoodShowVip',(req,res)=>{
    fn.updataGoodShowVip(req.body)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '修改成功',
                data: idea
            })
        })
        .catch(err=>{
            res.json({
                code: 4,
                msg: '修改失败'
            })
        })
})
// 添加 首屏 轮播图
Routers.post('/addSwiper',(req,res)=>{
    req.body.user_id = req.user.id
    if(req.body.id){
        fn.editSwiper(req.body)
            .then(idea=>{
                res.json({
                    code: 0,
                    msg: '修改商品成功',
                    data: {
                        type: 1 
                    }
                })
            })
            .catch(err=>{
       
                res.json({
                    code: 4,
                    msg: '修改商品失败'
                })
            })
    }else{
        fn.addSwiper(req.body)
            .then(idea=>{
                res.json({
                    code: 0,
                    msg: '添加成功',
                    data: {
                        type: 0
                    }
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
// 删除 轮播图
Routers.get('/removeSwiper',(req,res)=>{
    fn.removeSwiper(req.query)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '删除成功'
            })
        })
        .catch(err=>{
            console.log(err);
            res.json({
                code: 4,
                msg: '未知错误'
            })
        })
})
// 添加关键词
Routers.post('/addKeyword',(req,res)=>{
     req.body.user_id = req.user.id
    if(req.body.id){
        fn.editKeyword(req.body)
            .then(idea=>{
                res.json({
                    code: 0,
                    msg: '修改商品成功',
                    data: {
                        type: 1 
                    }
                })
            })
            .catch(err=>{
       
                res.json({
                    code: 4,
                    msg: '修改商品失败'
                })
            })
    }else{
        fn.addKeyword(req.body)
            .then(idea=>{
                res.json({
                    code: 0,
                    msg: '添加成功',
                    data: {
                        type: 0
                    }
                })
            })
            .catch(err=>{
                 res.json({
                    code: 4,
                    msg: '添加失败'
                })
            })
    }
// 删除 关键词
Routers.get('/removeKeyword',(req,res)=>{
    console.log('155');
    fn.removeKeyword(req.query)
        .then(idea=>{
            res.json({
                code: 0,
                msg: '删除成功'
            })
        })
        .catch(err=>{
            console.log(err);
            res.json({
                code: 4,
                msg: '未知错误'
            })
        })
    })
})
module.exports = Routers;