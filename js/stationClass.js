class Station {
    constructor() {
        this.cartridges = [];
    
        this.setup();
    }

    addNewCartridge(args) {
        this.cartridges.push(new Cartridge(args));
    }

    setup() {
        // Set an observer on the container
        const observer = new MutationObserver(this.injectHTML.bind(this));
        observer.observe($('[jsname="ME4pNd"]')[0], {
            childList: true,
            subtree: true
        });
    }

    async injectHTML() {
        await sleep(100);
        
        const $parent = $('[jsname="QGvzrd"]').parent();
        const itemSelector = '.VfPpkd-StrnGf-rymPhb-ibnC6b';

        onReady($parent, itemSelector, () => {
            if ($parent.find('.game-extension')[0] === undefined) {
                // Initiate changes to the DOM
                $parent.css({'position': 'relative'});
                       
                // Inject required HMTL
                $parent.append(canvasHTML);
                const $subParent = $parent.find('ul');
                this.cartridges.forEach(
                    cartridge => cartridge.injectHTML($subParent)
                );
            }
        });
    }
}

