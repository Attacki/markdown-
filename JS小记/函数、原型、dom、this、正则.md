#原型
- Div->HtmlDivElement->Element->Node->EventTarget

#函数的三种角色
1. 函数
2. 对象
3. 所有函数都是Function的实例，Object是所有对象的原型
```js
function Fn(){
    this.x = 100
}
Fn.prototype.getX = function(){
    console.log(this.x)
}
var f = new Fn;
// 函数本身也会有一些自己的属性
// length:0 形参个数
// name 函数名
// prototype  类的原型，在原型上定义的方法都是当前Fn这个类实例的公有方法
// __proto__  把函数当作一个普通的对象,指向Function这个类的原型

// 函数有多种角色：
// 1. 普通函数： 函数执行的时候就会产生一个私有的作用域，栈内存。 形参赋值 预解释 代码逐行执行  闭包 内存释放问题
// 2. 构造函数(类): new 实例  实力！！ 构造函数中的this是当前实例 return问题
// 3. 任何一个函数都是Function这个类的一个实例，那么任何一个函数实例都可以调用(__proto__)定义在Function这个类原型上的所有属性和方法
```
### Call方法
- call方法是定义在Function.prototype的方法。任何一个函数我们都可以认为它是Function这个类的一个实例。通过实例的__proto__属性找到所属类的原型。任何一个函数都可以调用call和apply等方法 eg: Object.prototype.toString.call(); 强制改变this关键字的 
- 函数实例找到call方法执行，call的执行过程中把调用call方法这个函数实例中的this都改变成call的第一个参数。接下来再把调用call方法的这个实例函数执行
```js
function fn() { //是Function这个类一个实例
    console.log(this); //obj
}
//fn(); //?? this==>window
var obj = {
    fn: fn
}
//obj.fn();//this ==> obj
//fn.call(obj); 
// 1 找到call方法并且运行  2 在运行之前把调用call方法的fn这个函数中的this都修改成call的参数，也就是obj  3 执行fn

Function.prototype.myCall = function (obj) {
    //1. 把这个函数体内的this都改成obj这个参数
    // eval 中函数作为字符串被定义需要“（”和“）”作为前缀和后缀
    // eval('('+this.toString().replace('this','obj')+')')
    //2. 执行fn就是this执行
    this()
}
function fn1(){console.log(1)}
function fn2(){console.log(2)}
fn1.call.call(fn2)  //2
// fn1.call和fn1.call.call代表的事同一个方法，然后call方法中的this替换成了fn2

Function.prototype.call(fn1);//执行的是空函数

```

# 正则作用:
- 正则：用来处理字符串的规则
- 匹配：判断一个字符串是否符合我们制定的规则
```js
var reg = /\d/; //包含一个0-9之间的数字
console.log(reg.test('start'));  //false
console.log(reg.test('1'));  // true
console.log(reg.test('start5435'));  //true
```

- 捕获：把字符串中符合我们正则规则的内容捕获到 -> exec：reg.exec(str)
```js
var reg = /\d/; //包含一个0-9之间的数字
console.log(reg.exec('start'));  // null
console.log(reg.exec('1'));  // ["1", index: 0, input: "1", groups: undefined]
```


# 如何创建正则:
正则的两种创建方式是有区别的,每一个正则表达式都是由元字符和修饰符组成的
```js
//字面量方式：
var reg = /\d/; //包含一个0-9之间的数字
//实例创建方式
var reg = new RegExp('');
```


1. **具有特殊意义的元字符**

|元字符|在//之间具有意义的一些字符|
|:--:|:--|
|\\ |转义字符，转译后面字符所代表的含义         |
|^  |	以某个元字符开始（匹配中是不占位置的）  |
|$  |以某个元字符结尾（匹配中是不占位置的）     |
|\n |	匹配一个换行符                          |
|.  |	除了\n以外的任意字符                    |
|() |	分组 把一个大正则本身划分成几个小正则   |
|\d | 	一个0-9之间的数字 [0-9]                 |
|\D |	除了0-9之间的数字以外的任何字符         |
|\b |	匹配一个边界符                          |
|\w |	数字、字母、下划线中的任意一个字符  [0-9a-zA-Z_]|
|\s |	匹配一个空白字符，空格、制表符、换页符...       |
|x|y|	x或者y中的一个                          |
|[xyz]  |		x、y、z中的一个                 |
|[^xyz] |	除了三个以外的任何一个字符          |
|[a-z]  |	a-z之间的任何一个字符               |
|[^a-z] |	除了a-z之间的任何一个字符           |


