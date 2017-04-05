/**
 * Created by jacelynfish on 2017/4/2.
 */

import PubSub from './PubSub.js';

function PreScheduler(options){

    PubSub.call(this);
    var enterQueue = options.queue,
        taskQueue = options.taskQueue,
        runningQueue = options.runningQueue,
        isStepDebug = options.isStepDebug,
        timer = false,
        timeSlot = options.timeSlot || 4,
        sortMethod = options.sortMethod || 'remainTime',
        currentTask = {},
        self = this,
        elapseTimer = null,
        record = new Map();
        var isFirst = true, isSame, stepDebugNext, stepDebugNextTask;

        options.timeElapse = 0;

    function timeSort(tasksArr=[], method){

        if(!tasksArr.length) return [];
        return tasksArr.sort((a, b) => {

            if(a[method] == b[method]){
                return a.arriveTime - b.arriveTime;
            }else{
                return a[method] - b[method];
            }
        })
    }

    function init(){

        self.subscribe('newTask', newTaskHandler);
        self.subscribe('nextTask', function(){
            runScheduler(true);
        });

        enterQueue = timeSort(enterQueue,'arriveTime');
        for(let task of enterQueue){
            task.endTime = -1;
            task.isOn = false;
            task.remainTime = task.cpuTime;
            task.timeSlot = timeSlot;
            if(!record.has(task.arriveTime)){
                record.set(task.arriveTime, [task]);
            }else{
                var list = record.get(task.arriveTime);
                list.push(task);
                record.set(task.arriveTime, list);
            }
        }
    }

    function start(){
        isFirst = true;
        isSame = true;
        stepDebugNext = false;
        enterQueue = options.queue;
        init();
        runScheduler(true);
    }
    function stop(){
        timer = false;
        clearInterval(elapseTimer);
        enterQueue = [];
        taskQueue = [];
        currentTask = {};
        record = new Map();
        options.timeElapse = 0;
    }
    function pause(){
        clearInterval(elapseTimer);
        timer = false;
        //console.log('pause');
    }
    function goon() {
        timer = true;
        taskProcess();
    }

    function runStepScheduler(){
        if(isFirst){
            isSame = true;
            stepDebugNext = true;
            enterQueue = options.queue;
            record = new Map();

            init();
        }
        runScheduler(isFirst? true : stepDebugNextTask);
    }

    function stopStepScheduler(){
        isFirst = true;
        isSame = true;
        stepDebugNext = true;
        enterQueue = options.queue;
        record = new Map();


    }
    function runScheduler(isNextTask){
        if(isStepDebug || !timer){//mutex
            clearInterval(elapseTimer);

            if(!taskQueue.length && isNextTask){
                if(!isStepDebug){
                    if(isFirst){
                        addTime();
                    }else{
                        elapseTimer = setInterval(function(){
                            addTime();
                        },1000);
                    }

                }else{
                    addTime();
                }

            }else{
                if(options.type == 'preemptive'){

                    if(isStepDebug){
                        if(stepDebugNext || stepDebugNextTask){
                            taskQueue = timeSort(taskQueue,sortMethod);

                            currentTask = taskQueue.shift();
                        }
                        stepDebugNext = false;
                    }else{
                        taskQueue = timeSort(taskQueue,sortMethod);
                        currentTask = taskQueue.shift();
                    }

                }

                if(options.type == 'nonpreemptive'){
                    if(isNextTask)//0------------
                        taskQueue = timeSort(taskQueue,sortMethod);
                }
                if(options.type == 'rr' || options.type == 'fcfs' || options.type == 'nonpreemptive'){
                    if(isFirst || isNextTask){
                        currentTask = taskQueue.shift();
                    }
                }

                if(!currentTask.isOn){
                    currentTask.isOn = true;
                }
                timer = true;

                if(isStepDebug){
                    if(isFirst){
                        isFirst = false;
                    }
                    taskProcess();
                }else{
                    if(isFirst || isNextTask){
                        setTimeout(taskProcess, 0);
                        isFirst = false;
                    }else{
                        setTimeout(taskProcess, 1000);
                    }
                }

            }
        }

    }

    function taskProcess(){

        if(isStepDebug || timer) {//mutex

            if(currentTask.remainTime == 0 || currentTask.timeSlot == 0){


                timer = false;


                if(currentTask.remainTime == 0){
                    currentTask.endTime = options.timeElapse - 1;
                }
                if(currentTask.timeSlot == 0 && currentTask.remainTime != 0){
                    currentTask.timeSlot = timeSlot;
                    taskQueue.push(currentTask);
                }

                if(isStepDebug){
                    stepDebugNextTask = true;
                    runStepScheduler(true);
                }else{
                    self.publish('nextTask');
                }

            }else{
                if(isStepDebug){
                    stepDebugNextTask = false;
                }
                currentTask.remainTime--;
                if(options.type == 'rr'){
                    currentTask.timeSlot--;
                }
                runningQueue.push(currentTask.pid);

                addTime();

                if (!isStepDebug && isSame) {
                    setTimeout(taskProcess, 1000);
                }
            }
        }
    }

    function addTime(){

        if(record.has(options.timeElapse)){
            isSame = false;
            clearInterval(elapseTimer);
            var records = record.get(options.timeElapse);
            for(let r of records){
                 //console.log(options.timeElapse, `Job ${r.pid} came into queue`);
                r.remainTime = r.cpuTime;
                r.isOn = false;

            }
            timer = false;

            newTaskHandler(records);

        }else{
            isSame = true;
        }

        options.timeElapse++;
    }
    function newTaskHandler(tasks){

        //ensure the currentTask is not an empty object
        if(options.type == 'preemptive'){
            if(Object.keys(currentTask).length){
                taskQueue.push(currentTask);
            }
        }
        taskQueue.push(...tasks);
        if(isStepDebug){
            stepDebugNext = true;
            stepDebugNextTask = false;
        }else{
            runScheduler(false);
        }

    }

    function add(newTask){
        var temp;
        newTask.arriveTime = options.timeElapse;
        newTask.timeSlot = timeSlot;
        if(record.has(newTask.arriveTime)){
            temp = record.get(newTask.arriveTime);
        }else{
            temp = [];
        }
        temp.push(newTask);
        record.set(newTask.arriveTime, temp);

        if(isStepDebug){
            addTime();
        }
    }
    return {
        start : start,
        stop: stop,
        pause: pause,
        continue: goon,
        add: add,
        runStepScheduler: runStepScheduler,
        stopStepScheduler: stopStepScheduler

    }
}
PreScheduler.prototype = Object.create(PubSub.prototype);

export default PreScheduler;