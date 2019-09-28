## 符号（symbol）与符号属性

在符号诞生之前，将字符串作为属性名称导致属性可以被轻易访问，无论命名规则如何。
- 符号没有字面量形式，这在 JS 的基本类型中是独一无二的，只能使用全局函数symbol创建一个符号值
- Symbol  函数还可以接受一个额外的参数用于描述符号值，该描述并不能用来访问对应属性，但它能用于调试。

```js
let firstName = Symbol("first name");
let person = {};
person[firstName] = "Nicholas";
console.log("first name" in person); // false
console.log(person[firstName]); // "Nicholas"
console.log(firstName); // "Symbol(first name)"
console.log(typeof firstName); // symbol
```

### 共享符号值

> Symbol.for()方法首先会搜索全局符号注册表，看是否存在一个键值为"uid"的符号值。若是，该方法会返回这个已存在的符号值；否则，会创建一个新的符号值，并使用该键值将其记录到全局符号注册表中，然后返回这个新的符号值。

```js
let uid = Symbol.for("uid");
let object = {
[uid]: "12345"
};
console.log(object[uid]); // "12345"
console.log(uid); // "Symbol(uid)"
let uid2 = Symbol.for("uid");
console.log(uid === uid2); // true
console.log(object[uid2]); // "12345"
console.log(uid2); // "Symbol(uid)"
```
> Symbol.keyFor()  方法在全局符号注册表中根据符号值检索出对应的键值

```js
let uid = Symbol.for("uid");
console.log(Symbol.keyFor(uid)); // "uid"
let uid2 = Symbol.for("uid");
console.log(Symbol.keyFor(uid2)); // "uid"
let uid3 = Symbol("uid");
console.log(Symbol.keyFor(uid3)); // undefined
```

### 符号值的转换
> 符号值无法被转换为字符串值或数值。因此将符号作为属性所达成的效果，是其他类型所无法替代的 

```js
let uid = Symbol.for("uid"),
desc = uid + ""; // 引发错误！
let uid = Symbol.for("uid"),
sum = uid / 1; // 引发错误！
```

### 检索符号属性
> Object.keys()与Object.getOwnPropertyNames()方法可以检索对象的所有属性名称,前者返回所有的可枚举属性名称，而后者则返回所有属性名称而无视其是否可枚举。然而两者都不能返回符号类型的属性。
> Object.getOwnPropertySymbols()方法会返回一个数组，包含了对象自有属性名中的符号值

```js
let uid = Symbol.for("uid");
let object = {
    [uid]: "12345"
};
let symbols = Object.getOwnPropertySymbols(object);
console.log(symbols.length); // 1
console.log(symbols[0]); // "Symbol(uid)"
console.log(object[symbols[0]]); // "12345"
```

### 符号内部方法
- Symbol.hasInstance  ：供instanceof运算符使用的一个方法，用于判断对象继承关系。

```js
obj instanceof Array;
//等价于
Array[Symbol.hasInstance](obj);
```
- Symbol.isConcatSpreadable  ：一个布尔类型值，在集合对象作为参数传递给Array.prototype.concat()方法时，指示是否要将该集合的元素扁平化。
> Symbol.isConcatSpreadable  属性是一个布尔类型的属性，它表示目标对象拥有长度属性与数值类型的键、并且数值类型键所对应的属性值在参与concat()调用时需要被分离为个体。可以用它来定义任意类型的对象，让该对象在参与concat()调用时能够表现得像数组一样

```js
let collection = {
    0: "Hello",
    1: "world",
    length: 2,
    [Symbol.isConcatSpreadable]: true
};
let messages = [ "Hi" ].concat(collection);
console.log(messages.length); // 3
console.log(messages); // ["hi","Hello","world"]
```
- Symbol.match  ：供String.prototype.match()函数使用的一个方法，用于比较字符串。
- Symbol.replace  ：供String.prototype.replace()函数使用的一个方法，用于替换子字符串。
- Symbol.search  ：供String.prototype.search()函数使用的一个方法，用于定位子字符串。
- Symbol.split  ：供String.prototype.split()函数使用的一个方法，用于分割字符串。

```js
// 有效等价于 /^.{10}$/
let hasLengthOf10 = {
    [Symbol.match]: function(value) {
        return value.length === 10 ? [value.substring(0, 10)] : null;
    },
    [Symbol.replace]: function(value, replacement) {
        return value.length === 10 ?replacement + value.substring(10) : value;
    },
    [Symbol.search]: function(value) {
        return value.length === 10 ? 0 : -1;
    },
    [Symbol.split]: function(value) {
        return value.length === 10 ? ["", ""] : [value];
    }
};
let message1 = "Hello world", // 11 characters
    message2 = "Hello John"; // 10 characters
let match1 = message1.match(hasLengthOf10),
    match2 = message2.match(hasLengthOf10);
console.log(match1); // null
console.log(match2); // ["Hello John"]
let replace1 = message1.replace(hasLengthOf10, "Howdy!"),
    replace2 = message2.replace(hasLengthOf10, "Howdy!");
console.log(replace1); // "Hello world"
console.log(replace2); // "Howdy!"
let search1 = message1.search(hasLengthOf10),
    search2 = message2.search(hasLengthOf10);
console.log(search1); // -1
console.log(search2); // 0
let split1 = message1.split(hasLengthOf10),
    split2 = message2.split(hasLengthOf10);
console.log(split1); // ["Hello world"]
console.log(split2); // ["", ""]
```
- Symbol.toPrimitive  ：返回对象所对应的基本类型值的一个方法。

```js
function Temperature(degrees) {
    this.degrees = degrees;
}
Temperature.prototype[Symbol.toPrimitive] = function(hint) {
    switch (hint) {
    case "string":
    return this.degrees + "\u00b0"; // 温度符号
    case "number":
    return this.degrees;
    case "default":
    return this.degrees + " degrees";
}
};
let freezing = new Temperature(32);
console.log(freezing + "!"); // "32 degrees!"
console.log(freezing / 2); // 16
console.log(String(freezing)); // "32°"
```
- Symbol.toStringTag  ：供String.prototype.toString()函数使用的一个方法，用于创建对象的描述信息。

```js
function Person(name) {
    this.name = name;
}
Person.prototype[Symbol.toStringTag] = "Person";
let me = new Person("Nicholas");
console.log(me.toString()); // "[object Person]"
console.log(Object.prototype.toString.call(me)); // "[object Person]"
```
- Symbol.unscopables  ：一个对象，该对象的属性指示了哪些属性名不允许被包含在with语句中。

```js
let values = [1, 2, 3],
colors = ["red", "green", "blue"],
color = "black";
with(colors) {
    push(color);
    push(...values);
}
console.log(colors); // ["red", "green", "blue", "black", 1, 2, 3]
// 默认内置在 ES6 中
//Symbol.unscopables  属性是一个对象，当提供该属性时，它的键就是用于忽略with语句绑定的标识符，键值为true代表屏蔽绑定
Array.prototype[Symbol.unscopables] = Object.assign(Object.create(null), {
    copyWithin: true,
    entries: true,
    fill: true,
    find: true,
    findIndex: true,
    keys: true,
    values: true
});
```
