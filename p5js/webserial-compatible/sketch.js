const connectLabel = "CONNECT MICROPROCESSOR"
const disconnectLabel = "DISCONNECT MICROPROCESSOR"
const classifyDelay = 100;
const videoSize = 250;
const videoPauseDelay = 2000;
const bgColor = "#e8f0fe";

// Machine Learning Model Instance
let classifier;

// Serial Port connected to the micro-controller
let serialPort;

// UI Elements
let modelInput;
let loadModelButton;
let cameraBorderImage;
let putSorterImage;
let connectButton;
let classificationBar;
let leftPhotoGrid;
let video;
let rightPhotoGrid;
let leftClassificationLabel;
let rightClassificationLabel;
let editCodeLink;

// Other State
let isLeftPic;
let modelLabels = [];
let hasSetVideoPauseTimer = false; // True if the video has been paused
let lastClassifyTime = 0;
let isModelLoaded = false;
let lastClassifiedImage = null; // serves as a sentinel to keep from running the lassifier to frequently and also stores the last image sent to the classifier

function initSerialPort() {
  let port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
    setConnectButtonText(disconnectLabel);
  }
  return port;
}

function setConnectButtonText(text) {
  const connectButton = document.querySelector("#connect");
  if (connectButton) {
    connectButton.textContent = text;
  }
}

/**
 * Create the button at the top right of the screen that allows the user to connect to the serial port
 * @returns {Clickable}
 */
function setupConnectButton() {
  if (connectButton) {
    connectButton.remove();
    connectButton = null;
  }

  connectButton = createButton(connectLabel);
  connectButton.position(width - 200, 20);
  connectButton.id("connectButton");
  connectButton.style("height", "40px");
  connectButton.style("border-width", "0px");
  connectButton.style("background-color", bgColor);
  connectButton.style("font-size", "18px");
  connectButton.style("width", "200px");
  connectButton.style("color", "#1967D2");
  connectButton.mouseClicked(() => {
    if (!serialPort.opened()) {
      console.log("Opening serial port");
      serialPort.open(9600);
      setConnectButtonText(disconnectLabel);
    } else {
      console.log("Closing serial port");
      serialPort.close();
      setConnectButtonText(connectLabel);
    }
  });

  if (serialPort && serialPort.opened()) {
    setConnectButtonText(disconnectLabel);
  } else {
    setConnectButtonText(connectLabel);
  }
}

/**
 * Ensure that the string has a trailing slash. Common mistake when pasting in the URL.
 * @param {string} str 
 * @returns {string}
 */
function ensureTrailingSlash(url) {
  url = url.trim();
  return url.charAt(url.length - 1) === '/' ? url : url + '/';
}


// Create the load model button. Called for first time setup only.
function setupLoadModelButton() {
  if (loadModelButton) {
    loadModelButton.remove();
    loadModelButton = null;
  }

  loadModelButton = new Clickable();
  loadModelButton.resize(145, 40);
  loadModelButton.locate(300, 15);
  loadModelButton.strokeWeight = 0;
  loadModelButton.color = bgColor;
  loadModelButton.text = "LOAD MODEL";
  loadModelButton.textSize = 18;
  loadModelButton.textColor = "#1967d2";
  loadModelButton.onPress = () => {
    try {
      let modelUrl = ensureTrailingSlash(modelInput.value());
      console.log(`Loading Tensorflow Model at: ${modelUrl}`);
      classifier = ml5.imageClassifier(modelUrl + "model.json");

      httpGet(
        modelUrl + "metadata.json",
        "json",
        false,
        (response) => {
          if (response.labels.length <= 2) {
            alert(
              "Train a model with at least three classes: one for each type of object you want to sort, and one for the empty sorter"
            );

          } else {
            modelLabels = response.labels;
            isModelLoaded = true;
            makeClassificationLabelsVisible();

          }
        },
        (error) => alert("invalid TM2 url")
      );
    } catch (e) {
      loadModelButton.text = "INVALID URL";
    }
    if (modelLabels.length > 1) {
      loadModelButton.text = "MODEL LOADED";
      setTimeout(() => {
        loadModelButton.text = "REFRESH MODEL";
      }, 3000);

    }
  };
}  // end setupLoadModelButton()

function makeClassificationLabelsVisible() {
  if (modelLabels.length > 1) {
    leftClassificationLabel.value(modelLabels[1]);
    rightClassificationLabel.value(modelLabels[0]);
    leftClassificationLabel.visible(true);
    rightClassificationLabel.visible(true);
  }
}

