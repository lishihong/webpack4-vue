import Vue from 'vue'
import {Button,Table,TableColumn,Input,Upload,Select,Option,MessageBox} from 'element-ui';

let useComponents = [Button,Table,TableColumn,Input,Upload,Select,Option,MessageBox];

useComponents.forEach(function(item) {
    Vue.use(item);
});
 