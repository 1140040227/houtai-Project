<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index' }">{{$t('message.home')}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{$t('message.authority_management')}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{$t('message.right_list')}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-table :data="rightsList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="authName" :label="$t('message.right_name')">
				</el-table-column>
				<el-table-column prop="path" :label="$t('message.path')">
				</el-table-column>
				<el-table-column prop="level" :label="$t('message.right_level')">
					<template v-slot="scope">
						<el-tag v-if="scope.row.level === '0'">{{$t('message.class_a')}}</el-tag>
						<el-tag type="success" v-if="scope.row.level === '1'">{{$t('message.class_b')}}</el-tag>
						<el-tag type="warning" v-if="scope.row.level === '2'">{{$t('message.class_c')}}</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import service from '../../request/request.js';
	import MainApi from '../../request/api.js';
	export default {
		data() {
			return {
				rightsList: []
			}
		},
		created() {
			this.getRightsList();
		},
		methods: {
			getRightsList() {
				service({
					url: '/rights/list',
					method: 'get',
					params: 'list'
				}).then(res => {
					// console.log(res);
					if(res.data.meta == 400){
						return this.$lxmessage.error(this.$i18n.t('message.error_data'));
					}
					this.rightsList = res.data.data;
				}).catch(err => {
					this.$lxmessage.error(this.$i18n.t('message.error_data'));
				})
			}
		}
	}
</script>

<style scoped="scoped">

</style>
