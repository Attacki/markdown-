# 盒子模型的属性

```js
// 获取p元素before伪类的content属性内容
console.log(window.getComputedStyle(p, "before").content);
/*
*       ->获取页面中元素的方法
*       document.getElementById()
*       context.getElementsByTagName(TAGNAME) ->把指定容器中子子孙孙辈分的所有标签名为TAGNAME的都获取到了
*       context.getElementsByClassName(CLASSNAME) ->在IE6~8下不兼容
*       document.getElementsByName() ->在IE浏览器中只对表单元素的name起作用
*       document.body
*       document.documentElement
*       context.querySelector/context.querySelectorAll ->在IE6~8下不兼容 通过这个获取的节点集合不存在DOM映射
*
*       ->描述节点和节点之间关系的属性 (在标准浏览器中会把空格和换行当做文本节点处理)
*       childNodes
*       children ->在IE6~8下获取的结果和标准浏览器获取的结果不一致
*       parentNode
*       previousSibling/previousElementSibling
*       nextSibling/nextElementSibling
*       lastChild/lastElementChild
*       firstChild/firstElementChild
*
*       ->DOM的增删改
*       createElement
*       document.createDocumentFragment()
*       appendChild
*       insertBefore
*       cloneNode(true/false)
*       replaceChild
*       removeChild
*       get/set/removeAttribute


*       ->js中的盒子模型
*       clientHeight 高度+上下填充
*       clientWidth  宽度+左右填充
*       clientLeft  左边框宽度
*       clientTop   上边框宽度
*
*       offsetWidth  宽度+左右填充+左右边框  ==> clientWidth+左右边框
*       offsetHeight 高度+上下填充+上下边框  ==> clientHeight+上下边框
*       offsetLeft  当前元素距离父元素左偏移量
*       offsetTop  当前元素的外边框距离父级元素的内边框的上偏移量
*       offsetParent
*
*       scrollWidth  区别于clientWidth  内容+左填充,如果没有发生溢出就是和clientWidth相等的
*       scrollHeight 区别于clientHeight 内容+上填充
*       scrollTop
*       scrollLeft
*
*       获取可视窗口：document.documentElement.clientHeight || document.body.clientHeight
*
*/
```

### 获取元素的 css 属性

```js
// 通过元素的style属性只能获取行内样式,但是我们一般不把样式写在行内
// 获取元素的浏览器计算后的样式
// 需要规避复合值的问题 margin padding
// 把带获取到带单位的把单位去掉  px em pt rem deg
function getCss(curEle, attr) {
    //处理带单位的问题
    var reg = /^(-?\d+\.?\d+)(?:px|em|pt|deg|rem)$/;
    var val = null;
    if (/MSIE (?:6|7|8)/.test(window.navigator.userAgent)) {
        debugger;
        //这里处理filter的滤镜问题  alpha(opacity=40);
        if (attr === "opacity") {
            //alpha(opacity=40)
            val = curEle.currentStyle["filter"];
            var reg1 = /^alpha\(opacity=(\d+(\.\d+)?)\)/;
            return reg1.test(val) ? RegExp.$1 / 100 : 1;
        } else {
            val = curEle.currentStyle[attr];
        }
    } else {
        val = window.getComputedStyle(curEle, null)[attr];
    }
    return reg.test(val) ? parseFloat(val) : val; //如果正则验证通过，说明返回值是带单位的，那么我们就要人为去掉这个单位。否则不变
}
```

### 获取视口元素属性

```js
function getWin(attr, val) {
    //一个参数的时候是读取，两个参数可以赋值
    if (val !== undefined) {
        document.documentElement[attr] = val;
        document.body[attr] = val;
    }
    return document.documentElement[attr] || document.body[attr];
}
```

### 获取距离视口边界的距离

```js
//offsetParent 和 parentNode 完全不是一回事,
// offsetParent取决你元素的相对位置,返回第一个非流布局的父级元素，也就是postion的值是 absolute，relative，fixed，（inherit 继承父元素也是前三者）其中之一
// parentNode返回的就是父节点
function offset(ele) {
    //只要存在offsetParent我们就尝试把offsetParent的边框和它的offsetLeft加上，一直到body不存在offsetParent（body的offsetParent是null）为止。我们知道截至的条件，所以使用while循环
    var eleLeft = ele.offsetLeft; //当前元素的offsetLeft
    var eleTop = ele.offsetTop; //当前元素的offsetTop
    var eleParent = ele.offsetParent;
    var left = null;
    var top = null;
    left += eleLeft;
    top += eleTop;
    while (eleParent) {
        //存在父级相对位置参照物
        //console.log(eleParent);
        /*
         *  ps: ie8中会有一个问题如果在ie8中就不加父级的边框了。因为已经加过了。
         *  判断我的当前浏览器是不是ie8   1 可以用正则 test MSIE 8.0   2 字符串
         *  中的indexOf MSIE 8.0 判断 -1. window.navigator.userAgent
         * */
        left +=
            eleParent.clientLeft /*父级参照物的边框*/ + eleParent.offsetLeft;
        top += eleParent.clientTop /*父级参照物的上边框*/ + eleParent.offsetTop;
        eleParent = eleParent.offsetParent; //??
    }
    return { left: left, top: top };
}
```

### 图片延迟加载

