class MinesweeperUI {
    constructor(container) {
        this.$container = container;
    }

    setup() {
        // override
    }

    draw(p) {
        // override
    }

    preload(p) {
        // override
    }
}

class MinesweeperHeader extends MinesweeperUI {
    constructor(container) {
        super(container);

        this.preload();

        this.html = `
            <div class="canvas-header">
                <div class="canvas-item">
                    <img src="${this.flagIcon}"/>
                    <span class="flag-value">0</span>
                </div>

                <div class="canvas-item">
                    <img src="${this.clockIcon}"/>
                    <span class="clock-value">0</span>
                </div>
            </div>
        `;
    }

    preload() {
        this.flagIcon = chrome.runtime.getURL("img/flag_icon.png");
        this.clockIcon = chrome.runtime.getURL("img/clock_icon.png");
    }

    setup() {
        $(this.html).insertBefore(this.$container);
    }

    update() {
        let flagsLeft = p5Handler.game.objectLayer.getChild("map").flagsLeft;
        let clockValue = p5Handler.game.clock;

        $('.flag-value').text(flagsLeft);
        $('.clock-value').text(clockValue);
    }
}


class MinesweeperPopup extends MinesweeperUI {
    constructor(container) {
        super(container);

        this.preload();

        this.html = `
            <div id="final-screen">
                <div id="overlay"></div>
                <div id="board">
                    <div id="result">
                        <img src="${this.clockIcon}" class="icon-lg" id="clock-icon">
                        <img src="${this.trophyIcon}" class="icon-lg" id="trophy-icon">
                        <div id="score">000</div>
                        <div id="best-score">000</div>
                    </div>
                    <img src="${this.looseScreen}" id="result-img">
                </div>
                <div id="replay">
                    Play Again!
                </div>
            </div>
        `;

        this.stateMachine = new StateMachine("inprocess");
        this.stateMachine.addTransition("inprocess", this.hide, "onEnter");
        this.stateMachine.addTransition("inprocess", this.show, "onExit");
        this.stateMachine.addTransition("loose", this.looseState.bind(this), "onEnter");
        this.stateMachine.addTransition("win", this.winState.bind(this), "onEnter");
    }

    preload() {
        this.clockIcon = chrome.runtime.getURL("img/clock_icon.png");
        this.trophyIcon = chrome.runtime.getURL("img/trophy_icon.png");
        this.looseScreen = chrome.runtime.getURL("img/loose_screen.png");
    }

    reset() {
        this.stateMachine.setState("inprocess");
    }

    setup() {
        $(this.html).insertBefore(this.$container);

        $("#replay").click(() => {
            p5Handler.game.reset();
        });
    }

    show() {
        $("#final-screen").css({"display": "block"});
    }

    hide() {
        $("#final-screen").css({"display": "none"});
    }

    looseState() {
        this._setState("loose", p5Handler.game.score, p5Handler.game.bestScore);
    }
    winState() {
        this._setState("win", p5Handler.game.score, p5Handler.game.bestScore);
    }

    _setState(state = "loose", score = "---", bestScore = "---") {
        console.log(score, bestScore);

        $("#score").text(score);
        $("#best-score").text(bestScore);
        $("#result-img").attr('src', chrome.runtime.getURL(`img/${state}_screen.png`));
    }
}