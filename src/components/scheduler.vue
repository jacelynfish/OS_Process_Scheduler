<template>
    <div>
        <div id="scheduler-util">
            <div class="scheduler-item">
                <label>Please select a preferred scheduler type: </label>
                <select v-model="options.type" @change="changeSchedulerMode">
                    <option v-for="(type, key) in schedulerType" :value="key">{{type}}</option>
                </select>
                <select v-if="isSecondChoose" v-model="options.sortedMethod">
                    <option value="remainTime">Shortest Job first</option>
                    <option value="priority">Priority</option>
                </select>
            </div>

            <div class="scheduler-item">
                <button :class="[ {'btn-disabled': !stepDebugOn || !startOn }, 'btn-md']" @click="run" :disabled="!stepDebugOn || !startOn">start</button>
                <button :class="[ {'btn-disabled': !stepDebugOn || startOn }, 'btn-md']" @click="stop" :disabled="!stepDebugOn || startOn">stop</button>
                <button :class="[ {'btn-disabled': !stepDebugOn || (startOn || !pauseOn) }, 'btn-md']" @click="pause" :disabled="!stepDebugOn || (startOn || !pauseOn)">pause</button>
                <button :class="[ {'btn-disabled': !stepDebugOn || (startOn || pauseOn) }, 'btn-md']" @click="con" :disabled="!stepDebugOn || (startOn || pauseOn)">continue</button>
                <button :class="[ {'btn-disabled': !startOn }, 'btn-md']" @click="toggleDebug" :disabled="!startOn">{{debugSwitchMes}}</button>
                <button :class="[ {'btn-disabled': !startOn || stepDebugOn }, 'btn-md']" @click="debugNextStep" :disabled="!startOn || stepDebugOn">next step</button>
            </div>

        </div>


        <div id="scheduler-info">
            <p>Average waiting time: {{aWaitingTimeStr}}</p>
        </div>

        <div id="running-queue-container">
            <h2>Running Timeline</h2>
            <ul id="running-queue">
                <li :class="['running-queue-item', `cclass_tag${task.tag}` ]" v-for="task in options.runningQueue">{{task.pid}}</li>
            </ul>
        </div>

    </div>
</template>
<style lang="sass">
    $gColor : #1BBDCC;
    $tColor: #6E7E7F;
    $bColor: #f9f9f9;
    $borderColor: #cecece;

    #running-queue{
        box-sizing: border-box;

        border: 1px solid $borderColor;
        padding: 1em;
        border-radius: 6px;
        min-height: 6em;
    }
     .running-queue-item{
        display: inline-block;
         height: 4em;
         line-height: 4em;
    }

    #running-queue-container{
        margin: 1em;

        h2 {
            color: $gColor;
            font-size: 1.4em;
            line-height: 1.5;
            font-family: 'fontin-bold';
        }
    }

    #scheduler-util{
        margin: 0 2em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        label{
            font-size: 1em;
            color: $tColor;
        }
    }

    #scheduler-info{
        margin: 1em 2em;
        font-family: 'fontin-bold';
        color: $gColor;
        line-height: 2;
        font-size: 1em;
        background-color: $bColor;
        border-radius: 6px;
        padding: 0.5em;
    }

</style>

