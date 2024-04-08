// Initialize an empty array to store the particle objects
/* skhandha | aggregate (V. 3)
Skandha (स्कन्ध) is a Sanskrit word that means "multitude, quantity, aggregate", generally in the context of body, trunk, stem, empirically observed gross object or anything of bulk verifiable with senses. The term appears in the Vedic literature.
The Pali equivalent word Khandha (sometimes spelled Kkhanda) appears extensively in the Pali canon where it means "bulk of the body, aggregate, heap, material collected into bulk" in one context, "all that is comprised under, groupings" in some contexts, and particularly as "the elements or substrata of sensory existence, sensorial aggregates which condition the appearance of life in any form". Paul Williams et al. translate skandha as "heap, aggregate", stating it refers to the explanation of the psychophysical makeup of any being.
Live app here:
https://marlonbarrios.github.io/skhandhas/
concept, programming and music by marlon barrios solano
#generativeart #creativecoding #musicvideo #music #bhuddhistart #complexity #complexitytheory #emergence

*/

let particles = [];
// Set the maximum number of particles that can exist at once
let maxParticles = 1000;
// Define the interval (in frames) at which new particles are added
let addParticleInterval = 10;
// A boolean flag to indicate whether the formation behavior is active
let formationMode = false;
// An object to store the target position for the formation behavior
let formationTarget = { x: null, y: null };
// The frame count after which the formation behavior will toggle
let nextToggleFrame = 200;
// A variable to store the sound file
let mySound;

// Preload function to load sound assets before the sketch runs
function preload() {
  // Specify the sound formats to use
  soundFormats('mp3', 'ogg');
  // Load the sound file and assign it to the mySound variable
  mySound = loadSound('skhandas.wav');
}

// Setup function to initialize the canvas and background
function setup() {
  // Create a canvas that fills the browser window
  createCanvas(windowWidth, windowHeight);
  // Set the initial background color to white
  background(255);
}

// Draw function runs repeatedly and is used for animation
function draw() {
  // Set a slightly transparent background to create a trail effect
  background(255, 10);
  // Hide the cursor when it's over the canvas
  noCursor();

  // Add a new particle at defined intervals, without exceeding the max count
  if (particles.length < maxParticles && frameCount % addParticleInterval === 0) {
    particles.push(new Particle());
  }

  // Check if it's time to toggle the formation behavior
  if (frameCount >= nextToggleFrame) {
    // Toggle the formation mode
    formationMode = !formationMode;
    // If formation mode is active, set a random target position
    if (formationMode) {
      formationTarget = { x: random(width), y: random(height) };
      particles.forEach(p => p.setTarget(formationTarget.x, formationTarget.y));
    } else {
      // If formation mode is deactivated, clear the target position
      particles.forEach(p => p.clearFormation());
    }
    // Calculate the next frame to toggle the formation mode again
    nextToggleFrame = frameCount + random(50, 1000);
  }

  // Set the stroke color for drawing lines between particles
  stroke(0, 50); // Semi-transparent black lines
  // Loop through all particles to update their state and draw lines
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      // Calculate the distance between two particles
      let distance = dist(p1.x, p1.y, p2.x, p2.y);
      // Determine the minimum distance for particles to be considered touching
      let minDistance = p1.size / 2 + p2.size / 2;

      // If particles are overlapping, adjust their positions to avoid overlap
      if (distance < minDistance) {
        let overlap = (minDistance - distance) / 2;
        p1.x -= (p2.x - p1.x) / distance * overlap;
        p1.y -= (p2.y - p1.y) / distance * overlap;
        p2.x += (p2.x - p1.x) / distance * overlap;
        p2.y += (p2.y - p1.y) / distance * overlap;
      } else if (distance < minDistance + 50) {
        // Draw a line between particles if they are within 50 pixels of each other
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
    // Update and display each particle
    p1.update();
    p1.display();
  }

  // Reset the stroke settings for other drawing operations
  noStroke();
  // Filter out particles that have "died" (lifespan has ended)
  particles = particles.filter(particle => particle.lifespan > 0);
}

// Particle class defines the properties and behaviors of a single particle
class Particle {
  constructor() {
    // Set the initial position of the particle
    this.setInitialPosition();
    // Random size for visual variety
    this.size = random(10, 50);
    // Random velocity components for movement
    this.vx = this.x < width / 2 ? random(0.5, 2) : random(-2, -0.5);
    this.vy = this.y < height / 2 ? random(0.5, 2) : random(-2, -0.5);
    // Random color for the particle
    this.color = [random(200), random(200), random(50, 200), random(255)];
    // Random lifespan for the particle
    this.lifespan = random(200, 1000000);
    // Factor to introduce curvy movement
    this.curveFactor = random(-0.05, 0.05);
    // Flag to indicate if the particle is in formation mode
    this.inFormation = false;
    // Target position for formation behavior
    this.target = { x: null, y: null };
  }

  // Function to randomly place the particle on one of the canvas edges
  setInitialPosition() {
    let edge = floor(random(4)); // Choose a random edge
    // Position the particle based on the chosen edge
    switch (edge) {
      case 0: this.x = random(width); this.y = 0; break;
      case 1: this.x = width; this.y = random(height); break;
      case 2: this.x = random(width); this.y = height; break;
      case 3: this.x = 0; this.y = random(height); break;
    }
  }

  // Update function to adjust the particle's position and handle edge bouncing
  update() {
    // If in formation mode, adjust velocity towards the target position
    if (this.inFormation && this.target.x !== null && this.target.y !== null) {
      let angleToTarget = atan2(this.target.y - this.y, this.target.x - this.x);
      this.vx = cos(angleToTarget) * 1.5; // Accelerate towards the target
      this.vy = sin(angleToTarget) * 1.5;
    } else {
      // Apply curved motion to the velocity
      this.vx += cos(frameCount * 0.02) * this.curveFactor;
      this.vy += sin(frameCount * 0.02) * this.curveFactor;
    }

    // Update the position based on the velocity
    this.x += this.vx;
    this.y += this.vy;

    // Handle bouncing off the canvas edges
    if (this.x <= 0 || this.x >= width) this.vx *= -1;
    if (this.y <= 0 || this.y >= height) this.vy *= -1;

    // Decrease the lifespan of the particle
    this.lifespan--;
  }

  // Display the particle on the canvas
  display() {
    fill(this.color); // Set the color of the particle
    ellipse(this.x, this.y, this.size); // Draw the particle as an ellipse
  }

  // Set the target position for the particle when in formation mode
  setTarget(x, y) {
    this.target.x = x;
    this.target.y = y;
    this.inFormation = true;
  }

  // Clear the target position and reset the formation mode state
  clearFormation() {
    this.inFormation = false;
    this.target = { x: null, y: null };
  }
}

// Adjust the canvas size dynamically when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Handle key press events to control sound playback
function keyPressed() {
  // Toggle the playback of the sound with the 'P' key
  if (key == 'p' || key == 'P') {
    if (mySound.isPlaying()) {
      mySound.stop(); // Stop the sound if it's currently playing
    } else {
      mySound.play(); // Play the sound if it's not playing
      mySound.setVolume(0.1); // Set a lower volume for the sound
      mySound.loop(); // Loop the sound playback
    }
  }
}
