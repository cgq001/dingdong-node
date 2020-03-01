const expressJwt = require('express-jwt');
const { tokenKey } = require('./constant');

const jwtAuth = expressJwt({secret: tokenKey}).unless({path:['/index/load']})


//unless 为排除那些接口

module.exports = jwtAuth;