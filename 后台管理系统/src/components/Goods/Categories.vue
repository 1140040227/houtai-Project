<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图-->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showDialog(0)">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false"
				:expand-type="false" show-index index-text="#" border :show-row-hover="false">
				<!-- 是否有效 -->
				<template v-slot:isOk="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
					<i class="el-icon-error" v-else style="color:red"></i>
				</template>
				<!-- 排序 -->
				<template v-slot:order="scope">
					<el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
					<el-tag size="mini" type="warning" v-else>三级</el-tag>
				</template>
				<!-- 操作 -->
				<template v-slot:opt="scope">
					<el-button size="mini" type="primary" icon="el-icon-edit" @click="showDialog(1,scope.row)">编辑
					</el-button>
					<el-button size="mini" type="danger" icon="el-icon-delete" @click="delCate(scope.row)">删除
					</el-button>
				</template>
			</tree-table>

			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
				layout="total,sizes,prev,pager,next,jumper" :total="total">

			</el-pagination>
		</el-card>
		<!-- 添加分类的对话框 -->
		<el-dialog :title="addDialogTitle" :visible.sync="addCateDialogFlag" width="50%" @close="addCateDialogClose">
			<!-- 添加分类的表单 -->
			<el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
				<el-form-item label="分类名称:" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类:" v-show="addDialogFlag">
					<span class="demonstration">hover 触发子菜单</span>
					<el-cascader :options="parentCateList" v-model="selectedKeys"
						:props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly:true }"
						@change="parentCateChange" clearable></el-cascader>
				</el-form-item>
			</el-form>
			<!-- 底部 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogFlag = false">取消</el-button>
				<el-button type="primary" @click="addCate">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import service from '../../request/request.js';
	export default {
		data() {
			return {
				setId: 0,
				addDialogTitle: '添加分类',
				addDialogId: 0, //对话框id
				addDialogFlag: true, //父级分类是否显示
				addCateForm: {
					cat_pid: 0, //父级分类的id
					cat_name: "", //分类名字
					cat_level: 0 //分类等级
				},
				addCateFormRules: {
					// 添加分类表单的验证规则对象
					cat_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}]
				},
				addCateDialogFlag: false,
				queryInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				cateList: [], //商品分类的数据列表
				total: 0, //总数据条数
				//为table指定列的定义
				columns: [{
					label: '分类名称',
					prop: 'cat_name'
				}, {
					label: '是否有效',
					type: 'template', //表示当前列定义为模板页
					template: 'isOk'
				}, {
					label: '排序',
					type: 'template', //表示当前列定义为模板页
					template: 'order'
				}, {
					label: '操作',
					type: 'template', //表示当前列定义为模板页
					template: 'opt'
				}],
				parentCateList: [], //父级分类的列表
				selectedKeys: [], //选中的父级分类的id数组

			}
		},
		created() {
			this.getCateList();
		},
		methods: {
			delCate(info) {
				this.$confirm('此操作将永久删除该分类，是否继续？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					service({
						url: `categories/${info.cat_id}`,
						method: 'delete'
					}).then(res => {
						// console.log(res);
						if (res.data.meta.status == 400) {
							this.$lxmessage.error('删除失败');
							return;
						} else {
							this.$lxmessage.success('删除分类成功');
							this.getCateList();
						}
					}).catch(err => {
						this.$lxmessage.error('删除失败');
					})
				}).catch(() => {
					this.$lxmessage.success('已取消删除');
				})
			},
			addCateDialogClose() {
				this.$refs.addCateFormRef.resetFields();
				this.selectedKeys = [];
				this.addCateForm.cat_pid = 0;
				this.addCateForm.cat_level = 0;
			},
			addCate() {
				if (this.addDialogId == 0) {
					this.$refs.addCateFormRef.validate(valid => {
						if (!valid) return
						service({
							url: 'categories',
							method: 'post',
							data: this.addCateForm
						}).then(res => {
							if (res.data.meta.status == 400) {
								this.$lxmessage.error('添加分类失败');
								return;
							} else {
								this.$lxmessage.success('添加分类成功');
								this.getCateList();
								this.addCateDialogFlag = false;
							}
						}).catch(err => {
							this.$lxmessage.error('添加分类失败');
						})
					})
				} else if (this.addDialogId == 1) {
					service({
						url: `categories/${this.setId}`,
						method: 'put',
						data: this.addCateForm.cat_name,
						data: {
							cat_name: this.addCateForm.cat_name
						}
					}).then(res => {
						console.log(res);
						if (res.data.meta.status == 400) {
							this.$lxmessage.error('修改分类失败');
						} else {
							this.$lxmessage.success('修改分类成功');
							this.getCateList();
							this.addCateDialogFlag = false;
						}
					}).catch(err => {
						this.$lxmessage.error('修改分类失败');
					})
				}

			},
			parentCateChange() { //选择项发生变化
				if (this.selectedKeys.length > 0) {
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
					this.addCateForm.cat_level = this.selectedKeys.length;
					return;
				} else {
					this.addCateForm.cat_pid = 0;
					this.addCateForm.cat_level = 0;
				}
			},
			getParentCateList() {
				service({
					url: 'categories',
					method: 'get',
					params: {
						type: 2
					}
				}).then(res => {
					if (res.data.meta.status == 400) {
						this.$lxmessage.error('获取失败');
						return;
					} else {
						this.parentCateList = res.data.data;
					}
				}).catch(err => {
					this.$lxmessage.error('获取失败');
				})
			},
			//展开对话框
			showDialog(id, info) {
				this.addDialogId = id;
				this.addCateDialogFlag = true;
				if (id == 0) {
					this.addDialogTitle = '添加分类';
					this.getParentCateList();
					this.addDialogFlag = true;
				} else if (id == 1) {
					this.addDialogTitle = '编辑分类';
					service({
						url: `categories/${info.cat_id}`,
						method: 'get'
					}).then(res => {
						if (rea.data.meta.status == 400) {
							this.$lxmessage.error('获取分类失败');
							return;
						} else {
							// console.log(res);
							let data = res.data.data;
							this.addCateForm.cat_name = data.cat_name;
							this.addCateForm.cat_pid = data.cat_pid;
							this.addCateForm.cat_level = data.cat_level;
							this.setId = data.cat_id;
						}
					}).catch(err => {
						this.$lxmessage.error('获取分类失败');
					})
					this.addDialogFlag = false;
					this.setCateDialogFlag = true;
				}

			},
			//监听pagenum改变
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage;
				this.getCateList();
			},
			//监听pagezise改变
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize;
				this.getCateList();
			},
			getCateList() { //获取商品分类数据
				service({
					url: 'categories',
					method: 'get',
					params: this.queryInfo
				}).then(res => {
					if (res.data.meta.status == 400) {
						this.$lxmessage.error('获取商品分类失败');
						return;
					} else {
						this.cateList = res.data.data.result;
						this.total = res.data.data.total;
					}
				}).catch(err => {
					this.$lxmessage.error('获取商品分类失败');
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.tree-table {
		margin: 15px 0;
	}

	.el-cascader {
		width: 100%;
	}
</style>
