<template>
  <div class="view-content">
    <p>特征间相关性矩阵</p>
    <vxe-table
      v-if="tableColumn.length!==0"
      ref="xTable"
      border
      class="cust-style-rect"
      max-height="300"
      :loading="false"
      :cell-class-name="cellClassName"
      show-header-all-overflow="tooltip"
      show-all-overflow="tooltip"
    >
      <vxe-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item"
        :label="item"
        width="80"
      />
    </vxe-table>
    <div style="display:flex;margin-top:20px;padding-top:10px;">
      <div style="font-size:16px;">
        剔除结果
      </div>
      <div style="flex:1;text-align:center;">
        相关性阈值
        <input
          v-model="relative"
          placeholder="请输入0.9-1之间的数"
          @input="handleInput($event)"
        >
      </div>
      <button
        class="btn"
        @click="exclude"
      >
        剔除
      </button>
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
        v-for="(item,index) in tableColumnExclude"
        v-show="item.show"
        :key="index"
        :prop="item"
        :label="item"
        width="120"
        show-overflow-tooltip
        :resizable="false"
      >
        <template
          slot="header"
          slot-scope="{column, $index}"
        >
          <el-checkbox
            v-model="checked[$index]"
          >
            {{ column.label }}
          </el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
let list = [],tempList = [],colors = ['col-c1','col-c2','col-c3','col-c4']
export default{
    data() {
        return {
            projectId:"",
            nodeId:"",
            relative:"",
            tableColumn:[],
            currentPage:1,
            totalPage:0,
            colorMsg:[],
            pageSize:30,
            tableData:[],
            tableColumnExclude:[],
            checked:[],
        }
    },
    created() {
      
    },
    mounted() {
    },
    methods: {
        loadChildData(projectId,nodeId) {
            this.projectId = projectId
            this.nodeId = nodeId
            this.loadBigTable()
            this.loadExcludeTable()
        },
        cellClassName({columnIndex,rowIndex}) {
            if(columnIndex === 0) {
                return 'col-grey'
            }
            let msg = this.colorMsg[rowIndex]
            if(msg.row == rowIndex) {
                return colors[msg.col[columnIndex - 1].color]
            }
        },
        loadBigTable(flag = true) {
            let parmas = {project_id:this.projectId,node_id:this.nodeId,theshold:0.95}
            this.requestUtil.post(`${this.urls.engineeAutoCorr.url}${this.currentPage}`,parmas,flag).then((res)=>{
                let obj = {};
                tempList = [];
                if(this.currentPage == 1) {
                    res.data.title[0] = ""
                    this.tableColumn = res.data.title
                    this.totalPage = res.data.pages
                    this.pageSize = res.data.content.length
                }
                res.data.content.forEach((item,index)=> {
                    obj = {}
                    let realRow = index + (this.currentPage - 1) * this.pageSize
                    this.colorMsg.push({row:realRow,col:[]})
                    
                    for(let i = 0;i < item.length;i++) {
                        obj[this.tableColumn[i]] = item[i]
                        if(i !== 0) {
                            this.colorMsg[realRow].col.push({color:this.dealDataColor(item[i])})
                        }
                    }
                    tempList.push(obj);
                });
                list = list.concat(tempList)
                this.$nextTick(()=>{
                    if(this.$refs.xTable) {
                        this.$refs.xTable.loadData(list)
                        if(this.currentPage < this.totalPage) {
                            this.currentPage++
                            this.loadBigTable(false)
                        }
                    }
                })
            })
        },
        loadExcludeTable() {
            let parmas = {project_id:this.projectId,node_id:this.nodeId,theshold:0.95}
            this.requestUtil.post(`${this.urls.engineeAutoCorrVar.url}1`,parmas).then((res)=>{
                this.tableColumnExclude = res.data.title
                res.data.title.forEach((item,index)=>{
                    this.checked[index] = true
                })
                this.tableData = res.data.content
            })
        },
        dealDataColor(data) {
            let d = Math.abs(data)
            if(d > 0.9 && d <= 1) {
                return  0
            }
            if(d > 0.6 && d <= 0.9) {
                return  1
            }
            if(d > 0.3 && d <= 0.6) {
                return  2
            }
            if(d >= 0 && d <= 0.3) {
                return  3
            }
        },
        exclude() {
            if(this.value && (this.relative < 0 || this.relative > 1) && this.value !== 0) {
                this.$message.warning("请输入0-1之间的数！")
                return
            }
            let res = []
            this.checked.forEach((item,index)=>{
                if(!item) {
                    res.push(this.tableColumnExclude[index])
                }
            })
            this.$confirm(`是否确认剔除当前选中的列`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    "project_id": this.projectId,
                    "node_id": parseInt(this.nodeId),
                    "point_type":3 ,
                    "select_type":1,
                    "select_cols":[],
                    "select_rows": [],
                    "theshold":this.relative,
                    "back_cols":res
                }
                this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                    if(!res.data) {
                        this.$message.success('保存成功!')
                        this.$emit("loadData",this.nodeId)
                        this.router.go(-1)
                    }
                })
            }).catch(() => {
                 
            });
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
input{
  height:24px;
  width:180px;
  margin-left:10px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(197,197,197,1);
  border-radius:2px;
  padding:0 4px;
}
 .btn{
  background:#337BF7;
  border:none;
  border-radius:2px;
  padding:4px 10px;
  color:#fff;
  margin-left:20px;
 }
</style>

<style lang="less">
.cust-style-rect .vxe-body--column.col-grey {
  background-color:#F8F8F9;
}
.cust-style-rect .vxe-body--column.col-c1 {
  background-color:#f49bc2;
}
.cust-style-rect .vxe-body--column.col-c2 {
  background-color:#facd89;
}
.cust-style-rect .vxe-body--column.col-c3 {
  background-color:#9cd8f5;
}
.cust-style-rect .vxe-body--column.col-c4 {
  background-color:#bae1a6;
}
</style>
