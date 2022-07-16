class MinesweeperGame extends Game {
    constructor() {
        super();

        this.stateMachine = new StateMachine('inprocess');
        this.stateMachine.addTransition('loose' , this.looseState.bind(this), 'onEnter');
        this.stateMachine.addTransition('win' , this.winState.bind(this), 'onEnter');
        this.stateMachine.addTransition('inprocess' , this.inprocessState.bind(this), 'onUpdate');
        this.stateMachine.addTransition('inprocess', (function onMousePressed() {
            this.objectLayer.mousePressed(this.p);
        }).bind(this), 'onMousePressed');
        this.stateMachine.addTransition('inprocess', this.reset.bind(this), 'onEnter');
    }

    async reset() {
        this.clock = 0;

        this.score = 0;
        let { bestScore } = await getStorageData(['bestScore']);
        this.bestScore = bestScore;

        this.objectLayer.reset();
        this.objectLayer.setup();
    }

    init($container) {
        this.$container = $container;

        this.objectLayer.addChild('map', new MinesweeperMap(14, 19, 1));
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
    
        this.objectLayer.getChild('map').stateMachine.setState('loose');
        this.objectLayer.getChild('popup').stateMachine.setState('loose');
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