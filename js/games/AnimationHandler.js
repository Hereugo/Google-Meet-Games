class AnimationHandler {
    constructor() {   
        this.stateMachine = new StateMachine("OFF");
    }

    addAnimation(foo, args) {
        this.stateMachine.addTransition("ON", foo, "onUpdate", args || {});
    }

    start() {
        this.stateMachine.setState("ON");
    }
    stop() {
        this.stateMachine.setState("OFF");
    }
    run() {
        this.stateMachine.dispatchOnUpdateEvents();
    }
}