```js
// 优化： 1 减少请求数量  2 雪碧图  3 打包压缩  4 压缩 5 图片延迟加载
window.onscroll = function() {
    //当鼠标滚轮的时候判断需要加载的图片是否已经完全进入到可视窗口内
    var winBottomDisBodyTop =
        utils.getWin("clientHeight") /*获取窗口的高度*/ +
        utils.getWin("scrollTop"); /*窗口滚出去的高度*/ //窗口底部距离body顶部的距离
    //如果这个距离大于图片（盒子的高度+图片盒子距离body顶部的距离） 说明这个图片已经完全进入到可视窗口内
    var imgBoxBottomDisBodyTop =
        img.parentNode.offsetHeight + utils.offset(img.parentNode).top;
    console.log(winBottomDisBodyTop - imgBoxBottomDisBodyTop); //图片完全进入到可视窗口内，这个差就是大于0的
    if (winBottomDisBodyTop - imgBoxBottomDisBodyTop > 0) {
        //img.src = img.getAttribute('trueSrc');
    }
    //我们发现如果图片资源是无效的，我们却还要赋值给图片的src属性就会有一个图片加载失败的标志。所以我们在赋值src属性之前要做图片有效性的验证
    //那么我们就创建一个临时的img
    if (winBottomDisBodyTop - imgBoxBottomDisBodyTop > 0) {
        if (img.isLoadSuccess) {
            return;
        }
        var tempImg = new Image(); //这就创建了一个图片对象
        //var img = document.createElement('img');
        tempImg.src = img.getAttribute("trueSrc"); //??我让一个临时的img去加载我的真实图片资源，无论加载是否成功都不会对我网页内的真实img有影响
        tempImg.onload = function() {
            //当图片加载成功的时候,说明我的真实资源路径是有效的
            img.src = this.src;
            tempImg = null;
        };
        img.isLoadSuccess = true;
    }
};
```

### 公告栏
```js
//->原理：
//1)保证页面上有两个容器:boxCon_begin,boxCon_end,boxCon_end中的内容个boxCon_begin中的内容一模一样
//2)获取boxCon_begin的宽度:boxCon_begin_width
//3)设置定时器,每隔一段时间,让boxCon的scrollLeft值进行累加；当我们的scrollLeft值已经>=boxCon_begin_width,说明已经让第二个div的语句开头正好处于最左边开始的位置,我们立马让boxCon的scrollLeft=0,这样又开始从头走了

var boxCon = document.getElementById("boxCon");
var boxCon_begin = document.getElementById("boxCon_begin");
var boxCon_begin_width = utils.getCss(boxCon_begin, "width");
var timer = window.setInterval(function () {
    var curLeft = boxCon.scrollLeft;
    if (curLeft >= boxCon_begin_width) {
        boxCon.scrollLeft = 0;
        return;
    }
    boxCon.scrollLeft = ++curLeft;
}, 5);
```

### 回到顶部
```js
~function () {
    var linkTo = document.getElementById("linkTo");
    var clientH = utils.win("clientHeight");

    function windowScroll() {
        var curTop = utils.win("scrollTop");
        linkTo.style.display = curTop >= clientH ? "block" : "none";
    }

    window.onscroll = windowScroll;
    linkTo.onclick = function () {
        this.style.display = "none";
        window.onscroll = null;
        var target = utils.win("scrollTop"), 
            duration = 5000, //总时长
            interval = 10,   //滚动条动一次的间隔
            step = (interval / duration) * target;
        var timer = window.setInterval(function () {
            var nowTop = utils.win("scrollTop");
            if (nowTop <= 0) {
                window.clearInterval(timer);
                window.onscroll = windowScroll;
                return;
            }
            utils.win("scrollTop", nowTop - step);
        }, interval);
    }
}();
```

### css属性
- :target  CSS伪类代表一个唯一的页面元素(目标元素)，其id 与当前URL片段匹配 
```css
:target {
  border: 2px solid black;
}
```

### 工具函数
- addClass 增加样式类名
- removeClass 删除样式类名
- hasClass 判断是否存在某一个样式类名
- children 获取一个元素的所有子元素，可带条件
```js
    //->hasClass:验证当前元素中是否包含className这个样式类名
    function hasClass(curEle, className) {
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    //->addClass:给元素增加样式类名
    function addClass(curEle, className) {
        //->为了防止className传递进来的值包含多个样式类名,我们把传递进来的字符串按照一到多个空格拆分成数组中的每一项
        var ary = className.split(/ +/g);

        //->循环数组,一项项的进行验证增加即可
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (!hasClass(curEle, curName)) {
                curEle.className += " " + curName;
            }
        }
    }
    addClass(box, "position");
    addClass(box, "position     bg");

    //->removeClass:给元素移除样式类名
    function removeClass(curEle, className) {
        var ary = className.split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }
    removeClass(box, "border position");

    //->children 获取一个元素的所有子元素，可带条件
    //->首先获取所有的子节点(childNodes),在所有的子节点中把元素节点过滤出来(nodeType===1)
    //->如果多传递一个标签名的话,我们还在在获取的子元素集合中把对应标签名的进行二次筛选
    function children(curEle, tagName) {
        var ary = [];
        //->IE6~8下不能使用内置的children属性,我们自己写代码实现
        if (/MSIE (6|7|8)/i.test(navigator.userAgent)) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                if (curNode.nodeType === 1) {
                    ary[ary.length] = curNode;
                }
            }
        } else {
            //->标准浏览器中,我们直接使用children即可,但是这样获取的是一个元素集合(类数组),为了和IE6~8下保持一致,我们借用数组原型上的slice,实现把类数组转换为数组
            ary = Array.prototype.slice.call(curEle.children);
        }

        //->二次筛选
        if (typeof tagName === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    //->不是我想要的标签
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }
    children(Div, "p")

```





