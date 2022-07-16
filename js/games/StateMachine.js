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
    addTransition(state, callback, listener = "onEnter") {
        this.addState(state);

        this.transitions[state][listener][callback.name] = callback;
    }

    dispatch(event, listener) {
        const action = this.transitions[this.state][listener][event];

        if (action) {
            action.call(this);
        } else {
            console.log("Invalid action: " + listener + " " + event);
        }
    }

    dispatchOnEnterEvents() {
        for (let event in this.transitions[this.state]["onEnter"]) {
            this.dispatch(event, "onEnter");
        }
    }
    dispatchOnMousePressedEvents() {
        for (let event in this.transitions[this.state]["onMousePressed"]) {
            this.dispatch(event, "onMousePressed");
        }
    }
    dispatchOnExitEvents() {
        for (let event in this.transitions[this.state]["onExit"]) {
            this.dispatch(event, "onExit");
        }
    }
    dispatchOnUpdateEvents() {
        for (let event in this.transitions[this.state]["onUpdate"]) {
            this.dispatch(event, "onUpdate");
        }
    }
}



