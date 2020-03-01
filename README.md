# 
#### 介绍


#### 初始化

```
cnpm install
```

###  启动
```
nodemon index.js
```
###  Token说明
#### 1.token过期时的err值：
```javascript
{
    "name": "UnauthorizedError",
    "message": "jwt expired",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2017-08-03T10:08:44.000Z"
    }
}
```
#### 2.token无效时的err值：
```javascript
{
    "name": "UnauthorizedError",
    "message": "invalid signature",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "JsonWebTokenError",
        "message": "invalid signature"
    }
}
```
####  3.token前端携带
```javascript
Authorization: Bearer 'xczsxssdshsd.zxjjdjsjdsjdsjsd.djjsjsjsdj'
```