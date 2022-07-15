class P5Handler {
    constructor() {
        this.game = null;
        this.$container = null;
    }

    setGame(game) {
        this.game = game;
    }
    getGame() {
        return this.game;
    }

    setContainer($container) {
        this.$container = $container;
    }
    getContainer() {
        return this.$container;
    }


    start() {
        this.game.init(this.$container);

        new p5(this.game.sketch.bind(this.game), this.$container[0]);
    }
}
