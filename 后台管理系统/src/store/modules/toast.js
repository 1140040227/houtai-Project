const namespaced = true;


const state = {
	type:null,					//弹出框类型
	content:null,				//弹出框提示内容
	time:null,					//弹出框出现时长
	status:false				//弹出框显示状态
}

const mutations = {
	UPDATE(state,payload){
		Object.assign(state,payload); //合并state和传进来的数据对象
		state.status = !state.status;
		// console.log(state);
	}
}

const actions = {
	update({commit},payload){
		// console.log(payload);
		commit('UPDATE',payload);
	}
}

export default {namespaced,state,mutations,actions}