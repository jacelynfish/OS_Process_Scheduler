<template>
    <div>
        <div id="file-drop" @dragover.prevent="dragoverHandler" @drop.prevent="dropHandler"
             :class=" [{ disableFile: (!startOn || !stepDebugOn)}] ">
            Please drap your file here to upload.
        </div>


        <input type="text" v-model="newTask.cpuTime">
        <input type="text" v-model="newTask.pid">
        <input type="text" v-model="newTask.priority">
        <input type="text" v-model="newTask.arriveTime">

        <button @click="addTask">add</button>

    </div>
</template>
<style lang="sass">
    #file-drop{
        height: 100px;
    }
    .disableFile{
        color: #eee;
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

            },
            dropHandler(e){
                if(!this.startOn ||  !this.stepDebugOn){
                    return false;
                }else{
                    var self = this;
                    var reader = new FileReader();

                    var file = e.dataTransfer.files[0];
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

                        console.log(...records);
                        self.addCurrentTask(records);

                    })
                }


            }
        }
    }
</script>