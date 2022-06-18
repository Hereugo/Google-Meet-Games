class AnimationHandler {
    /**
     * Handles all animations for the element.
     * @param {P5js class responsible for drawing on the canvas} p 
     * @param {Function that applies an animation on the element} animFunction 
     * @param {How many frames the animFunction will repeat} timer 
     */

    constructor(p, animFunction, timer = 0) {
        this.p = p;
        this.animFunction = animFunction;
        this.timer = timer;

        this.reset();
    }
    

    /**
     * Resets the animation handler.
     * @returns {None}
     */
    reset() {
        this.ctimer = 0;
        this.hasFinished = false;
        this.hasStarted = false;
    }
    

    /**
     * Starts to animate the element
     * @returns {None}
     */
    loop() {
        if (this.isFinished || !this.hasStarted)
            return;

        this.animFunction(this.p);
        
        this.ctimer++;
        if (this.ctimer == this.timer) {
            this.ctimer = 0;            
            this.hasFinished = true;
        }
    }
}
