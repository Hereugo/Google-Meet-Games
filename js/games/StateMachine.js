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

        this.addState(state);

        const name = callback.name.replace(/^bound /, "");
        this.transitions[state][listener][name] = {
            callback,
            args
        };
    }

    updateEvent(state, name, listener, {callback, args}) {
        let event = this.transitions[state][listener][name];

        this.transitions[state][listener][name] = {
            "callback": callback || event.callback,
            "args": args || event.args
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

    dispatchOnEnterEvents() {
        for (let event in this.transitions[this.state]["onEnter"]) {
            this._dispatch(event, "onEnter");
        }
    }
    dispatchOnMousePressedEvents() {
        for (let event in this.transitions[this.state]["onMousePressed"]) {
            this._dispatch(event, "onMousePressed");
        }
    }
    dispatchOnExitEvents() {
        for (let event in this.transitions[this.state]["onExit"]) {
            this._dispatch(event, "onExit");
        }
    }
    dispatchOnUpdateEvents() {
        for (let event in this.transitions[this.state]["onUpdate"]) {
            this._dispatch(event, "onUpdate");
        }
    }
}



