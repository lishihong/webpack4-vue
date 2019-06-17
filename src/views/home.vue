<template>
  <div style="width:100%;padding:10px;">
    <div style="display:flex;padding:10px 0;justify-content:space-between;">
      <form
        style="width:32%;display:flex;"
        @submit.prevent="onSubmit"
      >
        <el-input
          v-model="projectName"
          size="mini"
          style="margin-right:15px;"
          placeholder="请输入工程名"
        />
        <el-button
          type="primary"
          size="mini"
          @click="onSubmit()"
        >
          查询
        </el-button>
      </form>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="newProject()"
      >
        新建
      </el-button>
    </div>
    <el-table
      :data="tableData"
      border
      size="mini"
      height="calc(100% - 80px )"
      style="width: 100%;margin:10px 0;"
    >
      <el-table-column
        prop="project_id"
        label="ID"
        :resizable="false"
      />
      <el-table-column
        prop="name"
        label="工程名"
        width="200px;"
        :resizable="false"
      >
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit">{{ scope.row.name }}</span>
          <el-input
            v-show="scope.row.isEdit"
            v-model="scope.row.name"
            size="mini"
            @keyup.enter.native="submitName(scope.$index,scope.row.name)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="rows"
        label="数据行数"
        :resizable="false"
      />
      <el-table-column
        prop="cols"
        label="数据列数"
        :resizable="false"
      />
      <el-table-column
        prop="create_time"
        label="创建时间"
        :resizable="false"
      />
      <el-table-column
        prop="update_time"
        label="修改时间"
        :resizable="false"
      />
      <el-table-column
        label="操作"
        :resizable="false"
      >
        <template slot-scope="scope">
          <img
            src="../assets/images/img-edit.png"
            style="width:16px;cursor:pointer;"
            @click.stop="edit(scope.$index,scope.row.name)"
          >
          <img
            src="../assets/images/img-del.png"
            style="width:16px;margin-left:10px;cursor:pointer;"
            @click.stop="deleteRow(scope.$index)"
          >
          <i
            class="el-icon-view"
            style="font-size:24px;margin-left:10px;color:#7D7D7D;cursor:pointer;"
            @click="toDetail(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default{
    data() {
        return {
            projectName:"",
            oldName:"",//没有做修改，不触发保存方法
            tableData:[],
        }
    },
    created() {
        this.loadData();
    },
    mounted() {
    },
    methods: {
        edit(index) {
            if(!this.tableData[index].isEdit) {
                this.oldName = this.tableData[index].name;
            }
            this.tableData[index].isEdit = true
        },
        submitName(index,name) {
            if(this.tableData[index].isEdit && name != this.oldName) {//保存
                this.saveProject(index,name,this.tableData[index].project_id);
            }
        },
        loadData() {
            this.requestUtil.post(this.urls.projects.url,{name:""}).then((res)=>{
                res.data.forEach((item)=>{
                    item.isEdit = false
                })
                this.tableData = res.data
            })
        },
        saveProject(index,name,projectId) {
            this.requestUtil.post(this.urls.updateProject.url,{project_id:projectId,name:name}).then((res)=>{
                if(!res.data) {
                    this.tableData[index].isEdit = false
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                }
            })
        },
        deleteRow(index) {
            this.$confirm('注意：工程包含的模型与数据都将被删除！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.requestUtil.post(this.urls.delProject.url,{project_id:this.tableData[index].project_id}).then((res)=>{
                    if(!res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.loadData();
                    }
                })
            }).catch(() => {
                 
            });
        },
        onSubmit() {//查询 搜索
            this.requestUtil.post(this.urls.projects.url,{name:this.projectName}).then((res)=>{
                if(res.data) {
                    res.data.forEach((item)=>{
                        item.isEdit = false
                    })
                }
                this.tableData = res.data
            })
        },
        toDetail(index) {
            sessionStorage.setItem("menuIndex",1)
            sessionStorage.setItem("project_id",this.tableData[index].project_id)
            this.router.push({
                path:"/watch-feature/main"
            })
        },
        newProject() {
            this.router.push({
                path:"/choose/chooseOne"
            })
        }
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  .el-table .cell{
    display: flex;
    align-items: center;
 }
</style>
