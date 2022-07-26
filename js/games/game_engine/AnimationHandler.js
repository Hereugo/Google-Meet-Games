class AnimationHandler {
    constructor() {   
        this.stateMachine = new StateMachine("OFF");
        this.events = [];
    }

    addAnimation(foo, args) {
        this.stateMachine.addTransition("ON", foo, "onUpdate", args || {});
    }

    start(events) {
        this.events = events || Object.keys(this.stateMachine.transitions["ON"]["onUpdate"]);

        this.stateMachine.setState("ON");
    }
    stop() {
        this.events = [];

        this.stateMachine.setState("OFF");
    }
    run() {
        this.stateMachine.dispatchOnUpdateEvents(this.events);
    }

    reset(name) {
        this.stateMachine.resetEvent("ON", name, "onUpdate");
    }

    updateArgs(name, args) {
        this.stateMachine.updateEvent("ON", name, "onUpdate", {'args': args});
    }
}
