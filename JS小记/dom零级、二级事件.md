# Dom事件

### dom零级事件和dom二级事件
- DOM零级事件绑定和DOM二级事件绑定可以共存，不冲突(DOM0和DOM2的事件处理机制是不一样的)  
- DOM零级起始就是对象的属性名和属性值操作的机制(onclick就是一个属性名，绑定的方法就是它的一个属性值，当行为触发的时候获取到属性值即可)  
- DOM二级事件的机制是使用了浏览器的事件池/事件队列的机制完成的
- DOM零级事件绑定兼容所有的浏览器，而DOM2事件绑定兼容性特别差(IE6~8和标准浏览器之间的区别)
- DOM零级事件绑定在移除绑定方法的时候也有一些细节的问题需要重点考虑：移除：不需要管之前绑定的是啥方法
- DOM二级事件绑定，以后处理DOM2绑定的时候，需要"瞻前顾后"：绑定的时候要想着我可能还会移除，所有我们绑定的方法基本上都是实名函数


### 事件委托
> 事件委托:利用了事件的冒泡传播机制(当前元素的某一个行为被触发,那么其所有的父级元素的相关行为都会被触发),如果一个容器中的很多元素都要给点击的行为(其他行为一样)绑定方法,我们不需要一个个的绑定了,只需要给最外层的容器绑定即可,这样不管哪个元素的点击行为被触发,最外层的都会被触发,并且可以获取到事件源是谁,通过判断不同的事件源我们做不同的事情即可
```js
document.body.onclick = function (e) {
    e = e || window.event;
    e.target = e.target || e.srcElement;
    if (e.target.id === "center") {
        console.log("CENTER");
        return;
    }else if (e.target.id === "inner") {
        console.log("INNER");
        return;
    }else if (e.target.id === "outer") {
        console.log("OUTER");
        return;
    }else{
        console.log("BODY")
    };
};
```

### 事件冒泡和捕获
```js
//1、事件的“冒泡传播”:触发当前元素的某一个行为,那么当前元素所有的父级元素,的相关行为,都会被依次触发(由内到外的)
    //例如：我点击的是CENTER,CENTER->INNER->OUTER->BODY->HTML->DOCUMENT这条链上的所有元素的点击行为都会被依次触发(我们在项目中一般只需要处理到BODY即可,在不同浏览器中对于HTML/DOCUMENT是否被传播的机制是不一样的)

//2、阻止事件的冒泡传播
//->e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;

//3、DOM零级事件绑定只能控制我们的方法在“事件的冒泡传播阶段”发生(把对应的方法执行)

```
### 事件的传播机制
- 捕获阶段(第一阶段)当某个行为触发时，首先从外向内依次查找对应的html元素，在查找的过程中，把当前这些元素在捕获阶段绑定的方法执行
- DOM2级事件绑定既可以往冒泡阶段绑定，也可以往捕获阶段绑定
	1. center.addEventListener("click",function(){},false) //把当前方法绑定在了"冒泡阶段"
	2. center.addEventListener("click",function(){},true) //把当前方法绑定在了"捕获阶段"
- 我们可以阻止时间的冒泡传播，但是阻止不了它的捕获传播
- 冒泡阶段(第二阶段) 当元素的某一个行为触发的时候,首先进行捕获阶段,捕获完成后在执行冒泡阶段从内向外,把当前这些元素在冒泡阶段绑定的方法依次执行. center.onclick=function(){} 这个方法其实就是绑定在"冒泡阶段的方法"
- 通过dom零级时间绑定的所有方法都是绑定在了"冒泡阶段"




### 事件绑定
- 事件绑定:给行为绑定了一个方法,当行为触发的时候执行对应的方法
    1. DOM零级事件绑定(onxxx=function...)、DOM二级事件绑定(在元素对象原型链上的EventTarget这个类就是DOM二级事件绑定的类,在EventTarget.prototype上提供了addEventListener/removeEventListener就是DOM二级事件绑定/移除事件绑定的方法)
    2. 单从性能角度来说,我们的DOM0级事件绑定要优于DOM2级事件绑定(零级找的都是自己的私有的属性，而二级是通过原型一级级的查找才找到的)


### 事件对象
```js
oBox.onclick = function (e) {
    e = e || window.event;
    console.log(e);
    //->e.type:当前本次操作的行为类型  type:"click"
    //->e.clientX/e.clientY:当前鼠标的触发点距离当前窗口(不是距离BODY)X轴/Y轴的坐标

    //[兼容性]
    //->e.target:事件源(鼠标是在哪个元素上触发的这个行为,那么当前的事件源就是谁) 在IE6~8中是不存在e.target的,只能使用e.srcElement
    e.target = e.target || e.srcElement;
    //->e.pageX/e.pageY:当前鼠标的触发点距离BODY的X轴/Y轴的坐标(在IE6~8中是不存在这两个属性的)
    e.pageX = e.pageX || ((document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX);
    e.pageY = e.pageY || ((document.documentElement.scrollTop || document.body.scrollTop) + e.clientY);

    //->e.preventDefault:阻止默认行为(阻止浏览器天生的一些行为)
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
};
```


