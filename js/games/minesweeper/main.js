class MinesweeperGame extends Game {
    constructor() {
        super();

        this.stateMachine = new StateMachine('inprocess');

        this.stateMachine.addTransitions([
            {
                'state': 'loose', 
                'callback': this.looseState.bind(this), 
                'listener': 'onEnter'
            },
            {
                'state': 'win', 
                'callback': this.winState.bind(this), 
                'listener': 'onEnter'
            },
            {
                'state': 'inprocess', 
                'callback': this.inprocessState.bind(this), 
                'listener': 'onUpdate'
            },
            {
                'state': 'inprocess',
                'callback': (function onMousePressed() {
                                this.objectLayer.mousePressed(this.p);
                            }).bind(this), 
                'listener': 'onMousePressed'
            },
        ])
    }

    async reset() {
        this.stateMachine.setState('inprocess');

        this.clock = 0;
        this.score = 0;
        let { bestScore } = await getStorageData(['bestScore']);
        this.bestScore = bestScore;

        this.objectLayer.reset();
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
        this.objectLayer.setup();

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