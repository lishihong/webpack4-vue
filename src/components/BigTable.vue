<template>
  <div class="container">
    <table :style="tableStyle">
      <tr>
        <th
          v-for="(h,index) in currentCol"
          :key="index"
          :style="cellStyle"
        >
          {{ h }}
        </th>
      </tr>
      <tbody :style="tbodyStyle">
        <tr
          v-for="(d,index) in currentData"
          :key="index"
        >
          <td
            v-for="(item,i) in d"
            :key="i"
            :style="cellStyle"
          >
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="slot-space"
      :style="containerRealStyle"
    />
  </div>
</template>

<script>
export default {
    data() {
        return{
            width:document.documentElement.clientWidth,
            height:document.documentElement.clientHeight,
            cellW:100,
            cellH:25,
            rowCount:0,
            colCount:0,
            currentCol:[],
            currentData:[],
            cellStyle:"",
            tableStyle:"",
            tbodyStyle:"",
            lastData:[],
            nextData:[],
            currentPage:1,
            maxRowItem:0,
            maxColItem:0,
            containerRealStyle:"",
            dataCol:100,
            dataRow:100,
        }
    },
    created() {
        this.rowCount = parseInt(this.height / this.cellH);
        this.colCount = parseInt(this.width / this.cellW);
        this.currentCol = new Array(this.colCount).fill("col");
        this.cellStyle = `width:${this.cellW}px;height:${this.cellH}px;`;
        this.tableStyle = `width:${this.width}px;height:${this.height}px;`;
        this.tbodyStyle = `margin-top:${this.cellH}px;position:relative;top:100px;`;
        this.currentData = this.loadData();
        this.maxRowItem = parseInt(this.rowCount / 2) + this.rowCount
        this.maxColItem = parseInt(this.colCount / 2) + this.colCount
        this.containerRealStyle = `width:${this.cellW * this.dataCol}px;height:${this.cellH * this.dataRow}px;`;
    },
    mounted() {
        console.log(document.querySelector(".slot-space").scrollTop)
        document.querySelector(".slot-space").addEventListener("scroll",()=>{
            this.dealSlotScroll;
        });
    },
    methods: {
        loadData() {
            let res;
            res = new Array(this.rowCount).fill([]);
            for(let i = 0;i < res.length;i++) {
                res[i] = new Array(this.colCount).fill("aa" + i);
            }
            return res;
        },
        dealSlotScroll(evt) {
            console.log(evt)
        }
    },
}
</script>

<style scoped lang="less">
.container{
  width:100vw;
  height:100vh;
}
 table,tr,td,th{
   border:solid 1px #ddd;
   border-collapse:collapse;
 }
 .fixed{
   position:fixed;
 }
</style>

<style lang="less">
 
</style>
