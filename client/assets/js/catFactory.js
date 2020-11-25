//This function code needs to modified so that it works with Your cat code.
function headColor(color, code) {
  $(".cat__head, .cat__chest").css("background", "#" + color); // This changes the color of the cat
  $("#headcode").html("code: " + code); //This updates text of the badge next to the slider
  $("#dnabody").html(code); // This updates the body color part of the DNA that is displayed below the cat
}

// whenever we move the scroll to the color
function MouthBellyTail(color, code) {
  $(".cat__mouth-contour, .cat__tail, .cat__chest_inner").css(
    "background",
    "#" + color
  );
  $("#mouthcode").html("code: " + code);
  $("#dnamouth").html(code);
}
function colorEye(color, code) {
  $(".cat__eye span.pupil-left, .cat__eye span.pupil-right").css(
    "background",
    "#" + color
  );
  $("#eyecode").html("code: " + code);
  $("#dnaeyes").html(code);
}
function colorEar(color, code) {
  $(".cat__ear--right, .cat__ear--left").css("background", "#" + color);
  $("#earcode").html("code: " + code);
  $("#dnaears").html(code);
}
function dotsSide(color, code) {
  $(".cat__head-dots_second, .cat__head-dots_first").css(
    "background",
    "#" + color
  );
  $("#sideDotsCode").html("code: " + code);
  $("#dnadecorationSides").html(code);
}

function dotMid(color, code) {
  $(".cat__head-dots").css("background", "#" + color);
  $("#MidDotCode").html("code: " + code);
  $("#dnadecorationMid").html(code);
}

function eyeVariation(num) {
  $("#dnashape").html(num);
  switch (num) {
    case 1:
      normalEyes();
      $("#eyeName").html("Basic");
      break;
    case 2:
      normalEyes();
      $("#eyeName").html("Chill");
      eyesType1();
      break;
    case 3:
      normalEyes();
      $("#eyeName").html("up");
      eyesType2();
      break;
    default:
      console.log("not 1 or 2");
      break;
  }
}

function animationVariation(num) {
  $("dnadanimation").html(num);

  switch (num) {
    case 1:
      animationType1();
      $("#animationName").html("headSpining");
      break;
    case 2:
      animationType2();
      $("#animationName").html("tailShaking");
      break;
    case 3:
      animationType3();
      $("#animationName").html("eyeSpining");
  }
}

function decorationVariation(num) {
  $("#dnadecoration").html(num);
  switch (num) {
    case 1:
      $("#decorationName").html("Basic");
      normaldecoration();
      break;
    case 2:
      normaldecoration();
      $("#decorationName").html("longer");
      decoration1();
      break;
    case 3:
      normaldecoration();
      $("#decorationName").html("Angle");
      decoration2();
      break;
    default:
      console.log("not 1 or 2");
      break;
  }
}

function normalEyes() {
  $(".cat__eye").find("span").css("border", "none");
}
function eyesType1() {
  $(".cat__eye").find("span").css("border-top", "15px solid");
}
function eyesType2() {
  $(".cat__eye").find("span").css("border-bottom", "30px solid");
}

function normaldecoration() {
  $(".cat__head-dots").css({ height: "48px", transform: "rotate(0deg)" });
}
function decoration1() {
  $(".cat__head-dots").css("height", "100px");
}
function decoration2() {
  $(".cat__head-dots").css("transform", "rotate(180deg)");
}

function animationType1() {
  resetAnimation();
  $("#head").addClass("movingHead");
}

function resetAnimation() {
  $("#head").removeClass("movingHead");
  $("#tail").removeClass("movingTail");
  $(".pupil-left, .pupil-right").removeClass("movingPupil");
}

function animationType2() {
  resetAnimation();
  $("#tail").addClass("movingTail");
}

function animationType3() {
  resetAnimation();
  $(".pupil-left, .pupil-right").addClass("movingPupil");
}
// this creates a Default kittie
$("#defKit").click(function () {
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

  renderCat(defaultDNA);
  console.log("Siski");
});
// this hides "color" button and shows "cattributes" button
$("#cattributesButton").click(function () {
  $("#colorBar").hide();
  $("#cattributesBar").show();
});

// this hides "catributtes" button and shows "colors" button
$("#colorsButton").click(function () {
  $("#cattributesBar").hide();
  $("#colorBar").show();
});

//this creates a random cat on click
$("#randomCat").click(function () {
  let randomDNA = randomNumber();
  $("#dnabody").html(randomDNA.headColor);
  $("#dnamouth").html(randomDNA.mouthColor);
  $("#dnaeyes").html(randomDNA.eyesColor);
  $("#dnaears").html(randomDNA.earsColor);

  $("#dnashape").html(randomDNA.eyesShape);
  $("#dnadecoration").html(randomDNA.decorationPattern);
  $("#dnadecorationMid").html(randomDNA.decorationMidcolor);
  $("#dnadecorationSides").html(randomDNA.decorationSidescolor);
  $("#dnadanimation").html(randomDNA.animation);
  $("#dnaspecial").html(randomDNA.lastNum);

  renderCat(randomDNA);
});