2. **代表出现次数的量词元字符**

|量词元字符 |含义   |
|:--:       |:--    |
|*  |出现零到多次   |
|+  |出现一到多次   |
|?  |出现或者不出现 |
|{n}|出现n次        |
|{n,}|出现n到多次   |
|{n,m}|出现n到m次   |

```js
var reg = /^\d$/; //只能是一个0-9之间的数字
var reg = /^\d+$/; 
reg.test('12345'); //true
reg.test('1fdgdf2');//false
// .元字符
var reg = /^\d.+\d$/;
reg.test('1fdgdf2'); //true
// () 分组
var reg = /^(\d+)nihao(\d+)$/;
reg.test('1213fdgdf546');//false
reg.test('1213nihao546');//true
```

# 注意
- []
    1. 在中括号中出现的所有字符都是代表本身意思的字符
    2. 中括号中不识别二位数
    ```js
    var reg = /^[12-68]$/; //1、2-6或者8中的一个
    var reg = /^[\w-]]$/; //数字、字母、下划线、-中的一个
    ```

- ()
    1. 改变x|y的默认优先级
    2. /a+/ 表示连续出现 a ，而需要连续出现 ab，则需要 /(ab)+/
    3. 在多选分支结构(p1|p2)中，括号的作用是提供了子表达式的所有可能
    4. 一般情况下分组的作用是为了引用或者重复出现分组或者分支结构
    ```js
    var reg = /^i love (javascript|regular expression)$/
    console.log(reg.test('i love javascript'));
    console.log(reg.test('i love regular expression'));
    // true
    // true
    reg = /(\d{4})-(\d{2})-(\d{2})/
    var reg = /^18|19$/;
    //18、19、181、1819、119、18
    var reg = /^(18|19)$/;
    //18、19x
    ```

# 正则的应用

1. 有效数字的正则  正则、负数、零、小数
```js
//"."可以出现也可以不出现，一旦出现，就必须跟一位或多位数字
//最开始可以有+/-也可以没有
//整数部分，一位数可以是0-9之间的一个，多位数不能以0开头
var reg = /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/
```
2. 正则的创建方式
> 在字面量中，//之间包起来的所有字符都会是元字符，有的有特殊意义，大部分都代表本身含义的普通元字符
```js
var name = "attacki";
var reg = /^\d+"+name+"\d+$/;
reg.test('2019attacki2019'); //false
reg.test('2019"""nameeee"2019'); //true
//对于这种正则需要用实例创建方式
var reg = new RegExp("^\\d+"+ name + "\\d+","g");
reg.test('2019attacki2019'); //true

// 字面量方式和实例创建的方式在正则中的区别？
// 字面量方式中出现的一切都是元字符，所以不能进行变量拼接。
// 而实例创建方式是可以的,字面量方式直接写\d就可以，而在实例中需要把它转义 \\d
```
3. 年龄介于18-65  18-19 20-59 60-65
```js
var reg = /(1[8-9]|[2-5]\d|6[0-5])/;
```
4. 验证邮箱
```js
var reg = /^[\w.-]+@[0-9a-z-A-Z]+(\.[A-Za-z]{2,4}){1,2}$/;
```
5. 中国标准真实姓名 2-4位
```js
var reg = /^[\ue400=\u9fa5]{2,4}$/
```

6. 身份证号码 
```js
var reg = /^\d{17}(\d|X)$/
//正则的捕获
var reg = /^(\d{2})(\d{4})(\d{4})(\d{2})(\d{2})(\d{2})(\d)(\d|X)$/;
```

7. 把数字替换为汉字数字
```js
var str = "20190328";
var ary =['零','一','二','三','四','五','六','七','八','九'];
str = str.replace(/\d/g,function(){
    return ary[arguments[0]];
})
```

