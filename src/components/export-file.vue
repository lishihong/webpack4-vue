<template>
  <div style="margin-top:200px;margin-left:25%;">
    <div style="display:flex;align-items:center;">
      导入数据文件
      <el-upload
        ref="upload"
        :action="uploadUrl"
        style="margin-left:20px;margin-right:60px;"
        :before-upload="beforeUpload"
        :data="data"
        :headers="headers"
        :show-file-list="false"
        :on-success="uploaded"
        :on-progress="progress"
        :on-error="uploadError"
        :limit="1"
      >
        <div class="import">
          {{ fileName }}
        </div>
      </el-upload>
    </div>
    <div style="margin-top:25px;">
      请选择工作表
      <el-select
        v-model="value"
        placeholder="请选择工作表"
        size="small"
        style="width:360px;height:32px;margin-left:16px;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-button
      type="primary"
      size="mini"
      style="margin-left:25%;margin-top:50px;"
      @click="confirm()"
    >
      {{ btnText }}
    </el-button>
  </div>
</template>

<script>
let loading;
import {getToken} from '../services/user'
export default {
    props:[
        'options',
        'uploadUrl',
        'btnText',
    ],
    data() {
        return {
            value:"",
            data:{},
            headers:{},
            fileName:"请选择数据文件"

        }
    },
    created() {
        this.headers = {Authorization: getToken()};
        if(this.btnText == "预测") {
            this.data = {type:2}
        }
    },
    methods: {
        confirm() {
            this.$emit('confirm',this.value);
        },
        beforeUpload(file) {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === "application/vnd.ms-excel";
            const isLt100M = file.size / 1024 / 1024 < 100;
            this.fileName = file.name
            if (!isExcel) {
                this.$message.error('上传文件必须是excel或者csv格式!');
            }
            if (!isLt100M) {
                this.$message.error('上传文件大小不能超过 100MB!');
            }
            return isExcel && isLt100M;
        },
        progress(event, file) {
            console.log(file.percentage)
            loading = this.$loading({ 
                lock: true, 
                text: '文件上传中，请稍等', 
                spinner: 'el-icon-loading', 
                background: 'rgba(0, 0, 0, 0.7)' 
            });
        },
        uploadError(err) {
            console.log(err);
        },
        uploaded(response) {
            this.$refs.upload.clearFiles();
            loading.close();
            this.$emit("uploaded",response);
        }
    },
}
</script>

<style scoped lang="less">
  .import{
    width:345px;
    height:32px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    line-height:32px;
    text-align:left;
    padding-left:15px;
  }
</style>
<style lang="less">
   .el-table .cell{
    display: flex;
    align-items: center;
 }
</style>
