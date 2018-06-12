const minSpeed = 1;
const maxSpeed = 10;

class Particle {

    constructor(width, height) {
        //dimensions of container;
        this.width = width;
        this.height = height;

        //radius of particle
        this.r = 5;

        //position of particle
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        //velocity of particle
        let v = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        let theta = Math.random() * 2 * Math.PI;
        this.vx = v * Math.cos(theta);
        this.vy = v * Math.sin(theta);

        //Color: Does nothing so far
        this.color = "white";

    }

    update(others) {

        let nextX = this.x + this.vx;
        let nextY = this.y + this.vy;

        //Bounce off other particles
        for (let p of others) {
            //Don't bounce off yourself
            if (p === this) {
                continue;
            }

            //Check collisions
            let dx = p.x - this.x;
            let dy = p.y - this.y;
            let nextDx = p.x - nextX;
            let nextDy = p.y - nextY;

            //Will collide, but not already colliding
            if (dx**2 + dy**2 > (2 * this.r)**2 && nextDx**2 + nextDy**2 <= (2 * this.r)**2) {
                //Angle of collision
                let theta = Math.atan2(dy, dx);

                //Normal and parallel components of velocity relative to collision
                let v1n = this.vx * Math.cos(theta) + this.vy * Math.sin(theta);
                let v1p = this.vx * Math.sin(theta) - this.vy * Math.cos(theta);
                let v2n = p.vx * Math.cos(theta) + p.vy * Math.sin(theta);
                let v2p = p.vx * Math.sin(theta) - p.vy * Math.cos(theta);

                //Elastic collision: particles keep vp and swap vn
                this.vx = v2n * Math.cos(theta) + v1p * Math.sin(theta);
                this.vy = v2n * Math.sin(theta) - v1p * Math.cos(theta);
                p.vx = v1n * Math.cos(theta) + v2p * Math.sin(theta);
                p.vy = v1n * Math.sin(theta) - v2p * Math.cos(theta);
            }

        }

        //Update next position with new velocities
        nextX = this.x + this.vx;
        nextY = this.y + this.vy;

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
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
    }

}
