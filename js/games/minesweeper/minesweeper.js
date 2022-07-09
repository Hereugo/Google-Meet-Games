class Minesweeper {
    /**
     * Minesweeper game that handles, the game logic and the display.
     * @param {class} $gameCanvas Jquery element of the canvas that would be drawn on 
     */
    init($gameCanvas) {
        this.$gameCanvas = $gameCanvas;
    
        this.WIDTH = 14;
        this.HEIGHT = 19;
        this.NUM_BOMBS = 30;
    }


    /**
     * Setup canvas, header, popup and map.
     * @param {class} p Get access to methods to draw on the canvas and manipulate the DOM.
     * @returns {None}
     */
    sketch(p) {
        console.log("Hello from sketch: ", p);
        this.p = p;

        this.header = new MinesweeperHeader(this.$gameCanvas);
        this.popup = new MinesweeperPopup(this.$gameCanvas);

        // GAME VALUES

        this.map = new MinesweeperMap(
            this.p, 
            this.$gameCanvas, 
            this.WIDTH, 
            this.HEIGHT, 
            this.NUM_BOMBS
        );

        this.flagsLeft = 0;
        this.clock = 0;
        this.gameState = "pending"; // "pending", "win", "lose"

        p.preload = this.preload.bind(this);
        p.setup = this.setup.bind(this);
        p.draw = this.draw.bind(this);
        p.mousePressed = this.mousePressed.bind(this);
    }


    /**
     * Preload all images used in the game.
     * @returns {None}
     */
    preload() {
        this.map.flagIcon = this.p.loadImage(chrome.runtime.getURL("img/flag_icon.png"));
        this.map.font = this.p.loadFont(chrome.runtime.getURL("fonts/TiroDevanagariSanskrit-Regular.ttf"));
    }


    /**
     * P5 setup method. Called once when the canvas is created.
     * @returns {None}
     */
    setup() {
        this.popup.injectHTML(this.setupGameValues.bind(this));
        this.header.injectHTML();
        this.setupGameValues();

        // Square canvas
        this.p.createCanvas(this.$gameCanvas.width(), this.$gameCanvas.height());

        this.p.noStroke();
    }


    /**
     * P5 draw method. Called every frame. 
     * @returns {None}
     */
    async draw() {
        // this.p.background("#FFFFFF");

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


    /**
     * P5 mousePressed method. Called when the mouse is pressed.
     * @returns {None}
     */
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
                
                cell.particle.animationHandler.startAnimation('fling', {
                    'angle': 0,
                    'turnRate': 5,
                    'size': this.map.cellSize,
                    'sizeDropRate': 1
                });

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

            return;
        }
    }


    /**
     * Setup starting game values.
     * @returns {None}
     */
    setupGameValues() {
        this.map.setup();

        this.clock = 0;
        this.flagsLeft = this.map.numBombs;
        this.gameState = "pending";

        this.p.loop();
        this.popup.hide();
    }


    /**
     * Updates the clock when the game is running.
     * @param {int} frameCount Number of frames since the game started
     * @returns {None}
     */
    updateClock(frameCount) {
        if (frameCount % 60 == 0) this.clock++;
    }
}
