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

                // Normal and parallel components of velocity relative to collision
                let v1n = this.vx * Math.cos(theta) + this.vy * Math.sin(theta);
                let v1p = this.vx * Math.sin(theta) - this.vy * Math.cos(theta);
                let v2n = p.vx * Math.cos(theta) + p.vy * Math.sin(theta);
                let v2p = p.vx * Math.sin(theta) - p.vy * Math.cos(theta);

                // Elastic collision formula from https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=12&cad=rja&uact=8&ved=0ahUKEwjp-er0nc3bAhVtJDQIHV1DD38QFgiPATAL&url=https%3A%2F%2Fimada.sdu.dk%2F~rolf%2FEdu%2FDM815%2FE10%2F2dcollisions.pdf&usg=AOvVaw1zP8W3J-k7i750uBViTZu_
                let newV1n = (v1n * (this.m - p.m) + 2 * p.m * v2n)/(this.m + p.m);
                let newV2n = (v2n * (p.m - this.m) + 2 * this.m * v1n)/(this.m + p.m);
                this.vx = newV1n * Math.cos(theta) + v1p * Math.sin(theta);
                this.vy = newV1n * Math.sin(theta) - v1p * Math.cos(theta);
                p.vx = newV2n * Math.cos(theta) + v2p * Math.sin(theta);
                p.vy = newV2n * Math.sin(theta) - v2p * Math.cos(theta);
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
