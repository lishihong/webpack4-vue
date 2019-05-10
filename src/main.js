import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/less/theme.less'
import './services/element-use'
import urls from './constants/url'
import requestUtil from './services/request'
import 'echarts'
import VueECharts from 'vue-echarts'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import './assets/css/style'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from './services/token'


Vue.use(VXETable, {
    size: 'mini',
    contextMenu: null,
    optimized: {
        scrollX: {
            gt: 300,
            oSize: 20,
            rSize: 50
        },
        scrollY: {
            gt: 100,
            oSize: 30,
            rSize: 100,
        },
        animate:false,
        overflow:"tooltip",
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
    const hasToken = getToken()
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
    render: h => h(App)
}).$mount('#app')
