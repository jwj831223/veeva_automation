// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: `您是否确认进行文件拷贝功能？
// 确认请输入'Y'  取消请输入'N'
// >`
// });

// rl.prompt();

// rl.on('line', (line) => {
//         var affirm = line.trim().substring(0, 1).toLocaleUpperCase();
//         switch (affirm) {
//             case 'Y':
//                 rl.close();
//                 break;
//             case 'N':
//                 rl.close();
//                 break;
//             default:
//                 rl.prompt();
//                 break;
//         }
//     })
//     .on('close', () => {
//         console.log('已取消');
//     })