# Set
- Set类型, 这是一种无重复值的有序列表, Set允许对它包含的数据进行快速访问，从而增加了一个追踪离散值的更有效方式。
- Set 不会使用强制类型转换来判断值是否重复
- +0 与 -0 在 Set 中被判断为是相等的
- Set  构造器实际上可以接收任意可迭代对象作为参数。能使用数组是因为它们默认就是可迭代的， Set 与 Map 也是一样
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
  1. Set 中下个位置的值；
  2. 与第一个参数相同的值；
  3. 目标 Set 自身。 