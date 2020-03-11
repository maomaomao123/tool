const gulp = require('gulp');
const del = require('del'); // 删除文件
const path = require('path'); // 路径
const autoprefixer = require('gulp-autoprefixer'); // css前缀
const htmlmin = require('gulp-htmlmin'); // html压缩
const stylus = require('gulp-stylus'); // styl文件编译
const jsonminify = require('gulp-jsonminify2'); // json压缩
const gutil = require('gulp-util'); // 打印输出的插件
const combiner = require('stream-combiner2'); // 事件流插件
const babel = require('gulp-babel'); // babel插件，编译es6的
const uglify = require('gulp-uglify'); // js压缩
const rename = require('gulp-rename'); // 重命名
const cleanCss = require('gulp-clean-css'); // css压缩
const runSequence = require('run-sequence'); // 事件流插件
const base64 = require('gulp-base64'); // 转化成base64
const imagemin = require('gulp-imagemin'); // 图片压缩
const pngcrush = require('imagemin-pngcrush'); // 深度压缩png图片的imagemin插件
const minimist = require('minimist'); // 获取环境变量参数
const fs = require('fs'); // 文件流
const cache = require('gulp-cached');
const argv = minimist(process.argv.slice(2));

/*
    为了统一打包前后都是constants，所以以src/config/constants为模板（修改也修改这个文件）
生成src/config/_constants文件，再constantsJs里修改成constants打包到dist文件夹内
file 源文件
_file 目标文件
*/
// const file = "./src/miniprogram/configs/constants.js";
// const _file = "./src/miniprogram/configs/_constants.js";

// const writeFile = (src, dist) => {
//     // 读取_constants内容
//     let dataSrc = fs.readFileSync(src, 'utf-8');

//     const str = `
//                 export default {
//                     API_HOST: apiHost.${argv.env}
//                 };`;

//     dataSrc += str;

//     // 写入_constants
//     fs.writeFile(dist, dataSrc, err => {
//         if (err)
//             console.log(`写入出错：${err}`);
//         else
//             console.log('成功写入环境变量constants');
//     });
// }

const colors = gutil.colors;
const errorHandle = err => {
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log(`fileName: ${colors.red(err.fileName)}`);
    gutil.log(`lineNumber: ${colors.red(err.lineNumber)}`);
    gutil.log(`message: ${err.message}`);
    gutil.log(`plugin: ${colors.yellow(err.plugin)}`);
};

// 清除dist文件夹的东西
gulp.task('clean', () => {
    del(['dist/**'])
});

gulp.task('appJson', () => {
    const combinedJson = combiner.obj([
        gulp.src(['./src/app.json', './src/**/**/*.json', './src/package/**/**/**/*.json'])
            .pipe(cache('appJson')),
        jsonminify(),
        gulp.dest('./dist')
    ]);
    combinedJson.on('error', errorHandle);
});

gulp.task('appJs', () => {
    const combinedJs = combiner.obj([
        gulp.src(['./src/app.js', './src/**/**/*.js', '../src/package/**/**/**/*.js'])
            .pipe(cache('appJs')),
        babel(),
        uglify({
            compress: true,
            // mangle: { except: ['require', 'exports', 'module', '_', 'config'] } // 排除混淆关键字
        }),
        gulp.dest('./dist')
    ]);
    combinedJs.on('error', errorHandle);
});


gulp.task('appWxs', () => {
    const combinedWxs = combiner.obj([
        gulp.src(['./src/**/**/*.wxs']),
        gulp.dest('./dist')
    ]);
    combinedWxs.on('error', errorHandle);
});

gulp.task('appWxss', () => {
    const combinedWxss = combiner.obj([
        gulp.src(['./src/app.styl', './src/**/**/*.styl', '!./src/assets/stylus/*.styl', '../src/package/**/**/**/*.styl'])
            .pipe(cache('appWxssting')),
        stylus(),
        autoprefixer(['last 2 versions', 'iOS >= 8', 'Android >= 4.0']),
        base64({
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
            maxImageSize: 1024 * 5,
            debug: false
        }),
        cleanCss({
            keepSpecialComments: '*'
        }),
        rename((path) => path.extname = '.wxss'),
        gulp.dest('./dist')
    ]);

    combinedWxss.on('error', errorHandle);
});

gulp.task('appWxml', () => {
    const combinedWxml = combiner.obj([
        gulp.src(['./src/**/**/*.wxml', '../src/package/**/**/**/*.wxml'])
            .pipe(cache('appWxml')),
        htmlmin({
            collapseWhitespace: true, // 压缩HTML
            removeComments: true, // 清除HTML注释
            keepClosingSlash: true // 保持元素末尾的斜杠
        }),
        gulp.dest('./dist')
    ]);

    combinedWxml.on('error', errorHandle);
});

gulp.task('images', () => {
    const combinedImages = combiner.obj([
        gulp.src('./src/**/**/*.{jpg,jpeg,png,gif,bmp}')
            .pipe(cache('images')),
        imagemin({
            optimizationLevel: 5, // 默认：3  取值范围：0-7（优化等级）
            progressive: true, // 默认：false 无损压缩jpg图片
            interlaced: true, // 默认：false 隔行扫描gif进行渲染
            multipass: true, // 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [pngcrush()] // 深度压缩png图片的imagemin插件
        }),
        gulp.dest('./dist')
    ]);

    combinedImages.on('error', errorHandle);
});

// 环境配置输出js
// gulp.task('constantsJs', () => {

//     writeFile(file, _file);
//     const combinedJs = combiner.obj([
//         gulp.src('./src/**/_constants.js'),
//         babel(),
//         uglify({
//             compress: true,
//             // mangle: { except: ['require', 'exports', 'module', '_', 'config'] } // 排除混淆关键字
//         }),
//         rename((path) => path.basename = 'constants'),
//         gulp.dest('./dist')
//     ]);
//     combinedJs.on('error', errorHandle);
// });

gulp.task('watch', () => {
    gulp.watch(['./src/app.json', './src/**/**/*.json'], ['appJson']);
    gulp.watch('./src/**/**/*.wxml', ['appWxml']);
    gulp.watch(['./src/app.styl', './src/**/**/*.styl', '!./src/assets/stylus/*.styl'], ['appWxss']);
    gulp.watch(['./src/app.js', './src/**/**/*.js'], ['appJs']);
    // gulp.watch('./src/configs/constants.js', ['constantsJs']);
    gulp.watch('./src/**/**/*.{jpg,jpeg,png,gif,bmp}', ['images']);
});

gulp.task('dev', ['appJson', 'appJs', 'appWxss', 'appWxml', 'images', 'appWxs', 'watch']);

gulp.task('build', ['clean'], () => {
    runSequence('appJson', 'appJs', 'appWxss', 'appWxml', 'images');
});

// help
gulp.task('help', () => {
    gutil.log(colors.yellow('启动'));
    gutil.log(`默认(内测): ${colors.green('npm run dev')}`);
    gutil.log(`公测: ${colors.green('npm run dev-beta')}`);
    gutil.log(`公测: ${colors.green('npm run dev-betav2')}`);
    gutil.log(`灰度: ${colors.green('npm run dev-abtest')}`);
    gutil.log(`正式: ${colors.green('npm run dev-release')}`);

    gutil.log(colors.yellow('打包'));
    gutil.log(`默认(内测): ${colors.green('npm run build')}`);
    gutil.log(`公测: ${colors.green('npm run build-beta')}`);
    gutil.log(`灰度: ${colors.green('npm run build-abtest')}`);
    gutil.log(`正式: ${colors.green('npm run build-release')}`);
});
