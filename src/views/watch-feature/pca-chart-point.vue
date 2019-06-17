<template>
  <div style="overflow-y:auto;max-height:calc(100vh - 300px);overflow-x:hidden;">
    <div class="head">
      <span>X轴</span>
      <el-select
        v-model="valueX"
        style="margin-left:10px;width:100px;"
        size="mini"
        @change="submit"
      >
        <el-option
          v-for="item in xList"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        >
          <span class="flag">{{ item.flag }}</span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
      <span style="margin-left:3%;">Y轴</span>
      <el-select
        v-model="valueY"
        style="margin-left:10px;width:100px;"
        size="mini"
        @change="submit"
      >
        <el-option
          v-for="(item,index) in yList"
          :key="index"
          :label="item.label"
          :value="item.label"
        >
          <span class="flag">{{ item.flag }}</span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
      <span
        style="margin-left:3%;"
      >Color</span>
      <el-select
        v-model="color"
        style="margin-left:10px;width:100px;"
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
        v-show="shapeList.length!=0"
        style="margin-left:3%;"
      >Shape</span>
      <el-select
        v-show="shapeList.length!=0"
        v-model="shape"
        style="margin-left:10px;width:100px;"
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
      ref="pca_point_chart"
      :options="options"
      autoresize
      style="height:320px;width:100%;"
    />
    <Collect @collect="collect" />
  </div>
</template>

<script>
import Collect from '@components/collect'
import {colors,icons} from '../../services/chart-icon'
let dataList = []
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
            valueX:"",
            valueY:"",
            color:"",
            shape:"",
            xList:[],
            yList:[],
            colorList:[],
            shapeList:[],
            selectedPoints:[],
            areasLen:1,
            options:{
                title:{show:false},
                grid:{left:'4%'},
                legend: {bottom:10},
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
                    removeOnClick:true,
                    outOfBrush: {
                        colorAlpha: 0.46
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: obj=> {
                        return  `${this.valueX}=${obj[0].value[0]}<br>` +
                        `${this.valueY}=${obj[0].value[1]}<br>` +
                        `primary_key=${dataList[obj[0].dataIndex][0]}<br>`
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    id: 'insideX',
                    xAxisIndex: 0,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                }],
                xAxis: {
                    name:this.valueX,
                    nameGap: 16,
                    type: 'value',
                    data:[],
                },
                yAxis: {
                    name:this.valueY,
                    type:'value',
                    splitLine:{show:false},
                    axisTick:{show:false}
                },
                series:{
                    data:[], 
                    type: 'scatter',
                    symbolSize: 12,
                },
            },
            chart:{},//echarts instance
        }
    },
    created() {
        this.initData()
    },
    mounted() {
       
    },
    methods: {
        collect() {

        },
        initData() {
            let params = {project_id:this.projectId,node_id:this.nodeId}
            this.requestUtil.post(this.urls.pointChartSelects.url,params).then((res)=>{
                this.xList = this.dealList(res.data.x_list)
                this.valueX = this.xList[0].label
                this.yList =  this.dealList(res.data.y_list)
                this.valueY = this.yList[1].label
                this.shapeList =  this.dealList(res.data.shapes)
                this.colorList = this.dealList(res.data.colors)
                this.selectedPoints.splice(0)
                this.areasLen = 1
                this.loadLineData()
                this.$emit("toMain",true,1)
            })
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
        loadLineData() {
            let params = {
                "project_id": this.projectId,
                "node_id": this.nodeId,
                "x": this.valueX,
                "y": this.valueY,
                "color": this.color,
                "shape": this.shape
            }
            this.options.xAxis.name = this.valueX
            this.options.yAxis.name = this.valueY
            this.requestUtil.post(this.urls.pointChartData.url,params).then((res)=>{
                this.options.series.data.splice(0)
                dataList = res.data.content
                let obj = {}
                let numberFilter = this.$filters.number
                res.data.content.forEach((item)=>{
                    obj = {
                        value:[numberFilter(item[1],4),numberFilter(item[2],4)], 
                        itemStyle:{color:colors[parseInt(item[3])]},
                        symbol:`path://${icons[parseInt(item[4])]}`,
                    }
                    this.options.series.data.push(obj)
                })
                this.$nextTick(()=>{
                    this.chart = this.$refs.pca_point_chart.chart
                    this.chart.on('brushSelected', params=>{
                        this.brushSelect(params)
                    })
                })
            })
        },
        brushSelect(params) {
            let {areas,selected} = params.batch[0]
            let selectedIndex = selected[0].dataIndex
            this.areasLen = areas.length
            if(this.areasLen > 2) {
                areas.shift()
                this._.pullAll(selectedIndex,this.selectedPoints[1])//移除第二次选中的点
                this._.pullAll(selectedIndex,this.selectedPoints[0])//移除第一次选中的点
                this.selectedPoints.shift()
                this.selectedPoints[1] = selectedIndex
                this.chart.dispatchAction({
                    type: 'brush',
                    areas:areas
                })
            }else if(this.areasLen == 2) {
                this._.pullAll(selectedIndex,this.selectedPoints[0])//拿到第二次选中的点
                this.selectedPoints[1] = selectedIndex
                this.$emit("toMain",true,2)
            }else if(this.areasLen == 1) {
                this.$emit("toMain",false,2)
                this.selectedPoints[0] = selectedIndex
                this.$emit("toMain",true,4)
            }else{
                this.selectedPoints.splice(0)
                this.$emit("toMain",false,4)
                this.$emit("toMain",false,2)
            }
        },
        submit() {
            this.loadLineData()
        },
        exlcudeTips(type) {
            let msg = '最后一个'
            let msg2 = '排除'
            if(this.areasLen == 1) {
                msg = '当前'
                if(this.selectedPoints[0].length == 0) {
                    this.$message.warning(`${msg}选框中的数据为空`);
                    return
                }
            }else{
                if(this.selectedPoints[1].length == 0) {
                    this.$message.warning(`${msg}选框中的数据为空`);
                    return
                }
            }
            if(type == 2) {
                msg2 = "筛选"
            }
            this.$confirm(`是否${msg2}${msg}选框中的数据`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dealData(type)
            }).catch(() => {
                 
            });
        },
        exlcude() {
            this.exlcudeTips(1)
        },
        include() {
            this.exlcudeTips(2)
        },
        initChildData() {
            this.initData()
        },
        dealData(type) {
            let newSelected = this.selectedPoints[this.areasLen - 1]
            let selecRows = []
            newSelected.forEach(item=>{
                selecRows.push(dataList[item][0])
            })
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type": 2,
                "select_type":type,
                "select_cols": [],
                "select_rows": selecRows,
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!');
                    this.$emit("loadData",this.nodeId)
                    this.initData()
                }
            })
        },
        groupCompare(index) {
            if(index === 4) {
                if(this.selectedPoints[0].length === 0) {
                    this.$message.warning('框选的数据不能为空');
                    return;
                }
            }else{
                if(this.selectedPoints[0].length === 0 || this.selectedPoints[1].length === 0) {
                    this.$message.warning('框选的数据不能为空');
                    return;
                }
            }
            this.$emit("toMain",index,3)
            let res = []
            this.selectedPoints.forEach((item,index)=>{
                res[index] = [] 
                item.forEach(i=>{
                    res[index].push(dataList[i][0])
                })
            })
            window.selectedPoints = res
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
