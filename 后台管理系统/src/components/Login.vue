<template>
	<div class="loginbox">
		<div class="login-wrap">
			<div class="header-box">
				<img src="../assets/login-header.jpg" alt="">
			</div>
			<div class="form">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
					class="demo-ruleForm">
					<el-form-item :label="$t('message.userlabel')" prop="username">
						<el-input type="username" v-model="ruleForm.username" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item :label="$t('message.psdlabel')" prop="password">
						<el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button plain type="primary" @click="submitForm('ruleForm')">{{$t('message.submit')}}</el-button>
						<span style="margin-left: 20px;color: deepskyblue;cursor: pointer;text-decoration: underline" @click="languageToggle"><span>{{$t('message.chinese')}}</span>/<span>English</span></span>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import MainApi from '../request/api.js';
	export default {
		created(){
			this.lxlanguages();
		},
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error(this.$i18n.t('error.error_psd')));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validateUser = (rule, value, callback) => {
				if (value === '') {
					callback(new Error(this.$i18n.t('error.error_user')));
				} else {
					callback();
				}
			}
			return {
				ruleForm: {
					username: '',
					password: '',
				},
				rules: {
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					username: [{
						validator: validateUser,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			languageToggle(){
				if(this.$i18n.locale === 'CN'){
					this.$i18n.locale = 'EN';
					this.$lxmessage.success('The language switch is successful. The current language is English');
				}else{
					this.$i18n.locale = 'CN';
					this.$lxmessage.success('语言切换成功，当前语言为中文');
				}
				sessionStorage.setItem('lang',this.$i18n.locale);
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let data = this.ruleForm;
						this.open1('warning',this.$i18n.t('warn.warn_logining'));
						MainApi.login(data, 'post').then(res => {
							if(res.data.data !== null){
								this.$lxmessage.success(this.$i18n.t('success.success_login'));
								//存储token到本地
								let token = res.data.data.token;
								this.$store.dispatch('save_token',{token}).then(res=>{
									setTimeout(()=>{
										this.$router.push({
											path:'/index'
										})
									},2000)
									
								}).catch(err=>{
									console.log(err);
								})
								
							}else{
								this.$lxmessage.error(this.$i18n.t('error.error_login'));
							}
						}).catch(err => {
							this.$lxmessage.error(this.$i18n.t('error.error_loginCheck'));
						})
					} else {

						this.$lxmessage.error(this.$i18n.t('error.error_loginCheck'));
						return false;
					}
				});
			},
			open1(type,text) {
				this.$message({
					message: text,
					type: type
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.loginbox {
		background-color: #2b4b6b;
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.login-wrap {
		width: 500px;
		height: 300px;
		background-color: white;
		border-radius: 5px;
		position: absolute;
		left: 50%;
		margin-left: -250px;
		top: 50%;
		margin-top: -150px;
		box-sizing: border-box;
		padding: 100px 0 0 0;
	}

	.header-box {
		position: absolute;
		width: 150px;
		overflow: hidden;
		height: 150px;
		border-radius: 50%;
		left: 50%;
		margin-left: -75px;
		top: -75px;
	}

	.header-box img {
		width: 100%;
		height: 100%;
	}

	.form {
		/* border: 1px solid red; */
		width: 100%;
		box-sizing: border-box;
		padding-right: 40px;
	}
</style>
