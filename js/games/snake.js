var $canvas = $("#canvas");

function snakeSketch(p) {

    var player;

    var map = [
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........'
    ];

    p.setup = () => {
        p.createCanvas($canvas.width(), 
                       $canvas.height()
        );

        player = p.createVector(0, 0);
    }

    p.draw = () => {
        p.background(0);

        p.fill(255);
        p.rect(player.x, player.y, 20, 20);
    }

    p.keyPressed = () => {
        if (p.keyCode === p.LEFT_ARROW) {
            player.x -= 20;
        } else if (p.keyCode === p.RIGHT_ARROW) {
            player.x += 20;
        } else if (p.keyCode === p.UP_ARROW) {
            player.y -= 20;
        } else if (p.keyCode === p.DOWN_ARROW) {
            player.y += 20;
        }
    }
}

// Remove when testing is done
new p5(snakeSketch, $canvas[0]);