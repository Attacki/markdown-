1. 子级伪元素
```
div
    color purple
    background  grey
    &:hover
        color pink
// 输出
// div {
//   color: #800080;
//   background: #808080;
// }
// div:hover {
//   color: #ffc0cb;
// }
```

1. 混合书写
```
box-shadow()
    -webkit-box-shadow arguments
    -moz-box-shadow arguments
    box-shadow arguments
    html.ie8 &,
    html.ie7 &,
    html.ie6 &
      border 2px solid arguments[length(arguments) - 1]

body
    #login
      box-shadow 1px 1px 3px #eee
// 输出
// body #login {
//   -webkit-box-shadow: 1px 1px 3px #eee;
//   -moz-box-shadow: 1px 1px 3px #eee;
//   box-shadow: 1px 1px 3px #eee;
// }
// html.ie8 body #login,
// html.ie7 body #login,
// html.ie6 body #login {
//   border: 2px solid #eee;
// }
```


3. ()消除歧义
```
pad(n)
  padding (- n)

body
  pad(5px)
// 输出
// body {
//   padding: -5px;
// }
```

4. 无法处理的属性值 使用unquote()
```
div
	filter unquote('progid:DXImageTransform.Microsoft.BasicImage(rotation=1)')
//输出
//div {
//  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
//}
```

5. 变量
```
$font-size = 14px
font = $font-size "Lucida Grande", Arial

body
	font font sans-serif

#logo
  position: absolute
  top: 50%
  left: 50%
  width: w = 150px
  height: h = 80px
  margin-left: -(w / 2)
  margin-top: -(h / 2)
  margin-left: -(@width / 2) //这两行与上面两行是一样的
  margin-top: -(@height / 2)
// 输出
// body {
//   font: 14px "Lucida Grande", Arial sans-serif;
// }
// #logo {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   width: 150px;
//   height: 80px;
//   margin-left: -75px;
//   margin-top: -40px;
//   margin-left: -75px;
//   margin-top: -40px;
// }
```

6. 加条件 unless
```
position()
  position: arguments
  z-index: 1 unless @z-index

#logo
  z-index: 20
  position: absolute

#logo2
  position: absolute
// 输出
// #logo {
//   z-index: 20;
//   position: absolute;
// }
// #logo2 {
//   position: absolute;
//   z-index: 1;
// }
```


7. 向上冒泡
```
body
  color: red + 50deg
  ul
    li
      color: blue
      a
        background-color: @color
// 输出
// body {
//   color: #f00;
// }
// body ul li {
//   color: #00f;
// }
// body ul li a {
//   background-color: #00f;
// }
```


8. {}来插入值
```js
vendor(prop, args)
	-webkit-{prop} args
	-moz-{prop} args
	{prop} args

border-radius()
  	vendor('border-radius', arguments)

button
  	border-radius 1px 2px / 3px 4px
// 输出
// button {
//   -webkit-border-radius: 1px 2px/3px 4px;
//   -moz-border-radius: 1px 2px/3px 4px;
//   border-radius: 1px 2px/3px 4px;
// }
```


9. 选择器插值
```
table
  	for row in range(1,5)
    	tr:nth-child({row})
      		height: 10px * row
// 输出
// table tr:nth-child(1) {
//   height: 10px;
// }
// table tr:nth-child(2) {
//   height: 20px;
// }
// table tr:nth-child(3) {
//   height: 30px;
// }
```

10. 混合书写
```
pad(types = padding, n = 5px)
	if padding in types
		padding n
	if margin in types
		margin n

body
  	pad()

body
  	pad(margin)

body
  	pad(padding margin, 10px)
// 输出
// body {
//   padding: 5px;
// }
// body {
//   margin: 5px;
// }
// body {
//   padding: 10px;
//   margin: 10px;
// }
```


11. 混合书写中的混合书写
```
support-for-ie ?= true

opacity(n)
  opacity n
  if support-for-ie
    filter unquote('progid:DXImageTransform.Microsoft.Alpha(Opacity=' + round(n * 100) + ')')

#logo
  &:hover
    opacity 0.5

inline-list()
  li
    display inline

comma-list()
  inline-list()
  li
    &:after
      content ', '
    &:last-child:after
      content ''

ul
  comma-list()
// 输出
// #logo:hover {
//   opacity: 0.5;
//   filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=50);
// }
// ul li {
//   display: inline;
// }
// ul li:after {
//   content: ', ';
// }
// ul li:last-child:after {
//   content: '';
// }
```

12. 变量函数
```
invoke(a, b, fn)
   unit(fn(a, b),'px')

add(a, b)
  a + b

#app
  padding-right invoke(5, 10, add)
// 输出
// body {
//   padding: 15;
// }
```

13. 参数
```
sum()
  n = 0
  for num in arguments
    n = n + num

sum(1,2,3,4,5)
// 输出
// => 15
```

14. 哈希实例
```
hash = (one 1) (two 2) (three 3)
get(hash, two)
get(hash, three)
get(hash, something)
// 输出
// => 2
// => 3
// => null
```

15. 给不同方向加间距
```js
addpadding(dir,val)
	padding-{dir} val

#c15
	addpadding('top',12)
//输出
//#c15 {
//  padding-top: 12;
//}
```

16. @media 媒体查询
```
@media (max-width 1024px) and (min-width 720px)
    div
        color red
// 输出
// @media (max-width: 1024px) and (min-width: 720px) {
//   div {
//     color: #f00;
//   }
// }
```

17. 继承
```
form
 input[type=text]
   padding: 5px
   border: 1px solid #eee
   color: #ddd

textarea
 @extends form input[type=text]
 padding: 10px
// 输出
// form input[type=text],
// textarea {
//   padding: 5px;
//   border: 1px solid #eee;
//   color: #ddd;
// }
// textarea {
//   padding: 10px;
// }
```

18. 遇到stylus搞不定的 使用 @css
```
@css {
  body {
    font: 14px;
  }
}
// 输出
// body {
//   font: 14px;
// }
```