/**
 * Created by jacelynfish on 2017/4/10.
 */

import VueRouter from 'vue-router';
import login from './src/components/login.vue';
import mainFunction from './src/components/mainFunction.vue';

var router = new VueRouter({
    routes:[
        {

            path: '/main_scheduler',
            name:'mainscheduler',
            // props: true,
            // props:(route) => {
            //     if(typeof route.params.uname == 'string' && route.params.uname.length){
            //         return {
            //             uname: route.params.uname
            //         }
            //     }else{
            //         return {
            //             uname: 'global'
            //         }
            //     }
            // },
            component: mainFunction,
            beforeEnter: (to, from, next) => {
                if(valifySession()){
                    next();
                }else{

                    next({
                        name: 'login',
                        query: {
                            redirect: 'login'
                        }
                    });
                }
            }
        }
        ,{
            path: '/login',
            name: 'login',
            component: login,
            beforeEnter: (to, from, next) => {
                var check = valifySession();
                if(check){
                    console.log(check);
                    next({
                        name: 'mainscheduler',
                        query:{
                            redirect:'main_scheduer'
                        },
                        // params:{
                        //     uname: 'global'
                        // }
                    });
                }else{
                    next();
                }
            }
        },
        {
            path: '',
            component: login,
            beforeEnter:(to, from,next) => {
                var check = valifySession();
                if(check){
                    next({
                        name: 'mainscheduler',
                        query:{
                            redirect:'main_scheduer'
                        },
                        // params:{
                        //     uname: 'global'
                        // }
                    });
                }else{
                    next({
                        name:'login',
                        query:{
                            redirect:'login'
                        }
                    });
                }
            }
        },
    ]
});

function valifySession(){
    var cookies = document.cookie;
    if(cookies && cookies.length != 0){
        var tempCookie = {};
        var cookie = cookies.split(';');
        for(let c of cookie){
            let temp = c.split("=");
            tempCookie[temp[0]] = temp[1];
        }

        if('nsession' in tempCookie && tempCookie.nsession){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

export default router;