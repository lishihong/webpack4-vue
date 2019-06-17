<template>
  <div>
    <vxe-table
      v-if="tableColumn.length!==0"
      ref="xTable"
      border
      class="cust-style"
      :max-height="maxHeight"
      :loading="false"
      :header-cell-class-name="headerCellClassName"
      :cell-class-name="cellClassName"
      show-header-all-overflow="tooltip"
      show-all-overflow="tooltip"
    >
      <vxe-table-column
        type="index"
        width="80"
        fixed="left"
      >
        <template v-slot:header="{ column }">
          <span>行号</span>
        </template>
        <template v-slot="scope">
          <el-checkbox
            v-if="isShowCheckBox || isCondition"
            v-model="rowChecked[scope.rowIndex]"
            style="margin-right:5px;"
            @change="checked=>rowCheckChange(checked,scope.rowIndex)"
          >
            {{ scope.rowIndex+1 }}
          </el-checkbox>
          <span v-if="!isShowCheckBox&&!isCondition">{{ scope.rowIndex +1 }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.label"
        :label="item.label"
        width="120"
      >
        <template
          v-slot:header="scope"
        >
          <el-checkbox
            v-if="isShowCheckBox&&!isCondition || !isShowCheckBox&&isCondition && (tableColumn[index].status==1 || tableColumn[index].status==5)"
            v-model="colChecked[index]"
            style="margin-right:5px;"
            @change="checked=>colCheckChange(checked,index)"
          >
            {{ scope.column.label }}
          </el-checkbox>
          <span v-if="!isShowCheckBox&&!isCondition || !isShowCheckBox&&isCondition&&tableColumn[index].status!=1 && tableColumn[index].status!=5">{{ scope.column.label }}</span>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
let list = [],tempList = []
export default {
    name:"BigTable",
    props:{
        maxHeight:{
            default:200,
        },
        switchChoose:{
            default:false,
        },
        isShowCheckBox:{
            default:true,
        },
        isCondition:{
            default:false,
        },
        pageUrl:{
            default:""
        },
    },
    data() {
        return {
            tableColumn: [],
            currentPage:1,
            totalPage:0,
            projectId:"",
            el:{},
            rowList:[1,2],
            rowChecked:[], 
            colChecked:[],
            rowSelectIndex:[],//保存当前选择行的rowIndex
            colSelectIndex:[],//保存当前选择列的colIndex
            excludeRow:[],
            startSelect:-1,//批量选择的起点
            endSelect:-1,
            rowResetFlag:false,//做优化处理，不用每次change，都去重置，只需要重置一次
            colResetFlag:false,
            primaryKeyName:"",//主键列名
            subPrimaryKeyList:[],
            xList:[],
            yList:[],
            excludeCol:[],
            excludeRowFactor:[],//因子集里面的排除行，需要行所在主键列的对应值
        }
    },
    created() {
        list = [];
        this.projectId = sessionStorage.getItem("project_id")
        this.loadData()
    },
    mounted() {
        /* this.el = document.querySelector(".vxe-table--body-wrapper.body--wrapper");
        this.el.addEventListener("scroll",()=>{
            this.dealScroll()
        }); */
    },
    methods: {
        /*  dealScroll() {
            if(this.currentPage >= this.totalPage) {
                return;
            }
            let {scrollTop,scrollHeight} = this.el,screenHeight = document.documentElement.clientHeight;
            if(scrollTop + screenHeight > scrollHeight) {
                this.currentPage++;
                console.log("--loadmore--",this.currentPage);
                this.loadData()
            }
        }, */
        loadData(flag = true) {
            let parmas = {project_id:this.projectId}
            if(this.pageUrl.includes("factor")) {
                parmas.node_id = sessionStorage.getItem("nodeId")
            }
            this.requestUtil.post(`${this.pageUrl}${this.currentPage}`,parmas,flag).then((res)=>{
                let obj = {};
                tempList = [];
                if(this.currentPage == 1) {
                    res.data.title.forEach((item)=>{
                        obj = {};
                        obj.label = Object.keys(item).toString()
                        obj.status = parseInt(Object.values(item).toString()) // 1 :x和include ，2：主键 ，3：次级主键，4：Y，5：exclude
                        this.tableColumn.push(obj) 
                    })
                    this.totalPage = res.data.pages
                    this.colChecked = new Array(res.data.title.length).fill(false)
                    if(res.data.tags) {
                        this.excludeRow = res.data.tags.exclude_rows || []
                        this.primaryKeyName = res.data.tags.primary_key
                        this.$emit("initSelects",res.data.tags)
                    }
                }
                res.data.content.forEach((item)=> {
                    obj = {};
                    item.forEach((ele,index)=>{
                        obj[this.tableColumn[index].label] = ele
                    });
                    tempList.push(obj);
                    this.rowChecked.push(false)
                });
                list = list.concat(tempList);
                this.$nextTick(()=>{
                    if(this.$refs.xTable) {
                        this.$refs.xTable.loadData(list)
                        if(this.currentPage < this.totalPage) {
                            this.currentPage++
                            this.loadData(false)
                        }
                    }
                })
            })
        },
        headerCellClassName({column,columnIndex}) {
            let res = 'col-x'
            let id = column.id
            columnIndex--
            if(columnIndex < 0 || !this.tableColumn[columnIndex]) {
                return res
            }
            switch(this.tableColumn[columnIndex].status) {
                case 1:
                    res = 'col-x';
                    break;
                case 2:
                    res = 'col-primary';
                    break;
                case 3:
                    res = 'col-sub';
                    break;
                case 4:
                    res = 'col-y';
                    break;
                case 5:
                    res = 'col-exclude';
                    break;
            }
            this.$nextTick(()=>{
                let selector = `.vxe-header--column.${id}.${res} label>span:last-child`
                let el = document.querySelector(selector)
                if(el) {
                    this.setColColor(res,el)
                }else{
                    selector = `.vxe-header--column.${id}.${res}`
                    el = document.querySelector(selector)
                    if(el) {
                        this.setColColor(res,el)
                    }
                }
            })
            return res;
        },
        setColColor(res,el) {
            if(res === 'col-x') {
                el.style.color = "#606266"
            }else{
                el.style.color = "#fff"
            }
        },
        cellClassName({rowIndex,columnIndex}) {
            if(this.excludeRow.length != 0) {
                if(columnIndex == 0 && this.excludeRow.indexOf(rowIndex) != -1) {
                    return 'row-exclude'
                }
            }
        },
        rowCheckChange(checked,rowIndex) {
            this.rowResetFlag = false;
            if(!this.colResetFlag) {
                this.resetColCheckd();
            }
            if(checked) {
                this.rowSelectIndex.push(rowIndex);
                this.rowSelectIndex.sort();
            }else{
                this.rowSelectIndex.splice(this.rowSelectIndex.indexOf(rowIndex),1);
            }
            if(this.switchChoose) {//批量选模式
                if(this.startSelect === -1) {
                    this.startSelect = rowIndex
                }else{
                    this.endSelect = rowIndex;
                    //加入选择
                    if(this.startSelect > this.endSelect) {
                        [this.startSelect,this.endSelect] = [this.endSelect,this.startSelect]//交换
                    }
                    for(let i = this.startSelect + 1;i < this.endSelect;i++) {
                        this.$set(this.rowChecked,i,true);
                        this.rowSelectIndex.push(i);
                        this.rowSelectIndex.sort();
                    }
                    //重置起点和终点
                    this.startSelect = -1;
                    this.endSelect = -1;
                }
            }
        },
        colCheckChange(checked,colIndex) {
            colIndex += 1
            this.colResetFlag = false
            if(!this.rowResetFlag) {
                this.resetRowCheckd();
            }
            if(checked) {
                this.colSelectIndex.push(colIndex);
                this.colSelectIndex.sort();
            }else{
                this.colSelectIndex.splice(this.colSelectIndex.indexOf(colIndex),1);
            }
            if(this.switchChoose) {//批量选模式
                if(this.startSelect === -1) {
                    this.startSelect = colIndex
                }else{
                    this.endSelect = colIndex;
                    //加入选择
                    if(this.startSelect > this.endSelect) {
                        [this.startSelect,this.endSelect] = [this.endSelect,this.startSelect]//交换
                    }
                    for(let i = this.startSelect;i < this.endSelect;i++) {
                        this.$set(this.colChecked,i,true);
                        this.colSelectIndex.push(i);
                        this.colSelectIndex.sort();
                    }
                    //重置起点和终点
                    this.startSelect = -1;
                    this.endSelect = -1;
                }
            }
        },
        resetColCheckd() {
            this.colResetFlag = true;
            this.colChecked.splice(0);
            this.colChecked = new Array(this.tableColumn.length).fill(false);
            this.emptySelectColIndex();
        },
        resetRowCheckd() {
            this.rowResetFlag = true;
            this.rowChecked.splice(0);
            this.rowChecked = new Array(list.length).fill(false);
            this.emptySelectRowIndex();
        },
        setPrimaryKey() {
            if(this.colSelectIndex.length != 1) {
                this.$message.error('请选择一列设置为主键!');
                return;
            }
            this.checkPrimaryKey(this.tableColumn[this.colSelectIndex[0] - 1].label)        },
        checkPrimaryKey(primaryKeyName) {
            let params = {project_id:this.projectId,primary_key:primaryKeyName,exclude_rows:this.excludeRow}
            this.requestUtil.post(this.urls.isPrimaryKey.url,params).then((res)=>{
                if(res.data.flag !== 1) {
                    let msg = ""
                    res.data.repeat.forEach((item)=>{
                        msg += `第${item + 1}行，`
                    })
                    this.$message.error(`${params.primary_key}列不能设置为主键！${msg}是重复行！`);
                }else{
                    //移除之前的主键列的标色
                    if(this.primaryKeyName !== "") {
                        for(let i = 0;i < this.tableColumn.length;i++) {
                            if(this.tableColumn[i].label === this.primaryKeyName) {
                                this.tableColumn[i].status = 1;
                                break;
                            }
                        }
                    }
                    this.primaryKeyName = primaryKeyName
                    this.setColStatus(2);
                }
            })
        },
        setSubKey() {
            if(this.colSelectIndex.length === 0) {
                this.$message.error('请选择一列!');
                return;
            }
            this.setColStatus(3);
        },
        setExclude() {
            if(this.colSelectIndex.length === 0 && this.rowSelectIndex.length == 0) {
                this.$message.error('请选择一列或者一行!');
                return;
            }
            if(this.colSelectIndex.length !== 0) {
                this.setColStatus(5)
            }else{
                this.excludeRow = this.excludeRow.concat(this.rowSelectIndex);
                this.excludeRow = this._.uniq(this.excludeRow);
                this.excludeRow.sort();
                this.resetRowCheckd();
            }
        },
        clearExclude() {
            this.excludeRow.splice(0)
            this.resetRowCheckd();
            for(let i = 0;i < this.tableColumn.length;i++) {
                if(this.tableColumn[i].status == 5) {
                    this.tableColumn[i].status = 1
                } 
            }
            this.resetColCheckd();
        },
        setInclude() {
            if(this.colSelectIndex.length === 0 && this.rowSelectIndex.length == 0) {
                this.$message.error('请选择一列或者一行!');
                return;
            }
            if(this.colSelectIndex.length !== 0) {
                this.setColStatus(1);
            }else{
                if(this.excludeRow.length !== 0) {
                    this._.pullAll(this.excludeRow,this.rowSelectIndex)
                    this.resetRowCheckd();
                    if(this.primaryKeyName !== "") {
                        if(!this.isCondition) {
                            this.checkPrimaryKey(this.primaryKeyName);
                        }
                    }
                }
            }
        },
        setX() {
            if(this.colSelectIndex.length === 0) {
                this.$message.error('请选择一列!');
                return;
            }
            this.setColStatus(1);
        },
        setColStatus(status) {
            for(let i = 0;i < this.colSelectIndex.length;i++) {
                this.tableColumn[this.colSelectIndex[i] - 1].status = status;
            }
            this.resetColCheckd();
        },
        setY() {
            if(this.colSelectIndex.length === 0) {
                this.$message.error('请选择一列!');
                return;
            }
            this.setColStatus(4);
        },
        emptySelectColIndex() {
            this.colSelectIndex = [];
        },
        emptySelectRowIndex() {
            this.rowSelectIndex = [];
        },
        totalMsg() {
            let res = [],obj;
            this.primaryKeyName = ""
            this.xList = [];
            this.subPrimaryKeyList = [];
            this.yList = [];
            this.excludeCol = [];
            this.excludeRowFactor = [],
            this.tableColumn.forEach((item)=>{
                switch(item.status) {
                    case 1:
                        this.xList.push(item.label);
                        break;
                    case 2:
                        this.primaryKeyName = item.label;
                        break;
                    case 3:
                        this.subPrimaryKeyList.push(item.label);
                        break;
                    case 4:
                        this.yList.push(item.label);
                        break;
                    case 5:
                        this.excludeCol.push(item.label);
                        break;
                }
            })
            if(this.isCondition && this.excludeRow.length != 0) {
                for(let i = 0;i < this.excludeRow.length;i++) {
                    this.excludeRowFactor.push(list[this.excludeRow[i]][this.primaryKeyName])
                }
            }

            obj = {typeName:"主键",msg: this.primaryKeyName || "-",count:this.primaryKeyName ? "1（列）" : "0（列）"}
            res.push(obj);

            obj = {typeName:"次级主键",msg:this.totalColmsg(this.subPrimaryKeyList),count:`${this.subPrimaryKeyList.length}（列）`}
            res.push(obj);

            
            obj = {typeName:"X",msg:this.totalColmsg(this.xList),count:`${this.xList.length}（列）`}
            res.push(obj);

            obj = {typeName:"Y",msg:this.totalColmsg(this.yList),count:`${this.yList.length}（列）`}
            res.push(obj);

            obj = {typeName:"剔除列",msg:this.totalColmsg(this.excludeCol),count:`${this.excludeCol.length}（列）`}
            res.push(obj);
            let msg = ""
            this.excludeRow.forEach((item)=>{
                msg += item + ","
            })
            if(msg === "") {
                msg = "-"
            }
            obj = {typeName:"剔除行",msg:msg,count:`${this.excludeRow.length}（行）`}
            res.push(obj);

            return res;
        },
        totalColmsg(list) {
            let res = ""
            list.forEach((item)=>{
                res += item + ","
            })
            if(res === "") {
                res = "-"
            }
            return res
        },
        next() {
            this.totalMsg()
            if(!this.primaryKeyName) {
                this.$message.error('您还没有设置主键，请先设置主键哦!');
                return false;
            }
            if(this.yList.length == 0) {
                this.$confirm('您当前还没有设置Y，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doNext()
                }).catch(() => {
                    return false
                });
            }else{
                this.doNext()
            }
            return true;
        },
        doNext() {
            let params = {
                "project_id": this.projectId,
                "primary_key": this.primaryKeyName,
                "second_key": this.subPrimaryKeyList,
                "y": this.yList,
                "exclude_cols": this.excludeCol,
                "exclude_rows": this.excludeRow
            }
            this.$emit("submit",params)
        },
    },
}
</script>

<style lang="less">
.vxe-table .vxe-cell{
  height:25px;
  display: flex;
  min-width:79px;
  width:120px;
}
 .vxe-table.fixed--left.size--mini .vxe-body--column, .vxe-table.fixed--right.size--mini .vxe-body--column, .vxe-table.vxe-editable.size--mini .vxe-body--column{
  height:25px;
}
.vxe-table.size--mini .vxe-body--column, .vxe-table.size--mini .vxe-footer--column, .vxe-table.size--mini .vxe-header--column {
  padding:0;
  line-height: 25px
}
.cust-style .vxe-body--column.row-exclude {
  background-color: rgba(125,125,125,1);
}
.cust-style .vxe-header--column.col-primary {
  background-color:rgba(51,123,247,1);
}
.cust-style .vxe-header--column.col-sub {
  background:rgba(51,166,247,1);
}
.cust-style .vxe-header--column.col-x {
  background:#fff;
}
.cust-style .vxe-header--column.col-y {
  background: rgb(177, 191, 85);
}
.cust-style .vxe-header--column.col-exclude {
  background:rgba(125,125,125,1);
}
</style>