8. 获取一个字符串中出现次数最多的字符，并且获取出现次数
```js
var str = "jesus love person, he is the son of god";
var obj ={};
str.replace(/\w|,/gi,function(){
    var val = arguments[0];
    obj[val] >= 1 ? obj[val]++ : obj[val] = 1;
});
//获取最多的次数
var maxNum = 0;
for(var key in obj){
    obj[key] > maxNum ? maxNum = obj[key]:null;
}
//把所有符合出现maxNum次数的都获取到
var ary = [];
for(var key in obj){
    obj[key] === maxNum ? ary.push(key):null;
}
console.log(obj,ary);
```

9. 模版引擎实现的初步原理
```js
var str = 'my name is {0} ,my love is {1}';
var ary = ["attacki",'miao'];
str = str.replace(/{(\d+)}/g,function(){
    return ary[arguments[1]];
});
```

10. 把字符串中所有单词首字母变为大写

11. queryUrlParamter
```js
var  str = 'http://kbs.sports.qq.com/game?mid=1000&cid=1454&app=1.0';
var reg =/([^?=&]+)=([^?=&]+)/;
var obj = {};
str.replace(reg,function(){
    obj[arguments[1]] = arguments[2];
})
console.log(obj);
```

12. 时间格式化
```js
var str = "2015-5-16 14:53:00";
var reg = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
var ary = [];
str.replace(reg,function(){
    ary = ([].slice.call(arguments)).slice(1,7);
})
//设定好时间格式，把数组中内容替换到指定区域
var resStr = "{0}年{1}月{2}日 {3}时{4}分{5}秒";
str = str.replace(/{(\d+)}/g,function(){
    var val = ary[arguments[1]];
    val.length === 1 ? val='0'+val:null;
    return val;
})
```

13. 数据类型检测
```js
typeof		用来检测数据类型的运算符
console.log(typeof 12);
//typeof返回的都是字符串，其中包含对应数据类型
// string number boolean undefined function object
//局限性，不能具体细分是数组、正则还是对象中的其他值。 typeof null === "object"
//使用逻辑或、逻辑与 替代typeof
function(num1,num2){
    if(typeof num2==='undefined'){num2 = 0};
    num2 = num2 || 0;
}
function(callback){
    if(typeof callback==='function'){callback()};
    callback && callback();
}
```

### instanceof		检测某一个实例是否属于某个类
```js
var obj = [];
console.log(obj instanceof Array);
console.log(obj instanceof RegExp);
//1、不能用instanceof 检测基本数据类型的值，因为字面量创建和实例创建的结果分别为false和true。
//对于字面量创建的结果是基本的数据类型，不是严谨的实例，但是由于JS松散特点，可以使用Number.prototype上的方法；
//2、只要在当前实例的原型链上，用instanceof检测的结果都是true
```

### constructor	构造函数，先找私有的，私有没有再找原型
```js
//constructor 和 instanceof非常相似
var obj = [];
console.log(obj.constructor === Array); //true
console.log(obj.constructor === RegExp); //false
//constructor 可以处理基本数据类型
var num = 1;
console.log(num.constructor === Number);
//contsructor检测Object和instanceof不一样，一般情况是检测不了的
var reg = /^$/;
console.log(obj.constructor === RegExp); //true
console.log(obj.constructor === Object); //false
//局限性：类的原型可以进行重写，重写的时候很有可能吧constructor覆盖掉，导致检测结果不准确。
```

### Object.prototype.toString.call() （准备的常用方法）
```js
//Object.prototype.toString他的作用是返回当前方法执行主题（方法中this）所属类的信息
var obj = {name:'miao'};
console.log(obj.toString());
//toString中的this是obj，返回的事obj所属类的信息 ->"[object Object]" 
//第一个object代表当前实例是对象数据类型的(这个是固定死的)，第二个Object代表的事obj所属的类是Object
Math.toString();//"[object Math]"

//检测数据类型
var ary = [];
console.log(Object.prototype.toString.call(ary)==="[object Array]");//true
var reg = /^\[object Array\]$/;
console.log(reg.test(Object.prototype.toString.call(ary)));//true
```

### toString的理解
```js
对于Number、String、Boolean、Array、RegExp、Date、Function原型上的toString方法都是把当前数据类型转化为字符串。
Object上的toString不是用来转换字符串的
console.log((1).toString());//Number.prototype.toString转换为字符串 ，可以接受进制参数
console.log((1).__proto__.__proto__.toString());//Object.prototype.toString,[object Object]
```


