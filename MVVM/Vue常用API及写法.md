## Vue SPA的基本用法
```jsx
<template>
    <div id="app">
        <router-view></router-view>
        <router-view name="footer"></router-view>
        <router-link v-for="typeitem in proType" tag="li" @click.native="changeList(typeitem.cat_id)" :class="{'active':typeitem.cat_id == activeType}" :to="'/hash/'+typeitem.cat_id" >${typeitem.cat_name}</router-link>
        <div class="agree-btn" :class="{'dis_btn':!agree}" @click=" agree && pay()" >${agree | transform}</div>
        <div class="input-group" :class="paytype==4?'checked':''" >
            <input v-model='input_val' @keyup="keyup" @focus="consoleInput('可传参数')" >
        </div>
        <div class="b-switch" :class="[b_switch?'b-switch-on':'']" ></div>
        <ul>
            <template v-for="(item, index) in ary">
                <ul :key='index'>
                    <li v-show = 'item===1' class='visible'>${item}</li>
                    <li v-if = 'item!==2' class='display'>${item}</li>
                    <li v-else class='else'>${item}</li>
                </ul>
            </template>
        </ul>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                agree:false,
                ary:[1,2,3,4],
                input_val:'请写点东西吧',
                proType:[],
            }
        },
        delimiter:['${','}'],
        watch:{
            agree(_old,_new){
                console.log(_old,_new)
            }
        },
        filters:{
            transform(agree){
                return agree?'同意':'不同意'
            }
        },
        methods:{
            // currentTarget：代表事件绑定对象
            // target：事件触发对象
            changeCon(event){
                var target = event.target
                this.paytype = target.getAttribute('data-id');
                this.$router.push('/login');
            },
            consoleInput(params){
                console.log(params); //传进来的参数
                console.log('通过元素获取的值',this.val);
                console.log('通过v-model获取的值',this.input_val);
            },
            keyup(){
                if(timer){
                    window.clearTimeout(timer)
                }
                timer = window.setTimeout(
                    ()=>{
                        var val = Number(this.count)
                        if( val > this.proDetails.goods_number){
                            this.count = this.proDetails.goods_number
                        }
                        if( val < this.proDetails.min_unit){
                            this.count = this.proDetails.min_unit
                        }
                    },1000
                )
            }
        },
        beforeRouteEnter(){ //这是在引入vue-router之后才有的方法
            // 在进入该页面之前
        },
        mounted(){
            // 组价挂载之后
        },
        distoryed(){
            // 组件销毁之后
        }
    }
</script>
<style>
[v-cloak]:{ /*防止出现 v-* 之类的东西 */
    display:none;
}

</style>
```

### vue-router的基本配置
```js
import Vue from 'vue'
import Router from 'vue-router'
import proList from '@/components/proList'
import proDetails from '@/components/proDetails'
import navbar from '@/components/navbar'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'proList',
      components: {
        default:proList,
        footer: navbar
      }
    },{
      path: '/proDetails/:goods',
      name: 'proDetails',
      component: proDetails
    }
  ]
})

```









