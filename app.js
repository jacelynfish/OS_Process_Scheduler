/**
 * Created by jacelynfish on 2017/4/2.
 */

import reset from './src/style/_reset.css';
import global from './src/style/_global.scss';
//import bootstrap from './src/style/bootstrap/css/bootstrap.min.css';

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