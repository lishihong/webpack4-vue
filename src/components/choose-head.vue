<template>
  <div class="container">
    <div>
      <div
        class="circle"
        :class="{'select-bg':selectList[0]}"
      >
        1
      </div>
      <span
        class="text-color"
        :class="{'select-text-color':selectList[0]}"
      >
        导入数据
      </span>
    </div>
    <div
      class="line"
      :class="{'select-bg':selectList[1]}"
    />
    <div>
      <div
        class="circle"
        :class="{'select-bg':selectList[1]}"
      >
        2
      </div>
      <span
        class="text-color"
        :class="{'select-text-color':selectList[1]}"
      >
        设置标签
      </span>
    </div>
    <div
      class="line"
      :class="{'select-bg':selectList[2]}"
    />
    <div>
      <div
        class="circle"
        :class="{'select-bg':selectList[2]}"
      >
        3
      </div>
      <span
        class="text-color"
        :class="{'select-text-color':selectList[2]}"
      >
        确认数据
      </span>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        selectList:{
            default:()=> [true,false,false],
        }
    },
    data() {
        return{
           
        }
    }
}
</script>

<style scoped lang="less">
.container{
  display:flex;
  align-items:center;
  justify-content: center;
  padding-top:10px;
}
.circle{
  width:24px;
  height:24px;
  background:rgba(204,204,204,1);
  border-radius:50%;
  color:#fff;
  margin-bottom:4px;
  text-align: center;
  line-height: 24px;
}
.text-color{
  color:#7D7D7D;
  margin-left:-20px;
}
.line{
  width:200px;
  height:6px;
  background:rgba(204,204,204,1);
  border-radius:3px;
  margin:0 10px 18px 10px;
}
.select-bg{
  background:rgba(51,123,247,1);
}
.select-text-color{
  color:rgba(51,123,247,1);
}
</style>