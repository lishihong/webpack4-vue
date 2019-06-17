<template>
  <div>
    <div class="head">
      <div style="font-size:16px;">
        {{ type==3 ? "重要度筛选" : "特征间相关性" }}
      </div>
      <div style="display:flex;">
        <div
          v-for="(item,index) in btnList2"
          :key="index"
          class="btn select"
          @click="chooseData(index)"
        >
          <img
            :src="item.pic"
          >
          {{ item.name }}
        </div>
      </div>
    </div>
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
        {{ type==3 ? "重要度阈值" : "相关性阈值" }}
      </span>
      <input
        v-model="relative"
        :placeholder="[type==3 ? '请输入0-1之间的数':'请输入-1到1之间的数']"
        @keyup.enter="filterChart()"
        @input="handleInput($event)"
      >
    </div>
    <div style="max-height:320px;overflow-y:scroll;">
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
            btnList2:[
                {name:"Exclude",pic:require('../../assets/images/img-exclude.png')},
                {name:"Include",pic:require('../../assets/images/img-include.png')},
            ],
            options:{
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
                brush: {
                    toolbox: ['rect', 'polygon', 'lineX', 'lineY','clear'],
                    throttleType:'debounce',
                    throttleDelay:300,
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
            target:"",
            relative:"",
            targetList:[],
            projectId:"",
            nodeId:"",
            chart:{},//echarts instance
            selectedIndex:[],
            areasLen:0,
            type:2,
        }
    },
    beforeCreate() {
        this.type = this.$route.params.type
        if(this.type == 2) {
            document.title = '多因子分析工具-相关性筛选'
        }
    },
    mounted() {
        this.type = this.$route.params.type
    },
    methods: {
        chooseData(index) {
            this.exlcudeTips(index + 1) 
        },
        submit(type) {
            let selectCols = []
            this.selectedIndex.forEach(item=>{
                selectCols.push(this.options.xAxis.data[item])
            })
            let pointType = 5
            if(this.type == 2) {
                pointType = 4
            }
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type":pointType ,
                "select_type":type,
                "select_cols":selectCols,
                "select_rows": [],
                "theshold":this.relative,
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
        exlcudeTips(type) {
            if(this.areasLen == 1) {
                if(this.selectedIndex.length == 0) {
                    this.$message.warning(`当前选框中的数据为空`);
                    return
                }
            }
            if(!this.relative && this.relative !== 0 && this.selectedIndex.length == 0) {
                return
            }
            let msg = '排除',msg2 = "当前选框中"
            if(type == 2) {
                msg = "筛选"
            }
            if(this.selectedIndex.length == 0) {
                msg2 = `大于${this.relative}`
            }else if(this.selectedIndex.length !== 0 && (this.relative || this.relative === 0)) {
                msg2 = `大于${this.relative}以及当前选框中`
            }
            this.$confirm(`是否${msg}${msg2}的数据`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submit(type)
            }).catch(() => {
                 
            });
        },
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
        handleInput(e) {
            let reg = /[^\d.-]/g
            this.relative = e.target.value.replace(reg,'')
        },
        loadBarData() {
            let params = {
                project_id:this.projectId,
                node_id:this.nodeId,
                y_col:this.target,
            }
            let url = this.urls.engineVip.url
            if(this.type == 2) {
                url = this.urls.engineeGetCorr.url
            }
            this.requestUtil.post(url,params).then((res)=>{
                this.options.series.data = res.data.content
                this.options.xAxis.data = res.data.title
                this.$nextTick(()=>{
                    this.chart = this.$refs.bar_chart.chart
                    this.chart.on('brushSelected', params=>{
                        this.brushSelect(params)
                    })
                    this.chart.on('restore',()=>{
                        this.restoreChart()
                    })
                })
            })
        },
        brushSelect(params) {
            let {areas,selected} = params.batch[0]
            this.selectedIndex = selected[0].dataIndex
            this.areasLen = areas.length
            if(this.areasLen === 0) {
                this.selectedIndex.splice(0)
            } 
        },
        filterChart() {
            if(this.type == 3) {
                if(this.relative && ( this.relative < 0 || this.relative > 1) && this.relative != 0) {
                    this.$message.warning("请输入0-1之间的数！")
                    return
                }
            }else{
                if(this.relative && ( this.relative < -1 || this.relative > 1)) {
                    this.$message.warning("请输入-1-1之间的数！")
                    return
                }
            }
            this.options.visualMap.pieces = [{gt:+this.relative}]
        },
        restoreChart() {
            this.options.visualMap.pieces.splice(0)
            this.selectedIndex.splice(0)
        },
        collect() {

        },
    },      
}
</script>

<style scoped lang="less">
.head{
  display: flex;
  justify-content:space-between;
  margin:20px 0;
   .btn{
    padding:2px 5px;
    justify-content: center;
    background:rgba(245,245,245,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    display:flex;
    align-items:center; 
    box-sizing: border-box;
    cursor: pointer;
      img{
        width:14px;
        margin-right:4px;
      }
  }
  .btn:not(:first-child){
    margin-left:10px;
  }
  .select{
    background:rgba(51,123,247,1);
    color:#fff;
    border:none;
  }
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
</style>

<style lang="less">
  
</style>
