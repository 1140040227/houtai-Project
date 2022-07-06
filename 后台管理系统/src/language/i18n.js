import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
import cn from './lang/cn.js';
import en from './lang/en.js';
import error_cn from './lang/error-cn.js';
import error_en from './lang/error-en.js';
import warn_cn from './lang/warn-cn.js';
import warn_en from './lang/warn-en.js';
import success_en from './lang/success-en.js';
import success_cn from './lang/success-cn.js';
const messages = {
	CN:{
		message:cn,
		error:error_cn,
		warn:warn_cn,
		success:success_cn
	},
	EN:{
		message:en,
		error:error_en,
		warn:warn_en,
		success:success_en
	}
}
const i18n = new VueI18n({
	locale:"CN",
	messages,
	silentTranslationWarn: true,
})
export default i18n;




