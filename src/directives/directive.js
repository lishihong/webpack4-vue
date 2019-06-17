import Vue from 'vue'

const visible = Vue.directive('visible',{
    update:function(el,isVisible) {
        if(isVisible.value) {
            el.style.visibility = "visible"
        }else{
            el.style.visibility = "hidden"
        }
    }
})
export {visible}