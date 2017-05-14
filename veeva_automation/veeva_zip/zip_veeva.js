var archiver = require('archiver');
var fs = require("fs");
var path = require("path");

var config = fs.readFileSync("zip_veeva.json");
config = JSON.parse(config.toString());
var reject = config.reject;

if (process.argv.length != 3) {
    console.log("请传入一个有效的参数（要处理的文件路径）");
    return;
}

var first_folder_arr = fs.readdirSync(process.argv[2]);
(function veeva_zip(j) {
    if (j == first_folder_arr.length) {
        console.log("已完成100%");
        return;
    }
    var first_folder = path.join(process.argv[2], first_folder_arr[j]);

    //要排除的文件夹
    if (reject.indexOf(first_folder_arr[j]) != -1) {
        console.log('已完成' + parseInt(100 * j / first_folder_arr.length) + "%");
        veeva_zip(j + 1);
        return;
    }

    var stats = fs.statSync(first_folder);
    if (stats.isDirectory()) {
        var output_name = first_folder + '.zip';
        var new_output_name = path.join(first_folder, first_folder_arr[j]) + '.zip';
        //删除原有的压缩包
        var has_file = fs.existsSync(new_output_name);
        if (has_file) {
            fs.unlinkSync(new_output_name);
        }
        // 创建一最终打包文件的输出流
        output = fs.createWriteStream(output_name);
        //生成archiver对象，打包类型为zip
        var archive = archiver('zip');
        //将打包对象与输出流关联
        archive.pipe(output);

        output.on('close', function() {
            fs.renameSync(output_name, new_output_name);
            console.log('已完成' + parseInt(100 * j / first_folder_arr.length) + "%");
            veeva_zip(j + 1);
            // return;
        });
        archive.directory(first_folder, '');
        //打包
        archive.finalize();
    } else {
        veeva_zip(j + 1);
    }
})(0)