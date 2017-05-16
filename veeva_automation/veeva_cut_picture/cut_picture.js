var gm = require('gm');
var fs = require("fs");
var path = require("path");
var Horseman = require('node-horseman');


var cut_array = [];

var first_folder = fs.readdirSync("./");
for (var i = 0; i < first_folder.length; ++i) {
    var stats = fs.statSync(first_folder[i]);
    if (stats.isDirectory()) {
        var second_folder = fs.readdirSync(first_folder[i]);
        for (var j = 0; j < second_folder.length; ++j) {
            var stats_2 = fs.statSync(path.join(first_folder[i], second_folder[j]));
            if (stats_2.isDirectory()) {
                var third_folder = fs.readdirSync(path.join(first_folder[i], second_folder[j]));
                for (var k = 0; k < third_folder.length; ++k) {
                    var stats_3 = fs.statSync(path.join(first_folder[i], second_folder[j], third_folder[k]));
                    if (stats_3.isFile()) {
                        var extname = path.extname(path.join(first_folder[i], second_folder[j], third_folder[k]));
                        if (extname == ".html") {
                            if (third_folder[k] == "index.html") {
                                cut_array.push('./' + first_folder[i] + '/' + second_folder[j] + "/" + third_folder[k]);
                            }
                        }
                    }
                }
            }
        }
    }
}

var num = 0;

(function cut(num) {
    if (num == cut_array.length) {
        console.log("全部完成！100%");
        return;
    }
    var dirname = path.dirname(cut_array[num]);
    var horseman = new Horseman();
    horseman
        .viewport(200, 150)
        .open(cut_array[num])
        .wait(1000)
        .screenshot(dirname + "/" + '/thumb.png')
        .then(function() {
            horseman.close();
            gm(dirname + "/" + '/thumb.png')
                .resize(200, 150, '!')
                .write(dirname + '/thumb.png', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("已完成" + parseInt((100 * num / cut_array.length)) + "%");
                        cut(num + 1);
                    }
                });
        })
})(0)