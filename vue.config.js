const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    outputDir: 'www',
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    productionSourceMap: false,
    // configureWebpack:{
    //     optimization: {
    //         minimizer: [
    //             new UglifyJsPlugin({
    //                 uglifyOptions: {
    //                     compress: {
    //                         warnings: false,
    //                         drop_console: true,//console
    //                         drop_debugger: false,
    //                         pure_funcs: ['console.log']
    //                     }
    //                 }
    //             })
    //         ]
    //     }
    // }
};
