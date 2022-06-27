// How to hash string with md5 function in Node.js ?
// taking input from the console

const prompt = require('prompt');
const md5 = require('md5');
const password = "shailesh";
// hashing();
// function hashing(){
//     console.log("inside");
//     prompt.start();
//     prompt.get(["password"], (err, res) => {
//         if(err) {
//             console.log(err);
//         } else {
//             const hash = md5(res.password);
//             console.log("hashed: ", hash);
//         }
//     });
// }

console.log(md5(password));