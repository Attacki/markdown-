
# TypeScript 

## ts中的数据类型

- 布尔（boolean）
```ts
var bool:boolean = true;
```
- 数字（number）
```ts
var num:number = 123;
```
- 字符串（string）
```ts
var str:string = "some strs";
```
- 数组（array）
```ts
var arr1:string[] = ["love","sometihg"]; //第一种
var arr2:Array<number> = [11,22,33]; //第二种
var arr3:any[] = [123,"sdk"];//第三种
```
- 元组（tuple） 属于数组的一种
```ts
let arr:[number,string] = [527,"this is ts"];
```
- 枚举（enum） 用在某些状态如成功，失败等语义化代表
事先考虑到某一变量可能取的值，尽量用自然语言中含义清楚的单词来表示它的每一个值，这种方法称为枚举方法，用这种方法定义的类型称枚举类型。       
enum 枚举名{ 
    标识符[=整型常数], 
    标识符[=整型常数], 
    ... 
    标识符[=整型常数], 
} ;
```ts
enum Flag {success =1,error=0}
let s:Flag = Flag.success
console.log(s); // 1 

enum Color {blue,red,'orange'};
var c:Color=Color.red;
console.log(c);   //1  如果标识符没有赋值 它的值就是下标

enum Err {"undefined"=-1,"null"=-2,"success"=1}
var e:Err = Err.null;
console.log(e);

```
- 任意类型（any）
```ts
// 和es5的写法没有区别，比如获取dom对象的时候使用该类型
let box:any = document.getElementById("box");
box.style.color = "red";
```
- null和undefined 
```ts
// 其他（never类型）数据类型的子类型
// 定义了没有赋值就是undefined 赋值了可能为null
var num:number| undefined | null;
console.log(num); 
```
- void 
```ts
// typescript中的void表示没有任何类型，一般用于定义方法的时候方法没有返回值
function app():void{
    console.log("run")
}
```
- never
```ts
// 从不会出现的值，其中null和undefined属于never类型
// 这意味着生命never的变量只能被never类型所赋值
var a:never;
// a = 123; //错误的写法
a = (()=>{
    throw new Error("错误)
})()
```

## 函数

#### 函数定义方法
```ts
// 1.声明方法
    function getInfo(name:string,age:number):string{
        return `${name} ---- ${age}`
    }

// 2.匿名方法
    var getInfo2 = function(name:string,age:number):string{
        return `${name} ---- ${age}` 
    }
    alert(getInfo("土豆",27));

// 3.没有返回值的方法
    function fun3():void{
        console.log("没有返回值")
    }

// 4.方法可选参数
    // es5中的实参和形参可以不一样，但ts中必须一样，如果不一样就需要配置可选参数
    // 注意： 可选参数必须放在参数的最后面
    function getInfo3(name:string,age?:number):string{
        if(age){
            return `${name} --- ${age}`
        }else{
            return `${name} --- 没有年龄`
        }
    }
    // 只传入一个参数，不会报错
    alert(getInfo3("土豆")); // 土豆 --- 没有年龄   

// 5.默认可选参数 
    // es5不能设置默认参数
    function getInfo4(name:string,age:number=20):string{
        if(age){
            return `${name} --- ${age}`
        }else{
            return `${name} --- 没有年龄`
        }
    }
    alert(getInfo3("土豆"));// 土豆 --- 20

// 6.剩余参数
    // 三点运算符接受新参数传递的值
    function sum(a:number, ...result:number[]):number{
        var sum:number =a;
        for(var i=0; i<result.length;i++){
            sum+=result[i];
        }
        return sum;
    }
    alert(sum(1,2));

```

#### 函数重载
```ts
// ts中的重载，通过为一个函数提供多个函数类型定义来实现多种不同功能的目的
// ts为了兼容es5和es6重载的写法，和c#中有区别

// 参数个数不相同的函数重载
function getInfo(name:string):string;
function getInfo(name:string,age:number):number;
function getInfo(name:any,age?:any):any{
    if(age){
        return `我是${name}，我的年龄是${age}`;
    }else{
        return `我是${name}`;
    }
}
alert(getInfo("土豆"));
alert(getInfo("土豆",27));
```

#### 箭头函数
```ts
// 箭头函数中的this指向上下文
(()=>{console.log("真是狗啊")})();
```

## 类

