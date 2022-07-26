class StateMachine {
    constructor(initialState) {
        this.state = initialState;
        this.transitions = {};

        this.addState(this.state);
    }

    setState(state) {
        this.dispatchOnExitEvents();

        this.state = state;

        this.dispatchOnEnterEvents();
    }

    getState() {
        return this.state;
    }

    /**
     * 
     * @param {String} state 
     * @param {Function} callback 
     * @param {"onMousePressed" | "onUpdate" | "onEnter" | "onExit"} listener 
     */
    addState(state) {
        if (!this.transitions[state]) {
            this.transitions[state] = {
                onMousePressed: {},
                onEnter: {},
                onExit: {},
                onUpdate: {}
            };
        }
    }
    
    addTransition(state, callback, listener, args) {
        args = args || {};
        let initialArgs = args;
    
        this.addState(state);

        const name = callback.name.replace(/^bound /, "");
        this.transitions[state][listener][name] = {callback, args, initialArgs};
    }

    resetEvent(state, name, listener) {
        let event = this.transitions[state][listener][name];

        this.updateEvent(state, name, listener, {'args': event.initialArgs});
    }

    updateEvent(state, name, listener, {callback, args}) {
        let event = this.transitions[state][listener][name];

        this.transitions[state][listener][name] = {
            "callback": callback || event.callback,
            "args": args || event.args,
            "initialArgs": event.initialArgs
        }
    }

    _dispatch(event, listener) {
        const action = this.transitions[this.state][listener][event];

        if (action) {
            let newArgs = action.callback.call(this, action.args);
            if (newArgs) {
                this.updateEvent(this.state, event, listener, {'args': newArgs});
            }
        } else {
            console.log("Invalid action: " + listener + " " + event);
        }
    }

    _dispatchEvents(listener, events) {
        events = events || Object.keys(this.transitions[this.state][listener]);
        for (let event of events) {
            this._dispatch(event, listener);
        }
    } 

    dispatchOnEnterEvents(events) {
        this._dispatchEvents("onEnter", events);
    }
    dispatchOnMousePressedEvents(events) {
        this._dispatchEvents("onMousePressed", events);
    }
    dispatchOnExitEvents(events) {
        this._dispatchEvents("onExit", events);
    }
    dispatchOnUpdateEvents(events) {
        this._dispatchEvents("onUpdate", events);
    }
}



