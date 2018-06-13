let particles;
const backgroundColor = "blue";
let background;
let ctx;
let frameID;
let reaction;

window.onload = function() {
    background = document.getElementById("simulation");
    ctx = background.getContext("2d");
}

function simulate() {
    // Stop the previous simulation
    if (frameID !== null) {
        window.cancelAnimationFrame(frameID);
    }
    let reactionIndex = document.getElementById("reaction").selectedIndex;
    reaction = reactions[reactionIndex];
    // Reset particles
    particles = [];
    let container = {"width": background.width, "height": background.height};
    for (let type of reaction.reactants) {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(container, type));
        }
    }
    for (let type of reaction.products) {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(container, type));
        }
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

        frameID = window.requestAnimationFrame(update);
    }

    frameID = window.requestAnimationFrame(update);

}

function getEnergy() {
    let U = 0;
    for (let p of particles) {
        U += 1/2 * p.m * (p.vx**2 + p.vy**2);
    }
    return U;
}
