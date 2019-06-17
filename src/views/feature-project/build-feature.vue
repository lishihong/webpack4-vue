<template>
  <div class="view-content">
    <p>第一步：筛选参与构建新特征的基础因子</p>
    <div class="content">
      <span>目标变量</span>
      <el-select
        v-model="target"
        style="margin-left:10px;width:100px;"
        size="mini"
        @change="filterChart"
      >
        <el-option
          v-for="item in targetList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span style="margin-left:4%;">
        重要度阈值
      </span>
      <input
        v-model="importantVal"
        placeholder="请输入0-1之间的数"
        @keyup.enter="filterChart"
        @input="handleInput($event)"
      >
    </div>
    <div style="max-height:320px;overflow:hidden auto;">
      <v-chart
        ref="bar_chart1"
        :options="options1"
        autoresize
        style="height:240px;width:100%;"
      />
      <Collect
        style="top:-235px;"
        @collect="collect(1)"
      />
    </div>
    <p>第二步：设置构建新特征的计算方法</p>
    <div class="order-container">
      <ul>
        <li
          v-for="(item,index) in algorList"
          :key="index"
        >
          <el-checkbox v-model="item.check">
            {{ item.name }}
          </el-checkbox>
        </li>
      </ul>
      <div class="deal-container">
        <button
          class="factor-btn-step"
          @click="build"
        >
          构建特征
        </button>
      </div>
    </div>
    <p v-show="showThree">
      第三步：对构建的新特征进行筛选
    </p>
    <div
      v-show="showThree"
      style="max-height:320px;overflow:hidden auto;"
    >
      <v-chart
        ref="bar_chart2"
        :options="options2"
        autoresize
        style="height:300px;width:100%;"
      />
      <Collect
        style="top:-235px;"
        @collect="collect(2)"
      />
    </div>
    <button
      class="factor-btn-step"
      style="margin-top:10px;text-align:center;margin-left:47%;"
      @click="choose"
    >
      筛选
    </button>
  </div>
</template>

<script>
import Collect from '@components/collect'
let algorListTemp = [],selectCols1 = [],selectCols2 = [],selectedIndex1 = [],selectedIndex2 = []

