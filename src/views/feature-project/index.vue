<template>
  <div>
    <div class="head-title">
      <label style="flex:1;">降维</label>
      <label style="flex:1;">升维</label>
    </div>
    <section class="head">
      <div class="head-container">
        <div
          class="item"
          @click="goChild(1)"
        >
          <img src="../../assets/images/img-fature-project01.png">
          <div>共线性判断</div>
        </div>
        <div
          class="item"
          @click="goChild(2)"
        >
          <img src="../../assets/images/img-fature-project02.png">
          <div>相关性筛选</div>
        </div>
        <div
          class="item"
          @click="goChild(3)"
        >
          <img src="../../assets/images/img-fature-project03.png">
          <div>重要度筛选</div>
        </div>
      </div>
      <div
        class="head-container"
        style="border:none;"
      >
        <div
          class="item"
          @click="goChild(4)"
        >
          <img src="../../assets/images/img-fature-project04.png">
          <div>构建特征</div>
        </div>
      </div>
    </section>
    <div class="head-title">
      <label style="flex:1;">转换</label>
    </div>
    <section
      class="head"
      style="width:50%;"
    >
      <div
        class="head-container"
        style="border:none;"
      >
        <div
          class="item"
          @click="goChild(5)"
        >
          <img src="../../assets/images/img-fature-project05.png">
          <div>特征标准化</div>
        </div>
        <div
          class="item"
          @click="goChild(6)"
        >
          <img src="../../assets/images/img-fature-project06.png">
          <div>特征抽取</div>
        </div>
        <div
          class="item"
          @click="goChild(7)"
        >
          <img src="../../assets/images/img-fature-project07.png">
          <div>编码转换</div>
        </div>
      </div>
    </section>
    <router-view />
  </div>
</template>

<script>
export default{
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        goChild(index) {
            let path
            switch(index) {
                case 1:
                    path = `/feature-project/linear`
                    break;
                case 2:
                case 3:
                    path = `/feature-project/important/${index}`
                    break;
                case 4:
                    path = `/feature-project/buildFeature`
                    break;
                case 5:
                    path = `/feature-project/featureStandard`
                    break;
                case 6:
                    path = `/feature-project/extractFeature`
                    break;
                case 7:
                    path = `/feature-project/featureCode`
                    break;
            }
            this.router.push({
                path:path
            })
        }
    },      
}
</script>

<style scoped lang="less">
.head{
  display:flex;
  background:rgba(245,245,245,1); 
  border:1px solid rgba(204,204,204);
  border-radius:2px
}
.head-title{
  display:flex;
  font-size:16px;
  margin:6vh 0 3vh 0;
}
.head-container{
  flex:1;
  border-right:1px solid rgba(204,204,204);
  padding:1vw;
  display:flex;
  .item{
    text-align:center;
    margin-right:6%;
    cursor: pointer;
    img{
      width:60%;
      margin-bottom:6px;
    }
  }
}
</style>

<style lang="less">
  
</style>
