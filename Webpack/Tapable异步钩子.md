# 异步钩子
- 异步的钩子（串行）并行  需要等待所有并发的异步事件执行后再执行回调方法
- 同时发送多个请求
- 注册方法分为三种     tap注册 和 tapAsync(cb)注册  tapPromise(注册是promise) 
- call callAsync promise


### tapAsync版本
```js
let {AsyncParallelHook} = require(tapable)
class Lesson {
    constructor(){
        this.hooks = {
            arch: new AsyncParallelHook(),
        }
    }
    tap(){
        this.hooks.arch.tapAsync('node',(name,cb)=>{
            setTimeout(()=>{
                console.log('node',name);
                cb();
            },1000)
        })
        this.hooks.arch.tapAsync('react',(name,cb)=>{
            setTimeout(()=>{
                console.log('react',name);
                cb();
            },1000)
        })
    }

    start(){
        this.hooks.arch.callAsync('jw',function(){
            console.log('end')
        })
    }
}
let l = new Lesson()
l.tap()
l.start()

//  原理
class AsyncParallelHook{
    constructor(args){
        this.task = []
    }
    
    tapAsync(name,task){
        this.task.push(task)
    }
    callAsync(...args){
        let finalCb = args.pop()
        let index = 0;
        let done = ()=>{ //promise.all
            index++;
            if(index == this.tasks.length){
                finalCb();
            }
        }
        this.tasks.foreach((task)=>{ task(...args,done) }
    }
}
let hook = new AsyncParallelHook()
hook.tapAsync('react',(name,cb)=>{
    setTimeout(()=>{
        console.log('node',name);
        cb();
    },1000)
})
hook.tapAsync('react',(name,cb)=>{
    setTimeout(()=>{
        console.log('react',name);
        cb();
    },1000)
})
hook.callAsync('jw')

```

### promise版本

```js
class AsyncParallelHook{
    constructor(){
        this.tasks = []
    }
    tapPromise(name,task){
        this.task.push(task)
    }
    promise(...args){
        let promiseAry =  this.tasks.map(task=>task(...args))
        return Promise.all(promiseAry)
    }
}

let hook = new AsyncParallelHook();
hook.tapPromise('react',function(name){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('react',name)
            resolve()
        })
    })
})
hook.tapPromise('node',function(name){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('node',name)
            resolve()
        })
    })
})

hook.promise('jw').then(()=>{
    console.log('end')
})
//  AsyncParallelBailHook  异步带保险的钩子

```