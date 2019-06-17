<template>
  <div>
    <div class="btn-container">
      <span style="margin-bottom:-10px;font-size:16px;">模型管理</span>
      <div style="display:flex;">
        <div
          class="btn"
          :class="{'select':tabIndex===1}"
          @click="changeType(1)"
        >
          <img
            :src="[tabIndex==1 ? require('../assets/images/img-table-w.png'):require('../assets/images/img-table-b.png')]"
          >
          表格显示
        </div>
        <div
          class="btn"
          :class="{'select':tabIndex===2}"
          style="margin-left:10px;"
          @click="changeType(2)"
        >
          <img
            :src="[tabIndex==2 ? require('../assets/images/img-tree-w.png'):require('../assets/images/img-tree-b.png')]"
          >
          树状显示
        </div>
      </div>
    </div>
    <el-table
      v-show="tabIndex===1"
      ref="table"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
      height="180"
      size="mini"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="name"
        label="节点名称"
        width="160"
        show-overflow-tooltip
        :resizable="false"
      >
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.name }}</span>
          <el-input
            v-show="scope.row.isEdit"
            v-model="scope.row.name"
            size="mini"
            @keyup.enter.native="submit(scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="rows"
        label="x-行"
        width="60"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="cols"
        label="x-列"
        width="60"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="y_cols"
        label="y-列"
        width="60"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="operate"
        label="操作步骤"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="score"
        label="评分"
        width="60"
        show-overflow-tooltip
        :resizable="false"
      />
      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
        :resizable="false"
      >
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.remark }}</span>
          <el-input
            v-show="scope.row.isEdit"
            v-model="scope.row.remark"
            size="mini"
            @keyup.enter.native="submit(scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="操作"
        width="140"
        show-overflow-tooltip
        :resizable="false"
      >
        <template v-slot="scope">
          <i
            :class="scope.row.isEdit ? 'el-icon-circle-check' :'el-icon-edit-outline'"
            style="font-size:20px;color:#9C9C9C;cursor: pointer;"
            @click.stop="edit(scope.$index)"
          />
          <img
            src="../assets/images/img-copy.png"
            style="width:16px;margin-left:8px;cursor:pointer;"
            title="复制"
            @click.stop="copy(scope.row.node_id)"
          >
          <img
            v-if="scope.$index!==0"
            src="../assets/images/img-del.png"
            style="width:16px;margin-left:8px;cursor:pointer;"
            title="删除"
            @click.stop="deleteRow(scope.row.node_id)"
          >
        </template>
      </el-table-column>
    </el-table>
    <div
      v-show="tabIndex===2"
      style="height:180px;overflow-y:scroll;"
    >
      <v-chart
        ref="tree_chart"
        :options="options"
        autoresize
        style="height:36vh;width:100%;"
      />
    </div>
    <ul
      v-show="treeOperateShow"
      class="tree-operate-conatiner"
      :style="treeOperateStyle"
    >
      <li
        :class="{'select':treeOperateType==1}"
        @click="treeOperate(1)"
      >
        复制
      </li>
      <li 
        :class="{'select':treeOperateType==2}"
        @click="treeOperate(2)"
      >
        删除
      </li>
      <li 
        :class="{'select':treeOperateType==3}"
        @click="treeOperate(3)"
      >
        载入
      </li>
    </ul>
  </div>
</template>

