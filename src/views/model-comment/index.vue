<template>
  <div>
    <ModelManage 
      ref="modelManage"
      :key="$route.path"
      @noticeParentLoad="loadNodeId"
    />
    <div class="view-content">
      <div
        class="head"
      >
        目标变量
        <el-select
          v-model="target"
          style="margin-left:10px;width:180px;" 
          size="mini"
          placeholder="请选择目标变量"
          @change="loadChartData"
        >
          <el-option
            v-for="(d,i) in targetList"
            :key="i"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </div>
      <div v-if="operate==10">
        <p style="font-size:16px;">
          模型结果
        </p>
        <div class="head-container">
          <div style="flex:1;border-right:solid 1px #ccc;padding:6px 10px;">
            训练集
          </div>
          <div style="flex:1;padding:6px 10px;">
            验证集
          </div>
        </div>
        <div class="content-container">
          <div style="flex:1;border-right:solid 1px #ccc;">
            <v-chart
              ref="line_chart1"
              :options="options1"
              autoresize
              style="height:100%;width:100%;"
            />
            <Collect2
              @collect="collect(1)"
              @seeResult="seeResult(1)"
            />
          </div>
          <div style="flex:1;">
            <v-chart
              ref="line_chart2"
              :options="options2"
              autoresize
              style="height:100%;width:100%;"
            />
            <Collect2
              @collect="collect(2)"
              @seeResult="seeResult(2)"
            />
          </div>
        </div>

        <div style="display:flex;padding:3px 10px;">
          <div style="text-align:center;flex:1;">
            r2：0.69
            <span style="margin-left:20px;">mape：0.7</span>
          </div>
          <div style="text-align:center;flex:1;">
            r2：0.69
            <span style="margin-left:20px;">mape：0.7</span>
          </div>
        </div>
        <div class="head-container">
          <div style="padding:6px 10px;">
            残差对比
          </div>
        </div>
        <div class="content-container">
          <div style="flex:1;border-right:solid 1px #ccc;">
            <v-chart
              ref="line_chart3"
              :options="options3"
              autoresize
              style="height:100%;width:100%;"
            />
            <Collect2
              @collect="collect(3)"
              @seeResult="seeResult(3)"
            />
          </div>
          <div style="flex:1;">
            <v-chart
              ref="line_chart4"
              :options="options4"
              autoresize
              style="height:100%;width:100%;"
            />
            <Collect2
              @collect="collect(4)"
              @seeResult="seeResult(4)"
            />
          </div>
        </div>
      </div>
      <div v-if="operate==11">
        <p style="font-size:16px;">
          模型结果
        </p>
        <div style="display:flex;">
          <div style="flex:1;text-align:right;">
            <button class="btn">
              查看结果
            </button>
          </div>
          <div style="flex:1;text-align:right;">
            <button class="btn">
              查看结果
            </button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;height:200px;">
          <el-table
            :data="tableDataTrain"
            border
            style="flex:1;"
            max-height="200"
            size="mini"
          >
            <el-table-column
              v-for="(item,index) in trainColumns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
              :resizable="false"
            />
          </el-table>
          <div style="width:10px;" />
          <el-table
            :data="tableDataTest"
            border
            style="flex:1;"
            max-height="200"
            size="mini"
          >
            <el-table-column
              v-for="(item,index) in testColumns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
              :resizable="false"
            />
          </el-table>
        </div>
      </div>
      <p
        v-if="operate==11 || operate==10"
        style="font-size:16px;"
      >
        关键因子
      </p>
      <div
        v-if="operate==11 || operate==10"
        class="content-container"
        style="margin-bottom:20px;"
      >
        <v-chart
          ref="bar_chart1"
          :options="options5"
          autoresize
          style="height:100%;width:100%;"
        />
        <Collect2
          :style-collect="styleCollect"
          :style-result="styleResult"
          @collect="collect(5)"
          @seeResult="seeResult(5)"
        />
      </div>
      <div v-if="operate!=10 && operate!=11">
        <p>此节点下暂无模型评价相关数据，请先进行模型构建！</p>
      </div>
    </div>
  </div>
</template>

