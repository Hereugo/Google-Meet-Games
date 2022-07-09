class MinesweeperCell {
    constructor(x, y, isBomb = false, value) {
        this.x = x;
        this.y = y;

        this.isBomb = isBomb;
        this.value = isBomb ? "⬤" : value;
        this.exists = true;

        this.animationHandler = new AnimationHandler();
        this.animationHandler.addAnimation(new Animation(
            'color-bg', 
            this.color_bg.bind(this),
            1
        ));
        this.animationHandler.addAnimation(new Animation(
            'add-ons',
            this.addons.bind(this),
            1
        ));

        this.particle = new Particle();

        this.setType("unrevealed");
    }

    color_bg(p, args, state) {
        const {map} = args;

        let oddEven = (this.x + this.y) % 2;
        p.fill(this.bgColor[oddEven]);

        // When mouse is over cell
        let mouseCell = map.getCellOnPosition(p.mouseX, p.mouseY);
        if (!this.isRevealed && this.compare(mouseCell)) {
            p.fill(CELL_TYPE_COLOR["unrevealed-hover"]["bg"][0][oddEven]);
        }

        p.rect(
            this.x * map.cellSize, 
            this.y * map.cellSize, 
            map.cellSize,
            map.cellSize
        );

        return state;
    }
    
    addons(p, args, state) {
        const {map} = args;

        // When cell is flagged
        if (this.isFlagged) {
            p.image(
                map.flagIcon, 
                this.x * map.cellSize, 
                this.y * map.cellSize, 
                map.cellSize,
                map.cellSize
            );
        }

        p.fill(this.textColor);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(map.cellSize * map.SIZE_RATIO);

        p.text(
            this.value, 
            this.x * map.cellSize + map.cellSize / 2, 
            this.y * map.cellSize + map.cellSize / 2
        );

        return state;
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

class Particle {
    constructor() {
        this.animationHandler = new AnimationHandler();


        this.animationHandler.addAnimation(new Animation(
            'fling',
            this.fling,
            10
        ));
    }

    fling(p, args, state) {
        const {cell, map} = args;
        state.angle -= state.turnRate; // Turn counter-clockwise
        state.size -= state.sizeDropRate;

        p.push();
        // Apply transformations
        p.translate(
            cell.x * map.cellSize + map.cellSize / 2, 
            cell.y * map.cellSize + map.cellSize / 2
        );
        p.rotate(state.angle);
        p.rectMode(p.CENTER);

        let oddEven = (cell.x + cell.y) % 2;
        p.fill(CELL_TYPE_COLOR['unrevealed']["bg"][0][oddEven]);

        p.rect(0, 0, state.size, state.size);

        p.pop();

        return state;
    }
}