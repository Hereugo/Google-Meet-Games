class MinesweeperGame extends Game {
    constructor() {
        super();

        this.stateMachine = new StateMachine('inprocess');
        this.stateMachine.addTransition('loose' , this.looseState.bind(this), 'onEnter');
        this.stateMachine.addTransition('win' , this.winState.bind(this), 'onEnter');
        this.stateMachine.addTransition('inprocess' , this.inprocessState.bind(this), 'onUpdate');
        this.stateMachine.addTransition(
            'inprocess', 
            (
                function onMousePressed() {
                    this.objectLayer.mousePressed(this.p);
                }
            ).bind(this), 
            'onMousePressed'
        );
    }

    async reset() {
        this.stateMachine.setState('inprocess');

        this.clock = 0;
        this.score = 0;
        let { bestScore } = await getStorageData(['bestScore']);
        this.bestScore = bestScore;

        this.objectLayer.reset();
        this.objectLayer.setup();
    }

    init() {
        this.objectLayer.addChild('map', new MinesweeperMap(15, 21, 30));
        this.objectLayer.addChild('header', new MinesweeperHeader(this.$container));
        this.objectLayer.addChild('popup', new MinesweeperPopup(this.$container));
    }

    mousePressed() {
        this.stateMachine.dispatchOnMousePressedEvents();
    }

    preload() {
        // Game preload
        this.objectLayer.preload(this.p);
    }

    async setup() {
        // Game setup
        await this.reset();

        this.p.createCanvas(
            this.$container.width(),
            this.$container.height()
        );
    }

    update() {
        this.stateMachine.dispatchOnUpdateEvents();
    }

    inprocessState() {
        // Game update
        this.objectLayer.update();

        if (this.p.frameCount % 60 == 0) {
            this.clock++;
        }
    }
    looseState() {
        this.score = this.clock;
    }
    async winState() {
        this.score = this.clock;

        if (this.bestScore == '---' || this.score < this.bestScore) {
            this.bestScore = this.score;
            await setStorageData({ 'bestScore': this.score });
        }

        this.objectLayer.getChild('popup').stateMachine.setState('win');
    }

    render() {
        // Game render
        this.objectLayer.draw(this.p);
    }

    staticRender() {
        this.p.background(255);
    }
}