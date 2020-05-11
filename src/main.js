// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import router from './router'
import lang from './assets/i18n/language'
import common from './common'
import filters from './filters';
import store from "./store";
import md5 from 'js-md5';
import 'element-ui/lib/theme-chalk/index.css'
import './styles/quill.snow.css'
import './styles/common.css'
import './assets/icon/iconfont.css'

Vue.use(Vuex)
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$md5 = md5
Vue.prototype.moment = moment
Vue.prototype.common = common
Vue.prototype._ = _

// 多语言
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  messages: lang
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
