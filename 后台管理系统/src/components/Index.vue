<template>
	<el-container class="home-box">
		<!-- 头部 -->
		<el-header>
			<div class="header-left">
				<span>
					<img src="../assets/login-header.jpg" alt="">
				</span>
				LX {{$t('message.systemTitle')}}
			</div>
			<el-button type='info' @click="logout">{{$t('message.cancelInfo')}}</el-button>
		</el-header>
		<!-- 页面主体 -->
		<el-container>
			<!-- 左边侧边栏 -->
			<el-aside :width="menuAside" style="transition: 0.5s;" >
				<div class="toggle-button" @click="toggle_handle">|||</div>
				<el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
					background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse"
					 :collapse-transition="false" :router="true" :default-active="nowIndex" replace>
					<el-submenu :index="item.id + ''" v-for="(item) in menuList" :key="item.id">
						<template slot="title">
							<i :class="iconObj[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item :index="'/index/' + item.path" v-for="(item) in item.children" :key="item.id"
						 @click="saveIndex('/index/' + item.path)">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{item.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- 右侧内容主体 -->
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import MainApi from '../request/api.js';
	export default {
		data(){
			return{
				menuList:[],
				iconObj:{
					125:'el-icon-user',
					103:'el-icon-key',
					101:'el-icon-shopping-cart-full',
					102:'el-icon-document',
					145:'el-icon-pie-chart'
				},
				isCollapse:false,//是否折叠
				menuAside:'200px',
				nowIndex:''//当前的侧边栏
			}
		},
		created() {
			this.getMenuList();
			this.getIndex();
			this.lxlanguages();
		},
		methods: {
			getIndex(){
				if(sessionStorage.getItem('now-index')){
					this.nowIndex = sessionStorage.getItem('now-index');
				}else{
					this.nowIndex = '';
				}
			},
			saveIndex(index){
				// console.log(index);
				sessionStorage.setItem('now-index',index);
			},
			toggle_handle(){
				this.isCollapse = !this.isCollapse;
				if(this.isCollapse){
					this.menuAside = '70px';
				}else{
					this.menuAside = '200px';
				}
			},
			getMenuList(){
				MainApi.menus('','get').then(res=>{
					this.menuList = res.data.data;
					// console.log(this.menuList);
				}).catch(err=>{
					console.log(err);
				})
			},
			logout() {
				window.sessionStorage.clear();
				this.$router.push('/login');
			},
			handleOpen(key, keyPath) {
				// console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				// console.log(key, keyPath);
			}
		}
	}
</script>

<style scoped="scoped">
	.home-box {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0 10px;
		height: 60px;
	}

	.header-left {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0 10px;
	}

	.header-left span {
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		width: 30px;
		height: 30px;
		margin-right: 25px;
		cursor: pointer;
	}

	.header-left span img {
		width: 100%;
		height: 100%;
	}

	.el-aside {
		background-color: #333744;
		color: #333;
		text-align: center;
		line-height: 200px;
		overflow: hidden;
	}
	.toggle-button{
		line-height: 20px;
		background-color: #4A5064;
		text-align: center;
		color: white;
		font-size: 10px;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
	.el-menu-vertical-demo {
		/* border: 1px solid red; */
		width: 100%;
		text-align: start;
	}

	.el-main {
		background-color: #EAEDF1;
		color: #333;
		/* text-align: center; */
		line-height: 20px;
	}

	body>.el-container {
		margin-bottom: 40px;
	}

	.el-container:nth-child(5) .el-aside,
	.el-container:nth-child(6) .el-aside {
		line-height: 260px;
	}

	.el-container:nth-child(7) .el-aside {
		line-height: 320px;
	}
</style>
