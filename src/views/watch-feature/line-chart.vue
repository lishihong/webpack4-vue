<template>
  <div style="overflow-y:auto;max-height:calc(100vh - 300px);overflow-x:hidden;">
    <div class="head">
      <span>图表类型</span>
      <el-select
        v-model="chartType"
        style="margin-left:10px;width:100px;"
        size="mini"
        @change="changeChart"
      >
        <el-option
          v-for="item in chartTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span style="margin-left:4%;">特征名</span>
      <el-select
        v-model="name"
        style="margin-left:10px;width:180px;"
        size="mini"
        @change="submit"
      >
        <el-option
          v-for="(item,index) in nameList"
          :key="index"
          :label="item.label"
          :value="item.label"
        >
          <span class="flag">{{ item.flag }}</span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
      <span
        v-show="chartType==1"
        style="margin-left:4%;"
      >Color</span>
      <el-select
        v-show="chartType==1"
        v-model="color"
        style="margin-left:10px;width:180px;"
        size="mini"
        @change="submit"
      >
        <el-option
          label="请选择"
          value=""
        />
        <el-option
          v-for="(item,index) in colorList"
          :key="index"
          :label="item.label"
          :value="item.label"
        >
          <span class="flag">{{ item.flag }}</span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
      <span
        v-show="shapeList.length!=0&&chartType==1"
        style="margin-left:4%;"
      >Shape</span>
      <el-select
        v-show="shapeList.length!=0&&chartType==1"
        v-model="shape"
        style="margin-left:10px;width:180px;"
        size="mini"
        @change="submit"
      >
        <el-option
          label="请选择"
          value=""
        />
        <el-option
          v-for="(item,index) in shapeList"
          :key="index"
          :label="item.label"
          :value="item.label"
        >
          <span class="flag">{{ item.flag }}</span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
      <span
        v-show="shapeList.length!=0&&chartType==2"
        style="margin-left:4%;"
      >group</span>
      <el-select
        v-show="shapeList.length!=0&&chartType==2"
        v-model="group"
        style="margin-left:10px;width:180px;"
        size="mini"
        @change="submit"
      >
        <el-option
          label="请选择"
          value=""
        />
        <el-option
          v-for="(item,index) in shapeList"
          :key="index"
          :label="item.label"
          :value="item.label"
        >
          <span class="flag">{{ item.flag }}</span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
    <v-chart
      ref="line_chart"
      :options="options"
      autoresize
      style="height:320px;width:100%;"
    />
    <Collect @collect="collect" />
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      height="200"
      size="mini"
    >
      <el-table-column
        prop="group"
        label="group"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="mean"
        label="mean"
        show-overflow-tooltip
        :resizable="false"
      >
        <template slot-scope="scope">
          {{ scope.row.mean | number(4) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="count"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="std"
        label="std"
        show-overflow-tooltip
        :resizable="false"
      >
        <template slot-scope="scope">
          {{ scope.row.std | number(4) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="min"
        label="min"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="p25"
        label="25%"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="p50"
        label="50%"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="p75"
        label="75%"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="max"
        label="max"
        show-overflow-tooltip
        :resizable="false"
      />
    </el-table>
  </div>
</template>

<script>
let outlierKey = []
import {colors,icons} from '../../services/chart-icon'
import Collect from '@components/collect'
export default{
    components:{
        Collect
    },
    props:{
        projectId:{
            default:"",
        },
        nodeId:{
            default:-1,
        }
    },
    data() {
        return {
            chartType:1,
            chartTypeList:[
                {label:"折线图",value:1},
                {label:"箱线图",value:2},
            ],
            chart:{},//echarts instance
            name:"",
            color:"",
            shape:"",
            group:"",
            nameList:[],
            colorList:[],
            shapeList:[],
            tableData:[],
            options1:{
                title:{show:false},
                grid:{left:'8%'},
                toolbox: {
                    show: true,
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    },
                    right:40,
                },
                brush: {
                    toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep','clear'],
                    throttleType:'debounce',
                    throttleDelay:300,
                    brushMode:'multiple',
                    removeOnClick:false,
                },
                tooltip: {
                    trigger: 'axis',
                    showContent: true,
                    formatter:params => {
                        return params[0].name + "：" + params[0].value
                    }
                },
                dataZoom: [ {
                    type: 'inside',
                    id: 'insideX',
                    xAxisIndex: 0,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                }],
                /*  visualMap: {
                    type: 'piecewise',
                    pieces: [
                    ],
                }, */
                xAxis: {type: 'category',data:[],axisLabel:{rotate:90}},
                yAxis: {type:'value',splitLine:{show:false},min:-1,max:1},
                series:{
                    type:'line',
                    data:[],
                    symbolSize: 16,
                    symbolKeepAspect:true,
                    lineStyle:{color:"#666"},
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
            options2:{
                title:{show:false},
                grid:{left:'4%'},
                toolbox: {
                    show: true,
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    },
                    right:40,
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                dataZoom: [ {
                    type: 'inside',
                    id: 'insideX',
                    xAxisIndex: 0,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                }],
                xAxis: {type: 'category',data:[]},
                yAxis: {type:'value',splitLine:{show:false}},
                series:[
                    {
                        type:'boxplot',
                        data:[],
                        tooltip: {  }
                    },
                    {
                        name: 'outlier',
                        type: 'scatter',
                        data: [],
                        tooltip:{
                            formatter:  obj=> {
                                let groupIndex = this.options2.xAxis.data.indexOf(obj.name)
                                return `primary_key=${outlierKey[groupIndex][obj.dataIndex - 1]}<br>` +
                                `value=${obj.value}`
                            }
                        }
                    }
                ] ,
            },
        }
    },
    created() {
        this.options = this.options1
    },
    mounted() {
        this.initChildData()
    },
    methods: {
        collect() {

        },
        initChildData() {
            let params = {project_id:this.projectId,node_id:this.nodeId}
            this.requestUtil.post(this.urls.lineChartSelects.url,params).then((res)=>{
                this.colorList = this.dealList(res.data.colors)
                this.nameList =  this.dealList(res.data.names)
                this.name = this.nameList[0].label
                this.shapeList =  this.dealList(res.data.shapes)
                this.loadLineData()
            })
            this.$emit("toMain",true,1)
        },
        dealList(list) {
            list.forEach((item)=>{
                item.label = Object.keys(item).toString()
                let flagVal = Object.values(item).toString()
                let res = 'X'
                if(flagVal == 4) {
                    res = 'Y'
                }else if(flagVal == 3) {
                    res = 'L'//次级主键
                }
                item.flag = res
            })
            return list
        },
        submit( ) {
            if(this.chartType == 1) {
                this.loadLineData()
            }else{
                this.loadBoxData()
            }
        },
        loadLineData() {
            let params = {
                "project_id": this.projectId,
                "node_id": this.nodeId,
                "name":this.name,
                "color": this.color,
                "shape": this.shape
            }
            this.requestUtil.post(this.urls.lineChartData.url,params).then((res)=>{
                this.options1.xAxis.data.splice(0)
                this.options1.series.data.splice(0)
                this.options1.yAxis.min = res.data.y_min
                this.options1.yAxis.max = res.data.y_max
                this.options1.series.markLine.data = res.data.line
                let len = res.data.content.length
                for(let i = 0;i < len;i++) {
                    this.options1.xAxis.data.push(res.data.content[i][0])
                    this.options1.series.data.push(
                        {
                            value:res.data.content[i][1],
                            itemStyle:{
                                color:colors[parseInt(res.data.content[i][2])],
                                borderWidth:1
                            },
                            symbol:`path://${icons[parseInt(res.data.content[i][3])]}`,
                        }
                    )
                    /* if(i < len - 1) {
                        this.options1.visualMap.pieces[i] = {gte:res.data.content[i][1], lt:res.data.content[i + 1][1],color:colors[parseInt(res.data.content[i][2])]}
                    } */
                }
                this.tableData = res.data.statistics
                this.$nextTick(()=>{
                    this.chart = this.$refs.line_chart.chart
                    this.chart.on('brushSelected', params=>{
                        this.brushSelect(params)
                    })
                })
                this.options = this.options1
            })
        },
        loadBoxData() {
            let params = {
                "project_id": this.projectId,
                "node_id": this.nodeId,
                "name":this.name,
                "shape": this.group
            }
            this.requestUtil.post(this.urls.boxChartData.url,params).then((res)=>{
                this.options2.xAxis.data = res.data.group_label
                this.options2.series[0].data = res.data.plot_data
                this.options2.series[1].data = res.data.outlier
                outlierKey = res.data.outlier_key
                this.options = this.options2 
                this.$forceUpdate()
            })
        },
        changeChart(value) {
            if(value === 2) {
                this.loadBoxData()
            }else{
                this.loadLineData()
            }
        },
        brushSelect(params) {
            var mainSeries = params.batch[0].areas;
            var selectedItems = [];//选中区域的横纵标
            for (var i = 0; i < mainSeries.length; i++) {
                if(mainSeries[i].coordRange && mainSeries[i].coordRange.length > 0) {
                    for(var j = 0; j < mainSeries[i].coordRange.length; j++) {
                        selectedItems.push( mainSeries[i].coordRange[j]);
                    }
                }
            }
        },
    },      
}
</script>

<style scoped lang="less">
.head{
  order:1px solid rgba(204,204,204,1);
  background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
  border-radius:4px 4px 0px 0px;
  display: flex;
  align-items: center;
  padding:5px 10px;
}
.select{
width:96px;
height:22px;
line-height:22px;
font-size:12px;
font-family:MicrosoftYaHei;
font-weight:400;
color:rgba(36,36,36,1);
margin-left:4px;
display: inline-block;
margin-left:10px;
}
.flag{
  width:20px;
  height:20px;
  line-height:20px;
  text-align:center;
  display: inline-block;
  color:#fff;
  background:#409EFF;
}
</style>

<style lang="less">
  
</style>
