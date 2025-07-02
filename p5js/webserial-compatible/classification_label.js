/**
 * A p5 element that renders around the classification label when a classification is detected.
 * 
 * @param {boolean} isLeft - Whether the splash screen is on the left or right side of the screen.
 */
class Splash {
  constructor(x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.color = color(22, 79, 200);
    this.isExploding = false;
    // TODO(zundel): factor out this isInbetweenUpdates for some better animation logic
    this.isInbetweenUpdates = false;
    this.explosionRadius = 100;
    this.explosionIndex = 0;
    this.maxExplosions = 4;
    this.radiusOffset = 10;
  }

  trigger() {
    if (!this.isExploding) {
      this.explosionIndex = 0;
      this.isExploding = true;
    }
  }

  render() {
    if (!this.isExploding) {
      fill(this.color);
      return;
    }

    // Render the explosion
    noFill();
    strokeWeight(3);
    stroke(this.color);
    let size_offset = this.radiusOffset * this.explosionIndex;
    let pos_offset = size_offset / 2;

    rect(
      this.x,
      this.y,
      this.width + size_offset,
      this.height + size_offset,
      this.radiusOffset,
      this.radiusOffset,
      this.radiusOffset,
      this.radiusOffset
    );

    // Animate the explosion
    if (!this.isInbetweenUpdates) {
      // TODO(zundel): It’s safer to use frameCount or deltaTime for animation progress in p5.js, which is more deterministic and integrates with p5’s draw loop.
      // TODO(zundel): setTimeout is not cleared or tracked. If the Splash is triggered repeatedly, timeouts could pile up. If you ever remove/destroy the component, this could cause memory leaks.
      setTimeout(() => {
        this.explosionIndex++;
        this.isInbetweenUpdates = false;
      }, 75);
      this.isInbetweenUpdates = true;

      if (this.explosionIndex >= this.maxExplosions) {
        this.isExploding = false;
      }
    }
  }
}

/**
 * A p5 element that renders the classification label.
 */
class ClassificationLabel {
  constructor(x, y, width, height, radius, isLeft) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.isLeft = isLeft;
    this.text_value = "";
    this.is_visible = false;
    this.splash = new Splash(x, y, width, height);
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
  render() {
    this.splash.render();

    if (this.is_visible) {
      fill(255);
      rectMode(CENTER);
      noStroke();
      rect(
        this.x,
        this.y,
        this.width,
        this.height,
        this.radius,
        this.radius,
        this.radius,
        this.radius
      );

      fill("#1967D2");
      textSize(24);
      textStyle(BOLD);
      if (this.isLeft) {
        textAlign(LEFT, CENTER);
        text(this.text_value, this.x - this.width / 2 + 10, this.y);
      } else {
        textAlign(RIGHT, CENTER);
        text(this.text_value, this.x + this.width / 2 - 13, this.y);
      }
    }
  } // end render()
}
