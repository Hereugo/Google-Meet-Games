class MinesweeperHeader {
    /**
     * Constructor for the header class. Setups up initial values.
     * @param {class} $gameCanvas Jquery element of the canvas that would be drawn on. 
     */
    constructor($gameCanvas) {
        this.html = `
            <div class="canvas-header">
                <div class="canvas-item">
                    <img src="${chrome.runtime.getURL("img/flag_icon.png")}"/>
                    <span class="flag-value">0</span>
                </div>

                <div class="canvas-item">
                    <img src="${chrome.runtime.getURL("img/clock_icon.png")}"/>
                    <span class="clock-value">0</span>
                </div>
            </div>
        `;

        this.$gameCanvas = $gameCanvas;
    }


    injectHTML() {
        $(this.html).insertBefore(this.$gameCanvas);
    }


    setText(className, value) {
        $(`.${className}`).text(value);
    }


    update(flagsLeft, clock) {
        // Update header flag value
        this.setText("flag-value", flagsLeft);

        // Update header clock value
        this.setText("clock-value", clock);
    }
}

class MinesweeperPopup {
    constructor($gameCanvas) {
        this.$gameCanvas = $gameCanvas;

        this.html = `
            <div id="final-screen">
                <div id="overlay"></div>
                <div id="board">
                    <div id="result">
                        <img src="${chrome.runtime.getURL("img/clock_icon.png")}" class="icon-lg" id="clock-icon">
                        <img src="${chrome.runtime.getURL("img/trophy_icon.png")}" class="icon-lg" id="trophy-icon">
                        <div id="score">000</div>
                        <div id="best-score">000</div>
                    </div>
                    <img src="${chrome.runtime.getURL(`img/lose_screen.png`)}" id="result-img">
                </div>
                <div id="replay">
                    Play Again!
                </div>
            </div>
        `;
    }

    injectHTML(resetGame) {
        $(this.html).insertBefore(this.$gameCanvas);

        $("#replay").click(resetGame);
    }

    setState(gameState = "lose", score = "000", bestScore = "000") {
        $("#score").text(score);
        $("#best-score").text(bestScore);
        $("#result-img").attr('src', chrome.runtime.getURL(`img/${gameState}_screen.png`));
    }

    show() {
        $("#final-screen").css({"display": "block"});
    }

    hide() {
        $("#final-screen").css({"display": "none"});
    }
}