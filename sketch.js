let particles = [];
let maxParticles = 1000; // Maximum number of particles
let addParticleInterval = 10; // Interval to add new particles
let formationMode = false;
let formationTarget = { x: null, y: null };
let nextToggleFrame = 500; // Initial toggle after 500 frames

function preload() {//sound file
  soundFormats('mp3', 'ogg');
  mySound = loadSound('skhandas.wav');
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function draw() {
  background(255, 10); // Slightly transparent background
 noCursor();



 // Add new particles at intervals
 if (particles.length < maxParticles && frameCount % addParticleInterval === 0) {
   particles.push(new Particle());
 }

 // Use variable interval for toggling formation behavior
 if (frameCount >= nextToggleFrame) {
   formationMode = !formationMode;
   if (formationMode) {
     formationTarget = { x: random(width), y: random(height) };
     particles.forEach(p => p.setTarget(formationTarget.x, formationTarget.y));
   } else {
     particles.forEach(p => p.clearFormation());
   }
   // Calculate the next toggle frame with a variable interval
   nextToggleFrame = frameCount + random(300, 1000); // Next toggle between 300 and 700 frames later
 }
 
  // Update particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }

  // Collision detection and resolution
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[j].x - particles[i].x;
      let dy = particles[j].y - particles[i].y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDistance = (particles[i].size / 2) + (particles[j].size / 2);

      // Check for collision and adjust positions if necessary
      if (distance < minDistance) {
        let angle = atan2(dy, dx);
        let overlap = (minDistance - distance) / 2;
        particles[i].x -= cos(angle) * overlap;
        particles[i].y -= sin(angle) * overlap;
        particles[j].x += cos(angle) * overlap;
        particles[j].y += sin(angle) * overlap;
      }
    }
  }

  // Display particles and remove the ones that have ended their performance
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].display();
    if (particles[i].lifespan <= 0) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor() {
    this.setInitialPosition();
    this.size = random(10, 50); // Uniform size for all particles
    this.vx = this.x < width / 2 ? random(0.5, 2) : random(-2, -0.5);
    this.vy = this.y < height / 2 ? random(0.5, 2) : random(-2, -0.5);
    this.color = [random(200), random(200), random(50,200),random(255), ]; // Color
    this.lifespan = random(200, 1000000); // Lifespan
    this.curveFactor = random(-0.05, 0.05); // Initial curve movement factor
    this.inFormation = false; // Indicates if in formation
    this.target = { x: null, y: null }; // Target for formation
  }

  setInitialPosition() {
    // Choose a random edge for the initial position
    let edge = floor(random(4));
    switch(edge) {
      case 0: // Top edge
        this.x = random(width);
        this.y = 10; // Start just inside to ensure visibility
        break;
      case 1: // Right edge
        this.x = width - 10;
        this.y = random(height);
        break;
      case 2: // Bottom edge
        this.x = random(width);
        this.y = height - 10;
        break;
      case 3: // Left edge
        this.x = 10;
        this.y = random(height);
        break;
    }
  }

  update() {
    // Adjust velocity towards the target if in formation mode
    if (this.inFormation && this.target.x !== null && this.target.y !== null) {
      let angleToTarget = atan2(this.target.y - this.y, this.target.x - this.x);
      this.vx = cos(angleToTarget) * 1.5; // Move faster towards the target
      this.vy = sin(angleToTarget) * 1.5;
    } else {
      // Normal behavior with curve
      this.vx += cos(frameCount * 0.02) * this.curveFactor;
      this.vy += sin(frameCount * 0.02) * this.curveFactor;
    }

    // Move the particle
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x <= 0 || this.x >= width) {
      this.vx *= -1;
      this.x += this.vx;
    }
    if (this.y <= 0 || this.y >= height) {
      this.vy *= -1;
      this.y += this.vy;
    }

    this.lifespan--;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  // Set a target for formation movement
  setTarget(x, y) {
    this.target.x = x;
    this.target.y = y;
    this.inFormation = true;
  }

  // Clear the formation state and target
  clearFormation() {
    this.inFormation = false;
    this.target = { x: null, y: null };
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

function keyPressed() {
 //p  toggle play sound

  if (key == 'p' || key == 'P') {
    if (mySound.isPlaying()) {
      mySound.stop();
    } else {
      mySound.play();
      mySound.setVolume(0.1);
      mySound.loop();
    }
  }
}


