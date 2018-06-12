var particles;

window.onload = function() {
    var background = document.getElementById("simulation");
    var ctx = background.getContext("2d");
    var backgroundColor = "blue";

    particles = [];
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(background, ParticleTypes.A));
    }
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(background, ParticleTypes.B));
    }
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(background, ParticleTypes.C));
    }
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(background, ParticleTypes.D));
    }

    function update(time) {
        // Draw and update simulation
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, background.width, background.height);
        for (let p of particles) {
            p.update(particles);
            p.draw(ctx);
        }
        
        // Count particles
        let counts = [0, 0, 0, 0];
        for (let p of particles) {
            if (p.type === ParticleTypes.A) {
                counts[0]++;
            } else if (p.type === ParticleTypes.B) {
                counts[1]++;
            } else if (p.type === ParticleTypes.C) {
                counts[2]++;
            } else {
                counts[3]++;
            }
        }
        // Update table
        document.getElementById("[A]").innerHTML = counts[0];
        document.getElementById("[B]").innerHTML = counts[1];
        document.getElementById("[C]").innerHTML = counts[2];
        document.getElementById("[D]").innerHTML = counts[3];

        window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);

}

function getEnergy() {
    let U = 0;
    for (let p of particles) {
        U += 1/2 * p.m * (p.vx**2 + p.vy**2);
    }
    return U;
}
