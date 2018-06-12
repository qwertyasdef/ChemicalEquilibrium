class Particle {

    constructor(container, type) {
        const maxMomentum = 10;

        this.container = container

        // Properties of particle
        this.r = type.r;
        this.m = type.m;
        this.color = type.color;

        // Position of particle
        this.x = Math.random() * this.container.width;
        this.y = Math.random() * this.container.height;

        // Velocity of particle
        let v = Math.random() * maxMomentum / this.m;
        let theta = Math.random() * 2 * Math.PI;
        this.vx = v * Math.cos(theta);
        this.vy = v * Math.sin(theta);

    }

    update(others) {

        let nextX = this.x + this.vx;
        let nextY = this.y + this.vy;

        // Bounce off other particles
        for (let p of others) {
            // Don't bounce off yourself
            if (p === this) {
                continue;
            }

            // Check collisions
            let dx = p.x - this.x;
            let dy = p.y - this.y;
            let nextDx = p.x - nextX;
            let nextDy = p.y - nextY;

            // Will collide, but not already colliding
            if (dx**2 + dy**2 > (this.r + p.r)**2 && nextDx**2 + nextDy**2 <= (this.r + p.r)**2) {
                // Angle of collision
                let theta = Math.atan2(dy, dx);

                // Normal and parallel components of momentum relative to collision
                let p1n = this.m * (this.vx * Math.cos(theta) + this.vy * Math.sin(theta));
                let p1p = this.m * (this.vx * Math.sin(theta) - this.vy * Math.cos(theta));
                let p2n = p.m * (p.vx * Math.cos(theta) + p.vy * Math.sin(theta));
                let p2p = p.m * (p.vx * Math.sin(theta) - p.vy * Math.cos(theta));

                // Elastic collision: particles keep parallel momentum and swap perpendicular momentum
                this.vx = (p2n * Math.cos(theta) + p1p * Math.sin(theta)) / this.m;
                this.vy = (p2n * Math.sin(theta) - p1p * Math.cos(theta)) / this.m;
                p.vx = (p1n * Math.cos(theta) + p2p * Math.sin(theta)) / p.m;
                p.vy = (p1n * Math.sin(theta) - p2p * Math.cos(theta)) / p.m;
            }

        }

        // Update predicted next position with new velocities
        nextX = this.x + this.vx;
        nextY = this.y + this.vy;

        // Move particles, bounce off walls
        if (nextX < 0) {
            this.x = -this.x - this.vx;
            this.vx = -this.vx;
        } else if (nextX > this.container.width) {
            this.x = 2 * this.container.width - this.vx - this.x;
            this.vx = -this.vx;
        } else {
            this.x += this.vx;
        }

        if (nextY < 0) {
            this.y = -this.y - this.vy;
            this.vy = -this.vy;
        } else if (nextY > this.container.height) {
            this.y = 2 * this.container.height - this.vy - this.y;
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