1. 类的定义
```ts
class Person{
    public name:string; //表示公有属性
    constructor(name:string){ //构造函数 实例化类的时候出发的方法

    }
    intro():void{
        console.log(this.name)
    }
}
```

2. ts中类的继承，通过extends和super实现
```ts
class doctor extends Person{
    age:number;
    constructor(name:string,age:number){
        super(name); //初始化父类的构造函数
        this.age = age;
    }
    work():void{
        console.log("李正在工作...");
    }
}
var li = new doctor("Li",20);
```

3. 类里面的修饰符 ts中定义属性的时候提供了三个修饰符
```ts
// public: 公有 在当前类里面、子类、类外边都可以访问
// protected: 保护类型 在当前类里面、子类中可以访问，在类外部不能访问
// private: 私有 在当前类里面可以访问，子类、类外部都无法访问


// ES6 明确规定，Class 内部只有静态方法，没有静态属性
// 目前有一个静态属性的提案，使用static来对属性进行修饰
class Person{
    public name:string; // 在哪里都可以访问  public和省略没有区别 
    private name:string; // 在当前类和其子类中可以访问，外部无法访问
    constructor(name:string){

    }
}
```

4. 静态属性 静态方法
```ts
// ts中定义静态方法
class Person{
    public name:string; 
    private age:number; 
    static sex = "男";
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }

    run(){ //实例方法
        alert(`${this.name} 在跑步。`)
    }

    static print(){ // 静态方法 没有办法直接调用类里面的属性
        console.log(`该用户的性别为${ this.sex }。`)
    }
}

var p = new Person("土豆", 27);
Person.print();
```

5. 多态 父类定义一个方法不去实现，让继承它的子类去实现， 每一个子类又不同的实现
```ts
// 多态属于继承
class Ani{
    name:string;
    constructor(n:string){
        this.name = n;
    }
    eat():void{ // 具体吃什么不知道，让每一个继承它的子类去实现
        console.log("吃的方法");
    }
}

class dog extends Ani {
    constructor(n:string){
        super(n);
    }

    eat(){
        console.log(this.name + "啃骨头");
    }
}
```

6. 抽象类就是标准，它是提供其他类继承的基类，不能直接被实例化
```ts
// 用abstract关键字定义抽象类和抽象方法， 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
// abstract抽象方法只能放在抽象类里面

abstract class Animal{ 
    name:string;
    constructor(n:string){
        this.name = n;
    }
    abstract eat():any; //抽象方法在子类里面必须实现
}

class dog extends Animal {
    constructor(n:string){
        super(n);
    }
    eat(){ //抽象类的子类必须实现抽象类里面的抽象方法
        console.log(this.name + "啃骨头");
    }
}

```

## 接口
在面向对象的变成中，接口是一种规范的定义，定义了行为和动作的规范，在程序设计里面接口起到一种限制和规范
的作用。接口定义了某一批需要遵守的规范，接口不关心这些类的内部状态数据， 也不关心这些类里面方法的实现细节，他只规定这批类里必须提供某些方法，提供这些方法的类就可以满足实际需求。typescript中的接口类似于java，同时还增加了更灵活的接口类型，包括属性、函数、可索引和类等。

接口也是定义标准。

1. 属性接口：对json的约束
```ts
// 对批量方法传入参数进行约束
// 可选属性
interface FullName{
    age?:number, //代表是一个可选属性
    firstName:string,
    lastName:string
} 

function printName(name:FullName){
    // 必须传入对象 firstName lastName
    console.log(name.firstName +'-----'+name.lastName);
}
function printInfo(info:FullName){
    // 必须传入对象 firstName lastName
    console.log(info.firstName +'-----'+info.lastName+'-----'+info.age);
}
// 如果直接传递在调用函数是直接使用对象字面量，则只能包含这两个属性
// 如果是传递的实参，则只要实参中包含这两个属性就可以
// 传入的参数顺序可以不一样
var n = {
    age:20,
    firstName:"li",
    lastName:"ming"
}
// printName({
//     age:20,
//     firstName:"li",
//     lastName:"ming"
// }); //age那里会提示错误
printName(n);

// 接口例子：ajax封装
interface Config{
    type:string,
    url:string,
    data?:string,
    dataType:string;
}

function ajax(config:Config){
    var xhr = new XMLHttpRequest;
    xhr.open(config.url,'true');
    xhr.send(config.data);
    xhr.onreadystatechange = function(){
        if(xhr.readyState ==4 && xhr.status == 200){
            console.log('chenggong')
            if(config.dataType =="json"){
                JSON.parse(xhr.responseText)
            }else{
                console.log(xhr.responseText)
            }
        }
    }
}

ajax({
    type:"get",
    url:"www.nodejs.org",
    dataType:"json"
})
```

