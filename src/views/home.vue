<template>
  <div>
    <v-chart
      ref="chart1"
      :options="options"
      autoresize
      manual-update
    /> 
    <v-chart
      ref="chart2"
      :options="options"
      autoresize
      manual-update
    /> 
    <p>
      <button @click="goTest()">
        go test
      </button>
    </p>
    <p>
      <button @click="goTest2()">
        go test2
      </button>
    </p>
  </div>
</template>

<script>
export default {
    data() {
        return{
            options: {
                title: {
                    text: 'Dispersion of house price according to the built time',
                    x: 'center',
                    y: 0,
                    textStyle:{
                        color:'#3259B8',
                        fontSize:16,
                        fontWeight:'normal',
                    }
                },
                brush: {
                    outOfBrush: {
                        color: '#abc'
                    },
                    brushStyle: {
                        borderWidth: 2,
                        color: 'rgba(0,0,0,0.2)',
                        borderColor: 'rgba(0,0,0,0.5)',
                    },
                    seriesIndex: [0, 1],
                    throttleType: 'debounce',
                    throttleDelay: 300,
                    geoIndex: 0
                },
                xAxis: [{
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} m'
                    },
                    nameTextStyle: {
                        color: '#3259B8',
                        fontSize: 14,
                    },
                    axisTick:{
                        show:false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3259B8',
                        }
                    },
                    splitLine: {
                        show:false,
                    }
                }],
                yAxis: [{
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} CNY/㎡'
                    },
                    nameTextStyle: {
                        color: '#3259B8',
                        fontSize: 14
                    },
                    axisTick:{
                        show:false,
                    },
                    axisLine: {
                        lineStyle: {
                            color:'#3259B8',
                        }
                    },
                    splitLine: {
                        show:false,
                    }
                }],
                series: [{
                    name: 'price-area',
                    type: 'scatter',
                    data: [],
                    symbolSize:4,
                },
                ]
            },
            chart:"chart"
        }
    },
    computed: {
    },
    mounted() {
        console.log(this.$refs.chart1)
    },
    methods: {
        goTest() {
            this.$router.push('/test');
            /* this.requestUtil.post(this.urls.login.url,{}).then(function(data) {
                console.log(data)
            }) */
        },
        goTest2() {
            this.$router.push('/test2');
        }
    }
}
</script>

<style scoped lang="less">
 
</style>

<style lang="less">
 
</style>
