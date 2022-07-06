//用来统一管理接口的文件
import service from './request.js';

var apiList=[
	"/login",
	"/users",
	"/menus",
	"/users/:uid/state/:type",
	"/users/:id",
	"right/list"
]

let apiName,MainApi = {};

apiList.forEach(path=>{
	// console.log(path);
	apiName = /(?<=\/)[^/]+$/.exec(path)[0];
	// console.log(apiName);
	MainApi[apiName] = function(p,method,data){
		if(method == 'get'){
			return service({
				url:path,
				method:method,
				params:p
			})
		}else if(method == 'put' || method == 'delete'){
			return service({
				url:p,
				method:method,
				data:data
			})
		}else{
			return service({
				url:path,
				method:method,
				data:p
			})
		}
	}
})
// console.log(MainApi)
export default MainApi;

