<template>
  <div>
    <ModelManage 
      ref="modelManage"
      :key="$route.path"
      @noticeParentLoad="loadNodeId"
    />
    <div class="view-content">
      <p>第一步：设定模型类型</p>
      <div
        v-if="showItem1"
        class="item-container"
      >
        <div
          v-for="(item,index) in items1"
          :key="index"
          class="item-wrap"
          @click="changeItem(1,index)"
        >
          <div style="text-align:center;">
            <div
              class="item"
              :class="{'select':selectIndex1==index}"
            >
              <img :src="selectIndex1==index ? item.pics[1]:item.pics[0]">
            </div>
            <div style="margin-top:10px;">
              {{ item.data.name }}
            </div>
          </div>
        </div>
      </div>

      <p>第二步：设定算法类型</p>
      <div
        v-if="showItem2"
        class="item-container"
      >
        <div
          v-for="(item,index) in items2"
          v-show="item.showIndex===selectIndex1 || item.showIndex===2"
          :key="index"
          class="item-wrap"
          @click="changeItem(2,index)"
        >
          <div style="text-align:center;width:56px;">
            <div
              class="item"
              :class="{'select':selectIndex2==index}"
            >
              <img
                :src="selectIndex2==index ? item.pics[1]:item.pics[0]"
                :title="item.data.zh_name"
              >
            </div>
            <div style="margin-top:10px;">
              {{ item.data.en_name }}<br>
            </div>
          </div>
        </div>
      </div>

      <p v-if="thirdParam&&thirdParam.length>0">
        第三步：设定算法参数
      </p>
      <div
        v-if="thirdParam&&thirdParam.length>0"
        class="item-container"
      >
        <div
          v-for="(item,index) in thirdParam"
          :key="index"
          style="margin-bottom:15px;margin-left:15px;"
        >
          {{ item.name }}
          <el-select
            v-if="item.select_list&&item.select_list.length>0"
            v-model="item.value"
            style="margin-left:10px;width:100px;" 
            size="mini"
          >
            <el-option
              v-for="(d,i) in item.select_list"
              :key="i"
              :label="d"
              :value="d"
            />
          </el-select>
          <el-input
            v-if="!item.select_list||item.select_list.length===0"
            v-model="item.value"
            size="mini"
            placeholder="请输入"
            style="margin-left:10px;width:80px"
          />
        </div>
      </div>
      <p v-if="thirdParam&&thirdParam.length>0">
        第四步：设定训练验证集
      </p>
      <p v-if="!thirdParam||thirdParam.length===0">
        第三步：设定训练验证集
      </p>
        
      <div
        class="item-container"
      >
        <div style="margin-bottom:15px;">
          <label style="margin-left:15px;">验证集比例  </label>
          <el-input
            v-model="test_size"
            size="mini"
            type="text"
            placeholder="请输入"
            style="margin-left:10px;width:80px"
            @input.native="handleInput"
          />
          <label style="margin-left:15px;">抽取方式</label>
          <el-select
            v-model="split_type"
            style="margin-left:10px;width:100px;" 
            size="mini"
          >
            <el-option
              v-for="(d,i) in split_type_list"
              :key="i"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
          <label
            v-show="split_type==='random'"
            style="margin-left:15px;"
          >
            随机种子
          </label>
          <el-select
            v-show="split_type==='random'"
            v-model="random_state"
            style="margin-left:10px;width:100px;" 
            size="mini"
          >
            <el-option
              v-for="(d,i) in random_state_list"
              :key="i"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </div>
      </div>
      <div style="text-align:center;margin-top:20px;">
        <button
          class="btn"
          @click="confirm"
        >
          拟 合
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ModelManage from '@components/model-manage'
export default{
    components:{
        ModelManage,
    },
    data() {
        return {
            projectId:"",
            nodeId:"",
            test_size:"0.2",//验证集比例 0.01-0.99
            split_type:"random",//抽取方式
            split_type_list:[
                {label:"随机抽取",value:"random"},
                {label:"后端截取",value:"order"},
            ],
            random_state:"true",
            random_state_list:[
                {label:"固定",value:"true"},
                {label:"不固定",value:"false"},
            ],
            items1:[
                {pics:[require('../../assets/images/model/img-model1.png'),require('../../assets/images/model/img-model1-select.png')],data:{}},
                {pics:[require('../../assets/images/model/img-model2.png'),require('../../assets/images/model/img-model2-select.png')],data:{}},
            ],
            items2:[
                {showIndex:0,pics:[require('../../assets/images/model/img-args01.png'),require('../../assets/images/model/img-args01-select.png')],data:{}},
                {showIndex:0,pics:[require('../../assets/images/model/img-args02.png'),require('../../assets/images/model/img-args02-select.png')],data:{}},
                {showIndex:0,pics:[require('../../assets/images/model/img-args03.png'),require('../../assets/images/model/img-args03-select.png')],data:{}},
                {showIndex:0,pics:[require('../../assets/images/model/img-args04.png'),require('../../assets/images/model/img-args04-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args05.png'),require('../../assets/images/model/img-args05-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args06.png'),require('../../assets/images/model/img-args06-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args07.png'),require('../../assets/images/model/img-args07-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args08.png'),require('../../assets/images/model/img-args08-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args09.png'),require('../../assets/images/model/img-args09-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args10.png'),require('../../assets/images/model/img-args10-select.png')],data:{}},
                {showIndex:2,pics:[require('../../assets/images/model/img-args11.png'),require('../../assets/images/model/img-args11-select.png')],data:{}},
                {showIndex:1,pics:[require('../../assets/images/model/img-args12.png'),require('../../assets/images/model/img-args12-select.png')],data:{}},
            ],//showIndex 0 表示第一组显示，1表示第二组显示，2表示第一组和第二组都显示
            selectIndex1:0,
            selectIndex2:0,
            showItem1:false,
            showItem2:false,
            thirdParam:[],
        }
    },
    created() {
        this.projectId = sessionStorage.getItem("project_id")
    }, 
    mounted() {
    },
    methods: {
        loadNodeId(nodeId) {
            this.nodeId = nodeId
            this.loadData()
        },
        handleInput() {
            let reg = /[^\d.]/g
            this.test_size = this.test_size.replace(reg,'')
        },
        loadData() {
            this.requestUtil.post(this.urls.modelConfigList.url,{}).then((res)=>{
                res.data.forEach((item,index)=>{
                    this.$set(this.items1[index],'data',item)
                })
                this.showItem1 = true
                this.loadChildArg(this.items1[0].data.code,1)
            })
        },
        confirm() {
            if(!this.test_size) {
                this.$message("验证集比例不能为空！")
                return
            }
            if(this.test_size < 0.01 || this.test_size > 0.99) {
                this.$message("验证集比例范围为0.01到0.99！")
                return
            }
            let args = {}
            if(this.thirdParam) {
                this.thirdParam.forEach(item=>{
                    args[item.name] = item.value
                })
            }
            let params = {
                "project_id": this.projectId,
                "node_id": this.nodeId,
                "model_code": this.items1[this.selectIndex1].data.code,
                "algorithm_code": this.items2[this.selectIndex2].data.code,
                "algorithm_para": args,
                "test_size": parseFloat(this.test_size),
                "split_type": this.split_type,
                "random_state": this.random_state
            }
            this.requestUtil.post(this.urls.fittingBuild.url,params).then((res)=>{
                if(!res.data) {
                    sessionStorage.setItem("menuIndex",4)
                    this.router.push({
                        path:"/model-comment/index"
                    })
                }
            })
        },
        loadChildArg(code,type) {
            this.requestUtil.post(this.urls.algorithmList.url,{model_code:code}).then((res)=>{
                if(type === 1) {
                    this.loadChildArg(this.items1[1].data.code,2)
                    res.data.forEach((item,index)=>{
                        let tempArr = item.name.split("(")
                        item.en_name = tempArr[0]
                        item.zh_name = tempArr[1].replace(/\)/,"")
                        this.$set(this.items2[index],'data',item)
                    })
                }else{
                    let tempArr = res.data[0].name.split("(")
                    res.data[0].en_name = tempArr[0]
                    res.data[0].zh_name = tempArr[1].replace(/\)/,"")
                    this.$set(this.items2[this.items2.length - 1],'data',res.data[0])
                }
                this.showItem2 = true
                if(type === 1) {
                    this.loadThireParams()
                }
            })
        },
        changeItem(type,index) {
            if(type == 1) {
                this.selectIndex1 = index
                if(index == 0) {
                    this.selectIndex2 = 0
                }else{
                    this.selectIndex2 = 5
                }
            }else{
                this.selectIndex2 = index
            }
            this.loadThireParams()
        },
        loadThireParams() {
            let params = {
                "model_code": this.items1[this.selectIndex1].data.code,
                "algorithm_code": this.items2[this.selectIndex2].data.code,
            }
            this.requestUtil.post(this.urls.algorithmParam.url,params).then((res)=>{
                this.thirdParam = res.data
            })
        }
    },      
}
</script>

<style scoped lang="less">
 p{
   font-size:16px;
 }
 .item-container{
  padding:15px 0 0;
  display:flex;
  background:rgba(245,245,245,1);
  border:1px solid rgba(204,204,204,1);
  border-radius:2px;
  flex-wrap:wrap;
  .item{
    border-radius:15px;
    height:56px;
    display: flex;
    align-items:center;
    justify-content:center;
    cursor: pointer;
  }
  .select{
    border:1px solid rgba(51,123,247,1);
  }
  .item-wrap{
    display:flex;
    justify-content:center;
    width:100px;
    margin-bottom:15px;
  }
  img{
    width:60%;
  }
 }
 .btn{
   background:rgba(51,123,247,1);
   border-radius:2px;
   border:none;
   padding:8px 20px;
   color:#fff;
   cursor: pointer;
 }
</style>

<style lang="less">
  
</style>
