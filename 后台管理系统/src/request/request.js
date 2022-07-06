import axios from 'axios';
// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
//设置baseURL
//环境：开发环境，生产环境，测试环境
//axios创建一个实例
const service = axios.create({
	baseURL:process.env.VUE_APP_BASE_API,
	timeout:5000
})
export default service;
// console.log(process.env.BASE_URL)

//设置请求拦截
service.interceptors.request.use(config=>{
	//显示进度条
	NProgress.start();
	// console.log(config);
	config.headers.authorization = window.sessionStorage.getItem('user-token');
	// console.log(axios.defaults.baseURL)
	return config;
},error=>{
	return Promise.reject(error);
})

//设置响应拦截
service.interceptors.response.use(response=>{
	//隐藏进度条
	NProgress.done();
	if(response.status == 200){
		return Promise.resolve(response);
	}else{
		return Promise.reject(response);
	}
},error=>{
	if(error.response.status){
		switch(error.response.status){
			case 400:console.log("请求的地址不存在或者包含不支持的参数");
			break;
			case 401:console.log("未授权");
			break;
			case 403:console.log("被禁止访问");
			break;
			case 404:console.log('请求的资源不存在');
			break;
			case 422:console.log('[POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误');
			break;
			case 500:console.log('内部错误');
			break;
			default:console.log("error");
		}
		return Promise.reject(error.response);
	}
})

//封装get和post请求
export function get(url,params={}){
	return new Promise((resolve,reject)=>{
		axios.get(url,{params:params}).then(res=>{
			resolve(res);
		}).catch(err=>{
			reject(err);
		})
	})
	
}
export function post(url,params={}){
	return new Promise((resolve,reject)=>{
		axios.post(url,params).then(res=>{
			resolve(res);
		}).catch(err=>{
			reject(err);
		})
	})
	
}