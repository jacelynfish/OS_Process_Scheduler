/**
 * Created by jacelynfish on 2017/4/2.
 */

import reset from './src/style/_reset.css';
import global from './src/style/_global.scss';
//import bootstrap from './src/style/bootstrap/css/bootstrap.min.css';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import container from './src/components/container.vue';
import mainFunction from './src/components/mainFunction.vue';
import store from './store.js';
import router from './router'

Vue.config.devtools = true;
Vue.use(Vuex);
Vue.use(VueRouter);

var eventHub = new Vue();

Vue.mixin({
    data: function(){
        return {
            eventHub: eventHub
        }
    },

});
Vue.directive('focus',{
    bind:function(el, binding, vnode){
            console.log(JSON.stringify(binding));
            console.log(binding.value, binding.expression);
    }

})
new Vue({
    el: '#app',
    template:`
        <container></container>
    `,
    components:{
        container,
        mainFunction,
    },
    store,
    router,


})

// <main-function></main-function>
