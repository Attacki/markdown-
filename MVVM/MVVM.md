## 用户代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app">
        <div>{{message.greet}}</div>
        <input type="text" bee-model='message.greet'></br></br></br>
        <span>
            {{message.tip}}
        </span></br>
        <input type="text" bee-model='message.greet'></br>
        {{message.tip}}</br>
        {{message.tip}}
    </div>
<script src="mvvm.js"></script>
<script>
var vm = new MVVM({
    el:'#app',
    data:{
        message:{
            greet: 'hello everyone!~',
            tip: 'good job!~'
        }
    }
})
</script>
</body>
</html>
```

## MVVM类 数据驱动视图
```js

/* MVVM.js */ 
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
```

## Compiler类 对页面内容进行编译
```js
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
        node.value = this.getVal(expr, vm)
    },
    text(node,exprs,vm){
        node.textContent = ''
        exprs.forEach(expr=>{
            // expr = '{{message.greet}}'
            expr = this.getExpr(expr) // message.greet
            node.textContent += this.getVal(expr, vm);
        })
    }
}

```








