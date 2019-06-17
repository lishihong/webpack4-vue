<template>
  <div>
    <ModelManage 
      ref="modelManage"
      :key="$route.path"
    />
    <div class="view-content">
      <p>预测结果</p>
      <div class="content">
        模型名称
        <el-select
          v-model="modelName"
          style="margin-left:10px;width:100px;"
          size="mini"
          @change="foreacast"
        >
          <el-option
            v-for="(item,index) in modelNameList"
            :key="index"
            :label="item.name"
            :value="item.node_id"
          />
        </el-select>
      </div>
      <div v-if="modelObj.operate===10">
        <v-chart
          ref="line_chart"
          :options="options"
          autoresize
          style="height:240px;width:100%;"
        />
        <Collect
          style="top:-235px;"
          @collect="collect"
        />
      </div>
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
          :key="index"
          :prop="item"
          :label="item"
          width="120"
          show-overflow-tooltip
          :resizable="false"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import ModelManage from '@components/model-manage'
import Collect from '@components/collect'
export default{
    components:{
        ModelManage,Collect
    },
    data() {
        return {
            projectId:"",
            modelName:"",
            modelNameList:[],
            tableColumn:[],
            tableData:[],
            modelObj:{},
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
                yAxis: {type:'value',splitLine:{show:false},min:-1,max:1},
                series:{
                    type:'line',
                    data:[],
                    symbolSize: 16,
                    symbolKeepAspect:true,
                    lineStyle:{color:"#4DD67F"},
                    markLine:{
                        data:[],
                        label:{
                            show:true,
                            position:'end',
                            formatter:'{b}  {c}'
                        }
                    }
                } ,
            },

        }
    },
    created() {
        this.projectId = sessionStorage.getItem("project_id")
        this.initSelect()
    },
    mounted() {
    },
    methods: {
        initSelect() {
            this.requestUtil.post(this.urls.forecastInitList.url,{project_id:this.projectId}).then((res)=>{
                this.modelNameList = res.data
                this.modelName = this.modelNameList[0].node_id
                this.modelObj = this.modelNameList[0]
                this.foreacast()
            })
        },
        foreacast() {
            this.modelObj = this.modelNameList.find(item => item.node_id === this.modelName)
            this.requestUtil.post(this.urls.forecastResult.url,{project_id:this.projectId,node_id:this.modelObj.node_id}).then((res)=>{
                this.tableColumn = res.data.col_title
                this.tableData = res.data.col_content

                this.options.xAxis.data = res.data.title
                this.options.yAxis.min = res.data.y_min
                this.options.yAxis.max = res.data.y_max
                this.options.series.markLine.data = res.data.line
                this.options.series.data = res.data.content[0]

            })
        },
        collect() {

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
}
</style>

<style lang="less">
  
</style>
