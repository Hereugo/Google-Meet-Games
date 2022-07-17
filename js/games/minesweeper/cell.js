class MinesweeperCell {
    constructor(x, y, gridRef) {
        this.x = x;
        this.y = y;

        this.isBomb = false;
        this.exists = true;

        this.gridRef = gridRef;

        this.cellSize = p5Handler.$container.width() / this.gridRef.getWidth();

        this.SIZE_RATIO = 28 / 45;

        this.setType("unrevealed");

        this.particleSystem = new ParticleSystem(
            this.x * this.cellSize, 
            this.y * this.cellSize, 
            this.cellSize,
            this.bgColor[(this.x + this.y) % 2],
            1
        );
    }

    mousePressed(p) {
        // Reveal cell
        if (p.mouseButton == p.LEFT) {
            if (this.isBomb) {
                p5Handler.game.stateMachine.setState("loose");
                return;
            }

            if (this.type == "unrevealed") {
                this.setType("revealed");
                this.particleSystem.start();

                // If cell value is 0 reveal neighboring cells
                if (this.value == 0) {
                    let destroyedFlags = this.gridRef.revealNeighbors(this.x, this.y);
                    
                    this.gridRef.setFlagsLeft(this.gridRef.flagsLeft + destroyedFlags);
                }
            }
        }

        // Place/Remove flag on cell
        if (p.mouseButton == p.RIGHT) {
            if (this.isRevealed) {
                return;
            }

            if (!this.isFlagged) {
                if (this.gridRef.flagsLeft == 0) {
                    return;
                }

                this.setType("flag");
                this.gridRef.setFlagsLeft(this.gridRef.flagsLeft - 1);
            } else {
                this.setType("unrevealed");
                this.gridRef.setFlagsLeft(this.gridRef.flagsLeft + 1);
            }
        }
    }

    draw(p) {
        let oddEven = (this.x + this.y) % 2;

        p.fill(this.bgColor[oddEven]);

        //TODO: Draw cell border when its unrevealed.
        // Border color: #87af3a
        p.noStroke();

        let mouseCell = this.gridRef.getCellOnPosition(p.mouseX, p.mouseY);
        if (!this.isRevealed && this.compare(mouseCell) && this.type != "bomb") {
            p.fill(CELL_TYPE_COLOR["unrevealed-hover"]["bg"][0][oddEven]);
        }

        p.rect(
            this.x * this.cellSize, 
            this.y * this.cellSize, 
            this.cellSize,
            this.cellSize
        );

        if (this.isFlagged) {
            p.image(
                this.gridRef.flagIcon, 
                this.x * this.cellSize, 
                this.y * this.cellSize, 
                this.cellSize,
                this.cellSize
            );
        }

        p.fill(this.textColor);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(this.cellSize * this.SIZE_RATIO);

        p.text(
            this.value, 
            this.x * this.cellSize + this.cellSize / 2, 
            this.y * this.cellSize + this.cellSize / 2
        );
    }

    setType(type) {
        this.type = type;
        this.isRevealed = (type == "revealed");
        this.isFlagged = (type == "flag");
    
        this.updateCellColors();
    }

    updateCellColors() {
        let [variantColor, rId] = randomElement(CELL_TYPE_COLOR[this.type]["bg"]);

        this.bgColor = variantColor;
        this.textColor = CELL_TYPE_COLOR[this.type]["text"][
            this.isBomb ? rId : 
            this.isRevealed ? this.value : 0
        ];
    }

    compare(cell) {
        return (this.x == cell.x && this.y == cell.y);
    }
}