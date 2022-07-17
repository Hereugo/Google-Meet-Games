class ParticleSystem {
    constructor(x, y, sz, color, amount) {
        this.particles = [];
        this.origin = {x, y};
        this.sz = sz;
        this.amount = amount;
        this.color = color;
    }

    addParticle() {
        this.particles.push(new Particle(this.origin.x, this.origin.y, this.sz, this.color));
    }

    start(p) {
        for (let i = 0; i < this.amount; i++) {
            this.addParticle();
        }
        this.run(p);
    }

    run(p) {
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            particle.animationHandler.start();
        }
    }

    draw() {
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            particle.animationHandler.run();
        }
    }
}

class Particle {
    constructor(x, y, sz, color) {
        let p = p5Handler.game.p;
        
        this.acc = p.createVector(0, 0.05);
        this.vel = p.createVector(p.random(-1, 1), p.random(-1, 0));
        this.pos = p.createVector(x, y);
        this.color = color;
        this.sz = sz;
        this.shrinkRate = 0.97;
        this.rotRate = p.random(-0.5, 0.5);

        this.animationHandler = new AnimationHandler();
        this.animationHandler.addAnimation(this.run.bind(this), {p});
    
        this.lifespan = 50;
    }
    
    isDead() {
        return this.lifespan <= 0 || this.sz <= 0;
    }

    run({p}) {
        if (this.lifespan <= 0) {
            this.animationHandler.stop();
            return;
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.lifespan -= 1;
        this.sz *= this.shrinkRate;

        this.draw(p);
    }

    draw(p) {
        p.push();
        
        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.rotRate);

        p.noStroke();
        p.fill(this.color);
        p.rect(0, 0, this.sz, this.sz);

        p.pop();
    }
}