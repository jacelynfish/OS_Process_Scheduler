<template>
    <div>
        <select v-model="options.type" @change="changeSchedulerMode">
            <option v-for="(type, key) in schedulerType" :value="key">{{type}}</option>
        </select>
        <select v-if="isSecondChoose" v-model="options.sortMethod">
            <option value="remainTime">Shortest Job first</option>
            <option value="priority">Priority</option>
        </select>
        <button @click="run" :disabled="!stepDebugOn || !startOn">start</button>
        <button @click="stop" :disabled="!stepDebugOn || startOn">stop</button>
        <button @click="pause" :disabled="!stepDebugOn || (startOn || !pauseOn)">pause</button>
        <button @click="con" :disabled="!stepDebugOn || (startOn || pauseOn)">continue</button>
        <button @click="toggleDebug" :disabled="!startOn">{{debugSwitchMes}}</button>
        <button @click="debugNextStep" :disabled="!startOn || stepDebugOn">next step</button>

        <div>
            Ready Queue
            <ul id="task-queue">
                <li class="task-queue-item" v-for="task in options.taskQueue">{{task.pid}}</li>
            </ul>
        </div>

        <div>
            Running Timeline
            <ul id="running-queue">
                <li class="running-queue-item" v-for="task in options.runningQueue">{{task}}</li>
            </ul>
        </div>

    </div>
</template>
<style lang="sass">
    #task-queue, #running-queue{
        border: 1px solid black;
        padding: 12px;
    }
    .task-queue-item, .running-queue-item{
        display: inline-block;
        border:1px solid black;
        padding: 12px;
    }
</style>

<script>
    import Scheduler from '../api/Scheduler';
    import {mapGetters, mapMutations} from 'vuex';
    export default {

        computed: {
            ...mapGetters({
                tasks: 'getCurrentTasks',
                startOn: 'startOn',
                pauseOn: 'pauseOn',
                stepDebugOn : 'stepDebugOn'
            })
        },
        created (){
//            this.tasks = this.getCurrentTasks;
            this.eventHub.$on('addNewTask', this.addTask);
        },

        data: function(){
            return {
                debugSwitchMes:'start stepping over',
                isSecondChoose: false,
                isStepFirstTime: true,
                schedulerType:{

                    rr: 'Round Robin',
                    fcfs: 'First come first served',
                    preemptive: 'Preemptive',
                    nonpreemptive: 'Non-preemptive',
                },

                options:{
                    timeElapse:0,
                    queue:[],
                    sortedMethod: 'remainTime',
                    type:'rr',
                    taskQueue: [],
                    runningQueue:[]
                },
                scheduler : {},
            }
        },
        methods: {
            ...mapMutations([
                'addTasks',
                'toggleStartOn',
                'togglePauseOn',
                'toggleDebugOn'
            ]),
            changeSchedulerMode (){
                if(this.options.type == 'preemptive' || this.options.type == "nonpreemptive")
                    this.isSecondChoose = true;
                else
                    this.isSecondChoose = false;
            },
            toggleDebug(){
                if(this.stepDebugOn == true){
                    this.toggleDebugOn(false);
                    this.debugSwitchMes = 'stop stepping over';

                    this.options.queue = this.tasks;
                    this.options.isStepDebug = true;
                    this.scheduler = new Scheduler(this.options);
                }

                else{
                    this.toggleDebugOn(true);
                    this.debugSwitchMes = 'start stepping over';

                    this.scheduler.stopStepScheduler();
                    this.scheduler = {};
                    this.options.taskQueue = [];
                    this.options.runningQueue = [];
                }


            },
            debugNextStep (){
                this.scheduler.runStepScheduler();
            },
            run:function (){
                this.toggleStartOn(false);
                this.togglePauseOn(true);

                this.options.queue = this.tasks;
                this.options.isStepDebug = false;
                this.scheduler = new Scheduler(this.options);

                this.scheduler.start();
            },

            stop: function(){

                this.toggleStartOn(true);
                this.togglePauseOn(false);

                this.scheduler.stop();
                this.scheduler = {};
                this.options.taskQueue = [];
                this.options.runningQueue = [];
            },
            con: function(){
                this.togglePauseOn(true);
                this.scheduler.continue();
            },
            pause: function(){
                this.togglePauseOn(false);
                this.scheduler.pause();
            },
            addTask: function(task){
                if(!this.startOn || !this.stepDebugOn){
                    this.scheduler.add(task);
                }

            }
        }

    }
</script>