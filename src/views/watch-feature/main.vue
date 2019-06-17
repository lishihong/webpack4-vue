<template>
  <div>
    <ModelManage 
      ref="modelManage"
      @noticeParentLoad="parentLoad"
    />
    <div class="btn-container">
      <div style="display:flex;">
        <div
          v-for="(item,index) in btnList"
          :key="index"
          v-visible="item.isShow"
          class="btn"
          :class="{'select':selectIndex1==index}"
          @click="changeItem(index,1)"
        >
          <img
            :src="selectIndex1==index ? item.pics[1] : item.pics[0]"
          >
          {{ item.name }}
        </div>
      </div>
      <div style="display:flex;">
        <div
          v-for="(item,index) in btnList2"
          :key="index"
          v-visible="item.isShow"
          class="btn select"
          @click="changeItem(index,2)"
        >
          <img
            :src="item.pic"
          >
          {{ item.name }}
        </div>
      </div>
    </div>
    <component
      :is="currentView"
      ref="dComponent"
      :project-id="projectId"
      :node-id="nodeId"
      :select-index="selectIndex1"
      @toMain="toMain"
      @loadData="loadAllData"
    />
  </div>
</template>

<script>
import Factor from './factor'
import LineChart from './line-chart'
import PcaChartPoint from './pca-chart-point'
import PcaChartWeight from './pca-chart-weight'
import ModelManage from '@components/model-manage'
import G2G from './g2g'

export default{
    components:{
        Factor,LineChart,PcaChartPoint,ModelManage,G2G,PcaChartWeight
    },
    data() {
        return {
            tableData:[],
            projectId:"",
            nodeId:-1,
            btnList:[
                {name:"因子集",pics:[require('../../assets/images/img-factor.png'),require('../../assets/images/img-factor-select.png')],isShow:true},
                {name:"折线图",pics:[require('../../assets/images/img-line-chart.png'),require('../../assets/images/img-line-chart-select.png')],isShow:true},
                {name:"pca-散点图",pics:[require('../../assets/images/img-pca-point.png'),require('../../assets/images/img-pca-point-select.png')],isShow:true},
                {name:"pca-权重图",pics:[require('../../assets/images/img-pca-weight.png'),require('../../assets/images/img-pca-weight-select.png')],isShow:true},
                {name:"组对总体比较",pics:[require('../../assets/images/img-all-compare.png'),require('../../assets/images/img-all-compare-select.png')],isShow:false},
                {name:"组对组比较",pics:[require('../../assets/images/img-group-compare.png'),require('../../assets/images/img-group-compare-select.png')],isShow:false},
            ],
            btnList2:[
                {name:"Exclude",pic:require('../../assets/images/img-exclude.png'),isShow:true},
                {name:"Include",pic:require('../../assets/images/img-include.png'),isShow:false},
            ],
            selectIndex1:0,
            currentView:'Factor',
            currentViews:['Factor','LineChart','PcaChartPoint','PcaChartWeight','G2G','G2G'],
        }
    },
    created() {
        this.projectId = sessionStorage.getItem("project_id")
    },
    mounted() {
    },
    methods: {
        parentLoad(data) {
            this.loadChildData(data)
        },
        loadChildData(nodeId) {
            this.nodeId = nodeId
            sessionStorage.setItem("nodeId",nodeId)
            this.$refs.dComponent.initChildData() 
        },
        toMain(data,type) {
            if(type == 1) {
                this.$set(this.btnList2[1], "isShow", data)
            }else if(type == 2) {
                this.$set(this.btnList[5], "isShow", data)
            }else if(type == 3) {
                this.currentView = this.currentViews[data]
                this.selectIndex1 = data
            }else if(type == 4) {
                this.$set(this.btnList[4], "isShow", data)
            }
        },
        changeItem(index,type) {
            if(type == 1) {
                if((index === 5 || index == 4) && this.currentView !== 'G2G' ) {
                    this.$refs.dComponent.groupCompare(index)
                }else{
                    this.currentView = this.currentViews[index]
                    this.selectIndex1 = index
                }
            }else{
                if(index == 0) {
                    this.$refs.dComponent.exlcude()
                }else{
                    this.$refs.dComponent.include()
                }
            }
        },
        loadAllData() {
            this.$refs.modelManage.loadData()
        },
    },      
}
</script>

<style scoped lang="less">
.btn-container{
  display: flex;
  padding:6px 0;
  justify-content: space-between;
  align-items: center;
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
</style>

<style lang="less">
 
</style>