2. 函数类型接口：对方法传入的参数 以及返回值进行约束
```ts

// 加密的函数类型接口
interface introduction{
    (key:string,value:string):string;
}
var md5:introduction = function(a:string,b:string):string{
    return a+b
}
console.log(md5('lin','shuhao'));


```

3. 可索引接口：数组、对象的约束 （不常用）
```ts
// 可索引接口 对数组和对象的约束
interface UserArr{
    [index:number]:string
}
interface UserObj{
    [index:string]:string
}
var arr:UserArr = ["123",'ewe']
console.log(arr[0])
var arr2:UserObj = {name:'li'}

// 类类型接口：对类的约束和抽象类有点相似
interface Animal{
    name:string;
    eat(str:string):void;
}
class Dog implements Animal{
    public name:string
    constructor(n:string){
        this.name = n
    }
    eat(food:string):void{
        console.log(this.name + "吃" + food)
    }
}
var dog = new Dog("大黄")
dog.eat("骨头");
```

4. 接口扩展：接口可以继承接口
```ts
// 接口扩展：接口可以继承接口

interface Animal{
    eat(food:string):void;
}

interface Dog extends Animal{
    run():void;
}

class XiBoLiYa {
    public name:string;
    constructor(n:string){
        this.name =n
    }

    WheatherCold():void{
        console.log(this.name + "生活在环境很冷的地方")
    }
}

class ErHa extends XiBoLiYa implements Dog{
    constructor(n:string){
        super(n);
    }
    eat(food:string):void{
        console.log(this.name +"吃"+food)
    }
    run():void{
        console.log(this.name + "跑步")
    }
}
```

## 泛型
泛型：软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时能为你提供十分灵活的功能。使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。这样用户就可以以自己的数据类型来使用组件

1. 泛型的定义
泛型就是解决类 接口 方法的复用性，以及对不特定数据的支持
```ts
// 只能返回string
function getData(val:string):string{
    return val
}
// 同时返回string和number类型  any可以解决这个问题
// 但是any放弃了类型检查，传入的类型和返回的类型可以不一致
function getDataAny(val:any):any{
    return val
}


// 泛型：可以支持不特定的数据类型，要求传入什么类型必须返回什么类型
// <T>表示泛型。具体什么类型是调用这个方法的时候决定的
```
2. 泛型函数
```ts
function getDataFanXing<T>(val:T):T{
    return val
}
getDataFanXing<number>(123);
getDataFanXing<string>("123");

function getDataFanXingAny<T>(val:T):any{
    return "这里可以返回任意类型"
}

```
3. 泛型类
```ts
// 泛型类：比如有个最小堆算法，需要同时支持返回数字和字符串a-z两种类型。通过类的泛型实现
class MinClass<T> {
    public list:T[] = [];
    add(num:T,...more:T[]){
        this.list.push(num);
        if(more){
            for(var j=0;j<more.length;j++){
                this.list.push(more[j])
            }
        }
    }
    min():T{
        var minNum = this.list[0]
        for(var i =0; i<this.list.length; i++){
            if(minNum>this.list[i]){
                minNum = this.list[i]
            }
        }
        return minNum
    }
}
var m = new MinClass<number>(); // 实例化类 并且制定了类的T代表的类型就是number
var n = new MinClass<string>();
m.add(2,3,5,78,0,1);
n.add("z","x","c","a");
console.log(m.min())
console.log(n.min())

// 泛型可以帮助我们避免重复的代码一级不特定数据类型的支持（类型校验），下面我们看看把类当作参数的泛型类
// 1. 定义类
// 2. 把类作为参数来约束数据传入的类型
/*
定义一个user类，这个类的作用就是映射数据库字段
然后定义一个MysqlDB的类，这个类用于操作数据库
然后把user类作为参数参入到MysqlDB中
var user = new User({username:"li",password:"123456"})
var DB = new MysqlDB();
DB.add(user)
*/ 
interface option{
    n:string,
    p:string
}
// 把类作为参数来约束传入的类型
class User{
    username:string|undefined;
    password:string|undefined;
    constructor(option:option){
        this.username = option.n;
        this.password = option.p;
    }
}
class MysqlDB{
    add(user:User):boolean{
        console.log(user);
        return true
    }
}
var user = new User({n:"li",p:"123456"})
var DB = new MysqlDB();
DB.add(user)

class MysqlDB2<T>{
    add(info:T):boolean{
        console.log(info)
        return true
    }
    update(info:T,id:number):boolean{
        console.log(info);
        console.log(id);
        return true
    }
}

// 想给User表增加数据
// 1. 定义一个User类 和数据库进行映射
var u = new User({n:"zhang",p:"123456"})
var DBUser = new MysqlDB2<User>();
DBUser.add(u)

// 2. 定义一个ArticleCate类 和数据库进行映射
class ArticleCate{
    title:string|undefined;
    desc:string|undefined;
    status:number|undefined;
    constructor(params:{t:string,d:string,s?:number}){
        this.title = params.t;
        this.desc = params.d;
        this.status = params?.s;
    }
}
var article = new ArticleCate({t:"国外新冠病毒疫情",d:"逐渐加剧"})
var DBArticle = new MysqlDB2<ArticleCate>();
DBArticle.add(article);
var article_change = new ArticleCate({t:"修改内容",d:"感觉爽了很多"})
article_change.status = 200
DBArticle.update(article_change,12)





```

