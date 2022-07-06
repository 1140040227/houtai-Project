import Vue from 'vue';
import store from '../../store/store.js';

const success = (content)=>{
	// console.log(store);
	store.dispatch('toast/update', { type: 'success', content: content, time: 2000 });
}
const error = (content) =>{
	store.dispatch('toast/update', { type: 'error', content: content, time: 2000 });
}
const info = (content) =>{
	store.dispatch('toast/update', { type: 'info', content: content, time: 2000 });
}
const warning = (content) =>{
	store.dispatch('toast/update', { type: 'warning', content: content, time: 2000 });
}

export default function(Vue){
	Vue.prototype.$lxmessage = {
		success,
		error,
		info,
		warning
	}
};