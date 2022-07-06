<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">{{$t('message.home')}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{$t('message.userManger')}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{$t('message.userList')}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row :gutter='20'>
				<el-col :span='10'>
					<el-input :placeholder='$t("message.inputenter")' clearable @clear="getUserList" v-model="queryInfo.query">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span='4'>
					<el-button type="primary" @click="dialogOut(0)">{{$t('message.add_user')}}</el-button>
				</el-col>
			</el-row>
			<el-row>
				<el-table :data="userList" border stripe>
					<el-table-column type="index"></el-table-column>
					<el-table-column class='th' prop="username" :label="$t('message.name')">
					</el-table-column>
					<el-table-column prop="email" :label="$t('message.email')">
					</el-table-column>
					<el-table-column prop="mobile" :label="$t('message.phoneNum')">
					</el-table-column>
					<el-table-column prop="role_name" :label="$t('message.role')">
					</el-table-column>
					<el-table-column prop="mg_state" :label="$t('message.state')">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
							</el-switch>
						</template>
					</el-table-column>
					<el-table-column :label="$t('message.operation')" width="180">
						<template slot-scope="scope">
							<el-tooltip :content="$t('message.edit')" placement="top" :enterable="false">
								<el-button type="primary" icon="el-icon-edit" size="mini"
									@click="dialogOut(1,scope.row)"></el-button>
							</el-tooltip>
							<el-tooltip :content="$t('message.delete')" placement="top" :enterable="false">
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="isDel(scope.row.id)">
								</el-button>
							</el-tooltip>
							<el-tooltip :content="$t('message.assign_roles')" placement="top" :enterable="false">
								<el-button @click="setRole(scope.row)" type="warning" icon="el-icon-setting"
									size="mini"></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<el-dialog :title="dialogTitle" :visible.sync="dialogFlag" width="50%" @close="addFormClose">
			<!-- 内容主题区 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
				<el-form-item :label="$t('message.userlabel')" prop="username">
					<el-input v-model="addForm.username" :disabled="!dialogForm"></el-input>
				</el-form-item>
				<el-form-item v-show="dialogForm" :label="$t('message.psdlabel')" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item :label="$t('message.email')" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item :label="$t('message.phoneNum')" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogFlag = false">{{$t('message.Cancel')}}</el-button>
				<el-button type="primary" @click="addUserInfo">{{$t('message.Enter')}}</el-button>
			</span>
		</el-dialog>
		<!-- 分配角色的对话框 -->
		<el-dialog :title='$t("message.assign_roles")' :visible.sync="setRoleDialogFlag" width="50%" @close="setRoleDialogClosed">
			<div>
				<p>{{$t('message.current_user')}}：{{userInfo.username}}</p>
				<p>{{$t('message.current_role')}}：{{userInfo.role_name}}</p>
				<p>{{$t('message.assign_newRoles')}}：
					<el-select v-model="selectedRoleId" :placeholder="$t('message.select')">
						<el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRoleDialogFlag = false">{{$t('message.Cancel')}}</el-button>
				<el-button type="primary" @click="roleInfo">{{$t('message.Enter')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import MainApi from '../../request/api.js';
	import service from '../../request/request.js';
	export default {
		data() {
			//验证邮箱的规则
			var checkEmail = (rule, val, callback) => {
				//验证邮箱的正则
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
				if (regEmail.test(val)) {
					return callback();
				}
				callback(new Error(this.$i18n.t('error.error_email')));
			}
			// 验证手机号的规则
			var checkMobile = (rule, val, callback) => {
				const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
				if (regMobile.test(val)) {
					return callback();
				}
				callback(new Error(this.$i18n.t('error.error_phoneNum')));
			}
			return {
				setRoleDialogFlag: false,
				dialogTitle: '',
				userId: 0,
				dialogId: 0,
				dialogForm: false, //复用表单，true为添加用户，false为修改
				queryInfo: {
					query: '',
					//当前页数
					pagenum: 1,
					//当前每页显示多少条数据
					pagesize: 2
				},
				userList: [],
				total: 0,
				dialogFlag: false, //控制添加用户对话框的显示与隐藏
				addForm: { //添加用户的表单数据
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				selectedRoleId: '', //已选中的角色id
				userInfo: {},
				rolesList: [],
				addFormRules: { //添加表单验证规则的对象
					username: [{
							required: true,
							message: '请填写用户名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '用户名的长度请在3~10之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请填写密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '密码长度请在6~15之间',
							trigger: 'blur'
						}
					],
					email: [{
						required: true,
						message: '请填写邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请填写手机号',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.getUserList()
		},
		methods: {
			//监听关闭对话框
			setRoleDialogClosed() {
				this.selectedRoleId = '';
				this.userInfo = {};
			},
			//弹出分配角色对话框
			setRole(info) {
				this.userInfo = info;
				//在展示对话框之前，获取所有的角色列表
				service({
					url: 'roles',
					method: 'get'
				}).then(res => {
					// console.log(res);
					if(res.data.meta == 400){
						return this.$lxmessage.error(this.$i18n.t('error.error_data'));
					}
					this.rolesList = res.data.data;
				}).catch(err => {
					this.$message.error(this.$i18n.t('error.error_data'));
				})
				this.setRoleDialogFlag = true;
			},
			//提交分配角色
			roleInfo() {
				this.setRoleDialogFlag = false;
				if (!this.selectedRoleId) {
					return this.$message.error(this.$i18n.t('warn.warn_roleChange'));
				}
				service({
						url: `users/${this.userInfo.id}/role`,
						method: 'put',
						data: {
							rid: this.selectedRoleId
						}
					}).then(res => {
						// console.log(res);
						if(res.data.meta == 400){
							return this.$lxmessage.error(this.$i18n.t('error.error_data'));
						}
						this.$lxmessage.success(this.$i18n.t('success.success_data'));
						this.getUserList();
					})
					.catch(err => {
						this.$lxmessage.error(this.$i18n.t('errorr.error_data'));
					})
			},
			//确认是否删除
			isDel(id) {
				this.$confirm(this.$i18n.t('warn.warn_deluser'), this.$i18n.t('message.tip'), {
					confirmButtonText: this.$i18n.t('message.Enter'),
					cancelButtonText: this.$i18n.t('message.Cancel'),
					type: 'warning'
				}).then(() => {
					MainApi[':id'](`users/${id}`, 'delete').then(res => {
						// console.log(res);
						if(res.data.meta == 400){
							return this.$lxmessage.error(this.$i18n.t('error.error_data'));
						}
						this.$lxmessage.success(this.$i18n.t('success.success_data'));
						this.getUserList();
					}).catch(err => {
						console.log(err);
					})
				}).catch(() => {
					// this.open1('', '已取消删除');
					this.$lxmessage.success(this.$i18n.t('success.success_data'));
				})
			},

			//弹出修改用户信息的对话框
			//弹出添加用户信息的对话框
			dialogOut(id, info) {
				this.dialogFlag = true;
				this.dialogId = id;
				if (id == 0) {
					this.dialogTitle = this.$i18n.t('message.add_user');
					this.dialogForm = true;
				} else if (id == 1) {
					this.dialogTitle = this.$i18n.t('message.modify_user');
					this.dialogForm = false;
					// console.log(info);
					//修改用户表单
					this.addForm.username = info.username;
					this.addForm.password = '123456'
					this.addForm.email = info.email;
					this.addForm.mobile = info.mobile;
					this.userId = info.id;
				}
			},
			//添加新用户
			addUserInfo() {
				if (this.dialogId == 0) {
					this.$refs.addFormRef.validate(vaild => {
						// console.log(vaild);
						if (!vaild) return
						//可以发起添加用户的网络请求
						MainApi.users(this.addForm, 'post').then(res => {
							// console.log(res);
							if(res.data.meta == 400){
								return this.$lxmessage.error(this.$i18n.t('error.error_data'));
							}
							this.addUser = false;
							// this.open1('success', '创建用户成功');
							this.$lxmessage.success(this.$i18n.t('success.success_data'));
							this.dialogFlag = false;
							//重新获取列表数据
							this.getUserList();
						}).catch(err => {
							console.log(err);
						})
					});
				} else {
					this.$refs.addFormRef.validate(vaild => {
						// console.log(vaild);
						if (!vaild) return
						let data = {
							id: this.addForm.username,
							email: this.addForm.email,
							mobile: this.addForm.mobile
						}
						// this.axios.put()
						MainApi[":id"](`users/${this.userId}`, 'put', data).then(res => {
							if(res.data.meta == 400){
								return this.$lxmessage.error(this.$i18n.t('error.error_data'));
							}
							this.dialogFlag = false;
							// console.log(res);
							this.getUserList();
							// this.open1('success', '修改用户信息成功');
							this.$lxmessage.success(this.$i18n.t('success.success_data'));
						}).catch(err => {
							console.log(err);
						})
					})

				}


			},
			//监听添加用户对话框的关闭事件
			addFormClose() {
				this.$refs.addFormRef.resetFields();
			},
			//监听switch开关状态的改变
			userStateChange(state) {
				// console.log(state);
				MainApi[":type"](`users/${state.id}/state/${state.mg_state}`, 'put').then(res => {
					// console.log(res);
					if(res.data.meta == 400){
						return this.$lxmessage.error(this.$i18n.t('error.error_data'));
					}
					// this.open1('success', '修改用户状态成功');
					this.$lxmessage.success(this.$i18n.t('success.success_data'));
				}).catch(err => {
					// this.open1('error', '修改用户状态失败');
					this.$lxmessage.error(this.$i18n.t('error.error_data'));
					//改回操作前的状态
					state.mg_state = !state.mg_state;
				})
			},
			//监听pagesize改变的事件
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.queryInfo.pagesize = val;
				this.getUserList();
			},
			//监听 页码值改变的事件
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.queryInfo.pagenum = val;
				this.getUserList();
			},
			getUserList() {
				MainApi.users(this.queryInfo, 'get').then(res => {
					// console.log(res);
					if(res.data.meta == 400){
						return this.$lxmessage.error(this.$i18n.t('error.error_data'));
					}
					this.userList = res.data.data.users;
					this.total = res.data.data.total;
				}).catch(err => {
					this.$lxmessage.error(this.$i18n.t('error.error_data'));
				})
			},
		}
	}
</script>

<style scoped="scoped">
	.el-row {
		line-height: 30px;
		/* border: 1px solid red; */
		margin-bottom: 10px;
		padding: 0;
	}
</style>
