<template>
    <div id="login">
        <div class="login-item" id="login-title">
            LOGIN
        </div>
        <div class="login-item">
            <div class="login-group">
                <label for="login-name">user id</label>
                <input type="text" id="login-name" @change="checkUname" v-model="loginInput.uname">
                <span class="login-mes">{{loginUnameMes}}</span>
            </div>
            <div class="login-group">
                <label for="login-pw">password</label>
                <input type="password" id="login-pw"  v-model="loginInput.upw">
            </div>
        </div>
        <div class="login-item">
            <span class="login-mes">{{loginStatusMes}}</span>
            <button @click="submitLogin">login</button>
        </div>

    </div>
</template>
<style lang="sass" scoped>

</style>
<script>
    export default {
        data: function(){
            return {
                loginUnameMes: '',
                loginStatusMes: '',

                loginInput:{
                    uname:'',
                    upw:''
                }

            }
        },
        methods:{
            validateInput(){
                var result = false;
                var name = encodeURIComponent(this.loginInput.uname);
                var password = encodeURIComponent(this.loginInput.upw);

                var pattern = /[^0-9a-zA-Z]/ig;

                if( !name || pattern.test(name)){
                    result = false;
                    this.loginStatusMes = 'Incorrect username!';
                }else{
                    this.loginStatusMes = '';
                    result = true;
                }


                return result;
            },
            checkUname (){
                if(this.validateInput()){
                    var self = this;
                    var xhr = new XMLHttpRequest();

                    var req = new Promise(function(resolve, rejected){
                        xhr.onreadystatechange = function(){
                            if(xhr.readyState == 4){
                                if(xhr.status == 200 || xhr.status == 304){
                                    resolve("ok");
                                }else{
                                    rejected(xhr.responseText);
                                }
                            }
                        }

                        xhr.open('post', '/checkUser');
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            uname: self.loginInput.uname
                        }));
                    })

                    return req;
                }


            },
            submitLogin(){
                var self = this;
                if(this.validateInput()){

                    this.checkUname().then(function(mes) {

                        var xhr = new XMLHttpRequest();

                        var req = new Promise(function(resolve, rejected){
                            xhr.onreadystatechange = function(){
                                if(xhr.readyState == 4){
                                    if(xhr.status == 200 || xhr.status == 304){
                                        resolve(document.cookie);
                                    }else{
                                        console.log(xhr.responseText);
                                        rejected(xhr.responseText);
                                    }
                                }
                            }

                            xhr.open('post', '/login');
                            xhr.setRequestHeader('Content-Type','application/json');
                            xhr.send(JSON.stringify(self.loginInput));
                        })

                        return req;
                    }).then(function() {
                        self.$router.push({
                            name: 'mainscheduler'
                        });
                        return Promise.resolve();
                    }).catch(function(mes){
                        self.loginStatusMes = mes;
                    })



                }

            }
        }

    }
</script>