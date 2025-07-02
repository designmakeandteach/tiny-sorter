/**
 * A grid of images that can be used to display a set of images.
 * 
 * @param {boolean} isLeft - Whether the grid is on the left or right side of the screen.
 *  TODO: Add the following parameters:
 * @param {number} x - The x-coordinate of the grid.
 * @param {number} y - The y-coordinate of the grid.
 * @param {number} numRows - The number of rows in the grid.
 * @param {number} numCols - The number of columns in the grid.
 * @param {number} imageSize - The size of the images in the grid.
 */
class PhotoGrid {
  constructor(isLeft) {
    this.images = [];
    console.log(this.images.length);
    if (isLeft) {
      this.x = width / 2 - 480;
    } else {
      this.x = width / 2 + 300;
    }

    this.y = height / 2.5;
    this.numRows = 3;
    this.numCols = 2;
    this.imageSize = 120;
    this.padding = 20;
    this.maxImages = this.numRows * this.numCols;
  }

  addImage(img) {
    this.images.push(img);
    if (this.images.length > this.maxImages) {
      this.images.shift();
    }
  }

  render() {
    let imageIndex = 0;
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (imageIndex >= this.images.length) {
          return;
        }

        let currImage = this.images[imageIndex++];

        fill(255);
        noStroke();
        rectMode(CORNER);
        rect(
          this.x + (this.imageSize + this.padding) * col,
          this.y + (this.imageSize + this.padding) * row,
          this.imageSize,
          this.imageSize,
          3,
          3,
          3,
          3
        );

        image(
          currImage,
          this.x + (this.imageSize + this.padding) * col + 5,
          this.y + (this.imageSize + this.padding) * row + 5,
          this.imageSize - 10,
          this.imageSize - 10
        );
      }
    }
  }
}