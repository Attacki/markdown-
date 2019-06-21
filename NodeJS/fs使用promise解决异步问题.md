## fs模块
```js
let fs = require('fs');
// 同步方法
// 1.读取文件 文件必须存在。不要用绝对路径，使用相对路径
// 2.读取默认类型有一个buffer
// 如果程序只在开始时执行一次 可以同步
let result = fs.readFileSync('fs.js','utf8');
console.log(result);

// 异步方法 
// 异步方案  会导致回调地狱，不方便维护
// readFile会把内容读到内存中，用这种方式会导致淹没内存。
fs.readFile('./buffer.md','utf8',function(err,data){ //错误是一个参数
    if(err)return console.log(err);
    console.log(data);
})
// 自己封装promise解决回调地狱 下面方法还不够好
// function read (url){
//     return new Promise((resolve,reject)=>{
//         fs.readFil(url,'utf8',function(err,data){
//             if(err){ reject(err)};
//             resolve(data);
//         })
//     })
// }
// 使用util工具
let util = require('util');
let read = util.promisify(fs.readFile);
read('./buffer.md','utf8').then(function(data){
    return read(data,'urf8');//如果第一个promise中返回了一个promise实例。会吧当前执行的结果传到下一个then
}).then(function(data){
    // 如果返回的不是promise实例，会把结果继续往下传递
    return data +'something';
}).then(function(data){
    console.log(data);
}).catch(function(err){
    // 处理错误，如果写了错误回调走自己的，没写一同走catch
    console.log(err);
})

// async await es7语法 node版本 7.9+
// await后面只能跟promise
async function result(){
    // 像同步一样的流程
    let content1 = await read('./buffer.md','urf8');
    let content2 = await read(content1,'utf8');
    let str = content2 + 'async';
};
result();
```

## 将两个异步请求在同一时刻内拿到结果，进行合并
```js
let obj = {};
// 假如a的内容是 777  b的内容是 999
// all方法的参数是一个可迭代的promise数组
// 调用all方法之后，会返回一个新的promise实例
Promise.all([read('./a.md','utf8')，read('./b.md','utf8')]).then(function(data){
    // data是一个数组类型 对应的是和前面请求的顺序相同（会把成功后的结果放在数组中），假如有一个失败，就走err
    console.log(data); // [777,999]
}).catch(err=>{})

async function result(){
    let [a,b] = await Promise.all([read('./a.md','utf8'),read('./b.md','utf8')]);
    console.log(a,b)
}
result();

// promise解决1.回调地狱 2.合并异步的返回结果 3.async await 简化promise的写法（语法糖）


Promise.race()
// 谁快用谁的，得到结果以后就结束了
// Promise类上拥有两个方法可以把结果保证成promise对象 resolve reject （上来就成功或者失败）
Promise.resolve('love').then((data)=>{
    return data
}).then(data=>{
    return data+'miao';
})
```


## 写入文件
```js
// 读取的类型都是buffer，写入的时候utf8
// 读取的文件必须存在，写的时候文件不存在会自动创建，里面有内容会覆盖掉
// 默认会对写入的内容调用toString方法

fs.writeFile('1.txt','love miao',function(err){
    console.log(err);
})

```
