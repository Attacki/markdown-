## 基本数据类型

- python中有可变数据类型和不可变数据类型，列表 [] 和字典{} 是可变数据类型，就是其中的内容改变，内存地址不变。
- python中 a += a 和 a = a + a是不一样的，= 的使用会直接创建一个新的变量，而 += 则是直接对原变量进行操作。


## 函数及对象，类
- 类有 `__new__` (创建时调用object的`__new__`方法来返回当前类的引用)、 `__init__`(对象创建的时候，搜集传进来的参数，完成对象的创建)、`__del__`对象被删除的时候调用)、`__str__`(对象被打印的时候调用)等方法。这四个方法的第一个参数都代表的是类指向的那个类对象 。
- 单例模式：例如游戏只能有一个窗口，
```python
class single(object):
    __instance = None
    __inin_flag = False
    def __new__(cls,name) :
        if cls.__instance == None:
            cls.__instance = object.__new__(cls)
            return cls.__instance
        else:
            # return 上一次创建的对象的引用
            return cls.__instance
    def __init__(self,name)
        if __inin_flag == False:
            self.name = name
            __inin_flag = True
single = single('单例模式的对象')
single = single('单例')
```

## 调试

##### 异常捕获 
- 异常是可以传递的，按照作用域一级一级向上传递，直到传给python解释器还没有被捕获，那解释器就会报错，并且终止程序。
- 可以自定义异常 ，使用 raise 关键字，也可以用这个关键字捕获异常中的异常。
```python
try:
    11/0
except Exception:
    #Exception代表捕获所有异常
    print('捕获的异常在这里面')
```

## `__name__`
> 有时候，在自己模块调试时，需要运行的一些调试程序，但是在别人引用我们模块的时候，不希望运行这些调试程序时，应该这么做：
```python
if __name__ == '__main__'
    test()
```
> 因为 `__name__`这个变量是比较特殊的，在模块中打印时，是`__main__`。在别人引用时，打印的是模块的名字。






## 全局变量的问题
- 在一个函数中，对全局变量进行修改的时候，到底是否需要使用global进行说明，要看是否对全局变量的指向进行了修改，如果让全局变量指向一个新的内存地址，那么必须使用global。如果，仅仅是修改了指向的空间中的数据，此时不必须使用global，例如对列表使用append方法就不必须。
- 在函数内部，如果定了一个变量，必须先定义，在调用，就算外部有同名变量也会报错。