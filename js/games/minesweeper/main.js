class MinesweeperGame extends Game {
    constructor() {
        super();

        this.state = 'inprocessState'; // inprocessState, winState, looseState
        this.clock = 0;

        this.score = 0;
        this.bestScore = "---";
    }

    async reset() {
        this.state = 'inprocessState';
        this.clock = 0;

        this.score = 0;
        let { bestScore } = await getStorageData(['bestScore']);
        this.bestScore = bestScore;

        this.objectLayer.reset();
        this.objectLayer.setup();
    }

    init($container) {
        this.$container = $container;

        this.objectLayer.addChild('header', new MinesweeperHeader(this.$container));
        this.objectLayer.addChild('map', new MinesweeperMap(14, 19, 1));
        this.objectLayer.addChild('popup', new MinesweeperPopup(this.$container));
    }

    mousePressed() {
        if (this.state !== 'inprocessState') {
            return;
        }

        this.objectLayer.mousePressed(this.p);
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
        if (this.state !== 'inprocessState') {
            return;
        }

        // Game update
        this.objectLayer.update();

        if (this.p.frameCount % 60 == 0) {
            this.clock++;
        }
    }

    setState(state) {
        this.state = state;
    }
    async looseState() {
        this.score = this.clock;
    }
    async winState() {
        this.score = this.clock;

        if (this.bestScore == '---' || this.score < this.bestScore) {
            this.bestScore = this.score;
            await setStorageData({ 'bestScore': this.score });
        }
    }


    render() {
        // Game render
        this.objectLayer.draw(this.p);
    }

    staticRender() {
        this.p.background(255);
    }
}