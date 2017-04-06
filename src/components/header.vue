<template>
    <div id="header">
        <h1 id="header-title">Process Scheduler Simulator</h1>
        <span id="header-welcome">
            Welcome,
            <slot name="headerUser"></slot>
            <button id="header-logout" class="btn-sm">logout</button>
        </span>
    </div>
</template>

<style lang="sass">
    $gColor : #1BBDCC;
    $tColor: #6E7E7F;
    $gFont : 'fontin-bold';

#header{
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 3em;

    }

    #header-title{
        font-family: $gFont;
        color: $gColor;
        font-size: 1.8em;
        line-height: 10vh;
        height: 10vh;

    }
    #header-welcome{
        color: $tColor;
    }
</style>

<script>

    export default {
        data : function(){
            return {

            }
        }
    }
</script>