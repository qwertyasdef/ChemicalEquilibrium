const backgroundColor = "blue";
const boundaryColor = "orange";
let background;
let ctx;
let frameID;

const initEnergy = 5;
let energy = initEnergy;
const minEnergy = 5 / 3 / 3;
const maxEnergy = 5 * 3 * 3;
const multEnergy = 3;
let particles;
let reaction;
let container;
const minWidth = 200;
const maxWidth = 800;
const stepWidth = 200;

window.onload = function() {
    background = document.getElementById("simulation");
    ctx = background.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, background.width, background.height);
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
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(type));
        }
    }
    for (let type of reaction.products) {
        for (let i = 0; i < 30; i++) {
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

// Returns the average energy of a particle
function getEnergy() {
    let U = 0;
    for (let p of particles) {
        U += 1/2 * p.m * (p.vx**2 + p.vy**2);
    }
    return U / particles.length;
}

// When an option increase/decrease arrow is clicked
function option(variable, increase) {
    switch (variable) {
        case "T":
            changeT(increase);
            break;
        case "V":
            changeV(increase);
            break;
        default:
            changeConcentration(variable, increase);
    }
}

// Change the temperature/energy of particles
let options = document.getElementsByClassName("sim-opt");
function changeT(increase) {
    let buttons = options[0].getElementsByTagName("button");
    buttons[0].disabled = false;
    buttons[1].disabled = false;
    
    if (increase) {
        energy *= multEnergy;
        if (energy >= maxEnergy) {
            energy = maxEnergy;
            buttons[0].disabled = true;
        }
    } else {
        energy /= multEnergy;
        if (energy <= minEnergy) {
            energy = minEnergy;
            buttons[1].disabled = true;
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
    let buttons = options[1].getElementsByTagName("button");
    buttons[0].disabled = false;
    buttons[1].disabled = false;

    if (increase) {
        container.width += stepWidth;
        if (container.width >= maxWidth) {
            container.width = maxWidth;
            buttons[0].disabled = true;
        }
    } else {
        container.width -= stepWidth;
        if (container.width <= minWidth) {
            container.width = minWidth;
            buttons[1].disabled = true;
        }
    }
}

// Add or remove particles
function changeConcentration(type, increase) {
    type = type[1];

    if (increase) {
        let added = [];
        let newE = 0;
        for (let i = 0; i < 20; i++) {
            let temp = new Particle(ParticleTypes[type]);
            newE += temp.energy();
            added.push(temp);
        }
        let factor = Math.sqrt(getEnergy() / (newE / added.length));
        for (let p of added) {
            p.vx *= factor;
            p.vy *= factor;
            particles.push(p);
        }
    } else {
        let toRemove = [];
        for (p of particles) {
            if (p.type === ParticleTypes[type]) {
                toRemove.push(p);
                if (toRemove.length === 20) {
                    break;
                }
            }
        }
        particles = particles.filter(item => toRemove.indexOf(item) === -1);
    }
}
