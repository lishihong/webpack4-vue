    
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

const Home = () => import ("@views/home.vue")
const Login = () => import ("@views/login.vue")
const ChooseOne = () => import ("@views/choose/chooseOne")
const ChooseTwo = () => import ("@views/choose/chooseTwo")
const ChooseThree = () => import ("@views/choose/chooseThree")
const WatchFeatureMain = () => import ("@views/watch-feature/main")
const FeatureProjectMain = () => import ("@views/feature-project/main")
const FeatureImportant = () => import ("@views/feature-project/important")
const FeatureLinear = () => import ("@views/feature-project/linear")
const FeatureIndex = () => import ("@views/feature-project/index")
const BuildFeature = () => import ("@views/feature-project/build-feature")
const ExtractFeature = () => import ("@views/feature-project/extract-feature")
const FeatureCode = () => import ("@views/feature-project/feature-code")
const FeatureStandard = () => import ("@views/feature-project/feature-standard")
const ModelBuildIndex = () => import ("@views/model-build/index")
const ModelCommentIndex = () => import ("@views/model-comment/index")
const ModelForecastIndex = () => import ("@views/model-forecast/index")
const ModelForecastMain = () => import ("@views/model-forecast/main")
const MakeTemplateIndex = () => import ("@views/make-template/index")

let routes = [
    {
        path:'*',
        redirect:'/home'
    },
    {
        path:'/',
        redirect:'/home'
    },
    {
        path: '/home',
        name:'home',
        component: Home,
        meta:{"title":"工程主页"}
    },
    {
        path: '/login',
        name:'login',
        component: Login,
        meta:{"title":"登录"}
    },
    {
        path: '/choose/chooseOne',
        name:'chooseOne',
        component: ChooseOne,
        meta:{"title":"新建工程第一步",keepAlive:true}
    }
    ,
    {
        path: '/choose/chooseTwo',
        name:'chooseTwo',
        component: ChooseTwo,
        meta:{"title":"新建工程第二步"}
    },
    {
        path: '/choose/chooseThree',
        name:'chooseThree',
        component: ChooseThree,
        meta:{"title":"新建工程第三步"}
    },
    {
        path: '/watch-feature/main',
        name:'watchFeatureMain',
        component: WatchFeatureMain,
        meta:{"title":"观察特征"}
    },
    {
        path: '/feature-project',
        name:'featureProjectMain',
        component: FeatureProjectMain,
        children: [
            {path: 'index', component: FeatureIndex,meta:{"title":"特征工程"}},
            {path: 'important/:type', component: FeatureImportant,meta:{"title":"重要度筛选"}},
            {path: 'linear', component: FeatureLinear,meta:{"title":"共线性"}},
            {path: 'buildFeature', component: BuildFeature,meta:{"title":"构建特征"}},
            {path: 'extractFeature', component: ExtractFeature,meta:{"title":"特征抽取"}},
            {path: 'featureCode', component: FeatureCode,meta:{"title":"特征编码"}},
            {path: 'featureStandard', component: FeatureStandard,meta:{"title":"特征标准化"}},
        ],
        meta:{"title":"特征工程"}
    },
    {
        path: '/model-build/index',
        name:'modelMakeIndex',
        component: ModelBuildIndex,
        meta:{"title":"模型构建"}
    },
    {
        path: '/model-comment/index',
        name:'modelCommentIndex',
        component: ModelCommentIndex,
        meta:{"title":"模型评价"}
    },
    {
        path: '/model-forecast/index',
        name:'modelForecastIndex',
        component: ModelForecastIndex,
        meta:{"title":"模型预测"}
    },
    {
        path: '/model-forecast/main',
        name:'modelForecastMain',
        component: ModelForecastMain,
        meta:{"title":"模型预测结果"}
    },
    {
        path: '/make-template/index',
        name:'makeTemplateIndex',
        component: MakeTemplateIndex,
        meta:{"title":"制作模板"}
    },
]

export default new Router({
    mode:'history',
    routes:routes,
})