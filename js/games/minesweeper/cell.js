class MinesweeperCell {
    constructor(x, y, gridRef) {
        this.id = `${x}-${y}`;

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
            2
        );
    }

    mousePressed(p) {
        // Reveal cell
        if (p.mouseButton == p.LEFT) {
            if (this.isBomb) {
                p5Handler.game.stateMachine.setState("loose");

                // Reveal unflagged bombs in random order but have the bomb that was clicked first, explode first.
                let cells = p.shuffle(this.gridRef.getBombCells()).filter(cell => {
                    return (cell.id != this.id && !cell.isFlagged);
                });
                cells.push(this);

                this.gridRef.animationHandler.updateArgs("showBombsEffect", {
                    cells: cells,
                    p: p,
                    count: 0,
                    delay: 10,
                })
                this.gridRef.animationHandler.start(["showBombsEffect"]);
                return;
            }

            if (this.type == "unrevealed") {
                this.setType("revealed");
                this.particleSystem.start();

                // If cell value is 0 reveal neighboring cells
                if (this.value == 0) {
                    this.gridRef.animationHandler.reset("shakeEffect");
                    this.gridRef.animationHandler.start(["shakeEffect"]);

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

        // Draw cell border when its unrevealed.
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                if (i == j) continue;
                let neighborCell = this.gridRef.getCell(this.x + i, this.y + j);

                if (!neighborCell.exists) continue;

                if ((neighborCell.type == "revealed" || this.type == "revealed") && 
                    (neighborCell.type != this.type)) {
                    let offset = 1;

                    p.stroke("#87af3a");
                    p.strokeCap(p.SQUARE);
                    p.strokeWeight(4);
                    
                    p.line(
                        neighborCell.x * this.cellSize,
                        neighborCell.y * this.cellSize,
                        (this.x + 1) * this.cellSize + offset * j,
                        (this.y + 1) * this.cellSize + offset * i
                    );
                }
            }
       }
       

       p.noStroke();

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