// Called for first time setup and when the screen is resized
function setupClassificationBarAndLabels() {

  const classificationLabelY = height / 3.3;
  const classificationLabelXLeft = width / 2 - 314;
  const classificationLabelXRight = width / 2 + 314;
  const classificationLabelWidth = 200;
  const classificationLabelHeight = 48;
  const classificationLabelRadius = 9;

  classificationBar = new ClassificationBar(width / 2, classificationLabelY, min(width / 4, 341), 28, 5);
  leftClassificationLabel = new ClassificationLabel(classificationLabelXLeft, classificationLabelY, classificationLabelWidth, classificationLabelHeight, classificationLabelRadius, LEFT);
  rightClassificationLabel = new ClassificationLabel(classificationLabelXRight, classificationLabelY, classificationLabelWidth, classificationLabelHeight, classificationLabelRadius, RIGHT);

  if (isModelLoaded) {
    makeClassificationLabelsVisible();
  }
} // end setupClassificationBarAndLabels()

// Called for first time setup and when the screen is resized
function setupPhotoGrids() {
  let leftPhotos = null;
  let rightPhotos = null;

  // If we are resizing the screen, save the photos
  if (leftPhotoGrid) {
    leftPhotos = leftPhotoGrid.images;
  }
  if (rightPhotoGrid) {
    rightPhotos = rightPhotoGrid.images;
  }

  let photoGridY = height / 2.5;
  leftPhotoGrid = new PhotoGrid(width / 2 - 480, photoGridY, 3, 2, 120, 20);
  rightPhotoGrid = new PhotoGrid(width / 2 + 260, photoGridY, 3, 2, 120, 20);

  // Restore the photos if they were saved
  if (leftPhotos) {
    leftPhotoGrid.images = leftPhotos;
  }
  if (rightPhotos) {
    rightPhotoGrid.images = rightPhotos;
  }
} // end setupPhotoGrids()

function setupEditCodeLink() {
  if (editCodeLink) {
    editCodeLink.remove();
    editCodeLink = null;
  }

  editCodeLink = createA(
    "https://editor.p5js.org/designmakeandteach/sketches/yiTc27eXT",
    "EDIT CODE",
    "_blank"
  );
  editCodeLink.position(width - 110, height - 40);
  editCodeLink.style("height", "40px");
  editCodeLink.style("border-width", "0px");
  editCodeLink.style("background-color", bgColor);
  editCodeLink.style("font-size", "18px");
  editCodeLink.style("width", "200px");
  editCodeLink.style("color", "#1967D2");
} // end setupEditCodeLink()

function setupModelInput() {
  if (modelInput) {
    modelInput.remove();
    modelInput = null;
  }

  modelInput = createInput();

  modelInput.position(20, 20);
  modelInput.style("height", "35px");
  modelInput.style("width", "267px");
  modelInput.style("border-width", "0px");
  modelInput.style("border-radius", "4px 4px 0px 0px");
  modelInput.style("border-bottom", "2px solid #1967d2");
  modelInput.style("font-size", "16px");
  modelInput.style("padding-left", "5px");
  modelInput.style("color", "#669df6");
  modelInput.attribute("placeholder", "Paste model link here");
} // end setupModelInput()


/**
 * Adds some extra controls to the UI to test the interface.
 * Add the query string "?test=true" to the URL to enable test mode.
 */
function setupTestMode() {
  const params = new URLSearchParams(window.location.search);
  const test = params.get("test");


  // Add extra UI tif we are testing
  if (test) {
    // Add classification label test buttons
    addLeftClassificationLabelButton = createButton("Add Left Class");
    addLeftClassificationLabelButton.position(0, height / 3.3);
    addLeftClassificationLabelButton.mousePressed(() => {
      leftClassificationLabel.value("Left Class");
      leftClassificationLabel.visible(true);
      leftClassificationLabel.triggerSplash();
    });
    addRightClassificationLabelButton = createButton("Add Right Class");
    addRightClassificationLabelButton.position(width - 100, height / 3.3);
    addRightClassificationLabelButton.style("width", "100px");
    addRightClassificationLabelButton.mousePressed(() => {
      rightClassificationLabel.value("Right Class");
      rightClassificationLabel.visible(true);
      rightClassificationLabel.triggerSplash();
    });

    // Add photo grid test buttons
    addLeftPhotoButton = createButton("Add Left");
    addLeftPhotoButton.position(0, height / 2);
    addLeftPhotoButton.mousePressed(() => {
      leftPhotoGrid.addImage(getCroppedVideoImage());
    });
    addRightPhotoButton = createButton("Add Right");
    addRightPhotoButton.style("width", "100px");
    addRightPhotoButton.position(width - 100, height / 2);
    addRightPhotoButton.mousePressed(() => {
      rightPhotoGrid.addImage(getCroppedVideoImage());
    });

    // seed the model URL
    modelInput.value("https://teachablemachine.withgoogle.com/models/eGyhdtfG9/");
  }
} // end setupTestMode()

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.hide();
  shouldFeezeFrame = false;
  hasSetVideoPauseTimer = false;

  cameraBorderImage = loadImage("camera_border.png");
  putsorter = loadImage("put_sorter.png");

  // Initialize UI Components
  setupModelInput();
  setupLoadModelButton();
  setupConnectButton();
  setupPhotoGrids();
  setupClassificationBarAndLabels();
  setupEditCodeLink();
  setupTestMode();

  // Initialize the serial port
  serialPort = initSerialPort();
} // end setup()