### Dom二级事件绑定移除
```js
function bind(ele,type,handler){//handler直译为句柄，方法名，方法引用的意思
	if(ele.addEventListener){
		ele.addEventListener(type,handler,false);	
	}else if(ele.attachEvent){
		
		//1、事件触发的时候handler方法执行
		//2、让handler方法里的this指向ele
		
		//记好一个原则：如果是解决this关键字的指向，则记好用call或apply方法
		
		//以下的处理方式已经就可以实现让事件触发的时候，handler里的this指向ele了。如果就是解决仅仅是解决this关键字关键，已经就解决了
		
		//即可以把fnTemp保存下来，还要保证fnTemp的安全，还要把多次变形得成的fnTemp都可以保存下来，并且在unbind里还可以识别出来当前这个fnTemp是由那个方法变形而来
		
		if(!ele["abind"+type]){
			//这个自定义属性的命名规则是：abind是属性的前缀，click是属性的区分符
			//ele.click
			//为什么要用click来命名呢？把绑定在不同事件类型上的方法，以事件类型做为命名的依据来定义不同的数组，来保存不同的事件上的方法。
			//但是我们又不能直接用事件类型作属性，容易和系统属性引起冲突，所以才在它前面加个前缀（为了让属性名变长，降低冲突的机率）
			//ele[type]=[];
			
			ele["abind"+type]=[];	
		}
		var fnTemp=function(){handler.call(ele);};
		fnTemp.photo=handler;//photo"照片"，保存着它原来的面貌
		ele["abind"+type].push(fnTemp);
		ele.attachEvent("on"+type,fnTemp);
	}
}
bind(ele,"click",fn1);

function unbind(ele,type,handler){
    if(ele.removeEventListener){
        ele.removeEventListener(type,handler,false);
    }else if(ele.detachEvent){
        var a=ele["abind"+type];
        //a里的第i项可能就是handler变形而来
        //a[i]==handler
        //现在需要一个机制,能识别出a[i]是由handler变形来的
        if(a){
            for(var i=0;i<a.length;i++){
                if(a[i].photo==handler){
                    ele.detachEvent("on"+type,a[i]);
                    return;	
                }
            }
        }
        //ele.detachEvent("on"+type,fnTemp);
    }
}
unbind(ele,"click",fn1);
```

### 解决事件绑定的顺序问题
```js
on(ele,"click",fn1);
off(this,"click",fn1);

function on(ele,type,fn){
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;	
	}
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];
		//这里的代码在相同的元素相同事件的前提下，只会执行一次
		ele.attachEvent("on"+type,function(){fire.call(ele)});
	}
	
	var a=ele["aEvent"+type]; //元素的自定义属性
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;	
	}
	a.push(fn);//这是关键的一步：把方法保存到事件池里
	
	//当事件触发的时候，要遍历执行a里的这些方法
	//bind(ele,type,fire);//on每运行一次，bind就会执行一次，但bind的运行只有第一次有效。在bind里fire不会被重复绑定
	
	//ele.attachEvent("on"+type,function(){fire.call(ele)});//这样执行fire会被重复绑定到ele的type事件上。
	//这个问题如何解决呢？要无论on执行多少次，fire方法只能被绑定一次。在这个函数里有一个地方，无论on执行多少次,ele.attachEvent在相同的事件类型下，只会执行一次。
}

function fire(){
	var e=window.event;//取得事件对象
	var type=e.type;//从事件对象中得到相应的事件类型
	//需要把数组找到，并且遍历执行数组里的方法
	if(!e.target){
		e.target=e.srcElement;
		e.preventDefault=function(){e.returnValue=false;};
		e.stopPropagation=function(){e.cancelBubble=true;};
		e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
		e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
		
			
	}
	var a=this["aEvent"+type];	
	if(a){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);
			}else{
				a.splice(i,1);
				i--;	
			}
		}
	}
}

function off(ele,type,fn){//解除绑定，其实也是“假”解除，从数组里把对应的方法去掉
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
		return;	
	}
	var a=ele["aEvent"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				//a.splice(i,1);
				a[i]==null;//为了避免数组塌陷
				return;	
			}
		}
	}
}
```

### 异步编程
```js
// JS是单线程的,一次只能处理一件事情,只有当前事情完成后才可以做下一件事情 ->但是JS为了优化任务队列和性能,提供了一些异步编程模式:把一些需要等带一段时间才会处理的事情放在"等待的任务队列中",在此等待期间,不闲着,继续执行主任务队列中的事情,只有当主任务队列中的事情做完了,再能闲下来看看哪个等待的任务到时间了,在执行对应的任务

```

### 键盘事件对象
```js
document.onkeydown = document.onkeyup = document.onkeypress = function (e) {
    e = e || window.event;
    var top = parseFloat(oDiv.style.top);
    var left = parseFloat(oDiv.style.left);
    switch (e.keyCode) {
        case 37:
            left -= 5;
            break;
        case 39:
            left += 5;
            break;
        case 38:
            top -= 5;
            break;
        case 40:
            top += 5;
    }
    oDiv.style.top = top + "px";
    oDiv.style.left = left + "px";
    //->e.keyCode:每一个键盘按键码
    //->四个方向键(左、上、右、下):37、38、39、40
    //Ctrl ->17
    //Alt ->18
    //Space ->32
    //Shift ->16
    //Enter ->13
    //Backspace ->8
    //Delete ->46
    //Esc ->27
};
```







