# Set
- Set类型, 这是一种无重复值的有序列表, Set允许对它包含的数据进行快速访问，从而增加了一个追踪离散值的更有效方式。
- Set 不会使用强制类型转换来判断值是否重复
- +0 与 -0 在 Set 中被判断为是相等的
- Set构造器实际上可以接收任意可迭代对象作为参数。能使用数组是因为它们默认就是可迭代的， Set 与 Map 也是一样
```js
let set = new Set()
set.add(5)
set.add("5")
console.log(set.size) //2

// has可以测试某个值是否存在于 Set 中
set.has(5) 

/* 使用  delete()  方法来移除单个值 */
/* 或调用  clear()  方法来将所有值从 Set 中移除 */
set.delete(5);
console.log(set.has(5)); // false
set.clear();
console.log(set.has("5")); // false

```

### set中的foreach
- forEach()  方法会被传递一个回调函数，该回调接受三个参数：
  1. Set 中下个位置的值； 类似键值
  2. 与第一个参数相同的值； 类似键名
  3. 目标 Set 自身。 
```js
let set = new Set([1, 2]);
set.forEach(function(value, key, ownerSet) {
    console.log(key + " " + value);
    console.log(ownerSet === set);
});
```

### 与使用数组相同，如果想在回调函数中使用this，你可以给forEach()传入一个this值作为第二个参数
```js
let set = new Set([1, 2]);
let processor = {
    output(value) {
        console.log(value);
    },
    process(dataSet) {
        dataSet.forEach(function(value) {
            this.output(value);
        }, this);
    }
};
processor.process(set);
```

### 将set转化为数组
```js
let set = new Set([1, 2, 3, 3, 3, 4, 5]),
array = [...set];
console.log(array); // [1,2,3,4,5]
```

### weak set
- 由于Set类型存储对象引用的方式，它也可以被称为 Strong Set
- 对象存储在Set的一个实例中时，实际上相当于把对象存储在变量中。只要对于Set实例的引用仍然存在，所存储的对象就无法被垃圾回收机制回收，从而无法释放内存
```js
let set = new Set(),
key = {};
set.add(key);
console.log(set.size); // 1
// 取消原始引用
key = null;
console.log(set.size); // 1
// 重新获得原始引用
key = [...set][0];
//将key设置为null清除了对key对象的一个引用，但是另一个引用还存于set内部
```

- Weak Set，该类型只允许存储对象弱引用，而不能存储基本类型的值，对象的弱引用在它自己成为该对象的唯一引用时，不会阻止垃圾回收
```js
let set = new WeakSet(),
key = {};
// 将对象加入 set
set.add(key);
console.log(set.has(key)); // true
set.delete(key);
console.log(set.has(key)); // false
```

- Weak Set 与正规 Set 之间最大的区别是对象的弱引用
```js
let set = new WeakSet(),
key = {};
// 将对象加入 set
set.add(key);
console.log(set.has(key)); // true
// 移除对于键的最后一个强引用，同时从 Weak Set 中移除
key = null;
```

###  Weak Set与正规Set
1. 对于WeakSet的实例，若调用add()方法时传入了非对象的参数，就会抛出错误（
has()或delete()则会在传入了非对象的参数时返回false）；
1. Weak Set不可迭代，因此不能被用在for-of循环中；
3. WeakSet无法暴露出任何迭代器（例如keys()与values()方法），因此没有任何编程手段可用于判断WeakSet的内容；
4. WeakSet没有forEach()方法；
5. WeakSet没有size属性。
>Weak Set 看起来功能有限，而这对于正确管理内存而言是必要的。一般来说，若只想追踪对象的引用，应当使用 Weak Set 而不是正规 Set 。


# Map
- Map  类型是键值对的有序列表，而键和值都可以是任意类型。键的比较使用的是Object.is()  ，因此你能将  5  与  "5"  同时作为键，因为它们类型不同
```js
let map = new Map();
map.set("title", "Understanding ES6");
map.set("year", 2016);
console.log(map.get("title")); // "Understanding ES6"
console.log(map.get("year")); // 2016
// map中使用对象作为键值,每个对象都被认为是唯一的
key1 = {},
key2 = {};
map.set(key1, 5);
map.set(key2, 42);
console.log(map.get(key1)); // 5
console.log(map.get(key2)); // 42
// 这允许你给对象关联额外数据，而无须修改对象自身
```

### Map的方法和属性
- has(key)  ：判断指定的键是否存在于 Map 中；
- delete(key)  ：移除 Map 中的键以及对应的值；
- clear()  ：移除 Map 中所有的键与值。
- size  ：用于指明Map 中键值对的数量

### Map的初始化
- 能将数组传递给Map构造器，以便使用数据来初始化一个Map 
```js
let map = new Map([["name", "Nicholas"], ["age", 25]]);
console.log(map.has("name")); // true
console.log(map.get("name")); // "Nicholas"
console.log(map.size); // 2
```
> 因为键允许是任意数据类型，将键存储在数组中，是确保它们在被添加到 Map 之前不会被强制转换为其他类型的唯一方法。

### Map上的foreach
- 它接受一个能接收三个参数的回调函数：
  1. Map 中下个位置的值；第一个参数是值
  2. 该值所对应的键；第二个参数则是键
  3. 目标 Map 自身。
```js
let map = new Map([ ["name", "Nicholas"], ["age", 25]]);
map.forEach(function(value, key, ownerMap) {
    console.log(key + " " + value);
    console.log(ownerMap === map);
});
```
> 传递给forEach()的回调函数接收了每个键值对，按照键值对被添加到Map中的顺序

### Weak Map
- 在 Weak Map 中，所有的键都必须是对象（尝试使用非对象的键会抛出错误），而且这些对象都是弱引用，不会干扰垃圾回收
- WeakMap类型是键值对的无序列表，其中键必须是非空的对象，值则允许是任意类型
```js
let map = new WeakMap(),
element = document.querySelector(".element");
map.set(element, "Original");
let value = map.get(element);
console.log(value); // "Original"
// 移除元素
element.parentNode.removeChild(element);
element = null;
// 该 Weak Map 在此处为空
```
- 在传递给WeakMap构造器的参数中，若任意键值对使用了非对象的键，构造器就会抛出错误
- Weak Map只有两个附加方法能用来与键值对交互, has()方法用于判断指定的键是否存在于Map中，而delete()方法则用于移除一个特定的键值对

```js
var Person = (function() {
    var privateData = {},
    privateId = 0;
    function Person(name) {
        Object.defineProperty(this, "_id", { value: privateId++ });
        privateData[this._id] = {
            name: name
        };
    }
    Person.prototype.getName = function() {
        return privateData[this._id].name;
    };
    return Person;
}());
// 这里最大的缺点privateData中的数据永不会消失, 可以使用weak map来解决
let Person = (function() {
let privateData = new WeakMap();
    function Person(name) {
        privateData.set(this, { name: name });
    }
    Person.prototype.getName = function() {
        return privateData.get(this).name;
    };
    return Person;
}());
// 这种技术让私有信息能够保持私有状态，并且当与之关联的对象实例被销毁时，私有信息也会被同时销毁
```
- 确保额外数据在不再可用后被销毁，从而能优化内存使用并规避内存泄漏