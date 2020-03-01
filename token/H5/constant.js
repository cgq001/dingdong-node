const crypto = require('crypto');

module.exports = {
  MD5_SUFFIX: '805696667',
  md5: (pwd) => {
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
  },
  tokenKey: 'luffy_1993711_26_jwttoken'
};