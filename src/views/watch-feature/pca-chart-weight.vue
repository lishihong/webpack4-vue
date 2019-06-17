<template>
  <div>
    <v-chart
      ref="pca_weight_chart"
      :options="options"
      autoresize
      style="height:320px;width:100%;"
    />
    <Collect @collect="collect" />
  </div>
</template>

<script>
import Collect from '@components/collect'

export default{
    components:{
        Collect
    },
    data() {
        return {
            options:[],
        }
    },
    mounted() {
    },
    methods: {
        
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>
