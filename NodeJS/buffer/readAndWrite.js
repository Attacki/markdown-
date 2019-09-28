var mime = "image/png";
var encoding = "base64"
var fs = require('fs')
var data = fs.readFileSync('./70.png').toString(encoding)

var uri = "data:"+mime+";"+encoding+","+data;
console.log(uri)
var buf = Buffer(data,'base64')
fs.writeFileSync('70.test.png',buf)