
const connectLabel = "CONNECT MICROPROCESSOR"
const disconnectLabel = "DISCONNECT MICROPROCESSOR"

// Machine Learning Model Instance
let classifier;

// Serial Port connected to the micro-controller
let serialPort;

// UI Elements
let modeInput;
let loadModel;
let cameraBorder;
let putSorter;
let connectButton;
let classificationBar;
let leftGrid;
let video;
let rightGrid;
let leftClassificationLabel;
let rightClassificationLabel;
let editCode;

// Other State
let isLeftPic;
let videoSize;
let bgColor = "#e8f0fe";
let shouldFreezeFrame;
let labels = [];
let hasSetPauseTimer;
let isModelLoaded = false;
let enteredText = "";

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
      let pic = video.get(150, 0, videoSize / 1.6, videoSize / 1.6);
      leftGrid.addImage(pic);
    });
    addRightPhotoButton = createButton("Add Right");
    addRightPhotoButton.style("width", "100px");
    addRightPhotoButton.position(width - 100, height / 2);
    addRightPhotoButton.mousePressed(() => {
      let pic = video.get(150, 0, videoSize / 1.6, videoSize / 1.6);
      rightGrid.addImage(pic);
    });

    // seed the model URL
    enteredText = "https://teachablemachine.withgoogle.com/models/eGyhdtfG9/";
    modelInput.value(enteredText);

  }
} // end setupTestMode()

function setupLoadModelButton() {
  loadModel = new Clickable();

  loadModel.resize(145, 40);

  loadModel.locate(300, 15);
  loadModel.strokeWeight = 0;
  loadModel.color = bgColor;
  loadModel.text = "LOAD MODEL";
  loadModel.textSize = 18;
  loadModel.textColor = "#1967d2";
  loadModel.onPress = () => {
    try {
      console.log(enteredText + "metadata.json");
      classifier = ml5.imageClassifier(enteredText + "model.json");

      httpGet(
        enteredText + "metadata.json",
        "json",
        false,
        (response) => {
          if (response.labels.length <= 2) {
            alert(
              "Train a model with at least three classes: one for each type of object you want to sort, and one for the empty sorter"
            );

          } else {
            labels = response.labels;
            isModelLoaded = true;
            classifyVideo();
            makeClassificationLabelsVisible();

          }
        },
        (error) => alert("invalid TM2 url")
      );
    } catch (e) {
      loadModel.text = "INVALID URL";
    }
    if (labels.length > 1) {
      loadModel.text = "MODEL LOADED";
      setTimeout(() => {
        loadModel.text = "REFRESH MODEL";
      }, 3000);

    }
  };
}  // end setupLoadModelButton()

function makeClassificationLabelsVisible() {
  leftClassificationLabel.value(labels[1]);
  rightClassificationLabel.value(labels[0]);
  leftClassificationLabel.visible(true);
  rightClassificationLabel.visible(true);
}

function setupClassificationBarAndLabels() {

  const classificationLabelY = height / 3.3;
  const classificationLabelXLeft = width / 2 - 314;
  const classificationLabelXRight = width / 2 + 314;
  const classificationLabelWidth = 200;
  const classificationLabelHeight = 48;
  const classificationLabelRadius = 9;

  classificationBar = new ClassificationBar(width / 2, classificationLabelY, min(width / 4, 341), 28, 5);
  leftClassificationLabel = new ClassificationLabel(classificationLabelXLeft, classificationLabelY, classificationLabelWidth, classificationLabelHeight, classificationLabelRadius, true);
  rightClassificationLabel = new ClassificationLabel(classificationLabelXRight, classificationLabelY, classificationLabelWidth, classificationLabelHeight, classificationLabelRadius, false);

  if (isModelLoaded) {
    makeClassificationLabelsVisible();
  }
} // end setupClassificationBarAndLabels()

