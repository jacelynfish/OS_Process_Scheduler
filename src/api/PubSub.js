
function PubSub(){

    this.topics = {};
    this.subRecords = new Map();

}

PubSub.prototype.publish = function(topic, ...args){
    if(!this.topics[topic]){
        this.topics[topic] = [];
    }

    var subscribers = this.topics[topic],
        len = subscribers.length;
    while(len--){
        subscribers[len].cb(...args);
    }

}

PubSub.prototype.subscribe = function(topic, cb){
    if(!this.topics[topic]){
        this.topics[topic] = [];
    }
    var token = (new Date()).valueOf();

    this.topics[topic].push({
        token: token,
        cb: cb
    });
    this.subRecords.set(token, topic);
    return token;
}

PubSub.prototype.unsubscribe = function(token){
    if(this.subRecords.has(token)){
        var topic = this.subRecords.get(token);
        this.topics[topic] = undefined;
        delete this.topics[topic];

        return true;
    }
    return false;
}

export default PubSub;