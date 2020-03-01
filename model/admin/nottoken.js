//数据库配置
const db= require('../../config/db')

const notnoken = {
	// SQL执行语句
	query(sql,arr){   
		return new Promise((resolve,reject)=>{
           db.query(sql,arr,function(data,err){
                resolve(data)
            })
        })
	},

	//查询用户名是否存在
	searchUser: async function(user){
		let sql = "select id,user,password from users where user=?"
		let arr = []
			arr.push(user)
		return this.query(sql,arr)
	},
	//注册用户
   addUser: async function(data){
   		let src = await this.searchUser(data.user)
   			if(src && src.length != 0){
   				return src;
   			}else{
   				let sql ="insert into users(user,nickname,password) values(?,?,?)"
				let arr =[]
					arr.push(data.user)
					arr.push(data.nickname)
					arr.push(data.password)
				return this.query(sql,arr)
   			}
	},
	// 获取分页分类
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
			let sql = "select count(*) total from sort where removes=1 and locate(?,name)"
			let arr = []
				arr.push(src)
			return this.query(sql,arr)
		}else{
			let sql = "select count(*) total from sort where removes=1"
			let arr = []
			return this.query(sql,arr)
		}
			
	},
	// 获取某一分类
	getSortItem: async function(data){
		let sql = 'select * from sort where id=?'
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 获取所有分类
	getSortList: async function(){
		let sql = 'select id,name from sort where removes=1'
		let arr = []
		return this.query(sql,arr)
	},
	// 获取商品分页列表
	getGoods: async function(data){
		
		let start = (data.current - 1) * data.pageSize
		let pageSize = parseInt(data.pageSize)
		if(data.msg && data.sortActive && data.showsActive && data.msg.length > 0){
			let sql2 ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar , c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and  a.sort_id=? and a.shows=? and locate(?,a.name) limit ?,?"
			let arr2 = []
				arr2.push(parseInt(data.sortActive))
				arr2.push(parseInt(data.showsActive))
				arr2.push(data.msg)
				arr2.push(start)
				arr2.push(pageSize)
				
			return this.query(sql2,arr2)

		}
		if(data.msg && data.sortActive && data.msg.length > 0){
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar , c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and  a.sort_id=? and  locate(?,a.name) limit ?,?"

			let arr = []
				arr.push(parseInt(data.sortActive))
				arr.push(data.msg)
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		}
		if(data.msg && data.showsActive && data.msg.length > 0){
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar , c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and  a.shows=? and  locate(?,a.name) limit ?,?"

			let arr = []
				arr.push(parseInt(data.showsActive))
				arr.push(data.msg)
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		}
		if(data.sortActive && data.showsActive){
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar ,  c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and  a.shows=? and a.sort_id=? limit ?,?"

			let arr = []
				arr.push(parseInt(data.showsActive))
				arr.push(parseInt(data.sortActive))
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		}
		if(data.sortActive){
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar ,  c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and a.sort_id=? limit ?,?"

			let arr = []
				arr.push(parseInt(data.sortActive))
				arr.push(start)
				arr.push(pageSize)

			return this.query(sql,arr)
		}
		if(data.showsActive){
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar ,  c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and a.shows=? limit ?,?"

			let arr = []
				arr.push(parseInt(data.showsActive))
				arr.push(start)
				arr.push(pageSize)
				console.log(arr);
			return this.query(sql,arr)
		}
		if(data.msg && data.msg.length > 0){
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar , c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 and locate(?,a.name) limit ?,?"

			let arr = []
				arr.push(data.msg)
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		}
																											//	(表1 INNER JOIN 表2 ON 表1.字段号=表2.字段号) INNER JOIN 表3 ON 表1.字段号=表3.字段号
			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar, c.name as sort_name  from ( goods a inner join users b on a.user_id = b.id) inner join sort c on a.sort_id=c.id where a.removes=1 limit ?,?"

			let arr = []
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)

	},
	// 获取商品的总条数
	allGoodsNum: async function(data){
		if(data.msg && data.sortActive && data.showsActive && data.msg.length > 0){
			let sql2 ="select count(*) total  from goods where removes=1 and  sort_id=? and shows=? and locate(?,name)"
			let arr2 = []
				arr2.push(parseInt(data.sortActive))
				arr2.push(parseInt(data.showsActive))
				arr2.push(data.msg)
				
			return this.query(sql2,arr2)

		}
		if(data.msg && data.sortActive && data.msg.length > 0){
			let sql ="select count(*) total from goods where removes=1 and  sort_id=? and locate(?,name)"

			let arr = []
				arr.push(parseInt(data.sortActive))
				arr.push(data.msg)
				
			return this.query(sql,arr)
		}
		if(data.msg && data.showsActive && data.msg.length > 0){
			let sql ="select count(*) total from goods where removes=1 and  shows=? and  locate(?,name)"

			let arr = []
				arr.push(parseInt(data.showsActive))
				arr.push(data.msg)
				
			return this.query(sql,arr)
		}
		if(data.sortActive && data.showsActive){
			let sql ="select count(*) total from goods where removes=1 and  shows=? and sort_id=?"

			let arr = []
				arr.push(parseInt(data.showsActive))
				arr.push(parseInt(data.sortActive))
				
			return this.query(sql,arr)
		}
		if(data.sortActive){
			let sql ="select count(*) total from goods where removes=1 and sort_id=?"

			let arr = []
				arr.push(parseInt(data.sortActive))
				
			return this.query(sql,arr)
		}
		if(data.showsActive){
			let sql ="select count(*) total from goods where removes=1 and shows=?"

			let arr = []
				arr.push(parseInt(data.showsActive))
				
			return this.query(sql,arr)
		}
		if(data.msg && data.msg.length > 0){
			let sql ="select count(*) total from goods where removes=1 and locate(?,name)"

			let arr = []
				arr.push(data.msg)
				
			return this.query(sql,arr)
		}

			let sql ="select count(*) total from goods where removes=1"

			let arr = []
				
			return this.query(sql,arr)
	},
	// 获取 某一商品详情
	getGoodItem: async function(data){
		let sql = 'select * from goods where id=?'
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 获取分页轮播图
	getSwipers: async function(data){
		let start = (data.current - 1) * data.pageSize
		let pageSize = parseInt(data.pageSize)

			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar  from swipers a inner join users b on a.user_id = b.id where a.removes=1 limit ?,?"

			let arr = []
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		
	},
	// 获取轮播图的总条数
	allSwiperNum: async function(src){
		let sql = "select count(*) total from swipers where removes=1"
		let arr = []
		return this.query(sql,arr)	
	},
	// 获取 某一轮播图详情
	getSwiperItem: async function(data){
		let sql = 'select * from swipers where id=?'
		let arr = []
			arr.push(data.id)
		return this.query(sql,arr)
	},
	// 获取关键词列表
	getKeywords: async function(data){
		let start = (data.current - 1) * data.pageSize
		let pageSize = parseInt(data.pageSize)

			let sql ="select a.*, b.id as user_id , b.nickname as user_nickname , b.avatar as user_avatar  from keywords a inner join users b on a.user_id = b.id limit ?,?"

			let arr = []
				arr.push(start)
				arr.push(pageSize)
				
			return this.query(sql,arr)
		
	},
	// 获取关键词的总条数
	allKeywordsNum: async function(src){
		let sql = "select count(*) total from keywords"
		let arr = []
		return this.query(sql,arr)	
	},
}

module.exports = notnoken;