<script>
import Collect2 from '@components/collect2'
import ModelManage from '@components/model-manage'
export default{
    components:{
        ModelManage,Collect2,
    },
    data() {
        return {
            projectId:"",
            nodeId:"",
            targetList:[],
            tableDataTrain:[],
            tableDataTest:[],
            trainColumns:[],
            testColumns:[],
            target:"",
            styleCollect:{
                top:'4px',
                left:'12px'
            },
            styleResult:{
                top:'-15px',
                left:'-24px'
            },
            options1:{
                color:['#4DD67F','#FF5542'],
                title:{show:false},
                grid:{left:'8%'},
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                legend: {
                    data:[]
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
                series:[
                    {
                        type:'line',
                        data:[],
                    },
                    {
                        type:'line',
                        data:[],
                    },
                ] ,
            },
            options2:{
                color:['#4DD67F','#FF5542'],
                title:{show:false},
                grid:{left:'8%'},
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                legend: {
                    data:[]
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
                series:[
                    {
                        type:'line',
                        data:[],
                    },
                    {
                        type:'line',
                        data:[],
                    },
                ] ,
            },
            options3:{
                color:['#4DD67F','#FF5542'],
                title:{show:false},
                grid:{left:'8%'},
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                legend: {
                    data:[]
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
                series:[
                    {
                        type:'line',
                        data:[],
                    }
                ] ,
            },
            options4:{
                color:['#4DD67F','#FF5542'],
                title:{show:false},
                grid:{left:'8%'},
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                legend: {
                    data:[]
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
                series:[
                    {
                        type:'line',
                        data:[],
                    }
                ] ,
            },
            options5:{
                color:['#448ACA'],
                title:{show:false},
                grid:{left:'8%'},
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
                series:[
                    {
                        type:'bar',
                        data:[],
                    }
                ] ,
            },
            operate:"",
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
            this.loadData()
        },
        loadData() {
            this.requestUtil.post(this.urls.engineList.url,{project_id:this.projectId,node_id:this.nodeId}).then((res)=>{
                this.targetList = []
                res.data.forEach((item)=>{
                    let obj = {}
                    obj.label = item
                    obj.value = item
                    this.targetList.push(obj)
                })
                this.target = this.targetList[0].value
                if(this.operate == 10 || this.operate == 11) {
                    this.loadChartData()
                }
            })
        },
        loadChartData() {
            this.requestUtil.post(this.urls.scoreRegression.url,{project_id:this.projectId,node_id:this.nodeId,y_col:this.target}).then((res)=>{
                let data = res.data
                if(this.operate === 10) {
                    this.options1.xAxis.data = data.y_train_title
                    this.options1.series[0].data = data.y_train_content[0]
                    this.options1.series[1].data = data.y_train_content[1]
                    this.options1.series[0].name = data.y_train_legend[0]
                    this.options1.series[1].name = data.y_train_legend[1]
                    this.options1.legend.data = data.y_train_legend
  
                    this.options2.xAxis.data = data.y_test_title
                    this.options2.series[0].data = data.y_test_content[0]
                    this.options2.series[1].data = data.y_test_content[1]
                    this.options2.series[0].name = data.y_test_legend[0]
                    this.options2.series[1].name = data.y_test_legend[1]
                    this.options2.legend.data = data.y_test_legend
  
                    this.options3.xAxis.data = data.residual_train_title
                    this.options3.series[0].data = data.residual_train_content[0]
                    this.options3.series[0].name = data.y_train_legend[0]
                    this.options3.legend.data = data.y_train_legend
  
                    this.options4.xAxis.data = data.residual_test_title
                    this.options4.series[0].data = data.residual_test_content[0]
                    this.options4.series[0].name = data.residual_train_legend[0]
                    this.options4.legend.data = data.residual_train_legend
                }else if(this.operate === 11) {
                    this.trainColumns = []
                    data.cm_train_title.forEach(item=>{
                        let obj = {prop:item,label:item}
                        this.trainColumns.push(obj)
                    })
                    this.tableDataTrain = []
                    data.cm_train_content.forEach(item=>{
                        let obj = {}
                        item.forEach((d,index)=>{
                            let prop = data.cm_train_title[index]
                            obj[prop] = d
                        })
                        this.tableDataTrain.push(obj)
                    })

                    this.testColumns = []
                    data.cm_test_title.forEach(item=>{
                        let obj = {prop:item,label:item}
                        this.testColumns.push(obj)
                    })

                    this.tableDataTest = []
                    data.cm_test_content.forEach(item=>{
                        let obj = {}
                        item.forEach((d,index)=>{
                            let prop = data.cm_test_title[index]
                            obj[prop] = d
                        })
                        this.tableDataTest.push(obj)
                    })
                    
                }
                if(data.vip_content.length !== 0) {
                    this.options5.xAxis.data = data.vip_title
                    this.options5.series[0].data = data.vip_content[0]
                }
            })
        },
        seeResult(type) {
            console.log(type)
        },
        collect(type) {
            console.log(type)
        },
    },      
}
</script>

<style scoped lang="less">
 .head{
  padding:15px;
  display:flex;
  background:rgba(245,245,245,1);
  border:1px solid rgba(204,204,204,1);
  border-radius:2px;
  flex-wrap:wrap;
  margin-top:20px;
  justify-content: center;
  align-items: center;
 }
 .head-container{
  border:1px solid rgba(204,204,204,1);
  border-bottom:none;
  background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
  border-radius:4px 4px 0px 0px;
  display:flex;
 }
 .content-container{
  background:rgba(245,245,245,1);
  border:1px solid rgba(204,204,204,1);
  border-radius:0px 0px 2px 2px;
  display:flex;
  height:30vh;
 }
 .btn{
  background:rgba(255,255,255,1);
  border:1px solid rgba(204,204,204,1);
  border-radius:2px;
  padding:3px 8px;
  background:#fff;
 }
</style>

<style lang="less">
  
</style>
