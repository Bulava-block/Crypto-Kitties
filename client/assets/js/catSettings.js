//
var colors = Object.values(allColors());
console.log(colors);

// this variable creates default kittie
var defaultDNA = {
  headcolor: 10,
  mouthColor: 13,
  eyesColor: 96,
  earsColor: 10,
  //Cattributes
  eyesShape: 1,
  decorationPattern: 1,
  decorationMidcolor: 13,
  decorationSidescolor: 14,
  animation: 1,
  lastNum: 1,
};
// this is a function that generates random number from 1 to 98
function getRndInteger(x, y) {
  return Math.floor(Math.random() * (y - x)) + x;
}

//this is a function that generates a random number from 1 to 3
function getRndInteger13(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
// this function generates a random kittie
function randomNumber() {
  var randomDNA = {
    headcolor: getRndInteger(10, 98),
    mouthColor: getRndInteger(10, 98),
    eyesColor: getRndInteger(10, 98),
    earsColor: getRndInteger(10, 98),
    //Cattributes
    eyesShape: getRndInteger13(1, 3),
    decorationPattern: getRndInteger13(1, 3),
    decorationMidcolor: getRndInteger(10, 98),
    decorationSidescolor: getRndInteger(10, 98),
    animation: getRndInteger13(1, 3),
    lastNum: 1,
  };
  return randomDNA;
}

// when page loads this function executes and starts with the default kittie on the screen
$(document).ready(function () {
  $("#dnabody").html(defaultDNA.headColor);
  $("#dnamouth").html(defaultDNA.mouthColor);
  $("#dnaeyes").html(defaultDNA.eyesColor);
  $("#dnaears").html(defaultDNA.earsColor);

  $("#dnashape").html(defaultDNA.eyesShape);
  $("#dnadecoration").html(defaultDNA.decorationPattern);
  $("#dnadecorationMid").html(defaultDNA.decorationMidcolor);
  $("#dnadecorationSides").html(defaultDNA.decorationSidescolor);
  $("#dnadanimation").html(defaultDNA.animation);
  $("#dnaspecial").html(defaultDNA.lastNum);
  $("#cattributesBar").hide();
  renderCat(defaultDNA);
});
//this creates a number that is below the cat and shows DNA numbers
function getDna() {
  var dna = "";
  dna += $("#dnabody").html();
  dna += $("#dnamouth").html();
  dna += $("#dnaeyes").html();
  dna += $("#dnaears").html();
  dna += $("#dnashape").html();
  dna += $("#dnadecoration").html();
  dna += $("#dnadecorationMid").html();
  dna += $("#dnadecorationSides").html();
  dna += $("#dnadanimation").html();
  dna += $("#dnaspecial").html();

  return parseInt(dna);
}
// this converts data and creates a cat on screen
function renderCat(dna) {
  headColor(colors[dna.headcolor], dna.headcolor);
  $("#bodycolor").val(dna.headcolor);
  MouthBellyTail(colors[dna.mouthColor], dna.mouthColor);
  $("#mouthColor").val(dna.mouthColor);
  colorEye(colors[dna.eyesColor], dna.eyesColor);
  $("#eyesColor").val(dna.eyesColor);
  colorEar(colors[dna.earsColor], dna.earsColor);
  $("#earsColor").val(dna.earsColor);
  eyeVariation(dna.eyesShape);
  $("#eyeshape").val(dna.eyesShape);
  decorationVariation(dna.decorationPattern);
  $("#decorationPattern").val(dna.decorationPattern);
  dotsSide(colors[dna.decorationSidescolor], dna.decorationSidescolor);
  $("#decorationSidescolor").val(dna.decorationSidescolor);
  dotMid(colors[dna.decorationMidcolor], dna.decorationMidcolor);
  $("#decorationMidcolor").val(dna.decorationMidcolor);
  animationVariation(dna.animation);
  $("#animation").val(dna.animation);
}

// Changing cat colors, animations etc. The "change" command changes the parameter in real life and not when function is executed
$("#bodycolor").change(() => {
  var colorVal = $("#bodycolor").val();
  headColor(colors[colorVal], colorVal);
});

$("#mouthColor").change(() => {
  var colorVal = $("#mouthColor").val();
  MouthBellyTail(colors[colorVal], colorVal);
});
$("#eyesColor").change(() => {
  var colorVal = $("#eyesColor").val();
  colorEye(colors[colorVal], colorVal);
});
$("#earsColor").change(() => {
  var colorVal = $("#earsColor").val();
  colorEar(colors[colorVal], colorVal);
});

$("#eyeshape").change(() => {
  var shape = parseInt($("#eyeshape").val());
  eyeVariation(shape);
});

$("#decorationPattern").change(() => {
  var shape = parseInt($("#decorationPattern").val());
  decorationVariation(shape);
});

$("#decorationSidescolor").change(() => {
  var colorVal = $("#decorationSidescolor").val();
  dotsSide(colors[colorVal], colorVal);
});
$("#decorationMidcolor").change(() => {
  var colorVal = $("#decorationMidcolor").val();
  dotMid(colors[colorVal], colorVal);
});

$("#animation").change(() => {
  console.log("changed");
  var animationVal = parseInt($("#animation").val());
  animationVariation(animationVal);
});