function draw() {
  //   Darker BG
  if (width > 700) {
    background(bgColor);

    image(
      putsorter,
      width / 2 - putsorter.width / 5,
      0,
      putsorter.width / 2.5,
      putsorter.height / 2.5
    );
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text("enable webcam access", width / 2, height / 1.6);
    text("and refresh page to use", width / 2, height / 1.5);
    image(
      video,
      width / 2 - videoSize / 2,
      height / 1.6 - videoSize / 2,
      videoSize,
      videoSize,
      150,
      0,
      videoSize * 1.5,
      videoSize * 1.5
    );
    image(
      cameraBorderImage,
      width / 2 - videoSize / 2 - 3,
      height / 1.6 - videoSize / 2 - 3,
      videoSize + 6,
      videoSize + 6
    );

    leftPhotoGrid.draw();
    rightPhotoGrid.draw();
    rectMode(CORNER);
    loadModelButton.draw();

    classificationBar.draw();
    leftClassificationLabel.draw();
    rightClassificationLabel.draw();

  } else {
    // Tell the user to make the screen larger
    noStroke();
    text("expand page or ", width / 2, height / 1.6);
    text("load on a computer to use", width / 2, height / 1.5);
  }
  // Classify again after a timeout
  if (Date.now() - lastClassifyTime > classifyDelay) {
    classifyVideo();
    lastClassifyTime = Date.now();
  }
}

function getCroppedVideoImage() {
  //return video.get(150, 0, videoSize / 1.6, videoSize / 1.6);
  return video.get();
}

function pauseVideo() {
  if (!hasSetVideoPauseTimer) {
    hasSetVideoPauseTimer = true;
    video.pause();
    setTimeout(() => {
      video.play();
      hasSetVideoPauseTimer = false;
    }, videoPauseDelay);
  }
}

// The results are in an array ordered by confidence.
// console.log(results[0]);
function updateClassification(results) {
  // console.log(results);
  const class1 = results.filter((objs) => {
    if (objs.label === modelLabels[0]) {
      return objs;
    }
  });

  const class2 = results.filter((objs) => {
    if (objs.label === modelLabels[1]) {
      return objs;
    }
  });

  classificationBar.setConfidenceLeft(class1[0].confidence);
  classificationBar.setConfidenceRight(class2[0].confidence);

  if (class1[0].confidence > 0.9) {
    try {
      if (serialPort.opened()) {
        console.log("Sending Class 2 Detected")
        serialPort.write("2");
      }
      rightClassificationLabel.triggerSplash();
      if (lastClassifiedImage) {
        rightPhotoGrid.addImage(lastClassifiedImage);
      }
      pauseVideo();
    } catch (e) { }
  } else if (class2[0].confidence > 0.9) {
    try {
      if (serialPort.opened()) {
        console.log("Sending Class 1 Detected")
        serialPort.write("1");
      }
      leftClassificationLabel.triggerSplash();
      if (lastClassifiedImage) {
        leftPhotoGrid.addImage(lastClassifiedImage);
      }
      pauseVideo();
    } catch (e) { }
  }
}

function processClassificationResult(error, results) {
  // If there is an error
  if (error) {
    console.error(`Error classifying image: ${error}`);
  } else {
    updateClassification(results);
  }
  // Reset the last classified image so we can classify again
  lastClassifiedImage = null;
}

// Get a prediction for the current video frame
function classifyVideo() {
  if (isModelLoaded && lastClassifiedImage === null && !hasSetVideoPauseTimer) {
    lastClassifiedImage = getCroppedVideoImage();
    classifier.classify(lastClassifiedImage, processClassificationResult);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  clear();
  background(bgColor);

  // Components not justified left need to be moved around.
  // It's simplest to just re-create them.
  setupConnectButton();
  setupClassificationBarAndLabels();
  setupPhotoGrids();
  setupEditCodeLink();
}
