<template>
  <div>
    <vxe-table
      ref="xTable"
      border
      resizable
      height="600"
      :loading="loading"
    >
      <vxe-table-column
        type="index"
        width="100"
        fixed="left"
      />
      <vxe-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="'name'"
        :label="'col'"
        width="100" 
      />
    </vxe-table>
  </div>
</template>

<script>
let list;
export default {
    data() {
        return {
            loading: false,
            tableColumn: []
        }
    },
    created() {
        this.tableColumn = new Array(1000).fill({prop:"name"})
    },
    mounted() {
        this.$nextTick(()=>{
            this.loading = true;
            setTimeout(()=>{
                list = new Array(100).fill({name:"aaa"});
                this.$refs.xTable.reload(list);
                this.loading = false;
            },1000)
            let ele = document.querySelector("div.vxe-table--body-wrapper.body--wrapper");
            ele.addEventListener("scroll",()=>{
                this.dealScroll(ele);
            });
        });
    },
    methods: {
        rowClassName() {
            return 'row-green'
        },
        dealScroll(ele) {
            let {scrollTop} = ele;
            if(scrollTop >= 500 && scrollTop % 500 < 40) {
                list = list.concat(new Array(100).fill({name:"bbb"}));
                this.$refs.xTable.reload(list);
            }
        }
    }
}
</script>
<style>
.vxe-table.fixed--left.size--mini .vxe-body--column, .vxe-table.fixed--right.size--mini .vxe-body--column, .vxe-table.vxe-editable.size--mini .vxe-body--column{
  height:25px;
}
.vxe-table.size--mini .vxe-body--column, .vxe-table.size--mini .vxe-footer--column, .vxe-table.size--mini .vxe-header--column {
  padding: 2px 0;
}
</style>
