import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

const store = new Vuex.Store({

    state: {
        currentTasks: [],
        startOn: true,
        pauseOn: false,
        stepDebugOn: true,
    },
    getters:{
        getCurrentTasks (state){

            return state.currentTasks;
        },
        isNewAdded (state){
            return state.isNewAdded;
        },
        startOn (state){
            return state.startOn;
        },
        pauseOn (state){
            return state.pauseOn;
        },
        stepDebugOn (state){
            return state.stepDebugOn;
        }
    },
    mutations:{

        addTasks(state , newTask){
            state.currentTasks.push(...newTask);
        },
        delTask(state, idx){
            state.currentTasks.splice(idx, 1);
        },
        toggleStartOn (state, mode){
            state.startOn = mode;

        },
        toggleDebugOn(state, mode){
            state.stepDebugOn = mode;

        },
        togglePauseOn (state, mode){
            state.pauseOn = mode;
        }


    }
})

export default store;