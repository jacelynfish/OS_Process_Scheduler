<template>
    <div>
        <div id="file-drop" @dragover.prevent="dragoverHandler" @drop.prevent="dropHandler"
             @dragleave="dragLeaveHandler" :class=" [{ disableFile: (!startOn || !stepDebugOn)}] ">
            Please drop your file here to upload.
        </div>


        <div id="task-input-gp">
            <label><span>pid</span><input type="text" v-model="newTask.pid"></label>
            <label><span>arrive time</span><input type="text" v-model="newTask.arriveTime"></label>
            <label><span>cpu time</span><input type="text" v-model="newTask.cpuTime"></label>
            <label><span>priority</span><input type="text" v-model="newTask.priority"></label>

            <button @click="addTask" class="btn-md">add</button>
        </div>
    </div>
</template>
<style lang="sass">
    $gColor : #1BBDCC;
    $lightGColor: #9CE5E5;
    $tColor: #6E7E7F;
    $bColor: #f9f9f9;


    #file-drop{
        border: 3px solid transparent;
        background-color: $lightGColor;
        box-sizing: border-box;
        padding: 1em;
        border-radius: 6px;
        text-align: center;
        color: white;
        /*line-height: calc(100px - 2em);*/
    }
    #file-drop.disableFile{
        color: #eee;
    }
    #file-drop.activeDrag{
        transition: all 0.2s;
        background-color: transparent;
        border: 3px dashed $gColor;
        color: $gColor;
        font-weight: bold;
    }
    #task-input-gp{
        color: $gColor;
        width: 100%;
        font-size: 14px;
        margin: 1em 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        label{
            margin: 2px 0;
            width: 40%;

            span {
                display: inline-block;
                width: 25%;
            }


        }

    }


</style>
<script>
    import {mapMutations, mapGetters} from 'vuex';

    export default{
        created (){
        },
        computed:{
            ...mapGetters([
                'startOn',
                'stepDebugOn',
                'getCurrentTasks'
            ])
        },
        data: function () {
            return {
                fileDropClass:{
                    'enable-file':(this.startOn || this.stepDebugOn),
                    'disable-file':(!this.startOn && !this.stepDebugOn),
                },
                newTask:{
                    cpuTime:0,
                    pid:-1,
                    priority: 0,
                    arriveTime: 0,
                },
                isDraggingOver: false
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
            },
            dragoverHandler (){
                if(!this.isDraggingOver){
                    this.isDraggingOver = true;
                    var dragPanel = document.getElementById('file-drop');
                    dragPanel.classList.add('activeDrag')
                }
            },
            dragLeaveHandler(){
                this.isDraggingOver = false;
                var dragPanel = document.getElementById('file-drop');
                dragPanel.classList.remove('activeDrag');
            },
            dropHandler(e){
                this.dragLeaveHandler();
                if(!this.startOn ||  !this.stepDebugOn){
                    return false;

                }else{
                    var self = this;
                    var reader = new FileReader();

                    var file = e.dataTransfer.files[0];

                    if(/plain/.test(file.type)){
                        var result;
                        reader.readAsText(file);

                        reader.addEventListener('load', function(){
                            result = reader.result;
                            var records = [];
                            var resultLines = result.split('\n');
                            for(let r of resultLines){
                                if(r == ""){
                                    continue;
                                }

                                var record = r.split('\t');
                                var temp = {};
                                temp.pid = record[0];
                                temp.arriveTime = Number(record[1]);
                                temp.cpuTime = Number(record[2]);
                                temp.priority = Number(record[3]);

                                records.push(temp);
                            }

                            self.addCurrentTask(records);

                        })
                    }else{
                        alert('please upload utf-8 txt file!')
                    }

                }


            }
        }
    }
</script>