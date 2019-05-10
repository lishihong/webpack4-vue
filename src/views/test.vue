<template>
  <div id="tt">
    <div
      v-for="index in items"
      :key="index"
    >
      item{{ index }}
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            items: 25,
            style:""
        }
    },
    created() {
    },
    mounted() {
        let el = document.querySelector("#tt")
        this.toBottom(true,el)
        window.addEventListener('scroll',()=>{
            this.toBottom(true,el)
        })
    },
    methods: {
        toBottom(flag,el) {
            let scrollH = document.documentElement.scrollTop || document.body.scrollTop;
            let docH,windowH;//滚动条滚动高度
            docH = el.scrollHeight;//当前文档高度
            windowH = window.innerHeight;//浏览器窗口高度
            console.log(scrollH,windowH,docH)
            if(scrollH + windowH + windowH / 2 >= docH) {//滚动到底部和页面没有正在执行请求网络数据的过程中的条件要同时成立才可以执行请求请求数据操作
                if(flag) {
                    this.items += 10;
                }
            }
        },
    }, 
}
</script>
