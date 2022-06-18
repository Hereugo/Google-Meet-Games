class Cartridge {
    constructor(id, name, description, imagePath, game) {  
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageSrc = chrome.runtime.getURL(imagePath);    
        this.game = game;

        this.$gameCanvas;
    }

    getCartridge() {
        return $(`[game-id="${this.id}"]`);
    }

    injectHTML($parent) {
        $parent.append(cartridgeHTML.format(
            this.id,
            this.name,
            this.description,
            this.imageSrc
        ));
        
        this.setup();
    }

    setup() {
        this.$gameCanvas = $("#canvas");
        this.game.init(this.$gameCanvas);

        const $cartridge = this.getCartridge();
        $cartridge.click(this.initGame.bind(this));
    }

    initGame() {
        // Show the canvas
        this.$gameCanvas.css({"z-index": "999"});
        
        new p5(this.game.sketch.bind(this.game), this.$gameCanvas[0]);
    }
}