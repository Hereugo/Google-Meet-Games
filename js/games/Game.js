class Game {
    constructor() {
        this.objectLayer = new ObjectLayer();
    }

    sketch(p) {
        console.log(this);

        this.p = p;

        this.p.setup = this.setup.bind(this);
        
        this.p.preload = this.preload.bind(this);

        this.p.draw = () => {
            this.staticRender();
            this.update();
            this.render();
        }

        this.p.mousePressed = this.mousePressed.bind(this);
    }

    setup() {
        // override
    }

    preload() {
        // override
    }

    update() {
        // override
    }
    
    render() {
        // override
    }

    staticRender() {
        // override
    }
}
