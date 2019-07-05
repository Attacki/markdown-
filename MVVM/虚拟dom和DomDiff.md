# 虚拟dom
### 定义虚拟dom类
```js
class element{
    constructor(type,props,children){
        this.type = type
        this.props = props
        this.children = children
    }
}
```
### 生成虚拟dom元素
```js
function createElement(type,props,children){
    return new element(type,props,children)
}
```
### 为虚拟dom元素设置属性
```js
function setAttr(node,key,value){
    switch (key) {
        case 'value':
            if(node.tagName.toUpperCase === 'INPUT'|| node.tagName.toUpperCase === 'TEXTAREA'){
                node.value = value
            }else{
                node.setAttribute(key,value)
            }
            break;
        case 'style':
            node.style.cssText = value
            break
        default:
            node.setAttribute(key,value)
            break;
    }
}
```
### 渲染虚拟dom为真实dom
```js
function render(obj){
    let el = document.createElement(obj.type);
    for(let key in obj.props){
        //设置属性的方法
        setAttr(el,key,obj.props[key])
    }
    obj.children.forEach(ele => {
        let child = (ele instanceof element)?render(ele):document.createTextNode(ele);
        el.appendChild(child);
    });
    return el;
}
```


### 实例 
```js

const ATTRS='ATTRS',
    REPLACE='REPLACE',
    REMOVE='REMOVE',
    TEXT='TEXT';
let allPatches,
    p_index = 0,
    Index= 0  
// 由于index在传进diffWalk函数之后变为形参了，所以在父级作用域循环调用diffChildren所传递index一直没发生变化
// diffWalk函数必须要传递一个形参index ，为的是在私有作用域中形成一个不变的index

// 将虚拟dom转化成真实dom
let virtualDOM = createElement('ul',{class:'list'},[
    createElement('li',{class:'child'},['a']),
    createElement('li',{class:'child'},['a']),
    createElement('li',{class:'child'},['a'])
])
let virtualDOM2 = createElement('ul',{class:'list'},[
    createElement('li',{class:'child'},['b']),
    createElement('li',{class:'child'},['d']),
    createElement('div',{class:'child'},['a'])
])
let dom = render(virtualDOM);
document.body.append(dom);
let patches = diff(virtualDOM,virtualDOM2)
patch(dom,patches)
/** <ul class="list">
 *      <li class="child">a</li>
 *      <li class="child">a</li>
 *      <li class="child">a</li>
 *  </ul> 
*/ 
```

# dom diff规则
- 当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包 {type:'ATTRS',attrs:{class:'list-group'}}
- 新的dom节点不存在 {type:'REMOVE',index:xxx} //index代表要删除的序号
- 节点类型不相同 直接采用替换模式 {type:'REPLACE',newNode:newNode}
- 文本的变化 {type:'TEXT',text:1}

```js
// 深度优先遍历算法

// DOM diff方法
function diff(oldNode,newNode){
    let pathches = {}
    diffWalk(oldNode,newNode,Index,pathches)
    return pathches
}

function diffAttr(oldAttr,newAttr){
    let patch = {}
    // 遍历旧节点 查看有更改的内容
    for(var key in oldAttr){
        if(oldAttr[key]!=newAttr[key]){
            patch[key] = newAttr[key] // 可能是undefined
        }
    }
    // 遍历新节点 查看是否有新属性
    for(var key in newAttr){
        if(!oldAttr.hasOwnProperty(key)){
            patch[key] = newAttr[key]
        }
    }
    return patch
}

function isString(node){
    return Object.prototype.toString.call(node) === '[object String]';
}
function diffChildren(oldChildren,newChildren,pathches){
    oldChildren.forEach((child,idx)=>{
        diffWalk(child,newChildren[idx],++Index,pathches)
    })
}

function diffWalk(oldNode,newNode,index,pathches){
    let currentPatch = [] // 每个元素都有一个补丁对象
    if(!newNode){ // 如果没有新节点
        currentPatch.push({type:REMOVE,index})
    }else if(isString(oldNode)&&isString(newNode)){ // 判断文本是否一样
        if(oldNode !== newNode){
            currentPatch.push({type:TEXT,text:newNode})
        }
    }else if(oldNode.type === newNode.type){ // 旧节点和新节点类型是否相同
        let attrs = diffAttr(oldNode.props,newNode.props)
        // 比较属性是否有更改
        if(Object.keys(attrs).length>0){
            currentPatch.push({type:ATTRS,attrs})
        }
        // 如果有儿子节点 遍历儿子
        diffChildren(oldNode.children,newNode.children,pathches)
    }else{
        // 说明节点被替换了
        currentPatch.push({type:REPLACE,newNode})
    }
    if(currentPatch.length > 0){
        // 将元素和补丁对应起来 放到大补丁包中
        pathches[index] = currentPatch
        console.log(pathches)
    }
}
```

# 对节点更新内容进行打包
```js

function patch(node,patches){
    allPatches = patches
    patchWalk(node) //对节点进行遍历更新
}

function patchWalk(node){
    // 按次序将补丁打包到对应的节点
    let currentPatch = allPatches[p_index++]    // 获取当前节点所需要的补丁包
    let childNodes = node.childNodes            
    childNodes.forEach(child=>patchWalk(child)) // 对子节点进行遍历打包
    if(currentPatch){   //如果补丁包有内容就执行打包
        doPatch(node,currentPatch)
    }
}

function doPatch(node,patches){
    patches.forEach(patch=>{
        switch (patch.type) {
            case 'ATTRS':
                for(let key in patch.attrs){
                    let value = patch.attrs[key]
                    if(value){
                        setAttr(node,key,value)
                    }else{
                        node.removeAttribute(key)
                    }
                }
            break;
            case 'TEXT':
                node.textContent = patch.text
            break;
            case 'REPLACE':
                let newNode = (patch.newNode instanceof element)?render(patch.newNode):document.createTextNode(patches.newNode)
                node.parentNode.replaceChild(newNode,node)
            break;
            case 'REMOVE':
                node.parentNode.removeNode(node)
                
            break;
            default:
                break;
        }
    })
}
```
