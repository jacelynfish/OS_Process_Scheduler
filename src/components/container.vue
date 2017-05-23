<template>
    <div id="container">
        <hc></hc>
        <router-view></router-view>
    </div>
</template>
<style>

</style>
<script>
    const directives = [
        { name: 'focus', expression:'dismiss', modifiers: { abc: true } }
    ]



    var hc = {
        render (h){
            return (
                <div
                    id="hello"
                    class={{ hello: true, bye: false}}
                    onClick={()=>alert("hi")}
                     {...{directives}}
                    >
                hello from the other side
                </div>
            )
        }
    }
    export default{
        data: function(){
            return {
                dismiss:'kkk',
            }
        },
        components:{
            hc,
        },
        mounted:function(){
            console.log('hi');
        }


    }
</script>