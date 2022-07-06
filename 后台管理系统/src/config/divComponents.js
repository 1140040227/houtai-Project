//全局注册弹出框组件
import Vue from 'vue';
import IToast from '../views/components/Toast.vue';
const toast = {
	install:function(Vue){
		Vue.component('IToast',IToast);
	}
}
export default toast