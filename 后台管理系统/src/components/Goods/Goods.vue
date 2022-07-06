<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row :gutter="20">
				<el-col :span="6">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddPage">添加商品</el-button>
				</el-col>
			</el-row>

			<!-- 表格数据 -->
			<el-table :data="goodsList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
				<el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
				<el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
				<el-table-column label="创建时间" prop="add_time" width="140px">
					<template slot-scope="scope">{{scope.row.add_time | dataFormat }}</template>
				</el-table-column>
				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="setGoods(scope.row.goods_id)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini"
							@click="removeById(scope.row.goods_id)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total" background></el-pagination>
		</el-card>
		<el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%"
			@close="editDialogClosed">
			<el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
				<el-form-item label="商品名称" prop="goods_name">
					<el-input v-model="editForm.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="商品价格" prop="goods_price">
					<el-input v-model="editForm.goods_price"></el-input>
				</el-form-item>
				<el-form-item label="商品数量" prop="goods_number">
					<el-input v-model="editForm.goods_number"></el-input>
				</el-form-item>
				<el-form-item label="商品重量" prop="goods_weight">
					<el-input v-model="editForm.goods_weight"></el-input>
				</el-form-item>
				<el-form-item label="商品分类" prop="goods_cat">
					<el-cascader v-model="editForm.goods_cat" :options="cateList" :props="cascaderProps"
						@change="handleChange"></el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import service from '../../request/request.js';
	export default {
		data() {
			return {
				goodsId:0,
				editFormRules:{
					goods_name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					goods_price: [{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					}],
					goods_number: [{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur'
					}],
					goods_weight: [{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur'
					}],
					goods_cat: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}]
				},
				editForm:{
					goods_name:'',
					goods_price:0,
					goods_number:0,
					goods_weight:0,
					// 商品所属分类数组
					goods_cat: [],
					// 图片的数组
					pics: [],
					// 商品详情描述
					goods_introduce: '',
					attrs: []
				},
				editDialogVisible:false,
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				// 商品列表
				goodsList: [],
				// 商品总数
				total: 0,
				// 级联选择器配置
				cascaderProps: {
					expandTrigger: 'hover',
					label: 'cat_name',
					value: 'cat_id',
					children: 'children'
				},
				cateList:[]
			}
		},
		created() {
			this.getGoodsList()
		},
		methods: {
			getCateList() {
				service({
					url: 'categories',
					method: 'get'
				}).then(res => {
					// console.log(res);
					if (res.data.meta.status == 400) {
						return this.$lxmessage('获取商品列表失败');
					}
					this.cateList = res.data.data;
				}).catch(err => {
					console.log(err);
				})
			},
			// 级联选择器选中项变化时出发
			handleChange() {
				if (this.editForm.goods_cat.length !== 3) {
					this.editForm.goods_cat = []
				}
			},
			editInfo(){
				// console.log(this.editForm);
				service({
					url:`goods/${this.goodsId}`,
					method:'put',
					data:this.editForm
					// data:{
					// 	goods_name:this.editForm.goods_name,
					// 	goods_price:this.editForm.goods_price,
					// 	goods_number:this.editForm.goods_number,
					// 	goods_weight:this.editForm.goods_weight,
					// 	goods_cat:this.editForm.goods_cat
					// }
				}).then(res=>{
					// console.log(res);
					if(res.data.meta.status == 400){
						return this.$lxmessage.error('修改信息失败!');
					}
					this.$lxmessage.success('修改信息成功!');
					this.editDialogVisible = false;
				})
			},
			editDialogClosed(){
				this.$refs.editFormRef.resetFields();
			},
			setGoods(id){
				this.editDialogVisible = true;
				this.goodsId = id;
				service({
					url:`goods/${id}`,
					method:'get'
				}).then(res=>{
					// console.log(res);
					if(res.data.meta.status == 400){
						return this.$lxmessage.error('获取商品失败');
					}
					this.getCateList();
					let data = res.data.data;
					this.editForm.goods_name = data.goods_name;
					this.editForm.goods_price = data.goods_price;
					this.editForm.goods_number = data.goods_number;
					this.editForm.goods_weight = data.goods_weight;
				}).catch(err=>{
					console.log(err);
				})
			},
			// 根据分页获取对应的商品列表
			getGoodsList() {
				service({
					url: 'goods',
					method: 'get',
					params: this.queryInfo
				}).then(res => {
					// console.log(res);
					if (res.data.meta.status == 400) {
						return this.$lxmessage.error('获取商品列表失败');
					}
					this.goodsList = res.data.data.goods
					this.total = res.data.data.total
				}).catch(err => {
					console.log(err);
				})
			},
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getGoodsList()
			},
			handleCurrentChange(newSize) {
				this.queryInfo.pagenum = newSize
				this.getGoodsList()
			},
			// 通过Id删除商品
			removeById(id) {
				this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					service({
						url: 'goods/' + id,
						method: 'delete'
					}).then(res => {
						// console.log(res);
						if (res.data.meta.status == 400) {
							return this.$lxmessage.error('删除商品失败！');
						}
						this.$lxmessage.success('删除商品成功！')
						this.getGoodsList()
					}).catch(err => {
						console.log(err);
					})
				}).catch(() => {
					this.$lxmessage.success('已取消删除');
				})
			},
			goAddPage() {
				this.$router.push('/index/addgoods');
			}
		}
	}
</script>

<style scoped="scoped">
</style>