4. 泛型接口
```ts
// 泛型接口
// 第一种写法
interface ConfigFn{
    <T>(value1:T):T;
}
var setData:ConfigFn = function<T>(val1:T):T{
    return val1
}
console.log(setData<string>("燕子"))
// console.log(setData<string>(527)) //传入非字符串类型会报错

// 第二种写法
interface ConfigFnSecond<T>{
    (value:T):T
}
function getDataSecond<T>(val:T):T{
    return val
}
var mineGet:ConfigFnSecond<string> = getDataSecond
console.log(mineGet("李三"))
// console.log(mineGet(123)) //传入非字符串类型会报错
```



## 实战项目
```ts
/*
功能：定义一个操作数据库的库  支持 Mysql Mssql  MongoDb
要求1：Mysql MsSql  MongoDb功能一样  都有 add  update  delete  get方法    
注意：约束统一的规范、以及代码重用
解决方案：需要约束规范所以要定义接口 ，需要代码重用所以用到泛型
    1、接口：在面向对象的编程中，接口是一种规范的定义，它定义了行为和动作的规范
    2、泛型 通俗理解：泛型就是解决 类 接口 方法的复用性、
*/

interface DBI<T>{
    add(info:T):boolean
    update(info:T,id:number):boolean
    delete(id:number):boolean
    get(id:number):any[]
}

// 定义一个操作mysql数据库的类 
// 注意：要实现泛型接口，这个类也应该是一个泛型类
class MysqlDB<T> implements DBI<T>{
    constructor(){
        console.log("建立数据库连接")
    }
    add(info: T): boolean {
        throw new Error("Method not implemented.");
    }
    update(info: T, id: number): boolean {
        throw new Error("Method not implemented.");
    }
    delete(id: number): boolean {
        throw new Error("Method not implemented.");
    }
    get(id: number): any[] {
        throw new Error("Method not implemented.");
    }
}

// 定义一个操作mssql数据库的类 
class MssqlDB<T> implements DBI<T>{
    add(info: T): boolean {
        console.log(info)
        return true
    }
    update(info: T, id: number): boolean {
        throw new Error("Method not implemented.");
    }
    delete(id: number): boolean {
        throw new Error("Method not implemented.");
    }
    get(id: number): any[] {
        throw new Error("Method not implemented.");
    }
}

// 操作用户表 定义一个User类和数据表映射
class User{
    username:string|undefined;
    password:string|undefined
}

var u = new User()
u.username = "bill"
u.password = "123546"
var mm = new MysqlDB<User>(); //类作为参数来验证传入数据的类型
var ms = new MssqlDB<User>(); //
mm.add(u);
ms.add(u);

```

## ts中的模块
1. 模块的的概念  
`模块的的概念（官方）`  
    关于术语的一点说明: 请务必注意一点，TypeScript 1.5里术语名已经发生了变化。 “内部模块”现在称做“命名空间”。
    “外部模块”现在则简称为“模块” 模块在其自身的作用域里执行，而不是在全局作用域里；
    这意味着定义在一个模块里的变量，函数，类等等在模块外部是不可见的，除非你明确地使用export形式之一导出它们。 
    相反，如果想使用其它模块导出的变量，函数，类，接口等的时候，你必须要导入它们，可以使用 import形式之一。  
