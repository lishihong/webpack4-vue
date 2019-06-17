<template>
  <div style="height:100%;">
    <p>特征标准化</p>
    <div class="head">
      因子标准化处理
      <el-select
        v-model="standard"
        style="margin-left:10px;width:100px;"
        size="mini"
        @change="submit"
      >
        <el-option
          v-for="(item,index) in standardList"
          :key="index"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
    </div>
    <p>转换结果</p>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:10px;"
      height="calc(100% - 445px )"
      size="mini"
    >
      <el-table-column
        v-for="(item,index) in tableColumn"
        v-show="item.show"
        :key="index"
        :prop="item"
        :label="item"
        max-width="120"
        show-overflow-tooltip
        :resizable="false"
      />
    </el-table>
    <button
      class="factor-btn-step"
      style="margin-top:10px;text-align:center;margin-left:47%;"
      @click="confirm"
    >
      确认
    </button>
  </div>
</template>

<script>
export default{
    data() {
        return {
            projectId:"",
            nodeId:"",
            standard:"",
            standardList:[],
            tableColumn:[],
            tableData:[],

        }
    },
    mounted() {
    },
    methods: {
        loadChildData(projectId,nodeId) {
            this.projectId = projectId
            this.nodeId = nodeId
            this.loadInit()
        },
        loadInit() {
            this.requestUtil.post(this.urls.standardConfig.url,{}).then((res)=>{
                this.standardList = res.data
                this.standard = res.data[0].code
                this.submit()
            })
        },
        submit() {
            let params = {
                "project_id": this.projectId,
                "node_id":this.nodeId,
                "method": this.standard
            }
            this.requestUtil.post(`${this.urls.standardDataPage.url}1`,params).then((res)=>{
                this.tableColumn = res.data.title
                this.tableData = res.data.content
            })
        },
        confirm() {
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type":8 ,
                "select_type":1,
                "select_cols":this.tableColumn,
                "select_rows": [],
                "method":this.standard
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!')
                    this.$emit("loadData",this.nodeId)
                    this.router.go(-1)
                }
            })
        },
    },      
}
</script>

<style scoped lang="less">
p{
  font-size:16px;
}
.head{
    display:flex;
    align-items: center;
    padding:20px;
    background:rgba(245,245,245,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
}
</style>

<style lang="less">
  
</style>
