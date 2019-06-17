<template>
  <div class="view-content">
    <p>特征信息损失</p>
    <div class="content">
      <span>抽取方法</span>
      <el-select
        v-model="method"
        style="margin-left:10px;width:100px;"
        size="mini"
        @change="filterChart"
      >
        <el-option
          v-for="item in methodList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span style="margin-left:4%;">
        主成分TopN
      </span>
      <input
        v-model="colNo"
        @keyup.enter="filterChart"
        @input="handleInput($event)"
      >
    </div>
    <div>
      <v-chart
        ref="bar_chart"
        :options="options"
        autoresize
        style="height:240px;width:100%;"
      />
      <Collect
        style="top:-235px;"
        @collect="collect"
      />
    </div>
    <p>抽取结果</p>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:10px;"
      height="200"
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
import Collect from '@components/collect'
export default{
    components:{
        Collect
    },
    data() {
        return {
            projectId:"",
            nodeId:"",
            method:"",
            methodList:[],
            colNo:2,
            tableColumn:[],
            tableData:[],
            options:{
                color:['#448ACA'],
                title:{show:false},
                grid:{left:'8%',right:'10px',top:'20px'},
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                dataZoom: [ {
                    type: 'inside',
                    id: 'insideX',
                    xAxisIndex: 0,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                }],
                xAxis: {type: 'category',data:[],axisLabel:{rotate:90}},
                yAxis: {type:'value',splitLine:{show:false}},
                series:{
                    type:'bar',
                    data:[],
                } ,
            },
        }
    },
    mounted() {
    },
    methods: {
        loadChildData(projectId,nodeId) {
            this.projectId = projectId
            this.nodeId = nodeId
            this.loadData()
        },
        loadData() {
            this.methodList = []
            this.requestUtil.post(this.urls.extractMethods.url,{}).then((res)=>{
                res.data.forEach((item)=>{
                    let obj = {}
                    obj.label = item.name
                    obj.value = item.name
                    this.methodList.push(obj)
                })
                this.method = this.methodList[0].value
                this.loadBarData()
            })
        },
        loadBarData() {
            let params = {
                "project_id": this.projectId,
                "node_id":this.nodeId,
                "method": this.method
            }
            this.requestUtil.post(this.urls.extractInits.url,params).then((res)=>{
                res.data.forEach(item=>{
                    this.options.xAxis.data.push(item.index)
                    this.options.series.data.push(item.explained_variance)
                })
            })
            params.top_n = this.colNo + ''
            this.requestUtil.post(`${this.urls.extractDataPage.url}1`,params).then((res)=>{
                this.tableColumn = res.data.title
                this.tableData = res.data.content
            })
        },
        confirm() {
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type":6 ,
                "select_type":1,
                "select_cols":[],
                "select_rows": [],
                "method":this.method + '',
                "top_n":this.colNo + ''
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!')
                    this.$emit("loadData",this.nodeId)
                    this.router.go(-1)
                }
            })
        },
        filterChart() {
            if(this.colNo < 1) {
                this.$message.warning("请输入大于0的整数")
                return
            }
            this.loadBarData()
        },
        collect() {

        },
        handleInput(e) {
            let reg = /[^\d]/g
            this.relative = e.target.value.replace(reg,'')
        },
    },      
}
</script>

<style scoped lang="less">
p{
  font-size:16px;
}
.content{
  order:1px solid rgba(204,204,204,1);
  background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
  border-radius:4px 4px 0px 0px;
  display: flex;
  align-items: center;
  padding:5px 10px;
  input{
    height:24px;
    width:120px;
    margin-left:10px;
    text-align:center;
    background:rgba(255,255,255,1);
    border:1px solid rgba(197,197,197,1);
    border-radius:2px;
    padding:0 4px;
  }
}
</style>

<style lang="less">
  
</style>
