
/**
 * A p5 element that renders a bar that indicates the classification confidence.
 * 
 * @param {boolean} isLeft - Whether the classification bar is on the left or right side of the screen.
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
      this.hasSetTimeout = false;
    }

    /**
     * Sets the confidence value on the left side of the classification bar.
     * @param {number} confidenceValue pass a value between 0 and 1.0
     */
    setConfidenceLeft(confidenceValue) {
        this.confidenceLeftWidth = confidenceValue * this.classificationMaxWidth;
    }

    /**
     * Sets the confidence value on the right side of the classification bar.
     * @param {number} confidenceValue pass a value between 0 and 1.0
     */
    setConfidenceRight(confidenceValue) {   
        this.confidenceRightWidth = confidenceValue * this.classificationMaxWidth;
    }

    render() {
      //Draw Background rectangle
      rectMode(CENTER);
      fill("rgba(174, 203, 250, 0.4)");
      stroke(255);
      strokeWeight(5);
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
      noStroke();
  
      fill("#1967d2");
      rect(
        this.x + this.confidenceLeftWidth / 2,
        this.y,
        this.confidenceLeftWidth,
        this.height,
        this.radius,
        this.radius,
        this.radius,
        this.radius
      );
      rect(
        this.x - this.confidenceRightWidth / 2,
        this.y,
        this.confidenceRightWidth,
        this.height,
        this.radius,
        this.radius,
        this.radius,
        this.radius
      );
      stroke(0);
      strokeWeight(7);
      strokeCap(ROUND);
      line(this.x, this.y - this.height / 2, this.x, this.y + this.height / 2);
    }
  }