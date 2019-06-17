<template>
  <div>
    <BigTable
      v-if="nodeId>=0"
      ref="bigTable"
      :key="nodeId"
      style="height:calc(100vh - 354px);"
      :max-height="maxHeight"
      :is-condition="true"
      :is-show-check-box="false"
      :page-url="pageUrl"
    />
    <div
      v-show="isShowBtn"
      style="margin-top:10px;text-align:center;"
    >
      <button
        class="factor-btn-step"
        @click="confirm"
      >
        确认
      </button>
      <button
        class="factor-btn-step"
        style="margin-left:20px;"
        @click="cancel"
      >
        取消
      </button>
    </div>
  </div>
</template>

<script>
import BigTable from '@components/big-table'
export default{
    components:{
        BigTable
    },
    props:{
        projectId:{
            default:""
        }
    },
    data() {
        return {
            maxHeight:200,
            pageUrl:"", 
            nodeId:-1,
            isShowBtn:false,
            select_type:1,
        }
    },
    created() {
        this.pageUrl = this.urls.factorDataPage.url
    },
    mounted() {
        this.initChildData()
    },
    methods: {
        confirm() {
            this.$refs.bigTable.totalMsg()
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type": 2,
                "select_type":this.select_type,
                "select_cols": this.$refs.bigTable.excludeCol,
                "select_rows": this.$refs.bigTable.excludeRowFactor,
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!');
                    this.$emit("loadData",this.nodeId)
                    this.isShowBtn = false
                    this.$emit("toMain",false,1)
                }
            })
        },
        hasExclude() {
            this.$refs.bigTable.totalMsg()
            if(this.$refs.bigTable.excludeRow.length == 0 && this.$refs.bigTable.excludeCol.length == 0) {
                return false
            }
            return true
        },
        cancel() {
            this.$refs.bigTable.clearExclude()
            this.isShowBtn = false
            this.$emit("toMain",false,1)
        },
        exlcude() {
            this.select_type = 1
            this.$refs.bigTable.setExclude()
            this.isShowBtn = true
            this.$emit("toMain",true,1)
        },
        include() {
            this.select_type = 2
            this.$refs.bigTable.setInclude()
            if(!this.hasExclude()) {
                this.isShowBtn = false
                this.$emit("toMain",false,1)
            }
        },
        initChildData() {
            this.nodeId = sessionStorage.getItem("nodeId")
            this.$nextTick(()=>{
                this.maxHeight = this.$refs.bigTable.$el.clientHeight
            })
        },
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>
