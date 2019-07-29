class Dep{
    constructor(){
        // 订阅的数组
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}

// 观察者的目的就是给需要变化的那个元素增加一个观察者，当数据变化执行对应的方法
// 用新值和老值进行对比，发生变化，就调用更新
// vm
class Watcher{
    constructor(vm, expr, cb){
        this.vm = vm
        this.expr = expr
        this.cb = cb
        // 获取旧值
        this.value = this.get()
    }
    getVal(vm,expr){
        // message.a.b.c.d
        expr =  expr.split('.')
        return expr.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    }
    get(){
        Dep.target = this
        let value = this.getVal(this.vm,this.expr)
        Dep.target = null
        return value
    }
    // 对外暴露的方法
    update(){
        let newVal = this.getVal(this.vm,this.expr)
        let oldVal = this.value
        if(newVal != oldVal){
            this.cb(newVal) // 对应watch的回调函数
        }
    }
}

class Observer{
    constructor(data){
        this.observer(data)
    }

    observer(data){
        // 将data数据的属性改成set和get的形式
        if(!data || typeof data!=='object'){
            return
        }
        // 要将数据一一劫持,获取key和value
        Object.keys(data).forEach(key=>{
            // 劫持
            this.defineReactive(data,key,data[key])
            this.observer(data[key]) //深度递归劫持
        })
    }
    // 定义响应式
    defineReactive(obj,key,value){
        let that = this;
        let dep = new Dep()  //每个变化的数据 都会对应一个数组,这个数组是存放所有更新的操作
        Object.defineProperty(obj,key,{
            enumerable:true,  //数据可枚举，for循环可循环出这个值
            configurable:true,
            get(){  // 当取值时调用的方法
                Dep.target && dep.addSub(Dep.target)
                return value;
            },
            set(newValue){  //当给data属性中设置值时 更改获取的属性的值
                if(newValue!=value){
                    // 这里 this不是实例 
                    that.observer(newValue) //如果是对象继续劫持
                    value = newValue
                    dep.notify() //通知所有人 数据更新
                }
            }
        })
    }

}


const CompileUtil = {
    getVal(vm,expr){
        // message.a.b.c.d
        let props =  expr.split('.')
        let value = props.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
        return value
    },
    getTextVal(vm,expr){
        // {{message.greet}}{{message.tip}}
        return expr.replace(/\{\{([^}]+)\}\}/g,(...args)=>{
            return this.getVal(vm,args[1])
        })
        // 返回的内容是拼接好的
        // hello everyone!~good job!~
    },
    setVal(vm,expr,value){
        expr = expr.split('.')
        // 收敛
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex == expr.length-1){
                return prev[next] = value;
            }
            return prev[next]
        },vm.$data)
    },
    text(node,vm,expr){ //处理文本
        let updateFn = this.updater['textUpdater']
        let value = this.getTextVal(vm,expr)
        expr.replace(/\{\{([^}]+)\}\}/g,(...args)=>{
            new Watcher(vm,args[1],()=>{
                // 如果数据变化了,文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node,this.getTextVal(vm,expr))
            })
        })
        updateFn && updateFn(node,value)
    },
    model(node,vm,expr){
        // 将值赋给对应的元素
        // 添加监控 数据变化 调用cb
        let updateFn = this.updater['modelUpdater']
        // 这里应该加一个监控  数据变化 应该调用这个watch的callback
        new Watcher(vm,expr,(newVal)=>{
            // 当值变化后会调用cb 将新的值传递过来
            updateFn && updateFn(node,this.getVal(vm,expr))
        })
        node.addEventListener('input',(e)=>{
            let newValue = e.target.value
            this.setVal(vm,expr,newValue)
        })
        updateFn && updateFn(node,this.getVal(vm,expr))
    },
    updater:{
        // 文本更新
        textUpdater(node,value){
            node.textContent = value
        },
        // 输入框更新
        modelUpdater(node,value){
            node.value = value
        }
    }
}

class Compiler{
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el)
        this.vm = vm

        if(this.el){
            // 如果可以获取到挂载元素,开始编译
            // 1. 获取node节点，对节点属性进行遍历，转移到文档碎片
            let fragment = this.node2Fragment(this.el)
            // 2. 根据vm.$data对节点属性进行编译
            this.compile(fragment)
            // 3. 将编译完成的文档碎片重新插入根节点
            this.el.appendChild(fragment)
        }
    }

    isElementNode(node){
        return node.nodeType===1;
    }

    /* 创建文档碎片 */ 
    node2Fragment(el){
        let fragment = document.createDocumentFragment()
        let firstChild
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild)
        }
        return fragment //内存中的节点
    }

    /* 判断是否是指令 */ 
    isDirective(attr){
        return attr.includes('v-')
    }

    /* 执行编译 */
    compile(fragment){
        // 需要递归
        let childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                // 这里需要编译元素节点
                this.compileElement(node)
                // 是元素节点,还需要继续深入的检查
                this.compile(node)
            }else{
                // 文本节点
                var reg = /\{\{([^}]+)\}\}/g;
                if(reg.test(node.textContent)){
                    // 如果文本节点有内容就编译
                    this.compileText(node)
                }
            }
        })
    }

    compileElement(node){
        let attrs = node.attributes
        Array.from(attrs).forEach(attr=>{
            let attrName = attr.name
            // 判断属性是否包含"v-"
            if(this.isDirective(attrName)){
                // 取到对应的值放到节点中
                let expr = attr.value
                let [,type] = attrName.split('-')
                // node this.vm.$data // v-model v-text v-html
                CompileUtil[type](node,this.vm,expr)
            }
        })
    }

    compileText(node){
        // 带{{b.a.c}}
        let expr = node.textContent     //取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g    //{{c}}{{b}}{{a}}
        if(reg.test(expr)){
            // node this.vm.$data
            CompileUtil['text'](node,this.vm,expr)
        }
    }
}


class MVVM{
    constructor(options){
        this.$el = options.el
        this.$data = options.data
        if(this.$el){
            // 数据劫持 把对象的所有属性都改为 get和set方法
            new Observer(this.$data)
            this.proxyData(this.$data)
            // 用数据和元素进行编译
            new Compiler(this.$el,this)
        }else{
            console.log('没能选中要挂载的dom元素（根节点）')
        }
    }
    // 根据用户传入内容，获取dom元素
    element(node){
        return node.nodeType == 1 ?node:document.querySelector(node)
    }
    proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key] = newValue
                }
            })
        })
    }
}
