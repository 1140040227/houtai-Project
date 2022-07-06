import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/components/Login.vue');
const Index = () => import('@/components/Index.vue');
const Welcome = () => import('@/components/Welcome.vue');
const Users = () => import('@/components/User/Users.vue')
const Roles = () => import('@/components/Role/Roles.vue');
const Rights = () => import('@/components/Role/Rights.vue');
const Goods = () => import('@/components/Goods/Goods.vue');
const Categories = () => import('@/components/Goods/Categories.vue');
const Params = () => import('@/components/Goods/Params.vue');
const Orders = () => import('@/components/Order/Orders.vue');
const Reports = () => import('@/components/Reports/Reports.vue');
const Addgoods = () => import('@/components/Goods/Addgoods.vue');

Vue.use(VueRouter);

const routes = [{
	path:'/',
	redirect:'/login'
},{
	path:'/login',
	name:'Login',
	component:Login
},{
	path:'/index',
	name:'Index',
	component:Index,
	redirect:'/index/welcome',
	children:[
		{path:'/index/welcome',component:Welcome},
		{path:'/index/users',component:Users},
		{path:'/index/roles',component:Roles},
		{path:'/index/rights',component:Rights},
		{path:'/index/categories',component:Categories},
		{path:'/index/goods',component:Goods},
		{path:'/index/params',component:Params},
		{path:'/index/orders',component:Orders},
		{path:'/index/reports',component:Reports},
		{path:'/index/addgoods',component:Addgoods}
	]
}];

const router = new VueRouter({
	routes,
	mode:'history'
})




export default router;