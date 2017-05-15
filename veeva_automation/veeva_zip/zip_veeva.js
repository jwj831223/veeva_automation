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


// 判断存压缩包的文件夹是否存在，如果不存在则创建
var target_path = path.join(process.argv[2], "aaaaa_file_zip");
var has_target_path = fs.existsSync(target_path);
if (!has_target_path) {
    fs.mkdirSync(target_path);
}



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
        var temporary_output_zip = first_folder + '.zip';
        var self_zip = path.join(first_folder, first_folder_arr[j]) + '.zip';
        var target_path_zip = path.join(target_path, first_folder_arr[j]) + '.zip';
        //删除自己目录下的压缩包
        var has_file = fs.existsSync(self_zip);
        if (has_file) {
            fs.unlinkSync(self_zip);
        }
        //删除目标路径下的压缩包
        var has_file = fs.existsSync(self_zip);
        if (has_file) {
            fs.unlinkSync(self_zip);
        }

        // 创建一最终打包文件的输出流
        output = fs.createWriteStream(temporary_output_zip);
        //生成archiver对象，打包类型为zip
        var archive = archiver('zip');
        //将打包对象与输出流关联
        archive.pipe(output);

        output.on('close', function() {
            fs.renameSync(temporary_output_zip, target_path_zip);
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