<script>
export default{
    data() {
        return {
            projectId:"",
            tableData:[],
            el:{},
            tabIndex:1,
            treeOperateType:0,
            treeOperateShow:false,
            operateNodeId:"",
            nodeOperate:"",
            options:{
                title:{show:false},
                grid:{left:'4%'},
                tooltip: {
                    trigger: 'item',
                    formatter: obj=> {
                        return  `x-行：${obj.value.rows || '-'}<br>` +
                       `x-列：${obj.value.cols || '-'}<br>` +
                       `y-列：${obj.value.y_cols || '-'}<br>` +
                       `操作步骤：${obj.value.operate || '-'}<br>` +
                       `评分：${obj.value.score || '-'}<br>` +
                       `备注：${obj.value.remark || '-'}<br>`
                    }
                },
                series:{
                    type:'tree',
                    roam:true,
                    initialTreeDepth:5,
                    data:[],
                    symbolSize: 16,
                    label: {
                        normal: {
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right'
                        }
                    },
                    leaves: {
                        label: {
                            normal: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        }
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                } ,
            },
            treeOperateStyle:{},
        }
    },
    created() {
        this.loadData()
    },
    mounted() {
      
    },
    methods: {
        loadData() {
            this.projectId = sessionStorage.getItem("project_id")
            this.requestUtil.post(this.urls.modelList.url,{project_id:this.projectId}).then((res)=>{
                res.data.forEach((item)=>{
                    item.isEdit = false
                })
                this.tableData = res.data
                this.options.series.data = this.dealTreeData(this.tableData,-1)
                this.$nextTick(() => {
                    if(this.$refs.table) {
                        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
                    }
                    let lastSecondTr = document.querySelector(".el-table__row:nth-last-child(2)")
                    if(lastSecondTr && lastSecondTr.classList.contains("current-row")) {
                        lastSecondTr.classList.remove("current-row")
                    }
                    this.el = document.querySelector(".el-table__row:last-child")
                    if(this.el) {
                        this.el.classList.add("current-row")
                    }
                })
                this.$emit("noticeParentLoad",res.data[res.data.length - 1].node_id,res.data[res.data.length - 1].operate)
            })
        },
        treeOperate(type) {
            this.treeOperateType = type
            switch(type) {
                case 1:
                    this.copy(this.operateNodeId)
                    break;
                case 2:
                    this.deleteRow(this.operateNodeId)
                    break;
                case 3:
                    this.el.classList.remove("current-row")
                    this.$emit("noticeParentLoad",this.operateNodeId,this.operateNodeId)
                    break;
            }
            this.treeOperateShow = false
        },
        changeType(type) {
            this.tabIndex = type
            if(type == 2) {
                let chart = this.$refs.tree_chart.chart
                this.$nextTick(() => {
                    chart.on("contextmenu",this.treeContextMenu)
                    chart.on("mouseover",this.treeMouseover)
                })
            }
        },
        treeMouseover() {
            this.treeOperateShow = false
        },
        handleCurrentChange(row) {
            this.el.classList.remove("current-row")
            this.$emit("noticeParentLoad",row.node_id,row.operate)
        },
        treeContextMenu(params) {
            let event = params.event.event
            this.operateNodeId = params.value.node_id
            this.nodeOperate = params.value.operate
            event.preventDefault()
            this.treeOperateType = 0
            console.log(params)
            this.treeOperateShow = true
            this.treeOperateStyle = {
                position:'absolute', 
                left:`${event.clientX + 10}px`,
                top:`${event.clientY - 36}px`,
                zIndex:'999999'
            }
        },
        packageNode(item) {
            return {
                name:item.name,
                value:item,
            }
        },
        dealTreeData(data,parentId) {
            let nodes = this.findParentId(parentId)
            let rootNode = []
            nodes.forEach((item,index)=>{
                rootNode[index] = this.packageNode(item)
                let node = this.dealTreeData(data,item.node_id)
                rootNode[index].children = node
            })
            return rootNode
        },
        findParentId(id) {
            let res = [];
            this.tableData.forEach(item=>{
                if(item.parent_id === id) {
                    res.push(item)
                }
            })
            return res
        },
        edit(index) {
            this.tableData[index].isEdit = !this.tableData[index].isEdit;
        },
        submit(index) {
            if(!this.tableData[index].name || !this.tableData[index].name.trim()) {
                this.$message.warning('节点名称不能为空！')
                return
            }
            let param = {
                "node_id": parseInt(this.tableData[index].node_id), 
                "project_id": this.projectId, 
                "name": this.tableData[index].name,
                "remark": this.tableData[index].remark
            }
            this.requestUtil.post(this.urls.updateModelList.url,param).then((res)=>{
                if(!res.data) {
                    this.tableData[index].isEdit = false
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                }
            });
        },
        copy(id) {
            console.log(id)
            this.$message.success("敬请期待")
        },
        deleteRow(id) {
            this.$confirm('注意：该节点所包含的所有子节点都将被删除！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.requestUtil.post(this.urls.delModelList.url,{project_id:this.projectId,"node_id": id}).then((res)=>{
                    if(!res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.loadData()
                    }
                })
            }).catch(() => {
                 
            });
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
  .select{
    background:rgba(51,123,247,1);
    color:#fff;
    border:none;
  }
}
.tree-operate-conatiner{
    width:50px;
    height:80px;
    padding:0;
    margin:0;
    background:rgba(245,245,245,1);
    border:1px solid rgba(204,204,204,1);
    box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius:2px;
    li{
      list-style:none;
      padding:4px 10px;
    }
    .select{
      background:rgba(51,123,247,1);
      color:#fff;
    }
  }
</style>

<style lang="less">
  
</style>
