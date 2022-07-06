import Vue from 'vue';
import i18n from './language/i18n.js';
import App from './App.vue'
import elementComponent from './config/elementui.js';
import router from './router/router.js';
import './assets/css/global.css';
import store from './store/store.js';
import ZkTable from 'vue-table-with-tree-grid-icon';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
//全局注册组件
import IToast from './config/divComponents.js';
Vue.use(IToast);
//全局注册弹出框方法
import message from './assets/js/div.js';
Vue.use(message);

Vue.use(elementComponent);

Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
	if (to.path.indexOf('/index') !== -1) {
		if (sessionStorage.getItem('user-token')) {
			next();
		} else {
			next('/login');
		}
	} else if (to.path.indexOf('/login') !== -1) {
		next();
	}
})
// Vue.use(ZkTable);
Vue.component('tree-table', ZkTable);

Vue.filter('dataFormat', function(originVal) {
	const dt = new Date(originVal)

	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d = (dt.getDate() + '').padStart(2, '0')

	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds() + '').padStart(2, '0')
	// yyyy-mm-dd hh:mm:ss
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.lxlanguages = function(){
	if(sessionStorage.getItem('lang')){
		this.$i18n.locale = sessionStorage.getItem('lang');
	}else{
		sessionStorage.setItem('lang',this.$i18n.locale);
	}
}
new Vue({
	render: h => h(App),
	router,
	store,
	i18n,
}).$mount('#app')