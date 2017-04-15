<template>
    <div id="account-util">
        <div id="account-panel">
            <ul id="account-tag-panel">
                <li :class="['tag-item', {'tagItemActive': isRegPanel}]" @click="togglePanel($event, 0)">Register</li>
                <li :class="['tag-item', {'tagItemActive': !isRegPanel}]" @click="togglePanel($event, 1)">Login</li>
            </ul>
            <div v-if="isRegPanel" id="register" class="account-panel-item">

                <div class="register-item">
                    <div class="register-group">
                        <label for="register-name">user id</label>
                        <input type="text" id="register-name" @change="checkUname(0)" v-model="registerInput.uname">
                        <span class="register-mes">{{unameMes}}</span>
                    </div>
                    <div class="register-group">
                        <label for="register-pw">password</label>
                        <input type="password" id="register-pw"  v-model="registerInput.upw">
                    </div>
                    <div class="register-group">
                        <label for="register-rpw">repeat password</label>
                        <input type="password" id="register-rpw"  @change="checkRPW($event)">
                    </div>
                </div>
                <div class="register-item">
                    <span class="register-mes">{{statusMes}}</span>
                    <button @click="submitRegister">register</button>
                </div>
            </div>
            <div v-if="!isRegPanel" id="login"  class="account-panel-item">

                <div class="login-item">
                    <div class="login-group">
                        <label for="login-name">user id</label>
                        <input type="text" id="login-name" @change="checkUname(1)" v-model="loginInput.uname">
                        <span class="login-mes">{{unameMes}}</span>
                    </div>
                    <div class="login-group">
                        <label for="login-pw">password</label>
                        <input type="password" id="login-pw" v-model="loginInput.upw">
                    </div>
                </div>
                <div class="login-item">
                    <span class="login-mes">{{statusMes}}</span>
                    <button @click="submitLogin">login</button>
                </div>

            </div>

        </div>

    </div>

</template>
<style lang="sass">

    $gColor : #1BBDCC;
    $tColor: #6E7E7F;
    $bColor: #f9f9f9;
    $borderColor: #cecece;

    #account-util{
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
        padding: 18vh 10% 18vh 50%;
    }

    #account-panel{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 1em;
        box-shadow: 0px 12px 20px rgba(9,9,9,0.2);
        border-radius: 8px;
    }
    #account-tag-panel{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;


        li{
            color: $tColor;
            line-height: 4em;
            height: 4em;
            font-size: 1.2em;
            width: 50%;
            text-align: center;
        }
    }
    #account-tag-panel li.tagItemActive{
        color: $gColor;
        border-bottom: 3px solid $gColor;
    }
    .register-item, .login-item{
        box-sizing: border-box;
        width: 100%;
        margin-top: 1em;
        padding: 0 12px;

        button{
            display: block;
            background-color: $gColor;
            color: white;
            font-size: 1em;
            line-height: 3em;
            width: 50%;
            margin: 1em auto;
            font-weight: bold;
            border-radius: 8px;
            border: 1px solid transparent;

            &:active{
                outline: none;
             }

            &:hover, &:focus{
                outline: none;
                transition: all, 0.3s;
                background-color: white;
                border: 1px solid $gColor;
                color: $gColor;
            }
        }

    }
    .register-group, .login-group{
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        label, input, span{
            margin-top: 6px;
        }
        label{
            color: $gColor;
        }
        input{
            line-height: 2.4em;
            width: 100%;
            box-sizing: border-box;
        }

    }

    .register-mes{

        font-size: 12px;

    }
</style>
<script>

    import request from '../api/request';
//    function request(options = {method: 'get', url:'/', payload: null}){
//
//        var xhr = new XMLHttpRequest();
//        var req = new Promise(function(resolve, rejected){
//            xhr.onreadystatechange = function(){
//                if(xhr.readyState == 4){
//                    if(xhr.status == 200 || xhr.status == 304){
//                        resolve("ok");
//                    }else{
//                        rejected(xhr.responseText);
//                    }
//                }
//            }
//
//            xhr.open(options.method, options.url);
//            xhr.setRequestHeader('Content-Type', 'application/json');
//            xhr.send(JSON.stringify(options.payload));
//        })
//        return req;
//    }
    export default {
        data: function(){
            return {
                isRegPanel: true,
                unameMes: '',
                statusMes: '',
                isUnameOK: false,
                isROK: false,
                registerInput:{
                    uname: '',
                    upw: ''
                },
                loginInput:{
                    uname:'',
                    upw:''
                }

            }
        },
        methods:{
            togglePanel(e, option){
                if(option){

                    this.isRegPanel = false;
                }else{
                    this.isRegPanel = true;
                }
            },
            checkRPW(e){
                var target = e.target.value.trim();
                if(target!= this.registerInput.upw){
                    this.statusMes = 'Please enter the same password twice!';
                    this.isROK = false;
                }else{
                    this.statusMes = '';
                    this.isROK = true;
                }

            },
            validateInput(option){
                //option 1 for login and 0 for register
                var validateOp = {};
                if(option){
                    validateOp = this.loginInput;
                }else{
                    validateOp = this.registerInput;
                }
                var result = false;
                var name = encodeURIComponent(validateOp.uname);
                var password = encodeURIComponent(validateOp.upw);

                var pattern = /[^0-9a-zA-Z]/ig;

                if( !name || pattern.test(name)){
                    result = false;
                    this.unameMes = 'Incorrect username!';
                }else{
                    //this.unameMes = '';
                    result = true;
                }

                if(!option){
                    if(!password){
                        result = false;
                        this.statusMes = 'Password cannot be empty!';
                    }
                }


                return result;
            },
            checkUname (option){
                //option 1 for login and 0 for register
                var validateOp = {};
                if(option){
                    validateOp = this.loginInput;
                }else{
                    validateOp = this.registerInput;
                }

                var self = this;
                var opts = {
                    method: 'post',
                    url: '/checkUser',
                    payload: {
                        uname: validateOp.uname
                    }
                }

                //this.validateInput(option);

                var req =request(opts);


                req.then(function(mes){
                    if(option){
                        self.unameMes = '';
                        self.isUnameOK = true;
                    }else{
                        self.isUnameOK = false;
                        self.unameMes = 'Username exists. Please try another name.';
                    }

                }).catch(function(err){
                    console.log('i');
                    if(option){
                        self.isUnameOK = false;
                        self.unameMes = 'Incorrect username!';
                    }else{
                        self.unameMes = '';
                        self.isUnameOK = true;
                    }

                })



            },
            submitLogin(){
                var self = this;
                if(this.validateInput(1) && this.isUnameOK){

                    var opts = {
                        method: 'post',
                        url: '/login',
                        payload: self.loginInput
                    }
                    var xhr = new XMLHttpRequest();

                    var req = request(opts);

                    req.then(function() {
                        console.log('hello');
                        self.$router.push({
                            name: 'mainscheduler'
                        });
                        return Promise.resolve();
                    }).catch(function(mes){
                        console.log('hello');
                        self.statusMes = mes;
                    })

                }

            },
            submitRegister(){
                var self = this;
                console.log(this.isUnameOK,this.isROK);
                if(this.validateInput(0) && this.isUnameOK && this.isROK){

                    var opts = {
                        method: 'post',
                        url: '/register',
                        payload: self.registerInput
                    }
                    var xhr = new XMLHttpRequest();

                    var req = request(opts);

                    req.then(function() {
                        self.$router.push({
                            name: 'mainscheduler'
                        });
                        return Promise.resolve();
                    }).catch(function(mes){
                        self.statusMes = mes;
                    })
                }
            }
        }

    }
</script>