class Station {
    constructor() {
        this.cartridges = [];
    
        this.setup();
    }

    addNewCartridge(args) {
        this.cartridges.push(new Cartridge(args));
    }

    findCartridge(id) {
        return this.cartridges.find(cartridge => cartridge.id === id);
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
                $parent.css({'position': 'relative'});
                       
                let $container = $(canvasHTML);
                
                $parent.append($container);

                p5Handler.setContainer($container);
                $container.on("contextmenu", function(e) {
                    return false;
                });

                $(".VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.IWtuld.wBYOYb").click(p5Handler.stop.bind(p5Handler));

                const $subParent = $parent.find('ul');
                this.cartridges.forEach(
                    cartridge => cartridge.injectHTML($subParent)
                );
            }
        });
    }
}

