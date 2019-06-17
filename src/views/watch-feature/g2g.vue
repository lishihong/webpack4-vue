<template>
  <div style="overflow-y:auto;max-height:calc(100vh - 300px);overflow-x:hidden;">
    <v-chart
      ref="g2g_chart"
      :options="options"
      autoresize
      style="height:320px;width:100%;"
    />
    <Collect @collect="collect" />
  </div>
</template>

<script>
let selectedPoints,titleList
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
        },
        selectIndex:{
            default:0,
        }
    },
    data() {
        return {
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
                    toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'clear'],
                    throttleType:'debounce',
                    throttleDelay:300,
                    removeOnClick:false,
                },
                tooltip: {
                    trigger: 'axis',
                },
                dataZoom: [{
                    type: 'inside',
                    id: 'insideX',
                    xAxisIndex: 0,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                }],
                xAxis: {
                    data:[],
                },
                yAxis: {
                    splitLine:{show:false},
                },
                series:{data:[], type: 'bar'},
            },
            chart:{},
            areasLen:0,
            selectedPoints:[],
        }
    },
    created() {
        selectedPoints = window.selectedPoints
        delete window.selectedPoints
        this.initChildData()
    },
    mounted() {
         
    },   
    methods: {
        collect() {

        },
        exlcudeTips(type) {
            let msg = '排除'
            if(this.areasLen == 1) {
                if(this.selectedPoints[0].length == 0) {
                    this.$message.warning(`当前选框中的数据为空`);
                    return
                }
            }
            if(type == 2) {
                msg = "筛选"
            }
            this.$confirm(`是否${msg}当前选框中的数据`, '提示', {
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
            let params = {
                "project_id": this.projectId,
                "node_id": this.nodeId,
                "type": 1,
                'group_one':selectedPoints[0]
            }
            if(this.selectIndex === 4) {//组对整体 分析
                params.type = 2
                params.group_two = []
            }else{
                params.group_two =  selectedPoints[1]
            }
            this.requestUtil.post(this.urls.g2gData.url,params).then((res)=>{
                titleList = res.data.title
                this.options.series.data = res.data.content
                this.options.xAxis.data = res.data.title
                this.$nextTick(()=>{
                    this.chart = this.$refs.g2g_chart.chart
                    this.chart.on('brushSelected', params=>{
                        this.brushSelect(params)
                    })
                })
            })
        },
        dealData(type) {
            let newSelected = this.selectedPoints[this.areasLen - 1]
            let selectCols = []
            newSelected.forEach(item=>{
                selectCols.push(titleList[item])
            })
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type": 2,
                "select_type":type,
                "select_cols":selectCols,
                "select_rows": [],
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!');
                    this.$emit("loadData",this.nodeId)
                }
            })
        },
        brushSelect(params) {
            let {areas,selected} = params.batch[0]
            let selectedIndex = selected[0].dataIndex
            this.areasLen = areas.length
            if(this.areasLen == 1) {
                this.selectedPoints[0] = selectedIndex
            }else{
                this.selectedPoints.splice(0)
            }
        }
    },   
}
</script>

<style scoped lang="less">
</style>

<style lang="less">
  
</style>
