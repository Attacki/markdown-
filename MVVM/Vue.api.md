# 了解Vue的可控制项


## Vue.config 是一个对象，包含 Vue 的全局配置。可以在启动应用之前修改下列属性：

|属性名|值类型|默认值|作用|
|:--:|:--|:--|:--|
|silent|boolean|false|取消 Vue 所有的日志与警告。|
|optionMergeStrategies|{ [key: string]: Function }|{}|取消 Vue 所有的日志与警告。|
|devtools|boolean|true(生产版为 false)|取消 Vue 所有的日志与警告。|
|errorHandler|Function|undefined|指定组件的渲染和观察期间未捕获错误的处理函数。|
|warnHandler|Function|undefined|为 Vue 的运行时警告赋予一个自定义处理函数|
|ignoredElements|Array\<string\> \| RegExp>|[]|使 Vue 忽略在 Vue 之外的自定义元素 |
|keyCodes|{ [key: string]: number \| Array\<number\> }|{}|给 v-on 自定义键位别名|
|performance|boolean|false|设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪|
|productionTip|boolean|false|设置为 false 以阻止 vue 在启动时生成生产提示。|


## 全局API

|属性名|参数格式|作用|
|:--:|:--|:--|
|Vue.extend( options )|{Object} options|使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。|
|Vue.nextTick( [callback, context] )|{Function} [callback] ，{Object} [context]|在下次 DOM 更新循环结束之后执行延迟回调。|
|Vue.set( target, propertyName/index, value )|{Object \| Array} target ，{string \| number} propertyName/index，{any} value|向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。|
|Vue.delete( target, propertyName/index )|{Object \| Array} target ，{string \| number} propertyName/index|删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。|
|Vue.directive( id, [definition] )|{string} id ，{Function \| Object} [definition]|注册或获取全局指令。|
|Vue.filter( id, [definition] )|{string} id ，{Function} [definition]|注册或获取全局过滤器。|
|Vue.use( plugin )|{Object | Function} plugin|安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。|
|Vue.mixin( mixin )|{Object} mixin|全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。|
|Vue.compile( template )|{string} template|在 render 函数中编译模板字符串。只在独立构建时有效|
|Vue.observable( object )|{string} template|在 render 函数中编译模板字符串。|
|Vue.observable( object )|{Object} object|让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。|
|Vue.version||提供字符串形式的 Vue 安装版本号。|



## 创建实例的数据选项

|属性名|值类型|详情|
|:--|--|--|
|data|Object \| Function(组件的定义只接受 function。)|Vue 实例的数据对象|
|props|Array\<string\> \| Object|props 可以是数组或对象，用于接收来自父组件的数据。|
|propsDate|{ [key: string]: any }(只用于 new 创建的实例中。)|创建实例时传递 props。主要作用是方便测试。|
|computed|{ [key: string]: Function \| { get: Function, set: Function } }||
|methods|{ [key: string]: Function }|methods 将被混入到 Vue 实例中。|
|watch|{ [key: string]: string | Function | Object | Array }|一个对象，键是需要观察的表达式，值是对应回调函数。|

## 创建实例的DOM选项

|属性名|值类型|详情|
|:--|--|--|
|el|string \| Element(只在用 new 创建实例时生效。)|提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。|
|template|string|一个字符串模板作为 Vue 实例的标识使用。|
|render|(createElement: () => VNode) => VNode|字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。|
|renderError|(createElement: () => VNode, error: Error) => VNode|当 render 函数遭遇错误时，提供另外一种渲染输出。|

## 创建实例的生命周期钩子选项

|属性名|值类型|详情|
|:--|--|--|
|beforeCreate|Function|在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。|
|created|Function|在实例创建完成后被立即调用。|
|beforeMount|Function|在挂载开始之前被调用：相关的 render 函数首次被调用。|
|mounted|Function|el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。|
|beforeUpdate|Function|数据更新时调用，发生在虚拟 DOM 打补丁之前。|
|updated|Function|由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。|
|activated|Function|keep-alive 组件激活时调用。|
|deactivated|Function|keep-alive 组件停用时调用。|
|beforeDestroy|Function|实例销毁之前调用。在这一步，实例仍然完全可用。|
|destroyed|Function|Vue 实例销毁后调用。|
|errorCaptured|Function|当捕获一个来自子孙组件的错误时被调用。|

## 创建实例的资源选项

|属性名|值类型|详情|
|:--|--|--|
|directives|Object|包含 Vue 实例可用指令的哈希表。|
|filters|Object|包含 Vue 实例可用过滤器的哈希表。|
|components|Object|包含 Vue 实例可用过滤器的哈希表。|


## 创建实例的组合选项

|属性名|值类型|详情|
|:--|--|--|
|parent|Vue instance|指定已创建的实例之父实例，在两者之间建立父子关系。|
|mixins|Array\<Object\>|mixins 选项接受一个混入对象的数组。|
|extends|Object \| Function|允许声明扩展另一个组件(可以是一个简单的选项对象或构造函数)，而无需使用 Vue.extend|
|provide / inject|provide:Object \| () => Object <br> inject:Array\<string\> \| { [key: string]: string \| Symbol \| Object }|这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。|




## 创建实例的其他选项

|属性名|值类型|详情|
|:--|--|--|
|name|string(只有作为组件时有用)|允许组件模板递归地调用自身。|
|delimiters|Array\<string\>|改变纯文本插入分隔符。|
|functional|boolean|使组件无状态 (没有 data ) 和无实例 (没有 this 上下文)。|
|model|{ prop?: string, event?: string }|允许一个自定义组件在使用 v-model 时定制 prop 和 event。|
|inheritAttrs|boolean|默认情况下父作用域的不被认作 props 的特性绑定 (attribute bindings) 将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。|
|comments|boolean|当设为 true 时，将会保留且渲染模板中的 HTML 注释。|




