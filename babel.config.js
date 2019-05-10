module.exports = {
    "presets": [
        ["@babel/preset-env", {
            "modules": false,
            "targets": {
                "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
            },
            //"useBuiltIns": true,//配置babel-polyfill
            // "debug": true
        }]
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        "dynamic-import-webpack",//动态组件加载
    ]
}