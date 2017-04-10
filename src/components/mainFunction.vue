<template>
    <div id="main-function">
        <main-header>
            <span slot="headerUser">hello</span>
        </main-header>
        <div id="task-util">

            <fieldset id="task-input" class="task-util-item">
                <legend>Input task</legend>
                <task-input></task-input>
                <div id="task-input-queue">
                    <h2>Ready Queue</h2>
                    <ul id="task-queue">
                        <li :class="['task-queue-item', `cclass_tag${task.tag}` ]" v-for="task in getTaskQueue">{{task.pid}}</li>
                    </ul>
                </div>
            </fieldset>

            <fieldset id="task-panel" class="task-util-item">
                <legend>Task panel</legend>

                    <table>
                        <thead>
                        <th>pid</th>
                        <th>arrive time</th>
                        <th>cpu time</th>
                        <th>priority</th>
                        <th>end time</th>
                        <th>turnaround time</th>
                        <th>waiting time</th>
                        <th>delete</th>
                        </thead>
                        <tbody>
                        <tr v-for="(task, key) in getCurrentTasks">
                            <td>{{task.pid}}</td>
                            <td>{{task.arriveTime}}</td>
                            <td>{{task.cpuTime}}</td>
                            <td>{{task.priority}}</td>
                            <td>{{task.endTime >= 0? task.endTime: NaN}}</td>
                            <td>{{task.endTime >= 0? task.endTime - task.arriveTime: NaN}}</td>
                            <td>{{task.endTime >= 0? task.endTime - task.arriveTime - task.cpuTime: NaN}}</td>
                            <td><button :class="[{'btn-disabled':!startOn || !stepDebugOn},'btn-sm']" @click="deleteTask(key)" :disabled="!startOn || !stepDebugOn">delete</button></td>
                        </tr>
                        </tbody>
                    </table>




            </fieldset>
        </div>


        <div id="task-scheduler">
            <scheduler></scheduler>
        </div>

        <footer>
            <p>Designed by <a href="https://github.com/jacelynfish" target="_blank">JacelynFish</a> for the course CO003 Operating Systems. Powered by Vue.js 2.0, Webpack, Node.js and Mongodb</p>
            <p>Star this open-source project on <a href="https://github.com/jacelynfish/OS_Process_Scheduler" target="_blank">GitHub</a>!</p>
        </footer>
    </div>
</template>
<<style lang="sass">
    $gColor : #1BBDCC;
    $tColor: #6E7E7F;
    $bColor: #f9f9f9;
    $borderColor: #cecece;

#container{
    box-sizing: border-box;
    width: 100vw;
}

    #task-util{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;

    }

    .task-util-item{
        margin: 1em;
        flex-grow: 1;
        overflow: scroll;
    }
    /*#table-wrapper{*/
        /*max-height: 220px;*/
        /*overflow: scroll;*/
    /*}*/
    #task-panel{
        overflow: hidden;
        max-height: 312px;
    }
    table{
        display: block;
        max-height: 220px;
        overflow: auto;
        font-size: 0.875em;
        text-align: center;


        thead th{
            color: $gColor;
            padding: 6px;
            border-bottom: 1px solid #ddd;

        }

        td{
            color: $tColor;
            padding: 6px;
            border-bottom: 1px solid #ddd;
        }
    }

    #task-input-queue{
        h2{
            font-family: 'fontin-bold';
            color: $gColor;
            font-size: 1em;
            line-height: 2;
        }

    }

    #task-queue{
        border: 1px solid $borderColor;
        border-radius: 6px;
        padding: 1em;
        box-sizing: border-box;
        height: 4em;

    }
    .task-queue-item{
        display: inline-block;
        line-height: 2em;
        height: 2em;
        padding: 0 6px;
    }
    footer{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100vw;
        box-sizing: border-box;
        padding: 1em 0;
        text-align: center;
        font-family: 'fontin-reg';

        p{
            line-height: 1.2;
            font-size: 12px;
            color: #ccc;

            a{
                color: $gColor;
                font-family: 'fontin-bold';
                text-decoration: none;
            }
            a:hover{
                text-decoration: dotted;
            }
        }
    }

</style>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import scheduler from './scheduler.vue';
    import taskInput from './taskInput.vue';
    import mainHeader from './header.vue';
    export default {
//        props:['uname'],
        components:{
            scheduler,
            taskInput,
            mainHeader
        },
        created (){
            this.addCurrentTask(this.defaultTasks);
            this.currentTasks = this.getCurrentTasks;
        },

        computed:{
            ...mapGetters([
                'getCurrentTasks',
                'getTaskQueue',
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