`模块的概念（自己理解）`  
    我们可以把一些公共的功能单独抽离成一个文件作为一个模块。
    模块里面的变量 函数 类等默认是私有的，如果我们要在外部访问模块里面的数据（变量、函数、类），
    我们需要通过export暴露模块里面的数据（变量、函数、类...）。
    暴露后我们通过 import 引入模块就可以使用模块里面暴露的数据（变量、函数、类...）。
```ts
// ./modules/db.ts
var dbUrl="http://localhost"
export function getData(){
    consol.log("获取数据库的数据")
}
export function fun():any[]{
    return [
        {title:"something"},
        {title:"something else"},
    ]
}
// ./b.js
import {getData, fun} form "./modules/db"
getData();
fun();
```

2. 模块导出的几种方法
    1. export 导出声明  
    2. export 导出语句
    3. export default 每个模块都可以且只有一个default导出
    4. import导入模块

3. 模块化封装上一讲的DB库


## ts命名空间
`命名空间:`  
    在代码量较大的情况下，为了避免各种变量命名相冲突，可将相似功能的函数、类、接口等放置到命名空间内，同Java的包、.Net的命名空间一样，TypeScript的命名空间可以将代码包裹起来，只对外暴露需要在外部访问的对象。命名空间内的对象通过export关键字对外暴露。

`命名空间和模块的区别：`  
    命名空间：内部模块，主要用于组织代码，避免命名冲突。
    模块：ts的外部模块的简称，侧重代码的复用，一个模块里可能会有多个命名空间。

```ts
// ./modules/animal.ts
export namespace A{
    interface Animal {
        name: string;
        eat(): void;
    }
    export class Dog implements Animal {
        name: string;
        constructor(theName: string) {
            this.name = theName;
        }
        eat() {
            console.log(`${this.name} 在吃狗粮。`);
        }
    }
    export class Cat implements Animal {
        name: string;
        constructor(theName: string) {
            this.name = theName;
        }
        eat() {
            console.log(`${this.name} 吃猫粮。`);
        }
    }   

}

export namespace B{
    interface Animal {
        name: string;
        eat(): void;
    }
    export class Dog implements Animal {
        name: string;
        constructor(theName: string) {
            this.name = theName;
        }
        eat() {
            console.log(`${this.name} 在吃狗粮。`);
        }
    }

    export class Cat implements Animal {
        name: string;
        constructor(theName: string) {
            this.name = theName;
        }
        eat() {
            console.log(`${this.name} 在吃猫粮。`);
        }
    }   
}

var c=new B.Cat('小花');

c.eat();


// ./act.ts
import {A,B} from './modules/animal';
var d=new A.Dog('小黑');
d.eat();
var dog=new B.Dog('小花');
dog.eat();

```

