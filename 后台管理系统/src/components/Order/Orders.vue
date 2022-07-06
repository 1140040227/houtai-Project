<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<el-row>
				<el-col :span="6">
					<el-input placeholder="请输入内容">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>

			<!-- 订单列表 -->
			<el-table :data="orderList" border stripe>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="订单编号" prop="order_number"></el-table-column>
				<el-table-column label="订单价格" prop="order_price"></el-table-column>
				<el-table-column label="是否付款">
					<template slot-scope="scope">
						<el-tag type="danger" size="mini" v-if="scope.row.pay_status">未付款</el-tag>
						<el-tag type="success" size="mini" v-else>已付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="是否发货" prop="is_send"></el-table-column>
				<el-table-column label="下单时间" prop="create_time"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">
						</el-button>
						<el-button type="success" size="mini" icon="el-icon-location" @click="showProgressDialog">
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog title="修改订单" :visible.sync="orderDialogVisible" width="50%" @close="orderDialogClosed">
			<el-form :model="orderForm" :rules="orderFormRules" ref="orderFormRef" label-width="100px">
				<el-form-item label="是否发货" prop="is_send">
					<!-- <el-input v-model="orderForm.is_send"></el-input> -->
					<template>
						<el-radio-group v-model="orderForm.is_send">
							<el-radio :label="0">未发货</el-radio>
							<el-radio :label="1">已发货</el-radio>
						</el-radio-group>
					</template>

				</el-form-item>
				<el-form-item label="订单支付" prop="order_pay">
					<template>
						<el-radio-group v-model="orderForm.order_pay">
							<el-radio :label="0">未支付</el-radio>
							<el-radio :label="1">支付宝</el-radio>
							<el-radio :label="2">微信</el-radio>
							<el-radio :label="3">银行卡</el-radio>
						</el-radio-group>
					</template>
				</el-form-item>
				<el-form-item label="订单价格" prop="order_price">
					<el-input v-model="orderForm.order_price"></el-input>
				</el-form-item>
				<el-form-item label="订单数量" prop="order_number">
					<el-input v-model="orderForm.order_number"></el-input>
				</el-form-item>
				<el-form-item label="支付状态" prop="pay_status">
					<template>
						<el-radio-group v-model="orderForm.pay_status">
							<el-radio :label="1">已付款</el-radio>
							<el-radio :label="0">未付款</el-radio>
						</el-radio-group>
					</template>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="orderDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="orderInfo">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 展示物流进度对话框 -->
		<el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
			<!-- 时间线 -->
			<el-timeline>
				<el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
					{{activity.context}}
				</el-timeline-item>
			</el-timeline>
		</el-dialog>
	</div>
</template>

<script>
	import service from '../../request/request.js';
	import cityData from './citydata.js'
	export default {
		data() {
			return {
				// 订单列表查询参数
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				total: 0,
				// 订单列表
				orderList: [],
				// 修改地址对话框
				orderDialogVisible: false,
				orderForm: {
					is_send: 0,
					order_pay: 0,
					order_price: 0,
					order_number: 0,
					pay_status: 1
				},
				orderFormRules: {
					is_send: [{
						required: true,
						message: '请选择是否发货',
						trigger: 'blur'
					}],
					order_pay: [{
						required: true,
						message: '请选择支付方式',
						trigger: 'blur'
					}],
					order_price: [{
						required: true,
						message: '请输入订单价格',
						trigger: 'blur'
					}],
					order_number: [{
						required: true,
						message: '请输入订单数量',
						trigger: 'blur'
					}],
					pay_status: [{
						required: true,
						message: '请选择支付状态',
						trigger: 'blur'
					}]
				},
				cityData,
				// 物流进度对话框
				progressDialogVisible: false,
				// 物流进度
				progressInfo: [],
				orderId: 0
			}
		},
		created() {
			this.getOrderList()
		},
		methods: {
			orderInfo() {
				// console.log(this.orderForm);
				service({
					url: `orders/${this.orderId}`,
					method: 'put',
					data: this.orderForm
				}).then(res => {
					// console.log(res);
					if (res.data.meta.status == 400) {
						return this.$lxmessage.error('修改订单失败!');
					}
					this.$lxmessage.warning('修改订单成功，是否支付暂不支持修改');
					// this.$message.error('');
					this.getOrderList();
					this.orderDialogVisible = false;
				})
			},
			getOrderList() {
				service({
					url: 'orders',
					method: 'get',
					params: this.queryInfo
				}).then(res => {
					// console.log(res);
					if (res.data.meta.status == 400) {
						return this.$lxmessage.error('获取订单列表失败');
					}
					this.total = res.data.data.total
					this.orderList = res.data.data.goods
				}).catch(err => {
					console.log(err);
				})
			},
			// 分页
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getOrderList()
			},
			handleCurrentChange(newSize) {
				this.queryInfo.pagenum = newSize
				this.getOrderList()
			},
			showEditDialog(info) {
				this.orderDialogVisible = true;
				// console.log(info);
				// console.log(this.orderForm);
				this.orderId = info.order_id;
				// this.orderForm.is_send = info.is_send;
				this.orderForm.order_pay = info.order_pay
				this.orderForm.order_price = info.order_price
				this.orderForm.order_number = info.order_number
				// this.orderForm.pay_status = info.pay_status
			},
			orderDialogClosed() {
				this.$refs.orderFormRef.resetFields()
			},
			showProgressDialog() {
				// 供测试的物流单号：1106975712662
				// service({
				// 	url:'/kuaidi/1106975712662',
				// 	method:'get'
				// }).then(res=>{
				// 	console.log(res);
				// 	if(res.data.meta.status == 400){
				// 		return this.$message.error('获取物流进度失败');
				// 	}else if(res.data.meta.status == 501){
				// 		return this.$message.error('无对应的物流公司');
				// 	}
				// 	this.progressInfo = res.data.data;
				// 	this.progressDialogVisible = true
				// }).catch(err=>{
				// 	console.log(err);
				// })
				this.$lxmessage.warning('查询物流功能正在维护中，暂时无法使用！');
			}
		}
	}
</script>

<style scoped="scoped">
	.el-cascader {
		width: 100%;
	}
</style>
