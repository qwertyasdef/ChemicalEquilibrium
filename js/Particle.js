const minSpeed = 1;

class Particle {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = Math.random() * 10 - 5;
        this.vy = Math.random() * 10 - 5;
        this.vx += minSpeed * Math.sign(this.vx);
        this.vy += minSpeed * Math.sign(this.vx);
        this.color = "white";
    }

    update(others) {

        let nextX = this.x + this.vx;
        let nextY = this.y + this.vy;

        //Calculate repulsive forces
        for (let p of others) {
            if (p === this) {
                continue;
            }
            //Uses average position to approximately conserve energy
            let dx = ((this.x - p.x) + (nextX - p.x)) / 2;
            let dy = ((this.y - p.y) + (nextY - p.y)) / 2;
            let f = 100/(dx**2 + dy**2);
            let theta = Math.atan2(dy, dx);
            let fx = f * Math.cos(theta);
            let fy = f * Math.sin(theta);
            this.vx += fx;
            this.vy += fy;
        }

        //move particles, bounce off walls
        if (nextX < 0) {
            this.x = this.x - this.vx;
            this.vx = -this.vx;
        } else if (nextX > this.width) {
            this.x = 2 * this.width - this.vx - this.x;
            this.vx = -this.vx;
        } else {
            this.x += this.vx;
        }

        if (nextY < 0) {
            this.y = this.y - this.vy;
            this.vy = -this.vy;
        } else if (nextY > this.height) {
            this.y = 2 * this.height - this.vy - this.y;
            this.vy = -this.vy;
        } else {
            this.y += this.vy;
        }

    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
    }

}