function setupPhotoGrids() {
  let photoGridY = height / 2.5;
  leftGrid = new PhotoGrid(width / 2 - 480, photoGridY, 3, 2, 120, 20);
  rightGrid = new PhotoGrid(width / 2 + 300, photoGridY, 3, 2, 120, 20);
} // end setupPhotoGrids()

function setupEditCodeLink() {
  if (editCode) {
    editCode.remove();
    editCode = null;
  }

  editCode = createA(
    "https://editor.p5js.org/designmakeandteach/sketches/yiTc27eXT",
    "EDIT CODE",
    "_blank"
  );
  editCode.position(width - 110, height - 40);
  editCode.style("height", "40px");
  editCode.style("border-width", "0px");
  editCode.style("background-color", bgColor);
  editCode.style("font-size", "18px");
  editCode.style("width", "200px");
  editCode.style("color", "#1967D2");
} // end setupEditCodeLink()

function setupModelInput() {
  modelInput = createInput();
  modelInput.input(() => {
    enteredText = this.value().trim();
  });
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


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Create the video
  videoSize = 250;
  video = createCapture(VIDEO);
  video.hide();
  shouldFeezeFrame = false;
  hasSetPauseTimer = false;

  cameraBorder = loadImage("camera_border.png");
  putsorter = loadImage("put_sorter.png");

  // Initialize UI Components
  setupLoadModelButton();
  setupModelInput();
  setupConnectButton();
  setupPhotoGrids();
  setupClassificationBarAndLabels();
  setupEditCodeLink();
  setupTestMode();

  // Initialize the serial port
  serialPort = initSerialPort();

  // Start classifying
  if (isModelLoaded) {
    classifyVideo();
  }

} // end setup()

function draw() {
  //   Darker BG
  if (width > 700) {
    background(bgColor);
    video.get();
    //   Darker BG
    // background('#e8f0fe');
    if (shouldFreezeFrame && !hasSetPauseTimer) {
      video.pause();
      let selectPic = video.get(150, 0, videoSize / 1.6, videoSize / 1.6);
      if (isLeftPic) {
        leftGrid.addImage(selectPic);
      } else {
        rightGrid.addImage(selectPic);
      }
      setTimeout(() => {
        video.play();
        hasSetPauseTimer = false;
        shouldFreezeFrame = false;
      }, 2000);
    }
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
      cameraBorder,
      width / 2 - videoSize / 2 - 3,
      height / 1.6 - videoSize / 2 - 3,
      videoSize + 6,
      videoSize + 6
    );

    leftGrid.render();
    rightGrid.render();
    rectMode(CORNER);
    loadModel.draw();

    classificationBar.render();
    leftClassificationLabel.render();
    rightClassificationLabel.render();

  } else {
    noStroke();

    text("expand page or ", width / 2, height / 1.6);
    text("load on a computer to use", width / 2, height / 1.5);
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
  // classifier.classify(video, () => {});
}

function updateClassification(results) {
  // console.log(results);
  const class1 = results.filter((objs) => {
    if (objs.label === labels[0]) {
      return objs;
    }
  });

  const class2 = results.filter((objs) => {
    if (objs.label === labels[1]) {
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
      shouldFreezeFrame = true;
      rightClassificationLabel.triggerSplash();

      isLeftPic = false;
    } catch (e) { }
  } else if (class2[0].confidence > 0.9) {
    try {
      if (serialPort.opened()) {
        console.log("Sending Class 1 Detected")
        serialPort.write("1");
      }
      shouldFreezeFrame = true;
      leftClassificationLabel.triggerSplash();
      isLeftPic = true;
    } catch (e) { }
  }
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  updateClassification(results);

  label = results[0].label;

  // Classifiy again after a timeout
  setTimeout(() => {
    classifyVideo();
  }, 250);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  clear();
  background(bgColor);

  const leftPhotos = leftGrid.images;
  const rightPhotos = rightGrid.images;

  setupPhotoGrids();

  leftGrid.images = leftPhotos;
  rightGrid.images = rightPhotos;

  setupClassificationBarAndLabels();
  setupConnectButton();
  setupEditCodeLink();

}
