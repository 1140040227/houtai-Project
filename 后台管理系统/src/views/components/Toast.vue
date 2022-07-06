<template>
	<div class="container">
		<transition name="fade">
			<div class="layer no-touch" v-show="active"></div>
		</transition>
		<div class="box box-item no-touch" id="Itoast" :class="{active:active}" :data-type="type">
			<div class="box box-item Itosat-container">
				<i class="iconfont" data-type="success">√</i>
				<i class="iconfont" data-type="error">×</i>
				<i class="iconfont" data-type="info">❓</i>
				<i class="iconfont" data-type="warning">❗</i>
				<div id="Itosat-content">{{ content }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'; //vuex的辅助函数
	export default {
		data() {
			return {
				active: false,
				setTimer: null,
			}
		},
		computed: {
			...mapState('toast', [
				'type',
				'content',
				'time',
				'status',
			]),
		},
		watch: {
			status() {
				if (this.setTimer) clearTimeout(this.setTimer)
				this.active = true
				this.setTimer = setTimeout(() => {
					this.active = false
				}, this.time)
			},
		},
		created() {

		},
		methods: {

		}
	}
</script>

<style scoped="scoped">
	.layer {
		background: rgba(0, 0, 0, .1);
		transition: all .3s linear;
	}

	#Itoast {
		position: fixed;
		top: 5vh;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 1;
		opacity: 0;
		/* width: 50%; */
		box-sizing: border-box;
		width: 300px;
		min-width: 300px;
		-webkit-transition: all 0.5s;
		-moz-transition: all 0.5s;
		-ms-transition: all 0.5s;
		-o-transition: all 0.5s;
		transition: all 0.5s;
	}

	#Itoast.active {
		top: 10vh;
		opacity: 1;
		z-index: 10000;
	}

	.Itosat-container {
		/* background: white; */
		padding: 12px;
		/* color: #666;*/
		color: white;
		border-radius: 4px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		font-size: 16px;
		display: flex;
		font-family: '仿宋';
	}

	#Itoast i {
		font-size: 19px;
		margin-right: 6px;
		color: rgba(0, 160, 10, .7);
		display: none;
	}

	#Itoast[data-type="success"] i[data-type="success"] {
		display: block;
	}

	#Itoast[data-type="error"] i[data-type="error"] {
		display: block;
		color: #f05714;
	}

	#Itoast[data-type="info"] i[data-type="info"] {
		display: block;
		color: #fed700;
		position: relative;
		top: -2px;
	}

	#Itoast[data-type="warning"] i[data-type="warning"] {
		display: block;
		color: orange;
		position: relative;
	}
	#Itoast[data-type="success"]{
		background-color: rgba(129,199,98,0.6);
	}
	#Itoast[data-type="error"]{
		background-color: rgba(246,2,1,0.3);
	}
	#Itoast[data-type="warning"]{
		background-color: rgba(248,167,10,0.3);
	}
	#Itoast[data-type="info"]{
		background-color: rgba(213,213,212,0.6);
	}
</style>
