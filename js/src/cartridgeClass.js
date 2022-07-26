class Cartridge {
    constructor({id, name, description, imagePath, game}) {  
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageSrc = chrome.runtime.getURL(imagePath);

        this.game = game;
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
        
        this.getCartridge().click(this.initGame.bind(this));
    }


    initGame() {
        // Show the canvas
        p5Handler.getContainer().css({"z-index": "999"});
        
        p5Handler.setGame(this.game);
        p5Handler.start();
    }
}