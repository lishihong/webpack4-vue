<template>
  <div
    class="user-head"
  >
    <div
      v-if="isNotHome"
      class="home"
      @click="home()"
    >
      <img src="../assets/images/img-home.png">工程主页
    </div>

    <div class="name">
      <img src="../assets/images/img-user-default.png">{{ nickname }}
    </div>
  </div>
</template>

<script>
import {getUser} from '../services/user'
export default {
    props:{isNotHome:{default:false}},
    data() {
        return {
            nickname:"",
        }
    },
    created() {
        if(getUser()) {
            this.nickname = getUser().nickname;
        }
    },
    methods: {
        home() {
            this.router.push({
                path:"/home"
            })
        }
    },
}
</script>

<style scoped lang="less">
.user-head{
  position:fixed;
  display:flex;
  width:calc(100% - 30px);
  align-items:center;
  justify-content: space-between;
  height:40px;
  background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
  z-index:99;
  padding:0 15px;
  border-bottom:solid 1px #CCCCCC;
  .home{
    padding:4px 8px; 
    background:#fff;
    border:1px solid @borderColor;
    border-radius:2px;
    display:flex;
    align-items:center;
    cursor: pointer;
    img{
      width:14px;
      margin-right:3px;
    }
  }
  .name{
    display:flex;
    flex:1;
    justify-content: flex-end;
    align-items:center;
    img{
      width:24px;
      margin-right:6px;
    }
  }
}
</style>