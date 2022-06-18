class Minesweeper {
    /**
     * Minesweeper game that handles, the game logic and the display.
     * @param {Jquery element of the canvas that would be drawn on} $gameCanvas 
     * @param {P5js class responsible for drawing on the canvas} p
     * @param {Header of canvas, displays flagsLeft and clock} header
     * @param {Information on game result} popup
     * @param {Map with all game elements} map
     * @param {Number of flags left to place} flagsLeft
     * @param {Number of seconds currently played} clock
     * @param {Determines the state the game currently in} gameState
     */

    /**
     * Method that is called to initilize values, same as constructor.
     * @param {Initilize the canvas} $gameCanvas 
     */
    init($gameCanvas) {
        this.$gameCanvas = $gameCanvas;
        this.$gameCanvas.on("contextmenu", function(e) {
            return false;
        });
    }

    /**
     * 
     * @param {Initilize } p 
     */
    sketch(p) {
        this.p = p;

        this.header = new MinesweeperHeader(this.$gameCanvas);
        this.popup = new MinesweeperPopup(this.$gameCanvas);

        // GAME VALUES
        this.map = new MinesweeperMap(this.p, this.$gameCanvas, 10, 14, 20);
        this.flagsLeft = 0;
        this.clock = 0;
        this.gameState = "pending"; // "pending", "win", "lose"

        p.preload = this.preload.bind(this);
        p.setup = this.setup.bind(this);
        p.draw = this.draw.bind(this);
        p.mousePressed = this.mousePressed.bind(this);
    }

    preload() {
        this.map.flagIcon = this.p.loadImage(chrome.runtime.getURL("img/flag_icon.png"));
        this.map.font = this.p.loadFont(chrome.runtime.getURL("fonts/TiroDevanagariSanskrit-Regular.ttf"));
    }

    setup() {
        this.popup.injectHTML(this.setupGameValues.bind(this));
        this.header.injectHTML();
        this.setupGameValues();

        // Square canvas
        this.p.createCanvas(this.$gameCanvas.width(), this.$gameCanvas.height());

        this.p.noStroke();
    }

    async draw() {
        this.p.background("#FFFFFF");


        this.updateClock(this.p.frameCount);
        this.header.update(this.flagsLeft, this.clock);

        // Display map
        this.map.drawMap();

        if (this.gameState != "pending") {
            this.p.noLoop();

            // Update Best Score
            let { bestScore } = await getStorageData(['bestScore']);
            if(this.gameState == "win") {
                if (this.clock < bestScore || bestScore == "---") {
                    bestScore = this.clock;
                    await setStorageData({ bestScore });
                }    
            }
            
            this.popup.setState(this.gameState, this.clock, bestScore);
            this.popup.show();
            return;
        }
    }

    mousePressed() {
        console.log(this);
        console.log(this.p.mouseButton);

        if (this.gameState != "pending") {
            return;
        }

        // Get cell at mouse position
        let cell = this.map.getCellOnPosition(this.p.mouseX, this.p.mouseY);

        if (!cell.exists) {
            return;
        }

        // Reveal cell
        if (this.p.mouseButton == this.p.LEFT) {
            if (cell.isBomb) {
                this.gameState = "lose";

                for (let coords in this.map.bombs) {
                    let bombCell = this.map.map[coords];

                    if (bombCell.isFlagged) {
                        continue;
                    }

                    bombCell.setType("bomb");
                }

                alert("You lose!");
                return;
            }

            if (cell.type == "unrevealed") {
                cell.setType("revealed");

                // If cell value is 0 reveal neighboring cells
                if (cell.value == 0) {
                    let destroyedFlags = this.map.revealNeighbors(cell.x, cell.y);
                    this.flagsLeft += destroyedFlags;
                }
            }
        }

        // Place/Remove flag on cell
        if (this.p.mouseButton == this.p.RIGHT) {
            if (cell.isRevealed) {
                return;
            }

            if (!cell.isFlagged) {
                if (this.flagsLeft == 0) {
                    return;
                }

                cell.setType("flag");
                this.flagsLeft = this.flagsLeft - 1;
            } else {
                cell.setType("unrevealed");
                this.flagsLeft = Math.min(this.flagsLeft + 1, this.map.numBombs);
            }
        }

        if (this.map.checkWin()) {
            this.gameState = "win";

            alert("You win!");
            return;
        }
    }

    setupGameValues() {
        this.map.setup();

        this.clock = 0;
        this.flagsLeft = this.map.numBombs;
        this.gameState = "pending";

        this.p.loop();
        this.popup.hide();
    }

    updateClock(frameCount) {
        if (frameCount % 60 == 0) this.clock++;
    }
}

class MinesweeperHeader {
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

class MinesweeperMap {
    constructor(p, $gameCanvas, width, height, numBombs) {
        this.p = p;

        this.width = width;
        this.height = height;
        this.numBombs = numBombs;

        this.map = {};
        this.bombs = {};

        this.cellSize = $gameCanvas.width() / this.width;
        this.SIZE_RATIO = 28 / 45;
    }

    setup() {
        this.generateBombPositions();
        this.generateMap();

        console.log(this);
    }

