const flock = [];
const numBoids = 100;
const maxBoids = 160;

let alignSlider, cohesionSlider, separationSlider;


function setup() {
  // Fill the whole window as the canvas.
  createCanvas(windowWidth,windowHeight);

  // Font options
  textFont("Calibri Light");
  textSize(20);
  
  // Create sliders to change force of alignment, cohesion, and separation.
  alignSlider = createSlider(0,5,1,0.1);
  alignSlider.position(20,20);
  
  cohesionSlider = createSlider(0,5,1,0.1);
  cohesionSlider.position(20,50);

  separationSlider = createSlider(0,5,1,0.1);
  separationSlider.position(20,80);
  
  // Create initial batch of boids
  for(let i = 0; i < numBoids; i++) {
    flock.push(new Boid());
  }
}


function draw() {
  background(51);
  
  // Update and display boids
  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.show();
  }
  
  // Add border around sliders
  noStroke();
  fill(51);
  rect(10,10, 250, 100);
  
  // Display slider labels
  fill(255);
  text('Alignment', alignSlider.x * 2 + alignSlider.width, alignSlider.y + 15);
  text('Cohesion', cohesionSlider.x * 2 + cohesionSlider.width, cohesionSlider.y + 15);
  text('Separation', separationSlider.x * 2 + separationSlider.width, separationSlider.y + 15);
}

// Add new boids when the mouse is dragged
function mouseClicked() {
  if (flock.length < maxBoids) {
    flock.push(new Boid(mouseX, mouseY));
  }
}

// Support resizing of the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
