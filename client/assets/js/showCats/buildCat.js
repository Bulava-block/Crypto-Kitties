var colors = Object.values(allColors());

function headColor1(code, id) {
  var color = colors[code];
  $(`#head` + id + `, #chest` + id).css("background", "#" + color);
}

function mouthAndBelly(code, id) {
  var color = colors[code];
  $(`#mouth-contour` + id + `, #tail` + id + `, #chest_inner` + id).css(
    "background",
    "#" + color
  );
}

function eyeColor(code, id) {
  var color = colors[code];
  $(`#cat__eye` + id)
    .find("span")
    .css("background", "#" + color);
}

function earsAndPaw(code, id) {
  var color = colors[code];
  $(
    `#leftEar` +
      id +
      `,#rightEar` +
      id +
      `, #pawLeft` +
      id +
      `, #pawLeftInner` +
      id
  ).css("background", "#" + color);
}

function midColor(code, id) {
  var color = colors[code];
  $(`#midDot` + id).css("background", "#" + color);
}

function SidesColor(code, id) {
  var color = colors[code];
  $(`#leftDot` + id + `,#rightDot` + id).css("background", "#" + color);
  console.log(color, code);
}

function allPaws(code, id) {
  var color = colors[code];
  $(`#paws` + id`, #right`).css("background", "#" + color);
}

function eyeVariation(num, id) {
  console.log("eye variation!");
  switch (num) {
    case 1:
      normalEyes(id);
      $("#eyeName" + id).html("Basic");
      break;
    case 2:
      normalEyes(id);
      $("#eyeName" + id).html("Chill");
      eyesType1(id);
      break;
  }
}

function animationVariation(num, id) {
  console.log("animation variation", num, id);
  switch (num) {
    case 1:
      animationType1(id);
      $("#animationName" + id).html("Head spining");
      break;
    case 2:
      animationType2(id);
      $("#animationName" + id).html("Tail shaking");
      break;
    case 3:
      animationType3(id);
      $("#animationName" + id).html("Eye spining");
  }
}

function decorationVariation(num, id) {
  console.log("decoration variation!");
  switch (num) {
    case 1:
      $("#decorationName" + id).html("Looks straight");
      normaldecoration(id);
      break;
    case 2:
      normaldecoration(id);
      $("#decorationName" + id).html("Looks down");
      decoration1(id);
      break;
    case 3:
      normaldecoration(id);
      $("#decorationName" + id).html("Angle");
      decoration2(id);
      break;
    default:
      console.log("not 1 or 2");
      break;
  }
}

function resetAnimation(id) {
  $(`#head${id}`).removeClass("movingHead");
  $(`#tail${id}`).removeClass("movingTail");
  $(`#pupil-left${id}, #pupil-right${id}`).removeClass("movingPupil");
}

function animationType1(id) {
  resetAnimation();
  $(`#head${id}`).addClass("movingHead");
}

function animationType2(id) {
  resetAnimation();
  $(`#tail${id}`).addClass("movingTail");
}

function animationType3(id) {
  resetAnimation();
  $(`#pupil-left${id}, #pupil-right${id}`).addClass("movingPupil");
}

function normalEyes(id) {
  $(`#pupil-left${id}, #pupil-right${id}`).css("border", "none");
}
function eyesType1(id) {
  $(`#pupil-left${id}, #pupil-right${id}`).css("border-top", "15px solid");
}
function eyesType2(id) {
  $(`#pupil-left${id}, #pupil-right${id}`).css("border-bottom", "30px solid");
}

function normaldecoration(id) {
  $(`#midDot${id}`).css({
    height: "48px",
    transform: "rotate(0deg)",
  });
}

function decoration1(id) {
  $(`#midDot${id}`).css("height", "100px");
}
function decoration2(id) {
  $(`#midDot${id}`).css("transform", "rotate(180deg)");
}
