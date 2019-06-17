<template>
  <div class="view-content">
    <div class="head">
      <p>特征编码</p>
      <div>
        <button
          class="factor-btn-step"
          @click="order"
        >
          Order
        </button>
        <button
          class="factor-btn-step"
          style="margin-left:20px;"
          @click="oneHot"
        >
          OneHot
        </button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:4px;"
      height="200"
      size="mini"
    >
      <el-table-column
        v-for="(item,index) in tableColumn"
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
    <div class="order-container">
      <div>
        <label>Order</label>
        <ul>
          <li
            v-for="(item,index) in orderList"
            :key="index"
          >
            <el-checkbox v-model="orderChecked[index]">
              {{ tableColumn[item] }}
            </el-checkbox>
          </li>
        </ul>
      </div>
      <div class="deal-container">
        <div>
          <div
            class="btn"
            @click="reset"
          >
            重置
          </div>
          <div
            class="btn"
            style="margin-top:20px;"
            @click="del"
          >
            删除
          </div>
        </div>
      </div>
      <div>
        <label>OneHot</label>
        <ul>
          <li
            v-for="(item,index) in oneHotList"
            :key="index"
          >
            <el-checkbox v-model="oneHotChecked[index]">
              {{ tableColumn[item] }}
            </el-checkbox>
          </li>
        </ul>
      </div>
      <div class="deal-container">
        <button
          class="factor-btn-step"
          @click="translate"
        >
          编码转换
        </button>
      </div>
    </div>
    <p>转换结果</p>
    <el-table
      :data="tableDataRes"
      border
      highlight-current-row
      style="width: 100%;margin-top:10px;"
      height="200"
      size="mini"
    >
      <el-table-column
        v-for="(item,index) in tableColumnRes"
        v-show="item.show"
        :key="index"
        :prop="item"
        :label="item"
        max-width="120"
        show-overflow-tooltip
        :resizable="false"
      />
    </el-table>
    <button
      class="factor-btn-step"
      style="margin-top:10px;text-align:center;margin-left:47%;"
      @click="confirm"
    >
      确认
    </button>
  </div>
</template>

<script>
let orderCol = [],oneHotCol = []
export default{
    data() {
        return {
            projectId:"",
            nodeId:"",
            tableData:[],
            tableColumn:[],
            checked:[],
            tableColumnRes:[],
            tableDataRes:[],
            orderList:new Set(),
            oneHotList:new Set(),
            oneHotChecked:[],
            orderChecked:[],

        }
    },
    mounted() {
    },
    methods: {
        loadChildData(projectId,nodeId) {
            this.projectId = projectId
            this.nodeId = nodeId
            this.loadCodeTable()
        },
        loadCodeTable() {
            let params = {
                "project_id": this.projectId,
                "node_id":this.nodeId,
            }
            this.requestUtil.post(`${this.urls.encodeLabelPage.url}1`,params).then((res)=>{
                this.tableColumn = res.data.title
                this.resetCheck(this.tableColumn,this.checked)
                this.tableData = res.data.content
            })
        },
        gainIsChecked(set) {
            let res = false
            set.forEach(item=>{
                if(item === true) {
                    res = true
                }
            })
            return res
        },
        addTips() {
            let res = this.gainIsChecked(this.checked)
            if(!res) { 
                this.$message.warning('请至少选择一列!')
            }
            return res
        },
        checkedIndex() {
            let res = new Set()
            this.checked.forEach((item,index)=>{
                if(item === true) {
                    res.add(index)
                }
            })
            return res
        },
        resetCheck(arr,checkArr) {
            arr.forEach((item,index)=>{
                this.$set(checkArr,index,false)
            })
        },
        order() {
            if(!this.addTips()) {
                return
            }
            let checked = this.checkedIndex()
            this.orderList = new Set([...this.orderList,...checked])
            if(this.oneHotList.size != 0) {
                for(let item of checked) {
                    this.oneHotList.delete(item)
                }
            }
            this.resetCheck(this.tableColumn,this.checked)
            this.resetCheck(this.orderList,this.orderChecked)
        },
        oneHot() {
            if(!this.addTips()) {
                return
            }
            let checked = this.checkedIndex()
            this.oneHotList = new Set([...this.oneHotList,...checked])
            if(this.orderList.size != 0) {
                for(let item of checked) {
                    this.orderList.delete(item)
                }
            }
            this.resetCheck(this.tableColumn,this.checked)
            this.resetCheck(this.oneHotList,this.oneHotChecked)
        },
        reset() {
            this.oneHotList = new Set()
            this.orderList = new Set()
            this.oneHotChecked.splice(0)
            this.orderChecked.splice(0)
        },
        del() {
            if(this.oneHotList.size === 0 && this.orderList.size === 0) {
                return
            }
            let res1 = this.gainIsChecked(this.orderChecked)
            let res2 = this.gainIsChecked(this.oneHotChecked)
            if(!res1 && !res2) {//都没选
                this.$message.warning('请至少选择一个!')
                return
            }
            let arr1 = [...this.orderList]
            if(res1) {
                for(let i = 0;i < this.orderChecked.length;i++) {
                    if(this.orderChecked[i] === true) {
                        arr1.splice(i,1)
                    }
                }
            }
            this.orderList = new Set(arr1)
            let arr2 = [... this.oneHotList]
            if(res2) {
                for(let i = 0;i < this.oneHotChecked.length;i++) {
                    if(this.oneHotChecked[i] === true) {
                        arr2.splice(i,1)
                    }
                }
            }
            this.oneHotList = new Set(arr2)
        },
        translate() {
            orderCol = []
            oneHotCol = []
            this.orderList.forEach(val=>{
                orderCol.push(this.tableColumn[val])
            })
            this.oneHotList.forEach(val=>{
                oneHotCol.push(this.tableColumn[val])
            })
            let params = {
                "project_id":this.projectId,
                "node_id":this.nodeId,
                "order_col": orderCol,
                "onehot_col":oneHotCol,
            }
            this.requestUtil.post(`${this.urls.encodeDataPage.url}1`,params).then((res)=>{
                this.tableColumnRes = res.data.title
                this.tableDataRes = res.data.content
            })
        },
        confirm() {
            let params = {
                "project_id": this.projectId,
                "node_id": parseInt(this.nodeId),
                "point_type":9 ,
                "select_type":1,
                "select_cols":[],
                "select_rows": [],
                "order_col":orderCol,
                "onehot_col":oneHotCol,
            }
            this.requestUtil.post(this.urls.factorCreate.url,params).then((res)=>{
                if(!res.data) {
                    this.$message.success('保存成功!')
                    this.$emit("loadData",this.nodeId)
                    this.router.go(-1)
                }
            })
        },
    },      
}
</script>

<style scoped lang="less">
p{
  font-size:16px;
}
.head{
    display:flex;
    align-items: center;
    justify-content:space-between;
}
.order-container{
    margin-top:10px;
    padding:10px 20px;
    display:flex;
    background:rgba(245,245,245,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    max-height:250px;
    
    label{
        font-weight: 700;
    }
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
    .btn{
        background:rgba(255,255,255,1);
        border:1px solid rgba(204,204,204,1);
        border-radius:2px;
        padding:4px 15px;
    }
}
</style>

<style lang="less">
  
</style>
