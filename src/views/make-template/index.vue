<template>
  <div>
    <ModelManage 
      ref="modelManage"
      :key="$route.path"
      @noticeParentLoad="loadNodeId"
    />
    <div class="view-content">
      制作模板
    </div>
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
        loadNodeId(nodeId,operate) {
            this.nodeId = nodeId
            this.operate = operate
        },
         
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>