<script>
    import Scheduler from '../api/Scheduler';
    import request from '../api/request';
    import {mapGetters, mapMutations} from 'vuex';
    export default {

        computed: {
            ...mapGetters({
                tasks: 'getCurrentTasks',
                startOn: 'startOn',
                pauseOn: 'pauseOn',
                stepDebugOn : 'stepDebugOn',
                taskQueue: 'getTaskQueue',

            })
        },
        created (){

            this.eventHub.$on('addNewTask', this.addTask);
        },
        watch:{

        },
        data: function(){
            return {
                debugSwitchMes:'start stepping over',
                aWaitingTimeStr:'',
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
                    isCompleted: false,
                    runningQueue:[]
                },
                scheduler : {},
                currentStat:{
                    type: 'rr',
                    sortedMethod: 'remainTime',
                    start: new Date(),
                    end: undefined,
                    duration: undefined,

                }
            }
        },
        methods: {
            ...mapMutations([
                'addTasks',
                'toggleStartOn',
                'togglePauseOn',
                'toggleDebugOn',
                'clearTaskQueue',
                'updateTimeElapse'

            ]),
            changeSchedulerMode (){
                if(this.options.type == 'preemptive' || this.options.type == "nonpreemptive")
                    this.isSecondChoose = true;
                else
                    this.isSecondChoose = false;
            },
            toggleDebug(){
                var self = this;
                if(this.stepDebugOn == true){
                    this.toggleDebugOn(false);
                    this.debugSwitchMes = 'stop stepping over';
                    this.aWaitingTimeStr = '';

                    for(let t of this.tasks){
                        t.tag = Math.floor(Math.random()*16 + 1);
                    }
                    this.options.taskQueue = this.taskQueue;
                    this.options.queue = this.tasks;
                    this.options.isStepDebug = true;
                    this.scheduler = new Scheduler(this.options);

                    this.currentStat.type = this.options.type;
                    this.currentStat.sortedMethod = this.options.sortedMethod;
                    this.currentStat.start = (new Date());

                }

                else{
                    this.toggleDebugOn(true);
                    this.debugSwitchMes = 'start stepping over';

                    this.currentStat.end = (new Date());
                    this.currentStat.duration = Number((this.currentStat.end - this.currentStat.start)/1000).toFixed(2);




                    var query = '/rcrd?';
                    for(let k of Object.keys(this.currentStat)){
                        query += `${k}=${this.currentStat[k]}&`
                    }


                    request({
                        method:'get',
                        url: query,
                        payload: null,
                    }).then(function(){
                        self.currentStat = {};
                        self.scheduler.stopStepScheduler();
                        self.scheduler = {};
                        self.clearTaskQueue();
                        self.options.runningQueue = [];

                        self.calATime();

                    })
                }
            },
            debugNextStep (){
                this.scheduler.runStepScheduler();
            },
            run:function (){
                this.toggleStartOn(false);
                this.togglePauseOn(true);
                this.aWaitingTimeStr = '';

                for(let t of this.tasks){
                    t.tag = Math.floor(Math.random()*16 + 1);
                }
                this.options.taskQueue = this.taskQueue;
                this.options.queue = this.tasks;
                this.options.isStepDebug = false;
                this.scheduler = new Scheduler(this.options);


                this.currentStat.type = this.options.type;
                this.currentStat.sortedMethod = this.options.sortedMethod;
                this.currentStat.start = new Date();

                this.scheduler.start();

            },

            stop: function(){

                var self = this;
                this.toggleStartOn(true);
                this.togglePauseOn(false);

                this.currentStat.end = (new Date());
                this.currentStat.duration = Number((this.currentStat.end - this.currentStat.start) / 1000).toFixed(2) ;

                var query = '/rcrd?';
                for(let k of Object.keys(this.currentStat)){
                    query += `${k}=${this.currentStat[k]}&`
                }


                request({
                    method:'get',
                    url: query,
                    payload: null,
                }).then(function(){
                    self.currentStat = {};
                    self.scheduler.stop();
                    self.scheduler = {};
                    self.clearTaskQueue();
                    self.options.runningQueue = [];

                    self.calATime();
                })

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
                task.tag = Math.floor(Math.random()*16 + 1);
                if(!this.startOn || !this.stepDebugOn){
                    this.scheduler.add(task);
                }

            },
            calATime(){
                var tempStr = '', totalTime = 0;
                if(this.options.isCompleted){
                     tempStr = '(';
                    for(let i = 0; i < this.tasks.length; i++){
                        var task = this.tasks[i];
                        var waitingTime = task.endTime - task.arriveTime - task.cpuTime;
                        tempStr += waitingTime;
                        if(i != this.tasks.length - 1){
                            tempStr += ' + ';
                        }else{
                            tempStr += `)/${this.tasks.length} = `;
                        }

                        totalTime += waitingTime;

                    }
                    tempStr += Number(totalTime / this.tasks.length).toFixed(2);
                }else{
                    tempStr = 'Tasks not completed!';
                }


                this.aWaitingTimeStr = tempStr;
            },

        }

    }
</script>