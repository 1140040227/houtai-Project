<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<!-- 2.为Echarts准备一个Dom -->
			<div id="main" style="width: 750px;height:400px;"></div>
		</el-card>
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	import _ from 'lodash'
	import service from '../../request/request.js'
	export default {
		data() {
			return {
				// 需要合并的数据
				options: {
					title: {
						text: '用户来源'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#E9EEF3'
							}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						boundaryGap: false
					}],
					yAxis: [{
						type: 'value'
					}]
				}
			}
		},
		created() {
	
		},
		mounted() {
			//基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'))
			service({
				url:'reports/type/1',
				method:'get'
			}).then(res=>{
				// console.log(res);
				if(res.data.meta.status == 400){
					return this.$lxmessage.error('获取统计图数据失败!');
				}
				// 数据合并
				const result = _.merge(res.data.data, this.options)
				// 5.展示数据
				myChart.setOption(result)
			})
			
		},
	}
</script>

<style scoped="scoped">
</style>
