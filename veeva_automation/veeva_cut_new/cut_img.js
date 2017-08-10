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
    siteType: 'url',
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
    var source_thumb_path = source_html;
    var separator_last_ = my_lastIndexOf(source_html, "\\", 3);
    source_html = source_html.substring(separator_last_);
    // console.log(source_html)

    //本应该在配置文件中写入
    source_html = "http://127.0.0.1:3000" + source_html;
    source_html = source_html.replace(/\\/g, "/")
        // console.log(source_html)

    // //查找倒数第二条斜线的位置,只能够查找单个字母
    function my_lastIndexOf(searchvalue, letter, num) {
        var string_len = searchvalue.length;
        var j = 0; //用来记载查找到第几个需要的元素 
        for (var i = string_len; i > 0; --i) {
            if (letter == searchvalue[i]) {
                ++j;
                if (num == j) {
                    // 证明找到了第N个查找的字母
                    return i;
                }
            }
        }
    }

    target_img = path.join(path.dirname(source_thumb_path), "thumb.png");


    //如果原目录下存在缩略图将其删除
    // if (fs.existsSync(target_img)) {
    //     fs.unlinkSync(target_img);
    // }




    // console.log(source_html);
    // source_html = "http://127.0.0.1:3000/cut_test/CN_BAIFULE_EDA_2017_V1.0_SLIDE026/index.html"


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