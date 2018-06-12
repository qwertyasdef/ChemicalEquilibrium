window.onload = function() {
    const particleColor = "white";
    const backgroundColor = "blue";

    var background = document.getElementById("simulation");
    var ctx = background.getContext("2d");

    var particles = [];
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(background, ParticleTypes.A));
    }
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(background, ParticleTypes.B));
    }
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(background, ParticleTypes.C));
    }
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(background, ParticleTypes.D));
    }

    function draw(time) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, background.width, background.height);
        for (let p of particles) {
            p.update(particles);
            p.draw(ctx);
        }
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);

}
