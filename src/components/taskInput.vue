<template>
    <div>

        <input type="text" v-model="newTask.cpuTime">
        <input type="text" v-model="newTask.pid">
        <input type="text" v-model="newTask.priority">
        <input type="text" v-model="newTask.arriveTime">

        <button @click="addTask">add</button>

    </div>
</template>
<style>

</style>
<script>
    import {mapMutations, mapGetters} from 'vuex';

    export default{
        created (){
        },
        computed:{
            ...mapGetters([
                'startOn',
                'getCurrentTasks'
            ])
        },
        data: function () {
            return {
                newTask:{
                    cpuTime:0,
                    pid:-1,
                    priority: 0,
                    arriveTime: 0,
                },
            }
        },
        methods:{
            ...mapMutations({
                addCurrentTask: 'addTasks'
            }),
            addTask (){
                var temp = Object.assign({}, this.newTask);
                temp.arriveTime = Number(temp.arriveTime);
                temp.priority = Number(temp.priority);
                this.addCurrentTask([temp]);
                this.eventHub.$emit('addNewTask', temp);
            }
        }
    }
</script>