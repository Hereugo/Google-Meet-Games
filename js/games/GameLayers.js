function ObjectLayer() {
    this.children = {};

    this.addChild = function(name, child) {
        this.children[name] = child;
    }

    this.getChild = function(name) {
        return this.children[name];
    }

    this.reset = function() {
        Object.values(this.children).forEach(child => {
            if (typeof child.reset === 'function') {
                child.reset();
            }
        });
    }

    this.preload = function(p) {
        Object.values(this.children).forEach(child => {
            if (typeof child.preload === 'function') {
                child.preload(p);
            }
        });
    }

    this.setup = function() {
        Object.values(this.children).forEach(child => {
            if (typeof child.setup === 'function') {
                child.setup();
            }
        });
    }

    this.draw = function(p) {
        Object.values(this.children).forEach(child => {
            if (typeof child.draw === 'function') {
                child.draw(p);
            }
        });
    }

    this.update = function(state) {
        Object.values(this.children).forEach(child => {
            if (typeof child.update === 'function') {
                child.update(state);
            }
        });
    }

    this.mousePressed = function(p) {
        Object.values(this.children).forEach(child => {
            if (typeof child.mousePressed === 'function') {
                child.mousePressed(p);
            }
        });
        
        //State change
        let state = p5Handler.game.state;

        p5Handler.game[state] && p5Handler.game[state]();
        Object.values(this.children).forEach(child => {
            child[state] && child[state]();
        });
    }
}

