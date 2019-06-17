<template>
  <div>
    <ChooseHead />
    <ExportFile
      :options="options"
      :upload-url="uploadUrl"
      btn-text="下一步"
      @confirm="confirm"
      @uploaded="uploaded"
    />
  </div>
</template>

<script>
import ExportFile from '@components/export-file'
import ChooseHead from '@components/choose-head'
export default{
    components:{
        ExportFile,ChooseHead
    },
    data() {
        return {
            options:[],
            uploadUrl:"",
            sheetResponse:{},
        }
    },
    activated() {
        const isDev = process.env.NODE_ENV === 'development';
        if(isDev) {
            this.uploadUrl = this.urls.testBaseUrl.url + this.urls.sheetsMsg.url
        }else{
            this.uploadUrl = this.urls.baseUrl.url + this.urls.sheetsMsg.url
        }
    },
    methods: {
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
                file_url:this.sheetResponse.file_url
            }
            this.requestUtil.post(this.urls.sheetData.url,params).then((res)=>{
                if(res.data) {
                    sessionStorage.setItem("project_id",res.data.project_id)
                    this.router.push({
                        name:"chooseTwo" 
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
