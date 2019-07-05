class MVVM{
    constructor(options){
        this.$el = this.element(options.el)
        this.$data = options.data
        if(this.$el){
            // 数据劫持 把对象的所有属性都改为 get和set方法
            new Observer(this.$data)
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
}

class Compiler{
    constructor(el,vm){
        this.el = el
        this.vm = vm
        // 1. 获取node节点，对节点属性进行遍历，转移到文档碎片
        this.fragment = this.node2Fragment()
        // 2. 根据vm.$data对节点属性进行编译
        this.compile(this.fragment.childNodes)
        // 3. 将编译完成的文档碎片重新插入根节点
        el.appendChild(this.fragment)
    }

    /* 创建文档碎片 */ 
    node2Fragment(){
        let fragment = document.createDocumentFragment()
        while(this.el.firstChild){
            fragment.appendChild(this.el.firstChild)
        }
        return fragment
    }

    /* 判断是否是指令 */ 
    isDirect(attr){
        // 判断是否为指令
        return attr.name.includes('bee-')
    }

    /* 执行编译 */
    compile(nodes){
        Array.from(nodes).forEach(node=>{
            if(node.nodeType == 1){
                // 这里表示是元素节点
                // 例如 <span>{{message.tip}}<span>
                this.compileElement(node)
                // 对元素子节点执行递归编译
                this.compile(node.childNodes)
            }else{
                // 这里表示是文本节点
                var reg = /\{\{([^}]+)\}\}/g;
                if(reg.test(node.textContent)){
                    // 如果文本节点有内容就编译
                    this.compileText(node,node.textContent.match(reg))
                }
            }
        })
    }

    compileElement(node){
        let attrs = node.attributes
        Array.from(attrs).forEach(attr=>{
            if(this.isDirect(attr)){
                let [,type] = attr.name.split('-')
                let expr = attr.value
                utils[type](node,expr,this.vm)
            }
        })
    }

    compileText(node,exprs){
        utils['text'](node,exprs,this.vm)
    }

}

const utils = {
    getVal(expr,vm){
        // message.a.b.c.d
        let props =  expr.split('.')
        let value = props.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
        return value
    },
    getExpr(expr){
        var reg = /\{\{([^}]+)\}\}/g;
        return expr.replace(reg,(...args)=>args[1])
    },
    model(node,expr,vm){
        // 将值赋给对应的元素
        // 添加监控 数据变化 调用cb
        new Watcher(vm,expr,(newVal)=>{
            // 当值变化后会调用cb 将新的值传递过来
            node.value = this.getVal(expr, vm)
        })
        node.value = this.getVal(expr, vm)
    },
    text(node,exprs,vm){
        expr_ary = []
        exprs.forEach(expr=>{
            // expr = '{{message.greet}}'
            expr_ary.push(this.getExpr(expr))
            new Watcher(vm,expr,(newVal)=>{
                // 当数据变化了，文本节点需要重新获取依赖数据，更新文本内容
                this.textUpdate(expr_ary)
            })
        })
        this.textUpdate(expr_ary)
    },
    textUpdate(expr_ary){
        node.textContent = ''
        expr_ary.forEach(expr=>{
            node.textContent += this.getVal(expr, vm)
        })
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
        Object.keys(data).forEach(key=>{
            // 劫持
            this.defineReactive(data,key,data[key])
            this.observer(data[key])
        })
    }
    // 定义响应式
    defineReactive(obj,key,value){
        let that = this;
        Object.defineProperty(obj,key,{
            enumerable:true,  //数据可枚举，for循环可循环出这个值
            configurable:true,
            get(){      // 当取值时调用的方法
                return value;
            },
            set(newValue){  //当给data属性中设置值时 更改获取的属性的值
                if(newValue!=value){
                    // 这里 this不是实例
                    that.observer(newValue)
                    value = newValue
                }
            }
        })
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
    getVal(expr,vm){
        // message.a.b.c.d
        let props =  expr.split('.')
        return props.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    }
    get(){
        let value = this.getVal(this.vm,this.expr);
        return value
    }
    // 对外暴露的方法
    update(){
        let newVal = this.getVal(this.vm,this.expr);
        let oldVal = this.value;
        if(newVal != oldVal){
            this.cb(newVal) // 对应watch的回调函数
        }
    }
}

