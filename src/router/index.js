    
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

const Home = () => import ("../views/home.vue")
const Test = () => import ("../views/test.vue")
const Test2 = () => import ("../views/test2.vue")
const Login = () => import ("../views/login.vue")

let routes = [
    {
        path:'*',
        redirect:'/home'
    },
    {
        path:'/',
        redirect:'/home'
    },
    {
        path: '/home',
        name:'home',
        component: Home,
        meta:{"title":"主页",keepAlive:true}
    },
    {
        path: '/test',
        name:'test',
        component: Test,
        meta:{"title":"测试1",keepAlive:true}
    },
    {
        path: '/test2',
        name:'test2',
        component: Test2,
        meta:{"title":"测试2",keepAlive:true}
    },
    {
        path: '/login',
        name:'login',
        component: Login,
        meta:{"title":"登录",keepAlive:true}
    }
]

export default new Router({
    mode:'history',
    routes:routes,
})