/**
 * A p5 Element that renders grid of images that can be used to 
 * display a set of images.
 * 
 * @param {number} x - The x-coordinate of the grid.
 * @param {number} y - The y-coordinate of the grid.
 * @param {number} numRows - The number of rows in the grid.
 * @param {number} numCols - The number of columns in the grid.
 * @param {number} imageSize - The size of the images in the grid.
 * @param {number} padding - The padding between the images in the grid.
 */
class PhotoGrid {
  constructor(x, y, numRows, numCols, imageSize, padding) {
    this.images = [];
    this.x = x;
    this.y = y;
    this.numRows = numRows;
    this.numCols = numCols;
    this.imageSize = imageSize;
    this.padding = padding;
    this.maxImages = this.numRows * this.numCols;
  } // end constructor()

  // Add an image to the grid. If the grid is full, the oldest image is removed.
  addImage(img) {
    this.images.push(img);
    if (this.images.length > this.maxImages) {
      this.images.shift();
    }
  } // end addImage()

  render() {
    let imageIndex = 0;
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (imageIndex >= this.images.length) {
          return;
        }

        // Draw a border around the image
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

        // Render the image
        image(
          this.images[imageIndex++],
          this.x + (this.imageSize + this.padding) * col + 5,
          this.y + (this.imageSize + this.padding) * row + 5,
          this.imageSize - 10,
          this.imageSize - 10
        );
      }
    }
  } // end render()
}