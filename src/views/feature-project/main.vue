<template>
  <div>
    <ModelManage 
      ref="modelManage"
      :key="$route.path"
      @noticeParentLoad="loadNodeId"
    />
    <router-view
      ref="child"
      @loadData="loadAllData"
    />
  </div>
</template>

<script>
import ModelManage from '@components/model-manage'
export default{
    components:{
        ModelManage,
    },
    data() {
        return {
            projectId:"",
            nodeId:"",
        }
    },
    created() {
        this.projectId = sessionStorage.getItem("project_id")
    }, 
    mounted() {
    },
    methods: {
        loadNodeId(nodeId) {
            this.nodeId = nodeId
            if(!this.$route.path.includes("index")) {
                this.$refs.child.loadChildData(this.projectId,this.nodeId)
            }
        },
        loadAllData() {
            this.$refs.modelManage.loadData()
        },
    },      
}
</script>

<style scoped lang="less">
.head{
  display:flex;
  background:rgba(245,245,245,1); 
  border:1px solid rgba(204,204,204);
  border-radius:2px
}
.head-title{
  display:flex;
  font-size:16px;
  margin:6vh 0 3vh 0;
}
.head-container{
  flex:1;
  border-right:1px solid rgba(204,204,204);
  padding:1vw;
  display:flex;
  .item{
    text-align:center;
    margin-right:6%;
    cursor: pointer;
    img{
      width:60%;
      margin-bottom:6px;
    }
  }
  .item:hover{
    cursor: pointer;
    img{
      width:62%;
    }
  }
}
</style>

<style lang="less">
  
</style>
