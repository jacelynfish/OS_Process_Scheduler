<template>
    <div>
        <ul id="current-task-panel">
            <li v-for="(task, key) in getCurrentTasks">
                {{task.pid}}, {{task.cpuTime}}, {{task.priority}},
                <button @click="deleteTask(key)" :disabled="!startOn || !stepDebugOn">delete</button>

            </li>
        </ul>
        <task-input></task-input>
        <scheduler></scheduler>
    </div>
</template>
<style lang="sass">

</style>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import scheduler from './scheduler.vue';
    import taskInput from './taskInput.vue';
    export default {
        components:{
            scheduler,
            taskInput
        },
        created (){
            this.addCurrentTask(this.defaultTasks);
            this.currentTasks = this.getCurrentTasks;
        },

        computed:{
            ...mapGetters([
                'getCurrentTasks',

                'startOn',
                'stepDebugOn'
            ])
        },
        data : function () {
            return {
                currentTasks:this.getCurrentTasks,
                defaultTasks: [
                    {
                        pid: 1,
                        arriveTime: 0,
                        cpuTime: 12,
                        startTime: -1,
                        endTime: -1,
                        priority: 1

                    },
                    {
                        pid: 4,
                        arriveTime: 8,
                        cpuTime: 10,
                        startTime: -1,
                        endTime: -1,
                        priority: 3

                    },
                    {
                        pid: 2,
                        arriveTime: 2,
                        cpuTime: 4,
                        startTime: -1,
                        endTime: -1,
                        priority: 3

                    },
                    {
                        pid: 5,
                        arriveTime: 10,
                        cpuTime: 6,
                        startTime: -1,
                        endTime: -1,
                        priority: 2

                    },{
                        pid: 3,
                        arriveTime: 5,
                        cpuTime: 2,
                        startTime: -1,
                        endTime: -1,
                        priority: 1,

                    },
                ],
                isAdd: false,
            }
        },
        methods:{

            ...mapMutations({
                addCurrentTask: 'addTasks',
                delTask: 'delTask'
            }),

            deleteTask(idx){
                console.log(idx);
                this.delTask(idx);
            }
        }
    }

</script>