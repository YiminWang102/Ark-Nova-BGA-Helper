class PubSub {
    constructor() {
        this.events = {};
    }

    subscribe(eventName, callback) {        
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    unsubscribe(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
        }
    }

    publish(eventName, data) {
        console.log("publishing event ", eventName, data);
        if (this.events[eventName]) {
            this.events[eventName].forEach((callback) => callback(data));
        }
    }
}

export const pubSub = new PubSub();
