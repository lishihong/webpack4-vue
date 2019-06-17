<template>
  <div id="app">
    <UserHead
      v-if="isLogin"
      :is-not-home="isNotHome"
    />
    <div :class="{ 'main-contianer': isLogin}">
      <SideMenu
        v-if="isShowSide"
        :key="this.$route.path"
      />
      <keep-alive>
        <router-view
          v-if="$route.meta.keepAlive"
          class="right-container"
        />
      </keep-alive>
      <router-view
        v-if="!$route.meta.keepAlive"
        class="right-container"
      />
    </div>
  </div>
</template>

<script>  
let list = ['/home','/login','/choose'];
import UserHead from './components/user-head'
import SideMenu from './components/side-menu'
export default {
    components:{
        UserHead,SideMenu
    },
    data() {
        return{
            isNotHome:false,
            isShowSide:false,
        }
    },
    watch:{
        $route(to) {
            let toPath = to.path;
            if(toPath !== "/home") {
                this.isNotHome = true;
            }else{
                this.isNotHome = false;
            }
            for(let i = 0;i < list.length;i++) {
                if(toPath.includes(list[i])) {
                    this.isShowSide = false;
                    break;
                } 
                if(i === list.length - 1) {
                    this.isShowSide = true;
                }
            }
        }
    }, 
};
</script>

<style scoped lang="less">
 
</style>

<style lang="less">
#app{
  font-size:14px;
  font-family:MicrosoftYaHei;
  color:@mainFontColor;
  height:calc(100vh - 41px);
}
.main-contianer{
  top:41px;
  display:flex;
  position: relative;
  height:100%;
} 
.right-container{
  padding: 0 10px;
  overflow:hidden;
  flex:1;
}
</style>
