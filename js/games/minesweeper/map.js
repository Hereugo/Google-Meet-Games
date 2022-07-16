class MinesweeperMap {
    constructor(width, height, numBombs) {
        this.width = width;
        this.height = height;
        this.numBombs = numBombs;
        this.flagsLeft = numBombs;

        this.grid = {};

        this.stateMachine = new StateMachine("inprocess");
        this.stateMachine.addTransition("loose", this.looseState.bind(this), "onEnter");
    }

    reset() {
        this.grid = {};
        this.flagsLeft = this.numBombs;
        this.stateMachine.setState("inprocess");
    }

    preload(p) {
        this.flagIcon = p.loadImage(chrome.runtime.getURL("img/flag_icon.png"));
    }

    mousePressed(p) {
        let cell = this.getCellOnPosition(p.mouseX, p.mouseY);
        if (!cell.exists) {
            return;
        }
        
        cell.mousePressed(p);

        if (this.checkWin()) {
            p5Handler.game.stateMachine.setState("win");
        }
    }

    setup() {
        this.generateGrid();
    }

    draw(p) {
        for (let coords in this.grid) {
            let cell = this.grid[coords];
            
            cell.draw(p);
        }
    }

    generateGrid() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.grid[`${x},${y}`] = new MinesweeperCell(x, y);
            }
        }

        // Set cell type. Bomb or not bomb
        let cnt = this.numBombs;
        while (cnt > 0) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);

            let cell = this.getCell(x, y);

            if (cell.isBomb) {
                continue;
            }

            cell.isBomb = true;
            cnt--;
        }

        // Set cell value
        for (let coords in this.grid) {
            let cell = this.grid[coords];
            cell.value = cell.isBomb ? "⬤" : this.cntBombNeighbors(cell.x, cell.y);
        }
    }

    cntBombNeighbors(x, y) {
        var cnt = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;

                let cell = this.getCell(x + i, y + j);

                if (cell.isBomb) cnt++;
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

    setCellType(type, {cell, x, y}) {
        cell = cell || this.getCell(x, y);

        if (!cell.exists) {
            return;
        }

        cell.setType(type);
    }

    getCell(x, y) {
        return this.grid[`${x},${y}`] || {exists: false};
    }

    getCellOnPosition(x, y) {
        let cellSize = $("#canvas").width() / this.width;

        let cellX = Math.floor(x / cellSize);
        let cellY = Math.floor(y / cellSize);

        return this.getCell(cellX, cellY);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setFlagsLeft(num) {
        this.flagsLeft = num;
    }

    checkWin() {
        for (let coords in this.grid) {
            let cell = this.grid[coords];

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

    looseState() {
        for (let coords in this.grid) {
            let cell = this.grid[coords];

            if (cell.isBomb) {
                cell.setType("bomb");
            }
        }
    }
}