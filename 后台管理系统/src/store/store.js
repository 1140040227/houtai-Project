import Vue from 'vue';
import Vuex from "vuex";
import login from './modules/login.js';
import toast from './modules/toast.js';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules:{
		login,
		toast
	}
})

export default store;