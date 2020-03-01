//数据库配置
const db= require('../../config/db')

const fn={

	//注册用户
 //   addUser: async function(data){
	// 		let sql ="insert into user(username,password,email) values(?,?,?)"
	// 		let arr =[]
	// 			arr.push(data.username)
	// 			arr.push(data.password)
	// 			arr.push(data.email)

	// 		return await db.query(sql,arr)

	// },

	// 登录
	// loadUser:async function(data){
	// 	let sql ="select * from user where email=?"
	// 	let arr=[]
	// 		arr.push(data)

		
	// 	return new Promise((resolve,reject)=>{
 //           db.query(sql,arr,function(data,err){
 //                resolve(data)
 //            })
 //        })
	// 	// return await db.query(sql,arr)
	// },
	// 获取好友列表
	// getUserlist:async function(id){
	// 	let sql ="select a.*, b.*,a.id as user_id from contacts a inner join user b on a.userlistid = b.id where userid=?"
	// 	let arr=[]
	// 		arr.push(id)
	// 	return new Promise((resolve,reject)=>{
 //           db.query(sql,arr,function(data,err){
 //                resolve(data)
 //            })
 //        })
	// },

	// SQL执行语句
	query(sql,arr){   
		return new Promise((resolve,reject)=>{
           db.query(sql,arr,function(data,err){
                resolve(data)
            })
        })
	},

	// 获取用户信息
	getUser: async function(id){
		let sql = "select * from users where id=?"
		let arr = []
			arr.push(id)
		return this.query(sql,arr)
	},

	// 添加分类
	addSort: async function(data){
		let sql = "insert into sort(name,image,userid,shows,createtime) values(?,?,?,?,?)"
		let image =JSON.stringify(data.image)
		let arr = []
			arr.push(data.name)
			arr.push(image)
			arr.push(data.userid)
			arr.push(data.shows)
			arr.push(new Date())
  		return this.query(sql,arr)
	},
	// 修改分类
	editSort: async function(data){
		let sql = "update sort set name=?,image=?,userid=?,shows=? where id=?"
		let image =JSON.stringify(data.image) 
		let arr = []
			arr.push(data.name)
			arr.push(image)
			arr.push(data.userid)
			arr.push(data.shows)
			arr.push(data.id)
			// console.log(arr);
  		return this.query(sql,arr)
	},
	// 获取分类
	getSort: async function(data){
		let start = (data.current - 1) * data.pageSize
		let pageSize = parseInt(data.pageSize)
		if(data.msg && data.msg.length > 0){
			let sql2 ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar  from sort a inner join users b on a.userid = b.id   where a.removes=1 and locate(?,a.name) limit ?,?"
			let arr2 = []
				arr2.push(data.msg)
				arr2.push(start)
				arr2.push(pageSize)
				
			return this.query(sql2,arr2)

		}else{
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar  from sort a inner join users b on a.userid = b.id where a.removes=1 limit ?,?"

			let arr = []
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		}
	},
	// 获取分类的总条数
	allSortNum: async function(src){
		if(src && src.length > 0){
			let sql = "select count(*) total from sort where locate(?,name)"
			let arr = []
				arr.push(src)
			return this.query(sql,arr)
		}else{
			let sql = "select count(*) total from sort"
			let arr = []
			return this.query(sql,arr)
		}
			
	},
	// 修改 分类 是否上线 (参数:  bool id)
	updataSortShows: async function(data){
		if(data.types === 1){
			let sql = "update sort set shows=? where id=?"
			let arr = []
				arr.push(data.shows)
				arr.push(data.id)
			return this.query(sql,arr)
		}
		if(data.types === 2){
			let sql = "update sort set one_sort=? where id=?"
			let arr = []
				arr.push(data.shows)
				arr.push(data.id)
			return this.query(sql,arr)
		}
	},
	// 删除 分类(软删除)
	removeSort: async function(data){
		let sql = "update sort set shows=0,removes=0 where id=?"
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 获取某一分类
	getSortItem: async function(data){
		let sql = 'select * from sort where id=?'
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 添加商品详情
	addGoods: async function(data){
		let sql = "insert into goods(name,bewrite,price,sort_id,carousel,propaganda,shows,weight,conditions,shelf_life,create_time,user_id) values(?,?,?,?,?,?,?,?,?,?,?,?)"
		let carousel =JSON.stringify(data.carousel)
		let propaganda =JSON.stringify(data.propaganda)
		let arr = []
			arr.push(data.name)
			arr.push(data.bewrite)
			arr.push(data.price)
			arr.push(data.sort_id)
			arr.push(carousel)
			arr.push(propaganda)
			arr.push(data.shows)
			arr.push(data.weight)
			arr.push(data.conditions)  //condition,
			arr.push(data.shelf_life)
			arr.push(new Date())
			arr.push(data.userid)
  		return this.query(sql,arr)
	},
	// 删除 某一 商品  (软删除)
	removeGood: async function(data){
		let sql = "update goods set shows=0,removes=0 where id=?"
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 修改商品
	editGood: async function(data){
		let sql = "update goods set name=?,bewrite=?,price=?,sort_id=?,carousel=?,propaganda=?,shows=?,weight=?,conditions=?,shelf_life=?,user_id=? where id=?"
		let carousel =JSON.stringify(data.carousel)
		let propaganda =JSON.stringify(data.propaganda)
		let arr = []
			arr.push(data.name)
			arr.push(data.bewrite)
			arr.push(data.price)
			arr.push(data.sort_id)
			arr.push(carousel)
			arr.push(propaganda)
			arr.push(data.shows)
			arr.push(data.weight)
			arr.push(data.conditions)  //condition,
			arr.push(data.shelf_life)
			arr.push(data.userid)
			arr.push(data.id)
  		return this.query(sql,arr)
	},
	// 修改 商品 是否上线 (参数:  bool id)
	updataGoodShows: async function(data){
		if(data.types === 1){
			let sql = "update goods set shows=? where id=?"
			let arr = []
				arr.push(data.shows)
				arr.push(data.id)
			return this.query(sql,arr)
		}
		if(data.types === 2){
			let sql = "update goods set buy=? where id=?"
			let arr = []
				arr.push(data.shows)
				arr.push(data.id)
			return this.query(sql,arr)
		}
		if(data.types === 3){
			let sql = "update goods set one_live=? where id=?"
			let arr = []
				arr.push(data.shows)
				arr.push(data.id)
			return this.query(sql,arr)
		}
		if(data.types === 4){
			let sql = "update goods set car=? where id=?"
			let arr = []
				arr.push(data.shows)
				arr.push(data.id)
			return this.query(sql,arr)
		}
		
	},
	// 修改 商品 是否上线 (参数:  bool id)
	updataGoodShowVip: async function(data){
			let sql = "update goods set vip_price=? where id=?"
			let arr = []
				arr.push(data.vip_price)
				arr.push(data.vip_id)
			return this.query(sql,arr)
	},
	// 添加轮播图
	addSwiper: async function(data){
		let sql = "insert into swipers(remark,carousel,types,external,good_id,shows,create_time,user_id) values(?,?,?,?,?,?,?,?)"
		let carousel =JSON.stringify(data.carousel)
			data.external = data.external || null
			data.good_id = data.good_id || null
		let arr = []
			arr.push(data.remark)
			arr.push(carousel)
			arr.push(data.types)
			arr.push(data.external)
			arr.push(data.good_id)
			arr.push(data.shows)
			arr.push(new Date())
			arr.push(data.user_id)
			console.log(arr);
  		return this.query(sql,arr)
	},
	// 删除 某一 幻灯片
	removeSwiper: async function(data){
		let sql = "delete from swipers where id=?"
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 修改轮播图
	editSwiper: async function(data){
		let sql = "update swipers set remark=?,carousel=?,types=?,external=?,good_id=?,shows=?,user_id=? where id=?"
		let carousel =JSON.stringify(data.carousel)
		let arr = []
			arr.push(data.remark)
			arr.push(carousel)
			arr.push(data.types)
			arr.push(data.external)
			arr.push(data.good_id)
			arr.push(data.shows)
			arr.push(data.user_id)
			arr.push(data.id)
  		return this.query(sql,arr)
	},
	// 添加关键词
	addKeyword: async function(data){
		let sql = 'insert into keywords(name,remark,user_id) values(?,?,?)'
		let arr = []
			arr.push(data.name)
			arr.push(data.remark)
			arr.push(data.user_id)
		return this.query(sql,arr)
	},
	// 修改轮播图
	editKeyword: async function(data){
		let sql = "update keywords set name=?,remark=?,user_id=? where id=?"
		let carousel =JSON.stringify(data.carousel)
		let arr = []
			arr.push(data.name)
			arr.push(data.remark)
			arr.push(data.user_id)
			arr.push(data.id)
  		return this.query(sql,arr)
	},
	// 删除 某一 关键词
	removeKeyword: async function(data){
		let sql = "delete from keywords where id=?"
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
}

module.exports = fn;
