<template>
  <div class="login">
    <div style="height:40vh;" />
    <div>
      <label>用户名</label>
      <input v-model="username">
    </div>
    <div style="margin-top:20px;">
      <label>密&nbsp;&nbsp;&nbsp;码</label>
      <input v-model="password">
    </div>
    <el-button
      type="primary"
      style="margin-top:30px;"
      @click="login"
    >
      登&nbsp;&nbsp;&nbsp;录
    </el-button>
  </div>
</template>

<script>
import CanvasNest from 'canvas-nest.js';
import {setToken} from '../services/token'
export default {
    data() {
        return {
            cn:"",
            screenW:"",
            username:"",
            password:"",
        }
    },
    created() {
        this.screenW = document.documentElement.clientWidth;
    },
    mounted() {
        const config = {
            color: '225,228,232',
            count: parseInt(12 + this.screenW * 0.3),
            opacity: 0.7,
            zIndex: -2,
        };
        let el = document.querySelector(".login");
        this.cn = new CanvasNest(el, config);
        window.onresize = () => {
            return (() => {
                this.cn = new CanvasNest(el, config);
            })
        };
    }, 
    destroyed() {
        this.cn.destroy();
    },
    methods: {
        login() {
            this.username = "111@126.com"
            this.password = "567890"
            this.requestUtil.post(this.urls.login.url,{username:this.username,password:this.password}).then((res)=>{
                setToken(res.data);
                this.router.push({
                    path:"/home"
                })
            })
        }
    },
}
</script>
<style lang="less">
.login{
  height: 100vh;
  text-align: center;
  input{
    height:30px;
    width:240px;
    margin-left:10px;
    line-height: 30px;
  }
}
 
</style>
