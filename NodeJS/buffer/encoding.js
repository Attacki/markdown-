var fs= require('fs')
// fs.readFile('test.js',(err,data)=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log(data.toString('ascii'))
//     }
// })

var buf = Buffer.alloc(5,'兔'+':'+'am9obm550mMtvmFk','ascii') //使用字符串创建buffer的时候，默认为utf8编码
// var encode  = buf.toString('utf8')
// console.log(encode) //rabbi
console.log(buf)    //<Buffer 72 61 62 62 69>
fs.writeFile('test.txt',buf,'ascii',(err)=>{
    console.log(err)
})