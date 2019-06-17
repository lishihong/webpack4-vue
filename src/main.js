import Vue from 'vue'
import App from './app.vue'
import router from './router'
import './assets/less/theme.less'
import './directives/directive'
import './filters/filter'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import urls from './constants/url'
import requestUtil from './services/request'
import 'echarts'
import VueECharts from 'vue-echarts'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import './assets/css/style'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getUser} from './services/user'
import _ from 'lodash'
Vue.prototype._ = _
Vue.prototype.$filters = Vue.options.filters

Vue.use(ElementUI);

Vue.use(VXETable, {
    size: 'mini',
    contextMenu: null,
    optimization: {
        animat:false,
        scrollY: {
            gt: 100,
            oSize: 40,
            rSize: 80
        },
        scrollX: {
            gt: 100,
            oSize: 20,
            rSize: 40,
        },
    },
    fit:false,
}) 
NProgress.configure({showSpinner: false})

Vue.component('v-chart', VueECharts)

Vue.config.productionTip = false

Vue.prototype.router = router;
Vue.prototype.urls = urls;
Vue.prototype.requestUtil = requestUtil;

const whiteList = ['/login'] //不需要判断登录的路由
const baseTitle = '多因子分析工具'

router.beforeEach((to, from, next)=> {
    NProgress.start()
    document.title = `${baseTitle}-${to.meta.title}`;
    const hasToken = getUser();
    Vue.prototype.isLogin = !!hasToken;
    if (hasToken) {
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else{
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})
  
router.afterEach(() => {
    NProgress.done()
})
  

new Vue({
    router,
    data: {
        eventHub: new Vue()
    },
    render: h => h(App),
}).$mount('#app')
