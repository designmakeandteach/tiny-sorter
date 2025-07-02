/**
 * Derived from Google Experiment Tiny Sorter project.
 * https://experiments.withgoogle.com/tiny-sorter
 * 
 * Modifications Copyright 2025 Eric Z. Ayers
 * Distributed under the MIT License.
 */


/**
 * A p5 element that renders a bar that indicates the classification confidence.
 * @param {number} x - The x position of the classification bar.
 * @param {number} y - The y position of the classification bar.
 * @param {number} width - The width of the classification bar.
 * @param {number} height - The height of the classification bar.
 * @param {number} radius - The radius of the classification bar corners.
 */
class ClassificationBar {
    constructor(x, y, width, height, radius) {
      this.x = x
      this.y = y
      this.width = width;
      this.height = height;
      this.radius = radius;
  
      this.confidenceLeftWidth = 0.0;
      this.confidenceRightWidth = 0.0;
      this.classificationMaxWidth = this.width / 2;
    }

    /**
     * Sets the confidence value on the left side of the classification bar.
     * @param {number} confidenceValue pass a value between 0 and 1.0
     */
    setConfidenceLeft(confidenceValue) {
        if (confidenceValue < 0 || confidenceValue > 1.0) {
            throw new Error("Confidence value must be between 0 and 1.0");
        }
        this.confidenceLeftWidth = confidenceValue * this.classificationMaxWidth;
    }

    /**
     * Sets the confidence value on the right side of the classification bar.
     * @param {number} confidenceValue pass a value between 0 and 1.0
     */
    setConfidenceRight(confidenceValue) {   
        if (confidenceValue < 0 || confidenceValue > 1.0) {
            throw new Error("Confidence value must be between 0 and 1.0");
        }
        this.confidenceRightWidth = confidenceValue * this.classificationMaxWidth;
    }

    draw() {
      // Draw Background rectangle
      fill("rgba(174, 203, 250, 0.4)");
      stroke(255);
      strokeWeight(5);
      rectMode(CENTER);
      rect(
        this.x,
        this.y,
        this.width,
        this.height,
        this.radius
      );
      noStroke();
  
      // Draw the right side of the classification bar
      fill("#1967d2");
      rect(
        this.x + this.confidenceLeftWidth / 2,
        this.y,
        this.confidenceLeftWidth,
        this.height,
        this.radius    
      );
      // Draw the left side of the classification bar
      rect(
        this.x - this.confidenceRightWidth / 2,
        this.y,
        this.confidenceRightWidth,
        this.height,
        this.radius
      );
      
      // Draw the line in the middle of the classification bar
      stroke(0);
      strokeWeight(7);
      strokeCap(ROUND);
      line(this.x, this.y - this.height / 2, this.x, this.y + this.height / 2);
    }
  }