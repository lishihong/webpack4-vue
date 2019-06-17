<template>
  <div>
    <i
      class="el-icon-star-off collect-container"
      :style="styleCollect"
      title="收藏"
      @click="collect"
    />
    <i
      class="el-icon-download collect-container" 
      :style="styleResult"
      title="查看结果" 
      @click="seeResult"
    />
  </div>
</template>

<script>
export default{
    props:{
        styleCollect:{
            default:()=> {
                return  {
                    top: 'calc(-30vh + 6px)',
                    left: 'calc(100% - 24px)',
                }
            }
        },
        styleResult:{
            default:()=> {
                return  {
                    top: 'calc(-30vh + 6px)',
                    left: 'calc(100% - 80px)',
                }
            }
        }
    },
    data() {
        return {
            
        }
    },
    mounted() {
    },
    methods: {
        collect() {
            this.$emit("collect");
        },
        seeResult() {
            this.$emit("seeResult")
        }
    },      
}
</script>

<style scoped lang="less">
.collect-container{
    position: relative;
    cursor: pointer;
    font-size:18px;
}
.collect-container:hover{
  color:#337BF7
}
</style>

<style lang="less">
  
</style>
