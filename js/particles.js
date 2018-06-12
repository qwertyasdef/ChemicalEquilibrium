const particleCount = 30;

window.onload = function() {
    var background = document.getElementById("simulation");
    ctx = background.getContext("2d");

    particles = [];

    for (i = 0; i < particleCount; i++) {
        particles.push(new Particle(background.width, background.height));
    }

    function draw(time) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, background.width, background.height);
        for (let p of particles) {
            p.update(particles);
            p.draw(ctx);
        }
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
    
}
