class Boid{
  constructor(x = random(width), y = random(height)) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2,4.5));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 8;
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
  
  // Force boid in the same direction nearby boids are heading
  align(boids) {
    let perceptionRadius = 50;
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (d < perceptionRadius && other != this) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total>0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
    return steering;
  }
  
  // Forces boid to average position of nearby boids
  cohesion(boids) {
   let perceptionRadius = 50;
   let total = 0;
   let steering = createVector();
   for (let other of boids) {
     let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
     if (d < perceptionRadius && other != this) {
       steering.add(other.position);
       total++;
      }
    }
    if (total>0) {
      steering.div(total);
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
   let perceptionRadius = 30;
   let total = 0;
   let steering = createVector();
   for (let other of boids) {
     let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
     if (d < perceptionRadius && other != this) {
       let diff = p5.Vector.sub(this.position, other.position);
       diff.div(d);
       steering.add(diff);
       total++;
      }
    }
    if (total>0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
    return steering;
  }
  
  // Forces boid away from the mouse cursor
  externalForce(boids) {
   let perceptionRadius = 200;
   let total = 0;
   let steering = createVector();
   let mousePosition = createVector(mouseX, mouseY);
   
   let d = dist(this.position.x, this.position.y, mouseX, mouseY);
   if (d < perceptionRadius) {
     let diff = p5.Vector.sub(this.position, mousePosition);
     diff.div(d);
     steering.add(diff);
     total++;
    }
    
    if (total>0) {
      steering.div(total);
      steering.setMag(this.maxSpeed*2);
      steering.sub(this.velocity);
      steering.limit(this.maxForce*2);
      return steering;
    }
    return steering;
  }

  /**
  * Calculates the total acceleration of the boid based on the alignment,
  * cohesion, separation, and external forces.
  */
  flock(boids) {
    this.acceleration.mult(0);
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());
    
    
    this.acceleration.add(alignment);
    this.acceleration.add(alignment);
    this.acceleration.add(separation);
    this.acceleration.add(this.externalForce(boids));
  }
  
  // Render the boid as two circles, one as the main body and the other indicating direction.
  show() {
    strokeWeight(16);
    stroke(255);
    this.edges();
    point(this.position.x, this.position.y);
    strokeWeight(10);
    line(this.position.x, this.position.y, this.position.x + this.velocity.x, this.position.y + this.velocity.y);
  }
}
