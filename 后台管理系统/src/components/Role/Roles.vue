<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">{{$t('message.home')}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{$t('message.authority_management')}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{$t('message.role_list')}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showDialog(0)">{{$t('message.add_role')}}</el-button>
				</el-col>
			</el-row>
			<el-row>
				<!-- 角色列表区域 -->
				<el-table :data="roleList" border stripe >
					<!-- 展开列/ -->
					<el-table-column type="expand">
						<template slot-scope="scope">
							<el-row :class="['bdbottom',index === 0 ? 'bdtop' : '','vcenter']" v-for="(item,index) in scope.row.children" :key="item.id" >
								<!-- 一级权限 -->
								<el-col :span='5'>
									<el-tag closable @close='removeRole(scope.row,item.id)'>{{item.authName}}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<!-- 二级和三级权限 -->
								<el-col :span="19">
									<el-row :class="[index === 0 ? '' : 'bdtop','vcenter']" v-for="(item,index) in item.children" :key='item.id'>
										<el-col :span="6">
											<el-tag closable @close='removeRole(scope.row,item.id)' type='success'>{{item.authName}}</el-tag>
											<i class="el-icon-caret-right"></i>
										</el-col>
										<el-col :span="18" >
											<el-tag closable @close='removeRole(scope.row,item.id)' v-for="(item) in item.children" :key="item.id" type='warning'>{{item.authName}}</el-tag>											
										</el-col>
										
									</el-row>
									
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<!-- 索引列 -->
					<el-table-column type="index"></el-table-column>
					<el-table-column :label="$t('message.role_name')" prop="roleName">
					</el-table-column>
					<el-table-column :label="$t('message.role_intro')" prop="roleDesc">
					</el-table-column>
					<el-table-column :label="$t('message.operation')" width= '400px' >
						<template slot-scope="scope">
							<el-button size='mini' type="primary" icon="el-icon-edit" @click="showDialog(1,scope.row)">{{$t('message.edit')}}</el-button>
							<el-button size='mini' type="danger" icon="el-icon-delete" @click="roleDel(scope.row.id)">{{$t('message.delete')}}</el-button>
							<el-button size='mini' type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">{{$t('message.assign_right')}}</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</el-card>
		<el-dialog :title="dialogTitle" :visible.sync="dialogFlag" width="50%" @close="roleFormClose">
			<!-- 内容主题区 -->
			<el-form :model="roleForm" label-width="130px" ref="roleFormRef">
				<el-form-item :label="$t('message.role_name')" prop="roleName"  >
					<el-input v-model="roleForm.roleName"></el-input>
				</el-form-item>
				<el-form-item :label="$t('message.role_intro')" prop="roleDesc"  >
					<el-input v-model="roleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogFlag = false">{{$t('message.Cancel')}}</el-button>
				<el-button type="primary" @click="roleFormInfo">{{$t('message.Enter')}}</el-button>
			</span>
		</el-dialog>
		<!-- 分配权 -->
		<el-dialog :title="$t('message.assign_right')" :visible.sync="setRightDialog" width="50" @close="setRightClose">
			<el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" ref="treeRef" :default-checked-keys="defkeys" default-expand-all></el-tree>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRightDialog = false">{{$t('message.Cancel')}}</el-button>
				<el-button type="primary" @click="rightInfo">{{$t('message.Enter')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import service from '../../request/request.js';
	export default {
		data() {
			return {
				rightId:0,
				defkeys:[],//默认权限选中
				treeProps:{
					children:'children',
					label:'authName'
				},
				rightsList:[],//所有权限的数据
				setRightDialog:false,
				dialogTitle:'',
				roleId:0,
				roleForm:{
					// id:'',
					roleName:'',
					roleDesc:''
				},
				dialogId:0,
				dialogFlag:false,
				//所有角色列表数据
				roleList: []
			}
		},
		created() {
			this.getRoleList();
		},
		methods: {
			//授权权限
			rightInfo(){
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					this.$refs.treeRef.getHalfCheckedKeys()
				];
				// console.log(keys);
				const idStr = keys.join(',');
				service({url:`roles/${this.rightId}/rights`,method:'post',data:{rids:idStr}}).then(res=>{
					// console.log(res);
					if(res.data.meta == 400){
						return this.$lxmessage.error(this.$i18n.t('error.error_data'));
					}
					this.setRightDialog = false;
					this.$lxmessage.success(this.$i18n.t('success.success_data'));
					this.getRoleList();
				}).catch(err=>{
					this.$lxmessage.error(this.$i18n.t('error.error_data'));
				})
			},
			//监听权限对话框关闭
			setRightClose(){
				this.defkeys = [];
			},
			//通过递归形式获取角色下所有的权限id保存到defkeys
			getLeafkeys(node,arr){
				//如果当前node节点不包含children属性。则是三级节点
				if(!node.children){
					return arr.push(node.id);
				}
				node.children.forEach(item=>{
					this.getLeafkeys(item,arr);
				})
			},
			//分配权限对话框
			showRightDialog(role){
				this.setRightDialog = true;
				service({url:`rights/tree`,method:'get'}).then(res=>{
					// console.log(res);
					if(res.data.meta == 400){
						return this.$lxmessage.error('获取权限失败');
					}
					this.rightId = role.id;
					this.rightsList = res.data.data;
					this.getLeafkeys(role,this.defkeys);
				}).catch(err=>{
					console.log(err);
				})
			},
			//删除权限
			removeRole(role,rightid){
				this.$confirm('此操作将永久删除该权限，是否继续？',this.$i18n.t('message.tip'),{
					confirmButtonText:this.$t('message.Enter'),
					cancelButtonText:this.$t('message.Cancel'),
					type:'warning'
				}).then(()=>{
					service({url:`roles/${role.id}/rights/${rightid}`,method:'delete'}).then(res=>{
						this.$lxmessage.success('删除权限成功');
						// console.log(role);
						// console.log(res);
						role.children = res.data.data;
					}).catch(err=>{
						this.$lxmessage.error('删除失败');
					})
				}).catch(()=>{
					this.$lxmessage.success('已取消删除');
				})
			},
			//删除角色
			roleDel(id){
				// console.log(id)
				this.$confirm('此操作将永久删除该角色，是否继续？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(()=>{
					service({url:`roles/${id}`,method:'delete',data:id}).then(res=>{
						this.$lxmessage.success('删除角色成功');
						this.getRoleList();
					}).catch(err=>{
						this.$lxmessage.error('删除失败');
					})
				}).catch(()=>{
					this.$lxmessage.success('已取消删除');
				})
			},
			//提交表单数据
			roleFormInfo(){
				if(this.dialogId == 0){
					// console.log(this.roleForm);
					service({url:'roles',method:'post',data:this.roleForm}).then(res=>{
						this.$lxmessage.success('创建角色成功');
						this.getRoleList();
						this.dialogFlag = false;
					}).catch(err=>{
						this.$lxmessage.error('创建角色失败');
					})
				}else if(this.dialogId == 1){
					service({url:`roles/${this.roleId}`,method:'put',data:this.roleForm}).then(res=>{
						// console.log(res);
						this.$lxmessage.success('修改角色成功');
						this.getRoleList();
						this.dialogFlag = false;
					}).catch(err=>{
						this.$lxmessage.error('修改角色失败');
					})
				}
				
			},
			//关闭表单清空监听
			roleFormClose(){
				this.$refs.roleFormRef.resetFields();
				this.roleForm.roleName = '';
				this.roleForm.roleDesc = '';
			},
			//展开添加角色或者修改对话框
			showDialog(id,info){
				this.dialogFlag = true;
				this.dialogId = id;
				if(id == 0){
					this.dialogTitle = '添加角色';
				}else if(id == 1){
					// console.log(info);
					this.dialogTitle = '编辑角色';
					this.roleForm.roleName = info.roleName;
					this.roleForm.roleDesc = info.roleDesc;
					this.roleId = info.id;
					
				}
			},
			getRoleList() {
				service({
					url: 'roles',
					method: 'get',
				}).then(res => {
					this.roleList = res.data.data;
				}).catch(err => {
					this.$lxmessage.error('获取角色列表失败');
					// console.log(err);;
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.el-tag{
		margin: 15px 0;
	}
	.bdtop{
		border-top: 1px solid lightgrey;
	}
	.bdbottom{
		border-bottom: 1px solid lightgrey;
	}
	.vcenter{
		display: flex;
		align-items: center;
	}
</style>