## 实例属性

|属性名|值类型|详情|
|:--|--|--|
|vm.$data|Object|Vue 实例观察的数据对象。|
|vm.$props|Object|当前组件接收到的 props 对象。Vue 实例代理了对其 props 对象属性的访问。|
|vm.$el|Element|Vue 实例使用的根 DOM 元素。|
|vm.$options|Object|用于当前 Vue 实例的初始化选项。|
|vm.$parent|Vue instance|父实例，如果当前实例有的话。|
|vm.$root|Vue instance|当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。|
|vm.$children|Array\<Vue instance\>|当前实例的直接子组件。|
|vm.$slots|{ [name: string]: ?Array\<VNode\> }|用来访问被插槽分发的内容。|
|vm.$scopedSlots|{ [name: string]: props => Array<VNode> | undefined }|用来访问作用域插槽。|
|vm.$refs|Object|一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例。|
|vm.$isServer|boolean|当前 Vue 实例是否运行于服务器。|
|vm.$attrs|{ [key: string]: string }|包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。|
|vm.$listeners|{ [key: string]: Function | Array\<Function\> }|包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。|

## 实例的方法和数据

|属性名|值类型|详情|
|:--|--|--|
|vm.$watch( expOrFn, callback, [options] )|{string \| Function} expOrFn <br> {Function \| Object} callback <br> {Object} [ deep:boolean ,immediate:boolean]|观察 Vue 实例变化的一个表达式或计算属性函数。|
|vm.$set( target, propertyName/index, value )|{Object \| Array} target <br> {string \| number} propertyName/index <br> {any} value|这是全局 Vue.set 的别名。|
|vm.$delete( target, propertyName/index )|{Object \| Array} target <br> {string \| number} propertyName/index|这是全局 Vue.delete 的别名。|



## 实例的方法和事件

|属性名|值类型|详情|
|:--|--|--|
|vm.$on( event, callback )|{string \| Array\<string\>} event (数组只在 2.2.0+ 中支持) <br> {Function} callback|监听当前实例上的自定义事件。|
|vm.$once( event, callback )|{string} event <br> {Function} callback|监听一个自定义事件，但是只触发一次。|
|vm.$off( [event, callback] )|{string \| Array\<string\>} event (只在 2.2.2+ 支持数组) <br> {Function} [callback]|移除自定义事件监听器。|
|vm.$emit( eventName, […args] )|{string} eventName <br> [...args]|触发当前实例上的事件。|

## 实例方法和生命周期

|属性名|值类型|详情|
|:--|--|--|
|vm.$mount( [elementOrSelector] )|{Element \| string}[elementOrSelector] <br> {boolean} [hydrating]|如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。|
|vm.$forceUpdate()||迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。|
|vm.$nextTick( [callback] )|{Function} [callback]|将回调延迟到下次 DOM 更新循环之后执行。|
|vm.$destroy()||完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。|


## Vue提供的指令

|属性名|值类型|详情|
|:--|--|--|
|v-text|string|更新元素的 textContent。|
|v-html|string|更新元素的 innerHTML 。注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译 。|
|v-show|any|根据表达式之真假值，切换元素的 display CSS 属性。|
|v-if|any|根据表达式的值的真假条件渲染元素。|
|v-else|(前一兄弟元素必须有 v-if 或 v-else-if。)|为 v-if 或者 v-else-if 添加“else 块”。|
|v-else-if|any|表示 v-if 的 “else if 块”。可以链式调用。|
|v-for|Array \| Object \| number \| string \| Iterable (2.6 新增)|基于源数据多次渲染元素或模板块。|
|v-on(缩写 @)|Function \| Inline Statement \| Object|绑定事件监听器。|
|v-bind(缩写 :)|any (with argument) \| Object (without argument)|动态地绑定一个或多个特性，或一个组件 prop 到表达式。|
|v-model|(input select textarea)|在表单控件或者组件上创建双向绑定。|
|v-slot|插槽名 (可选，默认值是 default)|提供具名插槽或需要接收 prop 的插槽。|
|v-pre||跳过这个元素和它的子元素的编译过程。|
|v-cloak||这个指令保持在元素上直到关联实例结束编译。|
|v-once||只渲染元素和组件一次。|

## 特殊属性

|属性名|值类型|详情|
|:--|--|--|
|key|number \| string|key 的特殊属性主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。|
|ref|预期: string|ref 被用来给元素或子组件注册引用信息。|
|is|string | Object (组件的选项对象)|用于动态组件且基于 DOM 内模板的限制来工作。|

## 内置组件

|名称|props|详情|
|:--|--|--|
|component|is - string \| ComponentDefinition \| ComponentConstructor inline-template - boolean|渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染。|
|transition|具体查看官网api|\<transition\> 元素作为单个元素/组件的过渡效果。|
|transition-group|tag - string，默认为 span <br> move-class - 覆盖移动过渡期间应用的 CSS 类。 <br> 除了 mode，其他特性和 <transition> 相同。|\<transition-group\> 元素作为多个元素/组件的过渡效果。|
|keep-alive|include - 字符串或正则表达式。只有名称匹配的组件会被缓存。 <br> exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。 <br> max - 数字。最多可以缓存多少组件实例。|\<keep-alive\> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。|
|slot|name - string，用于命名插槽。|\<slot\> 元素作为组件模板之中的内容分发插槽。\<slot\> 元素自身将被替换。|
