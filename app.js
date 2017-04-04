/**
 * Created by jacelynfish on 2017/4/2.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import mainFunction from './src/components/mainFunction.vue';
import store from './store.js'

Vue.config.devtools = true;
Vue.use(Vuex);

var eventHub = new Vue();

Vue.mixin({
    data: function(){
        return {
            eventHub: eventHub
        }
    }
});
new Vue({
    el: '#app',
    template:`
        <main-function></main-function>
    `,
    components:{
        mainFunction,
    },
    store,


})