class AnimationHandler {
    constructor() {
        this.animations = [];
    
        this.currentAnimation = undefined;
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    startAnimation(id, startState = {}) {
        this.currentAnimation = this.animations.find(animation => animation.id === id)
    
        this.currentAnimation.start(startState);

        return this;
    }

    process(p, args = {}) {
        if (this.currentAnimation === undefined) {
            return;
        }

        this.currentAnimation.running(p, args);
    }
}

class Animation {
    constructor(id, foo, time) {
        this.id = id;
        this.foo = foo;
        this.time = time;
    
        this.ctime = 0;
        this.state = {};
        this.isRunning = false;
    }
    stop() {
        this.ctime = 0;
        this.isRunning = false;
    }
    start(startState = {}) {
        this.isRunning = true;
        this.state = startState;
    }

    running(p, args) {
        if (!this.isRunning) {
            return;
        }

        if (this.ctime == this.time) {
            this.stop();
            return;
        }

        this.state = this.foo(p, args, this.state);
        this.ctime++;
    }
}