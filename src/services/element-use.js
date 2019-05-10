import Vue from 'vue'
import {Button,Table,TableColumn} from 'element-ui';

let useComponents = [Button,Table,TableColumn];

useComponents.forEach(function(item) {
    Vue.use(item);
});
 