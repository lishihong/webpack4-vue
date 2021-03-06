import axios from 'axios';
import urls from '../constants/url';
import router from '../router'
import {getToken} from './user'
import {Loading,Message} from 'element-ui';
 
axios.defaults.timeout = 10000; //响应超时时间          
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; //配置请求头
const isDev = process.env.NODE_ENV === 'development';
if(isDev) {
    axios.defaults.baseURL = urls.testBaseUrl.url;  //配置接口地址
} else {
    axios.defaults.baseURL = urls.baseUrl.url;   //配置接口地址
}

//请求拦截器
axios.interceptors.request.use(
    config => {
        let token = getToken();
        if(token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
 
 
//添加响应拦截器
axios.interceptors.response.use((res) =>{
    return Promise.resolve(res);
}, (error) => {
    if(error.response && error.response.data.result_code != 200) {
        //提示msg
        Message({message:error.response.data.result_msg,duration:2000,center:true,type:"warning"})
    }
    if(error.response && (error.response.data.result_code === 10003 || error.response.data.result_code === 10002)) { 
        router.push({
            path:"/login",
            query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
        })
    }
    return Promise.reject(error);
});
 
function dealRequest(url,params,funName,isLoading) {

    return new Promise((resolve) => {
        //显示loading
        let loading;
        if(isLoading) {
            loading = Loading.service({
                lock: true,
                text: '努力加载中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        }
        axios[funName](url, params)
            .then(response => {
                if(isLoading) {
                    loading.close();
                }
                resolve(response.data);
            },err=>{
                if(isLoading) {
                    loading.close();
                }
                Message({message:`${err.message}`,duration:2000,center:true,type:"warning"})
            })
            .catch((err) => {
                if(isLoading) {
                    loading.close();
                }
                Message({message:`${err.message}`,duration:2000,center:true,type:"warning"})
            })
    })
}

//返回一个Promise(发送post请求)
function post(url, params,isLoading = true) {
    return dealRequest(url,params,"post",isLoading);
}
//返回一个Promise(发送get请求)
function get(url,params,isLoading = true) {
    return dealRequest(url,params,"get",isLoading);
}

export default {
    post:post,
    get:get 
}