const login = {
	state:{
		token:''
	},
	getters:{
		
	},
	mutations:{
		SAVE_TOKEN:(state,payload)=>{
			state.token = payload.token;
		}
	},
	actions:{
		save_token:({commit},payload)=>{
			return new Promise((resolve,reject)=>{
				// console.log(payload);
				let token = "";
				commit('SAVE_TOKEN',payload);
				sessionStorage.setItem('user-token',payload.token);
				if(sessionStorage.getItem('user-token')){
					token = payload.token;
				}
				resolve(token);
			})
		}
	}
}

export default login;