### exec 正则的捕获
- 捕获的内容格式，匹配成功才有内容，匹配失败结果为null
#### 捕获的内容是一个数组。
> 第一项是当前大正则捕获的内容，  
> index：捕获内容在字符串中开始的索引位置  
> input：捕获的原始字符串
#### 正则捕获的特点
    > 懒惰性：每次执行exec只捕获第一个匹配的内容，在不进行任何处理的情况下，再执行多次捕获，捕获的还是第一个匹配内容。  
    > 正则里面有lastIIndex属性：是正则每次捕获字符串开始查找的位置，默认是0
    ```js
    var reg = /\d+/;
    var str = "AE86AE";
    var res = reg.exec(str); //["86", index: 2, input: "AE86AE", groups: undefined]
    console.log(reg.lastIndex);//  0
    res = reg.exec(str); //["86", index: 2, input: "AE86AE", groups: undefined]
    console.log(reg.lastIndex);//  0 说明第二次捕获还是从0开始查找的 
    ```
    - 去除正则的懒惰性，可以在正则后面加修饰符
    
    |修饰符|g、i、m|
    |:--:|:--|
    |global（g）    |全局匹配       |
    |ignoreCase（i）|忽略大小写 |
    |multiple（m）  |多行匹配     |
    ```js
    var reg = /\d+/g;
    var str = "AE8666666AE89AE";
    var res = reg.exec(str);
    console.log(reg.lastIndex);//  9
    res = reg.exec(str);
    console.log(reg.lastIndex);//  13
    //把所有捕获内容放在数组当中
    var str2 = 'AE86AE87AE89';
    var ary = [];
    var res = reg.exec(str2);
    while(res){
        ary.push(res[0]);
        res = reg.exec(str2);
    }
    console.log(ary);//["86", "87", "89"]
    ```
    
    - 正则的每一次捕获都是按照匹配最长的结果捕获的。
    > 例如：8符合正则，86、87、89也符合，默认捕获的就是86、87、89
    - 取消正则的贪婪性，在量词元字符后面加"?"
    > ?在正则中有很多作用：  
    > 放在普通元字符后面代表出现或者不出现  
    > 放在量词元字符后面代表取消捕获的贪婪性  
    ```js
    var reg =/\d+?/g;
    //字符串中的match方法 ->把所有符合正则匹配的字符都捕获到
    var str2 = 'AE86AE87AE89';
    var ary = str2.match(reg); // ["8", "6", "8", "7", "8", "9"]
    ```

#### 正则分组捕获
    - 改变分组优先级
    - 分组引用
`\1代表和第一个分组出现一模一样；\2代表和第二个分组出现一模一样；`

```js
var reg = /(\w)\1(\w)\2/;
console.log(reg.test('aaee')); //true   
```
`分组捕获 正则捕获的时候，可以把大正则和小分组匹配的内容分别捕获`
> (?:) 	 在分组中?:的意思是只匹配不捕获

```js
var str = "411325199301270437";
var reg = /^(\d{2})(\d{4})(\d{4})(\d{2})(\d{2})(\d{2})(\d)(?:\d|X)$/;
var ary = reg.exec(str)
//ary[0] ->大正则匹配的内容
//ary[1] ->第一个分组匹配的内容
console.log(str.match(reg));//和exec捕获的内容是一样的

reg = /AE(\d+)/g;
str = "AE86AE87AE89";//match只能捕获大正则的内容
```

`replace:把原有的字符替换为新字符`
> 在不使用正则的情况下，每当执行一次只能替换一次
```js
var str = "lovejesus2018lovejesus2019";
str = str.replace("love","lovejesus").replace("love","lovejesus"); 
//"lovejesusjesusjesus2018lovejesus2019"
str = str.replace(/love/g,"lovejesus"); 
//"lovejesusjesus2018lovejesusjesus2019"
//replace方法的第二个参数可以是一个函数
var str = "love2018love2019";
str = str.replace(/love/g,function(){
    console.log(arguments);
    return "lovejesus";
})
//第二个参数换成一个函数
//1）匿名函数执行多少次，取决于正则捕获的次数
//2）每一次执行匿名函数，里面得到的argumens和exec方法捕获的内容非常相似
//(即使正则有分组，同样可以通过arguments获取到分组捕获的内容)
//3）把大正则捕获的内容替换为return的内容
```