    drawMap() {
        // Get cell at mouse position
        let mouseCell = this.getCellOnPosition(this.p.mouseX, this.p.mouseY);

        for (let coords in this.map) {
            let cell = this.map[coords];

            let oddEven = (cell.x + cell.y) % 2;

            // Draw background of a cell
            this.p.fill(cell.bgColor[oddEven]);

            // When mouse is over cell
            if (!cell.isRevealed && cell.compare(mouseCell)) {
                this.p.fill(cell.CELL_TYPE_COLOR["unrevealed-hover"]["bg"][0][oddEven]);
            }

            this.p.rect(cell.x * this.cellSize, cell.y * this.cellSize, this.cellSize, this.cellSize);

            // When cell is flagged
            if (cell.isFlagged) {
                this.p.image(this.flagIcon, cell.x * this.cellSize, cell.y * this.cellSize, this.cellSize, this.cellSize);
            }

            // this.p.textFont(this.font);
            this.p.fill(cell.textColor);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textSize(this.cellSize * this.SIZE_RATIO);

            this.p.text(cell.value, cell.x * this.cellSize + this.cellSize / 2, cell.y * this.cellSize + this.cellSize / 2);
        }
    }

    generateMap() {
        this.map = {};

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.map[`${x},${y}`] = new MinesweeperCell(
                    x, y, 
                    this.bombs[`${x},${y}`] ? true : false, 
                    this.cntBombNeighbors(x, y)
                );
            }
        }
    }

    generateBombPositions() {
        this.bombs = {};

        var sample = [];
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                sample.push(`${x},${y}`);
            }
        }

    
        for (var i = 0; i < this.numBombs; i++) {
            var idx = Math.floor(Math.random() * (sample.length));
            this.bombs[sample[idx]] = true;
            sample.splice(idx, 1);
        }
    }

    cntBombNeighbors(x, y) {
        var cnt = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                if (this.bombs[`${x + i},${y + j}`]) cnt++;
            }
        }
        return cnt;
    }

    revealNeighbors(x, y, value = 0) {
        let destroyedFlags = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }

                let x2 = x + i;
                let y2 = y + j;

                let cell = this.getCell(x2, y2);
                
                if (!cell.exists || cell.isRevealed) {
                    continue;
                }

                if (cell.isFlagged) {
                    destroyedFlags++;
                }

                cell.setType("revealed");

                if (cell.value == value) {
                    destroyedFlags += this.revealNeighbors(x2, y2, value);
                }
            }
        }

        return destroyedFlags;
    }

    checkWin() {
        for (let coords in this.map) {
            let cell = this.map[coords];

            if (cell.isBomb) {
                if (!cell.isFlagged)
                    return false;
            } else {
                if (cell.type == "unrevealed")
                    return false;
            }
        }
        return true;
    }

    setCellType(type, {cell, x, y}) {
        cell = cell || this.getCell(x, y);

        if (!cell.exists) {
            return;
        }

        cell.setType(type);
    }

    getCell(x, y) {
        return this.map[`${x},${y}`] || {exists: false};
    }

    getCellOnPosition(x, y) {
        let cellX = Math.floor(x / this.cellSize);
        let cellY = Math.floor(y / this.cellSize);

        return this.getCell(cellX, cellY);
    }
}

class MinesweeperCell {
    constructor(x, y, isBomb = false, value) {
        this.x = x;
        this.y = y;

        this.isBomb = isBomb;
        this.value = isBomb ? "⬤" : value;
        this.exists = true;

        this.CELL_TYPE_COLOR = {
            "bomb": {
                "bg": [['#DA3236', '#DA3236'], 
                       ['#F4840D', '#F4840D'], 
                       ['#F4C20E', '#F4C20E'], 
                       ['#008744', '#008744'], 
                       ['#48E6F1', '#48E6F1'], 
                       ['#4785ED', '#4785ED'], 
                       ['#ED44B5', '#ED44B5']],
                "text": ['#8E2123', '#9F5607', '#9F7E09', '#01582C', '#2F969D', '#2F569A', '#9A2C76'],
            },
            "flag": {
                "bg": [["#8ECC39", "#A7D948"]],
                "text": ["#FFFFFF00"], // Transparent color
            },
            "revealed": {
                "bg": [["#D7B899", "#E5C29F"]],
                "text": ["#FFFFFF00", "#1975CE", "green", "red", "purple", "black", "maroon", "gray", "turquoise"],
            },
            "unrevealed": {
                "bg": [["#8ECC39", "#A7D948"]],
                "text": ["#FFFFFF00"], // Transparent color
            },
            "unrevealed-hover": {
                "bg": [["#B9DD76", "#BFE17C"]],
                "text": ["#FFFFFF00"], // Transparent color
            }
        }

        this.setType("unrevealed");
    }

    setType(type) {
        this.type = type;
        this.isRevealed = (type == "revealed");
        this.isFlagged = (type == "flag");
    
        this.updateCellColors();
    }

    updateCellColors() {
        let [variantColor, rId] = randomElement(this.CELL_TYPE_COLOR[this.type]["bg"]);
        this.bgColor = variantColor;
        this.textColor = this.CELL_TYPE_COLOR[this.type]["text"][
            this.isBomb ? rId : 
            this.isRevealed ? this.value : 0];
    }

    compare(cell) {
        return (this.x == cell.x && this.y == cell.y);
    }
}