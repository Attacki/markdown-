# 原始数据类型

```js
// 布尔值
let isDone: boolean = false;
// 注意，使用构造函数 Boolean 创造的对象不是布尔值：
// let createdByNewBoolean: boolean = new Boolean(1);

// 数字
let decLiteral: number = 6;

// 字符串
let myName: string = 'Tom';
let myAge: number = 25;
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;

// 空值
function alertName(): void {
    alert('My name is Tom');
}
let unusable: void = undefined; //void只能将它赋值为 undefined 和 null。

// Null 和 Undefined
let u: undefined = undefined;
let n: null = null;
/* undefined 和 null 是所有类型的子类型（可赋值给其他类型），void 类型的变量不能赋值给 number 类型的变量 */ 

// any 任意类型 允许被赋值为任意类型
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
myFavoriteNumber.myName.setFirstName('Cat');// 在任意值上访问任何属性都是允许的

```


# 类型推断
```ts
/*  注意：
*   TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论
*/ 
// let myFavoriteNumber = 'seven'; 
// myFavoriteNumber = 7; 
// 报错提示不能定义数字7到字符串类型

// 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查 
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

```

# 联合类型
```js
// 可为多类型
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

# 对象的类型--接口
```js
/*  注意：
*   1. 定义的变量与接口类型必须一致
*   2. 定义的变量比接口少了一些属性是不允许的
*   3. 多一些属性也是不允许的
*/
interface Person {
    readonly id: number;
    name: string;
    age: number;
    gender?: string;            // ?代表该属性可有可无
    [propName: string]: string;    // [propName: string] 定义了任意属性取 string 类型的值。
};
/* 
*   注意：
*   1. 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
*   2. 只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
*/
let tom: Person = {
    id: 8888
    name: 'Tom',
    age: 25 
    //会报错 ，因为数值25不是任意属性string类型的子集 ，需要设置为  [propName: string]: any
};

// tom.id = 9527 // 报错，id为只读属性

```

# 数组的类型
```js
// 1.「类型 + 方括号」表示法
/* 注意：数组中数据必须全是number，使用数组方法push其它类型数据也不行 */ 
let fibonacci: number[] = [1, 1, 2, 3, 5]; 

// 2. 数组泛型 Array<elemType> 来表示数组
let fibonacci: Array<number> = [1, 1, 2, 3, 5];

// 3. 接口来描述数组
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];


// 如果允许数组出现任意数据类型
let list: any[] = ['Xcat Liu', 25, { website: 'http://bing.com' }];

// 类数组
function sum() {
    let args: IArguments = arguments;
}
```

# 函数的类型
ts中对函数进行约束，输入输出都要控制
```js
/* 注意：输入多余的（或者少于要求的）参数，是不被允许的 */ 
function sum(x: number, y: number): number {
    return x + y;
}

// 函数表达式定义函数
// => 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};

// 接口定义函数形状
interface SearchFunc {
    (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}

// 可选参数 使用?来表示可选
/* 注意：可选参数必须接在必需参数后面 */ 
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');

// 参数默认值
/*  注意：
*   1. TypeScript 会将添加了默认值的参数识别为可选参数 
*   2. 此时就不受「可选参数必须接在必需参数后面」的限制了
*/
function buildName(lastName: string = 'Cat', firstName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');

// 剩余参数
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a = [];
push(a, 1, 2, 3);

// 重载
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
/*
*   可以使用重载定义多个 reverse 的函数类型
*/
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

```

# 类型断言
```js
/*  
*   <类型>值 或者 值 as 类型
*   1. 在 tsx 语法（React 的 jsx 语法的 ts 版）中必须用后一种。
*   2. 需要断言的变量前加上 <Type> 即可
*   3. 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的
*   function getLength(something: string | number): number {
*       return something.length; //会报错，提示该变量为string或number，没有属性或方法
*   }
*/
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}

```

# 内置对象
```js
// ECMAScript 的内置对象：Boolean、Error、Date、RegExp
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;

// DOM & BOM 内置对象：Document、HTMLElement、Event、NodeList
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});

// TypeScript 核心库的定义文件
// TypeScript其实已经对常用的函数进行了重写，并对参数进行了类型判断
interface Math {
    /**
     * Returns the value of a base expression taken to a specified power.
     * @param x The base value of the expression.
     * @param y The exponent value of the expression.
     */
    pow(x: number, y: number): number;
}
// 用 TypeScript 写 Node.js
// npm install @types/node --save-dev


```

















