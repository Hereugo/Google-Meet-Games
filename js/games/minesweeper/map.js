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
    }

    drawMap() {
        for (let coords in this.map) {
            let cell = this.map[coords];

            cell.animationHandler.startAnimation('color-bg').process(this.p, {'map': this});
            cell.animationHandler.startAnimation('add-ons').process(this.p, {'map': this});

            cell.particle.animationHandler.process(this.p, {'cell': cell, 'map': this});
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