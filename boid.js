class Boid{
  constructor() {
    this.position = createVector(random(width),random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2,4.5));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 8;
  }
  
  edges() {
  if(this.position.x>width) {
    this.position.x = 0;
  }else if(this.position.x < 0) {
    this.position.x = width;
  }else if(this.position.y>height) {
    this.position.y = 0;
  }else if(this.position.y < 0) {
    this.position.y = height;
  }
  }
 
  
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
  
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
  
  separation(boids) {
   let perceptionRadius = 50;
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
  
  externalForce(boids) {
   let perceptionRadius = 300;
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
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce*2);
      return steering;
    }
    return steering;
  }
  
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
  
  show() {
    strokeWeight(16);
    stroke(255);
    this.edges();
    point(this.position.x, this.position.y);
    strokeWeight(10);
    line(this.position.x, this.position.y, this.position.x + this.velocity.x, this.position.y + this.velocity.y);
  }
}
