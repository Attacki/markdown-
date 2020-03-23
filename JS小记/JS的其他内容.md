# Ajax
- async(异步的) javascript and xml(可扩展的标记语言)

### Ajax作用
- 获取服务器端数据的,但是要求客户端和服务器端是同源->"同源策略":协议、域名、端口一模一样的才是同源
- "非同源策略(跨域)":协议、域名、端口三个有一个不一样就是跨域,处理跨域请求的话就不能使用AJAX了,而需要使用JSONP

### URL和URI
- URI(统一资源标识符)、URL(它是URI中的一种)
- 协议:HTTP、HTTPS、FTP...
- 域名:一级域名、二级域名、三级域名...
- www.qq.com(一级)、sports.qq.com(二级)、kbs.sports.qq.com(三级)
- 端口号:0~65535之间的一个任意数字(HTTP的默认端口号是80、HTTPS的默认端口号是443、FTP默认端口号是21)


### HTTP
- 它是超文本传输协议(除了可以传递文字以外对于其它内容也可以进行传输,例如:HTML、XML、IMG...) ->HTTPS比HTTP安全,FTP是文件上传和下载协议...

### GET和POST的区别
1. "安全":GET传送给服务器的内容是在UEL后面拼接上的,可以在控制台查看到;POST是把传递的内容放在HTTP主体中传给服务器的,在控制台看不到;所以POST请求更加的安全;GET请求很容易让黑客进行URL劫持;
2. "长度":因为GET是把内容拼接在URL后面的,而每一个浏览器对于URL的长度有大小的限制(谷歌->8KB 火狐->7KB IE->2KB),这样话,如果我们传递给服务器的内容过多,超过长度的部分,浏览器会自动截取掉,我们传递给后台的数据不完整了;对于这样的情况(需要传递很多内容),我们使用POST请求;
3. "缓存":POST请求,浏览器不会默认记录缓存信息,我们也不需要清理缓存信息;但是GET请求,浏览器会自己创建一个缓存,我们第二次获取的请求内容很有可能是上一次获取的内容,这样无法随时获取最新的数据了;->我们如果使用的是GET请求,还需要在每一次URL的地址后面多增加一个参数_=Math.random(),这样保证每一次请求的地址都是不一样的,也不会在走缓存数据了

### JS的本地存储:把一些数据存储到客户端

##### cookie 兼容所有浏览器的
    1. cookie存储的内容有大小限制,一般情况下"一个源"下最大存储量是4kb左右
    2. cookie有存储期限,我们在设置cookie的时候可以规定过期时间(最好在30天以内),超过期限浏览器自己会把其清除 ->360或者其他的清理垃圾软件可以把cookie清除掉
    3. 用户可能出于安全的角度,把cookie禁止掉(无痕浏览)

##### webStorage:localStorage/sessionStorage
    1. webStorage存储的内容也有大小限制,一般情况下"一个源"下最大存储量是5mb左右
    2. localStorage是永久存储到本地,只要我们不去刻意的清除(JS/在控制台手动清除),会一直保留 
    3. sessionStorage:当前页面的会话存储,只要当前页面关闭,浏览器就把sessionStorage给清除了(在JS中我们很少用)

```js
cookie.set("name","nihao");
cookie.clear("name");

localStorage.setItem("name", escape("珠峰培训"));
unescape(localStorage.getItem("name")
localStorage.removeItem("name");
localStorage.clear();//->把当前源下所有存储的都移除

```