<template>
  <div>
    <ChooseHead :select-list="selectList" />
    <div style="margin:10px 0;text-align:center;">
      数据工程名称
      <input
        v-model="projectName"
        placeholder="请输入工程名称"
        class="input"
      >
    </div>
    <el-table
      :data="headData"
      border
      size="mini"
      highlight-current-row
    >
      <el-table-column
        property="primary_key"
        label="主键"
      />
      <el-table-column
        property="second_key"
        label="次级主键"
        show-overflow-tooltip
      />
      <el-table-column
        property="fillnan_method"
        label="空值处理" 
      >
        <template slot-scope="scope">
          {{ fillnan_methods[scope.row.fillnan_method-1] }}
        </template>
      </el-table-column>
      <el-table-column
        property="check_outlier_method"
        label="Y异常值处理" 
      >
        <template slot-scope="scope">
          {{ check_outlier_methods[scope.row.check_outlier_method-1] }}
        </template>
      </el-table-column>
      <el-table-column
        property="x"
        label="X" 
      />
      <el-table-column
        property="y"
        label="Y" 
      />
      <el-table-column
        property="label"
        label="文本列" 
      />
      <el-table-column
        property="one_value"
        label="恒值列" 
      />
      <el-table-column
        property="count"
        label="空值列" 
      />
      <el-table-column
        property="count"
        label="剔除列" 
      />
    </el-table>
    <BigTable
      ref="bigTable"
      style="margin-top:10px;height:calc(100vh - 280px);"
      :max-height="maxHeight"
      :is-show-check-box="false"
      :page-url="pageUrl"
    />
    <div style="margin-top:10px;text-align:center;">
      <button
        class="factor-btn-step"
        @click="goLast"
      >
        上一步
      </button>
      <button
        class="factor-btn-step"
        style="margin-left:20px;"
        @click="confirm"
      >
        确认无误
      </button>
    </div>
  </div>
</template>

<script>
import BigTable from '@components/big-table'
import ChooseHead from '@components/choose-head'
export default{
    components:{
        BigTable,ChooseHead
    },
    data() {
        return {
            selectList:[true,true,true],
            headData:[],
            maxHeight:200,
            projectName:"",
            project_id:"",
            fillnan_methods:["剔除空值","均值填充","相关列填充"],
            check_outlier_methods:["剔除","均值填充"],
            pageUrl:"",
        }
    },
    created() {
        this.pageUrl = this.urls.confirmDataPage.url
        this.project_id = sessionStorage.getItem("project_id")
        this.requestUtil.post(this.urls.confirmData.url, {"project_id":this.project_id}).then((res)=>{
            this.headData.push(res.data)
        })
    },
    mounted() {
        this.maxHeight = this.$refs.bigTable.$el.clientHeight;
    },
    methods: {
        goLast() {
            this.$router.go(-1);
        },
        confirm() {
            if(!this.projectName) {
                this.$message.error('请输入工程名!');
                return;
            }
            this.requestUtil.post(this.urls.createProjectName.url, {"project_id": this.project_id,"name": this.projectName}).then((res)=>{
                if(!res.data) {
                    this.$message.success('成功新建一个工程!');
                    this.router.push({
                        path:"/home"
                    })
                }
            })
        }
    },
}
</script>

<style scoped lang="less">
  .input{
    width:280px;
    height:26px;
    line-height:26px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    margin-left:15px;
    padding:0 8px;
  }
</style>

<style lang="less">
 
</style>

