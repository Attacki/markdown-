## buffer（16进制）

- 缓冲区buffer是暂时存放输入输出数据的
- js语言没有二进制数据类型，而在处理TCP和文件流的时候，必须要处理二进制数据
- NodeJS提供了一个buffer对象来提供对二进制数据的操作
- 是一个表示固定内存分配的全局对象，也就是说要放到缓存区中的字节数需要提前选定
- buffer好比由一个多位字节元素组成的数组，可以有效的在js中表示二进制数据

## 编码格式
`ASCII码`
- ASCII码是起源，看百科可知它主要用于编码拉丁字符。ASCII一个字符用1个字节，1个字节是8位，所以总共能编出256个字符。最高位是0的有128个字符编码，一般都是一些字母、数字、标点符号之类的自然语言中用到的东东，最高位是1的也有128个，一般都是一些符号、图形神马的。
`gb2312`
- gb2312就是国标2312，是我国在计算机逐渐普及的初期，为了在计算机系统上使用汉字而开发的字符编码，用2个字节编码一个汉字（包括标点符号、拼音符号、偏旁部首等等）。gb2312将人类文明发展加速了20年，甚至现在unicode、GBK、gb18030等编码出现后，gb2312仍有强大的生命力。
`unicode`
- unicode：是国外几个it业界的大鳄为了更好地在计算机系统上使用全世界各种语言、各种行业中的字符而开发的编码方案，unicode使用更多的字节进行编码，因此涵盖的字符量更大。
`base64`
- base64是因为互联网发展而出现的。如果你用过RS232之类的连接线（比如串口、Modem等），在配置参数里会发现有7位、8位的选择项。那是因为最早的通信系统在数据链路层是按照7位来进行编码的（实际上也是8位，但是最高位被置零，作为电子线路识别高/低电平所代表的一串0/1数据的边界的一个电气特征）。当电子邮件、web网页等互联网应用出现后，由于人们使用的自然语言（那时主要是英语）是用ASCII编码的，前面说了ASCII使用一个字节全部的8位，这样如果直接传输，就会被网关、路由器等设备把一个字节的最高为置零，从而影响传输内容的正确性。于是出现了base64编码，相信你读过百科的介绍了，它把3个字节编码成4个字节，最后得到的都是256个ASCII码中最高位为0的前128个字符，这样在传输中就不受网络设备的影响了。在接收端，经过解码，读到的是正确的内容。

## 字节
- 1024b = 1k
- 8bit（8个二进制） = 1b  （1bit就是0或1）
- 字节是通过网络传输信息的单位
- 1个汉字（3个b）
- 1个字节最大值十进制是255
- 1个字节最大转换成16进制是ff

## buffer创建
1. 通过长度创建
```js
// 100个字节长度 相对这种方法比较耗性能
var buffer = Buffer.alloc(100);
// 不安全
var buffer = Buffer.allocUnsafe(100);
// 把数组转化为buffer
var buffer = Buffer.from([17,18,19]);//会自动把10进制转化为16进制
console.log(buffer); // <Buffer 11 12 13>
// 把字符串转换成buffer
var buffer = Buffer.from('每个汉字三个字节');//转换为buffer后，长度为buffer的长度
console.log(buffer.length); // 12
console.log(buffer.toString()); // '每个汉字三个字节'
```

> fill方法
```js
var buffer = Buffer.allocUnsafe(100);
buffer.fill(0);
console.log(buffer);
```
> slice方法 （截取，克隆：深（递归循环、parse(string)），浅（slice、assign、{...{}}））
- 深拷贝 两个对象长得一样但毫无关系
- 浅拷贝 两个对象中存放的空间是一样的
- Object.assign() 浅拷贝对象
```js
var buffer = Buffer.from([1,2,3]);
var newBuffer = buffer.slice(0,1); //拷贝出来的存放的是内存地址空间
newBuffer[0] = 100
console.log(buffer);
```

```js
var buf1 = Buffer.from('权利');
var buf2 = Buffer.from('游戏');
var buf = Buffer.allocUnsafe(12);
//拷贝buffer(copy)
// targetBuffer目标buffer，targetStart目标的开始，sourceStart源的开始，sourceEnd源的结束 this.length
buf1.copy(buf,0);
buf2.copy(buf,6);
console.log(buf.toString);
//连接buffer
console.log(Buffer.concat([buf1,buf2]).toString());
Buffer.cusConcat = function(list,totalLength){
    // 1.判断长度是否传递，有就用传递的，没有就自己算总长度
    if(typeof totalLength === "undefined")){
        totalLength = list.reduce((prev,next)=>prev+next.length,0);
    }
    // 2.通过长度创建相应的buffer Buffer.alloc(len)
    let buffer = Buffer.alloc(totalLength);
    // 3.循环list将每一项拷贝到buffer上
    let offset = 0
    list.forEach(buf=>{
        if(!Buffer.isBuffer(buf)) throw new Error('not buffer')
        buf.copy(buffer,offset);
        offset += buf.length;
    })
    // 4.如果长度过长 fill(0) 或者可以采用slice截取有效长度
    // 5.返回一个新buffer
    return buffer.slice(0,offset)
}
```

## buffer进制转换
- base64 进制转化
- 10-> 16 2 8 
- 16 2 8 -> 10
```js
let buf = Buffer.from('爱');
// 把一个汉字24位，转换成4个字节，每个字节就6位，其余两位补零
// 1.把16进制转换为2进制
console.log(buf) // Buffer e7 88 b1
console.log((0xe7).toString(2))
console.log((0x88).toString(2))
console.log((0xb1).toString(2))
// 11100111 10001000 10110001
// 00111001 00111000 00100010 00110001 
// 2.将这些值转化为10进制 去可见编码中取值
console.log(parseInt('00111001',2))//从二进制转为十进制
console.log(parseInt('00111000',2))
console.log(parseInt('00100010',2))
console.log(parseInt(0b00110001))
// 57 56 34 49
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
str += 'abcdefghijklmnopqrstuvwxyz';
str += '0123456789';
str += '+/';
// 计算汉字 "爱" 的base64
console.log(str[57]+str[56]+str[34]+str[49]);
```
