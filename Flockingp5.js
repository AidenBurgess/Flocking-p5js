const flock = [];
const numBoids = 150;

let alignSlider, cohesionSlider, separationSlider;


function setup() {
  createCanvas(1000,800);
  textFont("Calibri Light");
  textSize(width/50);
  
  alignSlider = createSlider(0,5,1,0.1);
  alignSlider.position(20,20);
  
  cohesionSlider = createSlider(0,5,1,0.1);
  cohesionSlider.position(20,50);

  separationSlider = createSlider(0,5,1,0.1);
  separationSlider.position(20,80);
  
  for(let i = 0; i < numBoids; i++) {
    flock.push(new Boid());
  }
}


function draw() {
  background(51);

  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.show();
  }
  noStroke();
  fill(255);
  text('Alignment', alignSlider.x * 2 + alignSlider.width, alignSlider.y + 15);
  text('Cohesion', cohesionSlider.x * 2 + cohesionSlider.width, cohesionSlider.y + 15);
  text('Separation', separationSlider.x * 2 + separationSlider.width, separationSlider.y + 15);
  
}
