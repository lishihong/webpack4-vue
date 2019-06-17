<template>
  <div
    class="collect-container"
    @mouseover="changeCollectImg(1)"
    @mouseout="changeCollectImg(0)"
    @click="collect"
  >
    <img
      :src="collectImg"
    >
    <div
      v-show="collectImgType==1"
      style="color:#4FA1CA;font-size:12px;margin-top:-2px;"
    >
      收藏
    </div>
  </div>
</template>

<script>
export default{
    data() {
        return {
            collectImg:require('../assets/images/img-collect.png'),
            collectImgType:0,
        }
    },
    mounted() {
    },
    methods: {
        changeCollectImg(type) {
            this.collectImgType = type
            if(type == 1) {
                this.collectImg = require('../assets/images/img-collect-select.png')
            }else{
                this.collectImg = require('../assets/images/img-collect.png')
            }
        },
        collect() {
            this.$emit("collect");
        }
    },      
}
</script>

<style scoped lang="less">
.collect-container{
  position:relative;
  top:-314px;
  left:calc(100% - 36px);
  cursor: pointer;
  width:40px;
  
}
</style>

<style lang="less">
  
</style>
