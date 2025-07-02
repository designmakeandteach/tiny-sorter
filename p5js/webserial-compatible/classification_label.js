/**
 * Derived from Google Experiment Tiny Sorter project.
 * https://experiments.withgoogle.com/tiny-sorter
 * 
 * Modifications Coyright 2025 Eric Z. Ayers
 * Distributed under the MIT License.
 */


/**
 * A p5 element that renders around the classification label when a classification is detected.
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {number} radius - Radius of the corners of the rectangle & explosion animation..
 */
class Splash {
  constructor(x, y, width, height, radius) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.color = color(22, 79, 200);
    this.isExploding = false;
    // TODO(zundel): factor out this isInbetweenUpdates for some better animation logic
    this.explosionRadius = 100;
    this.explosionIndex = 0;
    this.maxExplosions = 4;
    this.radius = radius;
    this.lastTriggerTime = this.lastTriggerDelayTime = this.triggerDelay = this.triggerDuration = 0;
  }

  /**
   * Trigger the animation sequence.
   */
  trigger(delay = 75, duration = 1000) {
    if (!this.isExploding) {
      this.explosionIndex = 0;
      this.isExploding = true;
      this.lastTriggerTime =  this.lastTriggerDelayTime = Date.now();
      this.triggerDelay = delay;
      this.triggerDuration = duration;
    }
  }

  draw() {
    if (!this.isExploding) {
      fill(this.color);
      return;
    }

    // Render the explosion
    noFill();
    strokeWeight(3);
    stroke(this.color);
    let size_offset = this.radius * this.explosionIndex;
    rectMode(CENTER)
    rect(
      this.x,
      this.y,
      this.width + size_offset,
      this.height + size_offset,
      this.radius);

    // Animate the explosionD
    if (Date.now() - this.lastTriggerDelayTime > this.triggerDelay) {
      this.explosionIndex = (this.explosionIndex + 1) % this.maxExplosions;
      this.lastTriggerDelayTime = Date.now();
    }

    if (Date.now() - this.lastTriggerTime > this.triggerDuration) {
      this.isExploding = false;
    }
  }
}


/**
 * A p5 element that renders the classification label.
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {number} radius - Radius of the corners of the rectangle.
 * @param {string} orientation - LEFT or RIGHT
 */
class ClassificationLabel {
  constructor(x, y, width, height, radius, orientation) {
    if (orientation !== LEFT && orientation !== RIGHT) {
      throw new Error("Orientation must be LEFT or RIGHT");
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.orientation = orientation;
    this.text_value = "";
    this.is_visible = false;
    this.splash = new Splash(x, y, width, height, radius);
  }

  /**
   * Set the value of the classification label.
   * @param {string} value - The value to display in the element. 
   */
  value(value) {
    this.text_value = value;
  }

  /**
   * Set the visibility of the classification label.
   * @param {boolean} visible - Whether the element is visible.
   */
  visible(visible) {
    this.is_visible = visible;
  }

  triggerSplash() {
    this.splash.trigger();
  }

  /**
   * Render the classification label.
   */
  draw() {

    if (!this.is_visible) {
      return;
    }
    this.splash.draw();

    // Draw the background rectangle
    fill(255);
    rectMode(CENTER);
    noStroke();
    rect(
      this.x,
      this.y,
      this.width,
      this.height,
      this.radius);

    // Draw the text
    fill("#1967D2");
    textSize(24);
    textStyle(BOLD);

    if (this.orientation === LEFT) {
      textAlign(LEFT, CENTER);
      text(this.text_value, this.x - this.width / 2 + 10, this.y);
    } else {
      textAlign(RIGHT, CENTER);
      text(this.text_value, this.x + this.width / 2 - 13, this.y);
    }
  } // end draw()
}