export default{
    components:{
        Collect
    },
    data() {
        return {
            projectId:"",
            nodeId:"",
            importantVal:"",
            target:"",
            targetList:[],
            chart1:{},
            chart2:{},
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
                    toolbox: ['rect', 'polygon', 'lineX', 'lineY','clear'],
                    throttleType:'debounce',
                    throttleDelay:300,
                    brushMode:'multiple',
                    removeOnClick:false,
                },
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
                visualMap: {
                    show:false,
                    type: 'piecewise',
                    pieces: [ ],
                    color:['#FF5542','#4DD67F','#448ACA'],
                    target: {
                        outOfRange: {
                            color: ['#448ACA'],
                        }
                    },
                }, 
                xAxis: {type: 'category',data:[],axisLabel:{rotate:90}},
                yAxis: {type:'value',splitLine:{show:false}},
                series:{
                    type:'bar',
                    data:[],
                } ,
            },
            options2:{
                color:['#448ACA','#4DD67F'],
                title:{show:false},
                grid:{left:'8%',bottom:'40%'},
                toolbox: {
                    show: true,
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    },
                    right:40,
                },
                brush: {
                    toolbox: ['rect', 'polygon', 'lineX', 'lineY','clear'],
                    throttleType:'debounce',
                    throttleDelay:300,
                    brushMode:'multiple',
                    removeOnClick:false,
                },
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                dataZoom: [ {
                    type: 'inside',
                    id: 'insideX',
                    start: 97,
                    end: 100,
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
            showThree:false,
            algorList:[],
        }
    },
    mounted() {
    },
    methods: {
        loadChildData(projectId,nodeId) {
            this.projectId = projectId
            this.nodeId = nodeId
            this.targetList = []
            this.requestUtil.post(this.urls.engineList.url,{project_id:projectId,node_id:nodeId}).then((res)=>{
                res.data.forEach((item)=>{
                    let obj = {}
                    obj.label = item
                    obj.value = item
                    this.targetList.push(obj)
                })
                this.target = this.targetList[0].value
                this.loadBarData()
            })
        },
        loadBarData() {
            let params = {
                project_id:this.projectId,
                node_id:this.nodeId,
                y_col:this.target,
            }
            this.requestUtil.post(this.urls.engineVip.url,params).then((res)=>{
                this.options1.series.data = res.data.content
                this.options1.xAxis.data = res.data.title
                this.$nextTick(()=>{
                    this.chart1 = this.$refs.bar_chart1.chart
                    this.chart1.on('brushSelected', params=>{
                        this.brushSelect1(params)
                    })
                    this.chart1.on('restore',()=>{
                        this.restoreChart1()
                    })
                })
            })

            //计算方法列表
            this.requestUtil.post(this.urls.featureCalculateMethod.url,{}).then((res)=>{
                res.data.forEach(item=>{
                    item.check = false
                })
                this.algorList = res.data
            })
        },
        filterChart() {
            if(this.importantVal && ( this.importantVal < 0 || this.importantVal > 1) && this.importantVal != 0) {
                this.$message.warning("请输入0-1之间的数！")
                return
            }
            this.options1.visualMap.pieces = [{gt:+this.importantVal}]
        },
        brushSelect1(params) {
            let {areas,selected} = params.batch[0]
            selectedIndex1 = selected[0].dataIndex
            this.areasLen = areas.length
            if(this.areasLen === 0) {
                selectedIndex1.splice(0)
            } 
        },
        restoreChart1() {
            this.options1.visualMap.pieces.splice(0)
            selectedIndex1.splice(0)
        },
        brushSelect2(params) {
            let {areas,selected} = params.batch[0]
            selectedIndex2 = selected[0].dataIndex
            this.areasLen = areas.length
            if(this.areasLen === 0) {
                selectedIndex2.splice(0)
            } 
        },
        restoreChart2() {
            selectedIndex2.splice(0)
        },
        collect(type) {
            console.log(type)
        },
        build() {
            selectCols1 = []
            selectedIndex1.forEach(item=>{
                selectCols1.push(this.options1.xAxis.data[item])
            })
            if(selectCols1.length === 0 && !this.importantVal && this.importantVal !== 0) {
                this.$message.warning("请筛选构建新特征的原始因子！")
                return 
            }
            algorListTemp = []
            this.algorList.forEach(item=>{
                if(item.check === true) {
                    algorListTemp.push(item.value)
                }
            })
            if(algorListTemp.length === 0) {
                this.$message.warning("请选择构建新特征的计算方法！")
                return 
            }
            let params = {
                "project_id": this.projectId,
                "node_id":this.nodeId,
                "point_type": 7,
                "y_col": this.target,
                "theshold": this.importantVal,
                "algor_list": algorListTemp,
                "select_cols": selectCols1
            }
            this.requestUtil.post(this.urls.featureBuildData.url,params).then((res)=>{
                this.showThree = true
                this.options2.series.data = res.data.content
                this.options2.xAxis.data = res.data.title
                this.$nextTick(()=>{
                    this.chart2 = this.$refs.bar_chart2.chart
                    this.chart2.on('brushSelected', params=>{
                        this.brushSelect2(params)
                    })
                    this.chart2.on('restore',()=>{
                        this.restoreChart2()
                    })
                })
            })
        },
        choose() {
            selectCols2 = []
            selectedIndex2.forEach(item=>{
                selectCols2.push(this.options2.xAxis.data[item])
            })
            if(selectCols2.length === 0) {
                this.$message.warning("请筛选构建的新特征！")
                return 
            }
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type":7 ,
                "select_type":2,
                "select_cols":selectCols1,
                "theshold":this.importantVal,
                "algor_list":algorListTemp,
                "include_cols_new_x":selectCols2,
                "y_col":this.target
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!');
                    this.$emit("loadData",this.nodeId)
                    this.router.go(-1)
                }
            })
        },
        handleInput(e) {
            let reg = /[^\d.]/g
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
    width:180px;
    margin-left:10px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(197,197,197,1);
    border-radius:2px;
    padding:0 4px;
  }
}
.order-container{
    margin-top:10px;
    padding:10px 20px;
    display:flex;
    background:rgba(245,245,245,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    max-height:250px;
    ul{
        padding:0;
    }
    li{
        list-style:none;
    }
    .deal-container{
        display:flex;
        align-items: center;
        margin:0 5%;
    }
}
</style>

<style lang="less">
  
</style>
