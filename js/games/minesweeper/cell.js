class MinesweeperCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.isBomb = false;
        this.exists = true;

        this.cellSize = $("#canvas").width() / this.getMap().getWidth();

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
        let map = this.getMap();

        // Reveal cell
        if (p.mouseButton == p.LEFT) {
            this.particleSystem.start();
            
            if (this.isBomb) {
                p5Handler.game.stateMachine.setState("loose");
                return;
            }

            if (this.type == "unrevealed") {
                this.setType("revealed");

                // If cell value is 0 reveal neighboring cells
                if (this.value == 0) {
                    let destroyedFlags = map.revealNeighbors(this.x, this.y);
                    
                    map.setFlagsLeft(map.flagsLeft + destroyedFlags);
                }
            }
        }

        // Place/Remove flag on cell
        if (p.mouseButton == p.RIGHT) {
            if (this.isRevealed) {
                return;
            }

            if (!this.isFlagged) {
                if (map.flagsLeft == 0) {
                    return;
                }

                this.setType("flag");
                map.setFlagsLeft(map.flagsLeft - 1);
            } else {
                this.setType("unrevealed");
                map.setFlagsLeft(map.flagsLeft + 1);
            }
        }
    }

    getMap() {
        return p5Handler.game.objectLayer.getChild("map");
    }

    draw(p) {
        let oddEven = (this.x + this.y) % 2;

        p.fill(this.bgColor[oddEven]);
        p.noStroke();

        let mouseCell = this.getMap().getCellOnPosition(p.mouseX, p.mouseY);
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
                this.getMap().flagIcon, 
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