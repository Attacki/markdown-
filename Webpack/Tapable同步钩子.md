# Tapable
Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，实现这一切的核心就是Tapable，Tapable有点类似nodejs的events库，核心原理也是依赖发布订阅模式。
```js
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable')
```


### synchook 同步钩子
函数都会挨个执行
```js
//  例子
let {SyncHook} = require(tapable)
class Lesson {
    constructor(){
        this.hooks = {
            arch: new SyncHook(),
        }
    }
    tap(){
        this.hooks.arch.tap('node',(name)=>{
            console.log('node',name)
        })
        this.hooks.arch.tap('react',(name)=>{
            console.log('react',name)
        })
    }

    start(){
        this.hooks.arch.call('jw')
    }
}
let l = new Lesson()
l.tap()
l.start()

//  原理
class SyncHook{
    constructor(args){
        this.task = []
    }
    
    tap(name,task){
        this.task.push(task)
    }
    call(...args){
        this.tasks.foreach((task)=>{ task(...args) }
    }
}
let hook = new SyncHook()
hook.tap('react',function(name){
    console.log(name)
)
hook.tap('node',function(name){
    console.log(name)    
})
hook.call('jw')
```

### syncbailhook  熔断型
如果返回值不为空，剩下的函数就不继续执行
```js
//  原理
class SyncBailHook{
    constructor(args){
        this.task = []
    }
    tap(name,task){
        this.task.push(task)
    }
    call(...args){
        let ret; //当前函数的返回值
        let index = 0
        do{
            ret = this.tasks[index++](...args)
        }while(ret === undefined && index < this.tasks.length)
    }
}
let hook = new SyncBailHook()
hook.tap('react',function(name){
    console.log(name)
    return '返回值不为空，队列结束'
})
hook.tap('node',function(name){
    console.log(name)    
})
hook.call('jw')
```


### SyncWaterfallHook  瀑布型
前一个函数的返回值会是后一个函数的形参
```js
class SyncWaterfallHook{
    constructor(args){
        this.task = []
    }
    tap(name,task){
        this.task.push(task)
    }
    call(...args){
        let [first , ...other] = this.tasks
        let ret = first(..args)
        others.reduce((a,b)=>{
            return b(a)
        },ret)
    }
}
let hook = new SyncWaterfallHook()
hook.tap('react',function(name){
    console.log(name)
    return 'react ok'
})
hook.tap('node',function(data){
    console.log(data)  
    return 'node ok'  
})
hook.tap('vue',function(data){
    console.log(data)    
})
hook.call('jw')
```


### SyncLoopHook  循环型
同步遇到某个不返回undefined的监听函数会多次执行
```js
class SyncLoopHook{
    constructor(args){
        this.task = []
        this.index = 0
    }
    tap(name,task){
        this.task.push(task)
    }
    call(...args){
        this.tasks.foreach(task=>{
            let ret ;
            do{
                ret = task(...args)
            }while(ret != undefined)
        })
    }
}
let hook = new SyncLoopHook()
hook.tap('react',function(name){
    console.log(name)
    return ++this.index === 3 ?undefined:'继续学' 
})
hook.tap('node',function(data){
    console.log(data)  
    return 'node ok'  
})
hook.call('jw')
```