## ts中的装饰器
装饰器:装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，属性或参数上，可以修改类的行为。  
通俗的讲装饰器就是一个方法，可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能。  
常见的装饰器有：类装饰器、属性装饰器、方法装饰器、参数装饰器  
装饰器的写法：普通装饰器（无法传参） 、 装饰器工厂（可传参）  
装饰器是过去几年中js最大的成就之一，已是Es7的标准特性之一  
```ts
// 1. 类装饰器：类装饰器在类声明之前被声明（紧靠着类声明）。 类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。 传入一个参数 

// 1.1 普通装饰器 无法传参
function logClass(params:any){
    console.log(params)
    params.prototype.apiUrl = "动态扩展的属性"
    params.prototype.run =function(){
        console.log("程序跑起来了")
    }
}

@logClass
class HttpClient{
    constructor(){

    }
    getData(){

    }
}
var http:any = new HttpClient()
console.log(http.apiUrl)
http.run();

// 1.2 类装饰器：装饰器工厂（可传参）
function logClassFactory(params:string){
    return function(target:any){
        console.log(params)
        console.log(target)
        target.prototype.apiUrl = "装饰器工厂动态扩展的属性"
    }
}

@logClassFactory("可以作为普通的字符串传入")
class HttpClient{
    constructor(){
    }
    getData(){
    }
}

var http:any = new HttpClient()
console.log(http.apiUrl)


// 1.3 类装饰器重载构造函数，类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
// 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。
function logClassOverload(target:any){
    return class extends target{
        apiUrl:any = "我是修改后的数据"
        getData(){
            this.apiUrl +=this.apiUrl+ "-----"
            console.log(this.apiUrl)
        }
    }
}
@logClassOverload
class HttpClient{
    public apiUrl:string|undefined;
    constructor(){
        this.apiUrl = "这里是构造函数里面的apiurl"
    }
    getData(){
        console.log(this.apiUrl)
    }
}

var http = new HttpClient()
http.getData();


// 2 属性装饰器
//  属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
//      1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
//      2、成员的名字。
function logProperty(params:any){
    return function(target:any,attr:any){
        console.log(target)
        console.log(attr)
        target[attr] = params
    }
}

@logClass
class HttpClient{
    @logProperty("more string")
    public url:any|undefined;
    constructor(){}
    getData(){
        console.log(this.url)
    }
}


var http = new HttpClient()
http.getData();


// 3. 方法装饰器
// 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。
// 方法装饰会在运行时传入下列3个参数：
//     1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
//     2、成员的名字。
//     3、成员的属性描述符。

// 3.1 方法装饰器
function logMethod(params:any){
    return function(target:any,method:any,desc:any){
        console.log(target)
        console.log(method)
        console.log(desc)
        target.url = "ttttttttttttttt";
        target.run = function(){
            console.log(this.url)
        }
    }
}

class HttpClient{
    public url:any|undefined;
    constructor(){}
    @logMethod('http://www.beepool.org')
    getData(){
        console.log(this.url)
    }
}

var http = new HttpClient()
http.getData();

// 3.2 方法装饰器二
function logMethod(params:any){
    return function(target:any,method:any,desc:any){
        // console.log(target)
        // console.log(method)
        // console.log(desc)
        // 修改装饰器的方法 把装饰器方法里传入的所有参数改为string

        // <1> 报错当前的方法
        var oMethod = desc.value
        desc.value = function(...args:any[]){
            args = args.map( val => {
                return String(val)
            })
            console.log(args)
            oMethod.apply(this, args)
        }
    }
}

class HttpClient{
    public url:any|undefined;
    constructor(){}
    @logMethod('http://www.beepool.org')
    getData(...args:any[]){
        console.log("我是原型中的方法")
        console.log(args)
    }
}

var http = new HttpClient()
http.getData("dasds",12311);

// 4. 方法参数装饰器
// 参数装饰器表达式会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元素数据 ，传入下列3个参数：
// 1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
// 2、方法的名字。
// 3、参数在函数参数列表中的索引。

function logParams(params:any){
    return function(target:any,methodName:string,paramIndex:any){
        console.log(target)
        console.log(methodName)
        console.log(paramIndex)
        console.log(params)
        target.apiUrl = "tttttttr"
    }
}

class HttpClient{
    public url:any|undefined;
    constructor(){}
    getData(index:number, @logParams('uuid') uuid:any){
        console.log("我是原型中的方法")
    }
}
var http:any = new HttpClient()
http.getData(1231,"123456");
console.log(http.apiUrl)


// 5. 装饰器执行顺序
// 属性 > 方法 > 方法参数 > 类
// 如果有多个同样的装饰器，会先执行后面的
function logClass1(params:any){
    return function(target:any){
        console.log("这里是第一个类装饰器")
    } 
}
function logClass2(params:any){
    return function(tarhet:any){
        console.log("这里是第二个类装饰器")
    } 
}
function logAttribute(params?:any){
    return function(target:any,attr:any){
        console.log("属性装饰器")
    } 
}
function logMethod(params:string){
    return function(target:any,methodName:any,desc:any){
        console.log("方法装饰器思密达")
    }
}
function logParams1(params:string){
    return function(target:any,methodName:any,paramIndex:any){
        console.log("方法参数装饰器思密达1")
    }
}
function logParams2(params:string){
    return function(target:any,methodName:any,paramIndex:any){
        console.log("方法参数装饰器思密达2")
    }
}


@logClass1("first one")
@logClass2("seconde one")
class HttpClient{
    @logAttribute("some 值")
    public url:any|undefined;
    constructor(){}
    @logMethod()
    getData(){
        console.log("我是原型中的方法")
    }
    setData(@logParams1() id1:any, @logParams2() id2:any){
        console.log("")
    }
}


var http:any = new HttpClient();

```