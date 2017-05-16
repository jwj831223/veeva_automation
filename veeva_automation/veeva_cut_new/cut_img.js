var webshot = require("webshot");
var gm = require('gm');
var fs = require("fs");
var path = require("path");

var cut_array = [];

if (process.argv.length != 3) {
    console.log("请传入一个有效的参数（要处理的文件路径）");
    return;
}

var first_folder_arr = fs.readdirSync(process.argv[2]);

for (var i = 0; i < first_folder_arr.length; ++i) {
    var first_folder = path.join(process.argv[2], first_folder_arr[i]);
    var stats = fs.statSync(first_folder);
    if (stats.isDirectory()) {
        var second_folder_arr = fs.readdirSync(first_folder);
        for (var j = 0; j < second_folder_arr.length; ++j) {
            var second_folder = path.join(first_folder, second_folder_arr[j]);
            var stats = fs.statSync(second_folder);
            if (stats.isFile()) {
                var extname = path.extname(second_folder);
                if (extname == ".html") {
                    cut_array.push(second_folder);
                }
            }
        }
    }
}


var source_html = "";
var target_img = "";

var options = {
    phantomPath: "C:\\Users\\siyu.chen\\Downloads\\phantomjs-2.1.1-windows\\bin\\phantomjs.exe",
    siteType: "file",
    windowSize: {
        width: 1024,
        height: 768
    },
    streamType: "png",
    renderDelay: 1000
};

(function cut_img(i) {
    if (i == cut_array.length) {
        console.log("已完成100%");
        return;
    }
    source_html = cut_array[i];
    target_img = path.join(path.dirname(source_html), "thumb.png");

    webshot(source_html, target_img, options, (err) => {
        if (err) {
            return console.log(err);
        }
        gm(target_img)
            .resize(200, 150, '!')
            .write(target_img, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("已完成" + parseInt((100 * i / cut_array.length)) + "%");
                    cut_img(i + 1);
                }
            });
    });
})(0);