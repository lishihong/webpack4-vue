<template>
  <div>
    <ModelManage 
      ref="modelManage"
      :key="$route.path"
      @noticeParentLoad="loadNodeId"
    />
    <div class="view-content">
      <ExportFile
        :options="options"
        :upload-url="uploadUrl"
        btn-text="预测"
        style="margin-top:10%;"
        @confirm="confirm"
        @uploaded="uploaded"
      />
    </div>
  </div>
</template>

<script>
import ModelManage from '@components/model-manage'
import ExportFile from '@components/export-file'
export default{
    components:{
        ExportFile,ModelManage
    },
    data() {
        return {
            projectId:"",
            nodeId:"",
            options:[],
            uploadUrl:"",
            sheetResponse:{},
        }
    },
    created() {
        this.projectId = sessionStorage.getItem("project_id")
        const isDev = process.env.NODE_ENV === 'development';
        if(isDev) {
            this.uploadUrl = this.urls.testBaseUrl.url + this.urls.sheetsMsg.url
        }else{
            this.uploadUrl = this.urls.baseUrl.url + this.urls.sheetsMsg.url
        }
    },
    mounted() {
    },
    methods: {
        loadNodeId(nodeId,operate) {
            this.nodeId = nodeId
            this.operate = operate
        },
        confirm(value) {
            if(!value) {
                this.$message({
                    message: '请选择工作表！',
                    type: 'warning'
                });
                return;
            }
            let params = {
                sheet_name:value,
                file_url:this.sheetResponse.file_url,
                project_id:this.projectId,
                type:2,
            }
            this.requestUtil.post(this.urls.sheetData.url,params).then((res)=>{
                if(!res.data) {
                    this.router.push({
                        path:"/model-forecast/main"
                    })
                }
            })
        },
        uploaded(response) {
            this.options = []
            this.sheetResponse = response.data;
            this.sheetResponse.sheets.forEach(e => {
                this.options.push({label:e,value:e});
            });
        }
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>
