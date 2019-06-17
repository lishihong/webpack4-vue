<template>
  <div>
    <ChooseHead :select-list="selectList" />
    <div style="display:flex;">
      <div class="label-container">
        <div style="flex:1;">
          <div class="head">
            标识标签
          </div>
          <diV
            class="wrap"
            style="border-bottom-left-radius:4px;"
          >
            <div style="display:flex;justify-content:space-between;">
              <button
                class="btn btn1"
                @click="setPrimaryKey"
              >
                主键
              </button>
              <button
                class="btn btn1"
                style="margin-left:12px;background:rgba(51,166,247,1);"
                @click="setSubKey"
              >
                次级主键
              </button>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:15px;">
              <button
                class="btn btn1"
                style="background:#fff;border:1px solid rgba(204,204,204,1);color:inherit;"
                @click="setX"
              >
                X
              </button>
              <button
                class="btn btn1"
                style="margin-left:12px;background:rgba(177,191,85,1);"
                @click="setY"
              >
                Y
              </button>
            </div>
          </diV>
        </div>
        <div style="flex:1;">
          <div class="head">
            删减数据
          </div>
          <diV class="wrap">
            <button
              class="btn btn1"
              style="background:rgba(125,125,125,1);margin-bottom:12px;"
              @click="setExclude"
            >
              Exclude
            </button>
            <button
              class="btn btn2"
              style="border:1px solid rgba(204,204,204,1);"
              @click="setInclude"
            >
              Include
            </button>
          </diV>
        </div>
        <div style="flex:6;">
          <div
            class="head"
            style="border:0;"
          >
            异常处理
          </div>
          <diV
            class="wrap"
            style="border:0;border-bottom-right-radius:4px;padding:10px 2%;display:flex;"
          >
            <div style="flex:1;text-align: center;">
              x-缺失值处理
              <select
                v-model="valueX"
              >
                <option
                  v-for="item in optionsX"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </select>
            </div>
            <div
              style="flex:1;text-align: center;"
            >
              <div>
                y-超规值识别
                <select
                  v-model="valueY1"
                  @change="changeY1"
                >
                  <option
                    v-for="item in optionsY1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </select>
              </div>
              <div
                :style="styleY2"
                style="margin-top:15px;text-align: center;"
              >
                y-超规值处理
                <select
                  v-model="valueY2"
                >
                  <option
                    v-for="item in optionsY2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </select>
              </div>
            </div>
            <div
              :style="styleYLH"
              style="flex:1;text-align: center;"
            >
              <div>
                y-下限
                <input
                  v-model="valueYLow"
                  style="height:18px;"
                  @input="handleInput($event,1)"
                >
              </div>
              <div style="margin-top:15px;">
                y-上限
                <input
                  v-model="valueYHigh"
                  style="height:18px;"
                  @input="handleInput($event,2)"
                >
              </div>
            </div>
          </diV>
        </div>
      </div>
      <div style="text-align:right;width:20%;">
        <el-button
          type="primary"
          size="small"
          style="margin-top:10px;"
          @click="totalMsg()"
        >
          操作信息
        </el-button>
        <br>
        <el-switch
          v-model="switchChoose"
          active-text="批量选择"
          inactive-text="单选"
          style="margin-top:62px;"
        />
      </div>
    </div>
    <BigTable
      ref="bigTable"
      style="margin-top:10px;height:calc(100vh - 286px);"
      :max-height="maxHeight"
      :switch-choose="switchChoose"
      :page-url="pageUrl"
      @submit="submitData"
      @initSelects="initSelects"
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
        @click="goNext"
      >
        下一步
      </button>
    </div>

    <el-dialog
      title="操作信息"
      :visible.sync="showTotal"
    >
      <el-table
        :data="totalData"
        border
        size="mini"
      >
        <el-table-column
          property="typeName"
          label="操作类型"
          width="100"
        />
        <el-table-column
          property="msg"
          label="信息"
          show-overflow-tooltip
        />
        <el-table-column
          property="count"
          label="行列数" 
          width="120"
        />
      </el-table>
    </el-dialog>
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
            selectList:[true,true,false],
            maxHeight:200,
            optionsX:[
                {label:"剔除空值",value:1},
                {label:"均值填充",value:2},
                {label:"相关列填充",value:3},
            ],
            optionsY1:[
                {label:"不处理",value:1},
                {label:"自定义上下限",value:2},
                {label:"6sigma",value:3},
            ],
            optionsY2:[
                {label:"剔除",value:1},
                {label:"均值填充",value:2},
            ],
            valueX:1,
            valueYHigh:"",
            valueYLow:"",
            valueY1:1,
            valueY2:"",
            styleYLH:"visibility:hidden",
            styleY2:"visibility:hidden",
            switchChoose:false,
            showTotal:false,
            totalData:[],
            isTip:true,
            pageUrl:"",
        }
    },
    created() {
        this.pageUrl = this.urls.baseDataPage.url
    },
    mounted() {
        this.maxHeight = this.$refs.bigTable.$el.clientHeight;
    },
    methods: {
        goLast() {
            if(this.isTip) {
                this.$confirm('返回到上一步，所有的设置操作信息都将被清空，确认返回吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.go(-1)
                }).catch(() => {
                   
                })
            }else{
                this.$router.go(-1)
            }
        },
        goNext() {
            this.$refs.bigTable.next()
        },
        handleInput(e,type) {
            let reg = /[^\d.]/g
            if(type == 1) {
                this.valueYLow = e.target.value.replace(reg,'')
            }else{
                this.valueYHigh = e.target.value.replace(reg,'')
            }
        },
        initSelects(data) {
            this.isTip = false
            if(data.x_handle) {
                this.valueX = data.x_handle
            }
            if(data.y_identify) {
                this.valueY1 = data.y_identify
            }
            if(data.y_handle) {
                this.valueY2 = data.y_handle
            }
            if(data.y_value) {
                this.valueYLow = data.y_value[0]
                this.valueYHigh = data.y_value[1]
            }
            this.changeY1();
        },
        submitData(data) {
            let params = data
            params.x_handle = this.valueX
            params.y_identify = this.valueY1
            params.y_handle = this.valueY2
            params.y_value = [this.valueYLow,this.valueYHigh]
            if(this.valueY1 === 2) {
                if(!this.valueYLow && this.valueYLow !== 0 || !this.valueYHigh && this.valueYHigh !== 0) {
                    this.$message.info('请输入自定义的上下限!');
                    return;
                }
                if(parseFloat(this.valueYLow) > parseFloat(this.valueYHigh)) {
                    this.$message.info('下限不能大于上限!');
                    return;
                }
            }
            this.requestUtil.post(this.urls.saveTag.url, params).then((res)=>{
                if(!res.data) {
                    this.router.push({
                        name:"chooseThree"
                    })
                }
            })
        },
        changeY1() {
            switch(this.valueY1 ) {
                case 1:
                    this.styleYLH = "visibility:hidden;"
                    this.styleY2 = "visibility:hidden;"
                    this.valueY2 = "";
                    this.valueYHigh = "";
                    this.valueYLow = "";
                    break;
                case 2:
                    this.styleYLH = "visibility:visible;"
                    this.styleY2 = "visibility:visible;"
                    this.valueY2 = 1;
                    break;
                case 3:
                    this.styleYLH = "visibility:hidden;"
                    this.valueYHigh = "";
                    this.valueYLow = "";
                    this.styleY2 = "visibility:visible;"
                    this.valueY2 = 1;
                    break;
            }
        },
        setPrimaryKey() {
            this.$refs.bigTable.setPrimaryKey();
        },
        setSubKey() {
            this.$refs.bigTable.setSubKey();
        },
        setExclude() {
            this.$refs.bigTable.setExclude();
        },
        setInclude() {
            this.$refs.bigTable.setInclude();
        },
        setX() {
            this.$refs.bigTable.setX();
        },
        setY() {
            this.$refs.bigTable.setY();
        },
        totalMsg() {
            this.showTotal = true
            this.totalData = this.$refs.bigTable.totalMsg();
        },
    },
}
</script>

<style scoped lang="less">
.label-container{
 width:80%;
 border:solid 1px rgba(204,204,204,1);
 background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
 display: flex;
 border-radius:4px;
 margin-top:12px;

.head{
  height:28px;
  line-height:28px;
  margin-left:10px;
  border-right:solid 1px rgba(204,204,204,1);
}
.wrap{
  background-color: rgba(245,245,245,1);
  border-right: solid 1px rgba(204,204,204,1);
  padding:10px 4vw;
  height:63px;
}
.btn{
  width:72px;
  height:24px;
  border:none;
  line-height:24px;
  border-radius:2px;
}
.btn1{
background:rgba(51,123,247,1);
color:#fff;
}
.btn2{
background: #fff;
}
select,input{
width:96px;
height:22px;
line-height:22px;
font-size:12px;
font-family:MicrosoftYaHei;
font-weight:400;
color:rgba(36,36,36,1);
margin-left:4px;
display: inline-block;
}
}
</style>

<style lang="less">
 
</style>

