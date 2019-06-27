# 异步串行的钩子
会挨个处理，当前异步函数执行结束，才会执行下一个函数

`tapAsync版本`
```js
class AsyncParallelHook{
    constructor(args){
        this.task = []
    }
    
    tapAsync(name,task){
        this.task.push(task)
    }
    callAsync(...args){
        let index = 0;
        let finalCb = args.pop()
        let next = ()=>{ 
            if( this.tasks.length === index) return finalCb() 
            let task = this.tasks[index++];
            task(...args, next);
        };
        next()
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
hook.callAsync('jw',function(){
    cosnole.log('end')
})
```


`promise版本`

```js
class AsyncSeries{
    constructor(args){
        this.task = []
    }
    
    tapPromise(name,task){
        this.task.push(task)
    }
    promise(...args){
        let index = 0;
        let [first, ...others] = this.tasks
        others.reduce((a,b)=>{  //redux源码是一样的
            return a.then(b())
        },first(...args))
    }
}
let hook = new AsyncSeries()
hook.tapPromise('react',(name)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('node',name);
            resolve();
        },1000)
    })
})
hook.tapPromise('react',(name)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('react',name);
            resolve();
        },1000)
    })
})
hook.promise('jw').then(function(){
    cosnole.log('end')
})
```




# 异步串行瀑布函数

```js
class AsyncSeriesWaterfallHook{
    constructor(args){
        this.task = []
    }
    tapAsync(name,task){
        this.task.push(task)
    }
    callAsync(...args){
        let index = 0;
        let finalCb = args.pop();
        let next = (err,data)=>{ 
            let task = this.tasks[index];
            if(!task) return finalCb();
            if(index == 0){
                task(...args, next);
            }else{
                task(data, next);
            }
            index++;
        };
        next();
    }
}
let hook = new AsyncSeriesWaterfallHook()
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
hook.callAsync('jw',function(){
    cosnole.log('end')
})
```