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

### 使用jquery制作tab标签页
```html
<html>
    <div class="box">
        <ul>
            <li>页卡一</li>
            <li>页卡二</li>
            <li class="select">页卡三</li>
            <li>页卡四</li>
        </ul>
        <div>内容一</div>
        <div>内容二</div>
        <div class="select">内容三</div>
        <div>内容四</div>
    </div>
    <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
    <script type="text/javascript">
        function tabChange() {
            var $boxUl = $(this).children("ul"), $boxLi = $boxUl.children("li");
            $boxLi.on("click", function () {
                var _index = $(this).index();
                $(this).addClass("select").siblings().removeClass("select");
                $(this).parent().nextAll().each(function (index, item) {
                    index === _index ? $(item).addClass("select") : $(item).removeClass("select");
                });
            });
        }
        jQuery.fn.extend({
            tabChange: tabChange
        });
        $(".box").tabChange();
    </script>
</html>
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
var utils = (function () {
    var flag = "getComputedStyle" in window;

    //->listToArray:把类数组集合转换为数组
    function listToArray(likeAry) {
        if (flag) {
            return Array.prototype.slice.call(likeAry, 0);
        }
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
        return ary;
    }

    //->formatJSON:把JSON格式字符串转换为JSON格式对象
    function formatJSON(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    //->offset:获取页面中任意元素距离BODY的偏移
    function offset(curEle) {
        var disLeft = curEle.offsetLeft, disTop = curEle.offsetTop, par = curEle.offsetParent;
        while (par) {
            if (navigator.userAgent.indexOf("MSIE 8") === -1) {
                disLeft += par.clientLeft;
                disTop += par.clientTop;
            }
            disLeft += par.offsetLeft;
            disTop += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: disLeft, top: disTop};
    }

    //->win:操作浏览器的盒子模型信息
    function win(attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    //->children:获取所有的元素子节点
    function children(curEle, tagName) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
            }
            nodeList = null;
        } else {
            ary = this.listToArray(curEle.children);
        }
        if (typeof tagName === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }


    //->prev:获取上一个哥哥元素节点
    //->首先获取当前元素的上一个哥哥节点,判断是否为元素节点,不是的话基于当前的继续找上面的哥哥节点...一直到找到哥哥元素节点为止,如果没有哥哥元素节点,返回null即可
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    //->next:获取下一个弟弟元素节点
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    //->prevAll:获取所有的哥哥元素节点
    function prevAll(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    //->nextAll:获取所有的弟弟元素节点
    function nextAll(curEle) {
        var ary = [];
        var nex = this.next(curEle);
        while (nex) {
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    }

    //->sibling:获取相邻的两个元素节点
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) : null;
        nex ? ary.push(nex) : null;
        return ary;
    }

    //->siblings:获取所有的兄弟元素节点
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    //->index:获取当前元素的索引
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    //->firstChild:获取第一个元素子节点
    function firstChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[0] : null;
    }

    //->lastChild:获取最后一个元素子节点
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }

    //->append:向指定容器的末尾追加元素
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    //->prepend:向指定容器的开头追加元素
    //->把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有,就放在末尾即可
    function prepend(newEle, container) {
        var fir = this.firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return;
        }
        container.appendChild(newEle);
    }

    //->insertBefore:把新元素(newEle)追加到指定元素(oldEle)的前面
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //->insertAfter:把新元素(newEle)追加到指定元素(oldEle)的后面
    //->相当于追加到oldEle弟弟元素的前面,如果弟弟不存在,也就是当前元素已经是最后一个了,我们把新的元素放在最末尾即可
    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }


    //->hasClass:验证当前元素中是否包含className这个样式类名
    function hasClass(curEle, className) {
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    //->addClass:给元素增加样式类名
    function addClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (!this.hasClass(curEle, curName)) {
                curEle.className += " " + curName;
            }
        }
    }

    //->removeClass:给元素移除样式类名
    function removeClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (this.hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合
    function getElementsByClass(strClass, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        //->IE6~8
        var ary = [], strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/g);
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var curNode = nodeList[i];
            var isOk = true;
            for (var k = 0; k < strClassAry.length; k++) {
                var reg = new RegExp("(^| +)" + strClassAry[k] + "( +|$)");
                if (!reg.test(curNode.className)) {
                    isOk = false;
                    break;
                }
            }
            if (isOk) {
                ary[ary.length] = curNode;
            }
        }
        return ary;
    }

    //->getCss:获取元素的样式值
    function getCss(curEle, attr) {
        var val = null, reg = null;
        if (flag) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //->setCss:给当前元素的某一个样式属性设置值(增加在行内样式上的)
    function setCss(curEle, attr, value) {
        if (attr === "float") {
            curEle["style"]["cssFloat"] = value;
            curEle["style"]["styleFloat"] = value;
            return;
        }
        if (attr === "opacity") {
            curEle["style"]["opacity"] = value;
            curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += "px";
            }
        }
        curEle["style"][attr] = value;
    }

    //->setGroupCss:给当前元素批量的设置样式属性值
    function setGroupCss(curEle, options) {
        //->通过检测options的数据类型,如果不是一个对象,则不能进行批量的设置
        options = options || 0;
        if (options.toString() !== "[object Object]") {
            return;
        }

        //->遍历对象中的每一项,调取setCss方法一个个的进行设置即可
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this.setCss(curEle, key, options[key]);
            }
        }
    }

    //->css:此方法实现了获取、单独设置、批量设置元素的样式值
    function css(curEle) {
        var argTwo = arguments[1];
        if (typeof argTwo === "string") {//->第个参数值是一个字符串,这样的话很有可能就是在获取样式;为什么说是很有可能呢?因为还需要判断是否存在第三个参数,如果第三个参数存在的话,不是获取了,而是在单独的设置样式属性值
            var argThree = arguments[2];
            if (!argThree) {//->第三个参数不存在
                return utils.getCss.apply(this, arguments);
            }
            //->第三个参数存在则为单独设置
            this.setCss.apply(this, arguments);
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            //->批量设置样式属性值
            this.setGroupCss.apply(this, arguments);
        }
    }


    //->把外界需要使用的方法暴露给utils
    return {
        win: win,
        offset: offset,
        listToArray: listToArray,
        formatJSON: formatJSON,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css: css
    }
})();
```





