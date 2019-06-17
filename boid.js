class Boid{
  constructor(x = random(width), y = random(height)) {
    this.maxForce = 0.2;
    this.maxSpeed = 8;
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(this.maxSpeed);
    this.acceleration = createVector();
  }
  
  // Infinite canvas, so have boids loop around when going out of bounds.
  edges() {
  if(this.position.x>width) {
    this.position.x = 0;
  } else if(this.position.x < 0) {
    this.position.x = width;
  } else if(this.position.y>height) {
    this.position.y = 0;
  } else if(this.position.y < 0) {
    this.position.y = height;
  	}
  }
 
  // Update the position and velocity of the boid, and reset the acceleration.
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  getNearbyBoids(boids, radius) {
    let nearby = []
    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (d < radius && other != this) {
        nearby.push(other);
      }
    }
    return nearby;
  }
  
  // Force boid in the same direction nearby boids are heading
  align(boids) {
    let steering = createVector();

    if (boids == null) {
      return steering;
    }

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      steering.add(other.velocity);      
    }
    if (boids.length>0) {
      steering.div(boids.length);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
    return steering;
  }
  
  // Forces boid to average position of nearby boids
  cohesion(boids) {
   let steering = createVector();

    if (boids == null) {
      return steering;
    }

   for (let other of boids) {
    let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    steering.add(other.position);
    }

    if (boids.length>0) {
      steering.div(boids.length);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
    return steering;
  }
  
  // Forces boid away from nearby boids
  separation(boids) {
   let steering = createVector();

   if (boids == null) {
      return steering;
    }
   for (let other of boids) {
     let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
     let diff = p5.Vector.sub(this.position, other.position);
     diff.div(d);
     steering.add(diff);
    }

    if (boids.length>0) {
      steering.div(boids.length);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
    return steering;
  }
  
  // Forces boid away from the mouse cursor
  externalForce() {
    let perceptionRadius = 200;
    let steering = createVector();
    let mousePosition = createVector(mouseX, mouseY);

    let d = dist(this.position.x, this.position.y, mouseX, mouseY);
    if (d < perceptionRadius) {
     let diff = p5.Vector.sub(this.position, mousePosition);
     diff.div(d);
     steering.add(diff);
      steering.setMag(this.maxSpeed*2);
      steering.sub(this.velocity);
      steering.limit(this.maxForce*2);
    }

    return steering;
  }

  /**
  * Calculates the total acceleration of the boid based on the alignment,
  * cohesion, separation, and external force.
  */
  flock(boids) {
    let within_50 = this.getNearbyBoids(boids, 50);

    let alignment = this.align(within_50);
    let cohesion = this.cohesion(within_50);
    let separation = this.separation(within_50);
    
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());
    
    
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(this.externalForce());
  }
  
  // Render the boid as two circles, one as the main body and the other indicating direction.
  show() {
    strokeWeight(20);
    stroke(255);
    this.edges();
    point(this.position.x, this.position.y);

    // Draw a tadpole-like shape
    for (let i = 0; i < 18; i += 2) {
      strokeWeight(i);
      point(this.position.x - this.velocity.x * (20-i) * 0.15, this.position.y - this.velocity.y * (20-i) * 0.15);
    }
  }
}
