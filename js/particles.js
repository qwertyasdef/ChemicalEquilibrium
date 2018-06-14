const backgroundColor = "blue";
const boundaryColor = "orange";
let background;
let ctx;
let frameID;

const initEnergy = 500;
let energy = initEnergy;
const minEnergy = 125;
const maxEnergy = 2000;
const multEnergy = 2;
let particles;
let reaction;
let container;
const minWidth = 40;
const maxWidth = 640;
const stepWidth = 100;

window.onload = function() {
    background = document.getElementById("simulation");
    ctx = background.getContext("2d");
}

function simulate() {
    // Stop the previous simulation
    if (frameID !== null) {
        window.cancelAnimationFrame(frameID);
    }
    // Get new reaction
    let reactionIndex = document.getElementById("reaction").selectedIndex;
    reaction = reactions[reactionIndex];
    // Update the table
    if (reactionIndex === 0) {
        let toHide = document.querySelectorAll("table#sim-data > tbody > tr > *:nth-child(n+6)");
        for (let box of toHide) {
            box.style.display = "none";
        }
    } else {
        let toShow = document.querySelectorAll("table#sim-data > tbody > tr > *:nth-child(n+6)");
        for (let box of toShow) {
            box.style.display = "";
        }
    }
    // Reset particles
    particles = [];
    container = {"width": background.width, "height": background.height};
    // Add particles
    for (let type of reaction.reactants) {
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle(type));
        }
    }
    for (let type of reaction.products) {
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle(type));
        }
    }
    // Set energy to initial
    let factor = Math.sqrt(initEnergy / getEnergy());
    for (let p of particles) {
        p.vx *= factor;
        p.vy *= factor;
    }

    function update(time) {
        // Draw and update simulation
        // Clear canvas
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, background.width, background.height);
        // Draw container border
        ctx.strokeStyle = boundaryColor;
        ctx.rect(0, 0, container.width, container.height);
        ctx.stroke();
        // Draw particles
        for (let p of particles) {
            p.update(particles);
            p.draw(ctx);
        }

        // Count particles by type
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

        // Request next frame
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

// When an option increase/decrease arrow is clicked
function option(variable, increase) {
    console.log(variable + increase);
    switch (variable) {
        case "T":
            changeT(increase);
            break;
        case "V":
            changeV(increase);
            break;
        default:
            changeConcentration(variable, increse);
    }
}

// Change the temperature/energy of particles
function changeT(increase) {
    if (increase) {
        energy *= multEnergy;
        if (energy > maxEnergy) {
            energy = maxEnergy;
            return;
        }
    } else {
        energy /= multEnergy;
        if (energy < minEnergy) {
            energy = minEnergy;
            return;
        }
    }
    let factor = Math.sqrt(energy / getEnergy());
    for (let p of particles) {
        p.vx *= factor;
        p.vy *= factor;
    }
}

// Change the volume of the container
function changeV(increase) {
    if (increase) {
        container.width += stepWidth;
        if (container.width > maxWidth) {
            container.width = maxWidth;
            return;
        }
    } else {
        container.width -= stepWidth;
        if (container.width < minWidth) {
            container.width = minWidth;
            return;
        }
    }
}
