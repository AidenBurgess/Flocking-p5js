const flock = [];
const numBoids = 80;
const maxBoids = 170;
const sliderStartX = 150;

const settingsX = 10;
const settingsY = 10;
const settingsW = 250;
const settingsH = 150;

let alignSlider, cohesionSlider, separationSlider, toggleMouseMode;
let attractionMode = -1;

function setup() {
  // Fill the whole window as the canvas.
  createCanvas(windowWidth,windowHeight);

  // Font options
  textFont("Calibri Light");
  textSize(20);
  
  // Create sliders to change force of alignment, cohesion, and separation.
  alignSlider = createSlider(0,5,1,0.1);
  alignSlider.position(sliderStartX,20);
  
  cohesionSlider = createSlider(0,5,1,0.1);
  cohesionSlider.position(sliderStartX,50);

  separationSlider = createSlider(0,5,1,0.1);
  separationSlider.position(sliderStartX,80);

  // Create button to toggle between attract and repel
  toggleMouseMode = createCheckbox('Label', false);
  toggleMouseMode.position(200,110);
  toggleMouseMode.changed(toggleAttraction);

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
  rect(settingsX, settingsY, settingsW + 10, settingsH + 10);
  
  // Display slider labels
  fill(255);
  text('Alignment', 20, alignSlider.y + 17);
  text('Cohesion', 20, cohesionSlider.y + 17);
  text('Separation', 20, separationSlider.y + 17);
  alignSlider.style('background-color', color(255));
  // text('Repulsion/Attraction', toggleMouseMode.x * 2 + toggleMouseMode.width, toggleMouseMode.y + 15);
  text('Repulsion/Attraction', 20, 135);

}

// Add new boids when the mouse is dragged
function mouseClicked() {
  // Detect that the mouse is not within the settings box
  if (
    !(mouseX > settingsX - settingsW) ||
    !(mouseX < settingsX + settingsW) ||
    !(mouseY > settingsY - settingsH) ||
    !(mouseY < settingsY + settingsH)
  ) {
    // Add a new boid to the screen
    if (flock.length < maxBoids) {
      flock.push(new Boid(mouseX, mouseY));
      console.log("New boid added")
    }
  }
}

// Support resizing of the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function toggleAttraction() {
  if (this.checked()) {
    attractionMode = 1;
    console.log("Attraction");
  } else {
    attractionMode = -1;
    console.log("Repulsion");
  }
  
}
