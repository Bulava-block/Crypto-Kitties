//File for fetching all the cats from the blockchain
// into the catalogue
// when the page load, create a catalogue
$(document).ready(function () {
  setTimeout(() => {
    getKitties();
    
    
  }, 1000);
});

function appendCat(dna, id, generation, onSaleCats="catsDiv", column=4) {
  console.log(dna, id, onSaleCats);
  // 1 return cat dna into readable string
  var KittyDna = catDna(dna);
  //2 build a catBox into html
  catBox(id, onSaleCats, column);
  //3 render the cats css style depending on dna string
  renderCat(KittyDna, id);
  $("#catDNA" + id).html(
    `
    <span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>GEN:</b>${generation}</h4></span>
    <br>

    <span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>DNA:</b> 
      ${dna} 
      </h4></span>
      </br>
  `
  );
}

//Apply cat css Styles from buildCat.js
function renderCat(dna, id) {
  headColor1(dna.headcolor, id);
  mouthAndBelly(dna.mouthColor, id);
  eyeColor(dna.eyesColor, id);
  earsAndPaw(dna.earsColor, id);
  eyeVariation(parseInt(dna.eyesShape), id);
  decorationVariation(parseInt(dna.decorationPattern), id);
  midColor(dna.decorationMidcolor, id);
  SidesColor(dna.decorationSidescolor, id);
  animationVariation(parseInt(dna.animation), id);
}

//Spitting the cat DNA to use it in render
function catDna(dnaStr) {
  var dna = {
    //Colors
    headcolor: dnaStr.substring(0, 2),
    mouthColor: dnaStr.substring(2, 4),
    eyesColor: dnaStr.substring(4, 6),
    earsColor: dnaStr.substring(6, 8),
    //Catributes
    eyesShape: dnaStr.substring(8, 9),
    decorationPattern: dnaStr.substring(9, 10),
    decorationMidcolor: dnaStr.substring(10, 12),
    decorationSidescolor: dnaStr.substring(12, 14),
    animation: dnaStr.substring(14, 15),
    lastNum: dnaStr.substring(15, 16),
  };
  return dna;
}

//Cat html div

var name = "Stas";
var string = "Hello" + name + "!";

function catBox(id, onSaleCats, column) {
  
  var catDiv = `
<div onclick="selectParents(${id}); sellOrBuy(${id})" id="hide${id}" class="col-lg-${column}"  >
  <div  style="cursor: pointer" class="col-lg-10 catBox1 m-2 light-b-shadow">
    <div class="cat">
      <div class="cat__ear">
        <div id="leftEar${id}" class="cat__ear--left">
          <div class="cat__ear--left-inside"></div>
        </div>
        <div id="rightEar${id}" class="cat__ear--right">
          <div class="cat__ear--right-inside "></div>
        </div>
      </div>
        <div id="head${id}" class="cat__head ">
          <div id="midDot${id}"  class="cat__head-dots">
            <div id="leftDot${id}" class="cat__head-dots_first"></div>
            <div id="rightDot${id}" class="cat__head-dots_second"></div>
          </div>
            <div id="cat__eye${id}" class="cat__eye">
              <div   class="cat__eye--left">
                <span id="pupil-left${id}" class="pupil-left"></span>
              </div>
              <div class="cat__eye--right">
                <span id="pupil-right${id}" class="pupil-right"></span>
              </div>
            </div>
              <div class="cat__nose"></div>
              <div id="mouth-contour${id}" class="cat__mouth-contour"></div>
              <div class="cat__mouth-left"></div>
              <div class="cat__mouth-right"></div>
              <div class="cat__whiskers-left"></div>
              <div class="cat__whiskers-right"></div>
        </div>
          <div class="cat__body">
            <div id="chest${id}" class="cat__chest"></div>
            <div id="chest_inner${id}" class="cat__chest_inner"></div>
            <div id="pawLeft${id}" class="cat__paw-left"></div>
            <div id="pawLeftInner${id}" class="cat__paw-left_inner"></div>
            <div id="pawLeft${id}" class="cat__paw-right"></div>
            <div id="pawLeftInner${id}" class="cat__paw-right_inner"></div>
            <div id="tail${id}" class="cat__tail"></div>
          </div>
    </div>
      <br>
        <div class="dnaDiv" id="catDNA${id}"></div>
  
  </div> 
    <div class="container">
    <div class="row "> 
    <div class="col-7"> 
      <ul class="ml-5 ">
        <li><span id="eyeName${id}"></span>eyes</li>
        <li><span id="decorationName${id}">decoration</span></li>
        <li><span id="animationName${id}">animation</span></li>
      </ul>
      </div>
        <br>
        <div class="col">
      <button
          type="button"
          onclick="removeFromSale(${id})"
          class="btn btn-warning btn-sm btn-rounded hidden "
          id="cancelBut${id}"
          >
          Cancel
      </button>
      </div> 
    </div> 
    </div>

</div>
 `;
  $(`#${onSaleCats}`).append(catDiv);
  

}

function appendCatFunction(id, box=1){
  return `<div  >
  <div  style="cursor: pointer" class="col catBox${box} m-2 light-b-shadow">
  
    <div class="cat">
        <div class="cat__ear">
            <div id="leftEar${id}" class="cat__ear--left">
                <div class="cat__ear--left-inside"></div>
            </div>
            <div id="rightEar${id}" class="cat__ear--right">
                <div class="cat__ear--right-inside "></div>
            </div>
        </div>

        <div id="head${id}" class="cat__head ">
                <div id="midDot${id}"  class="cat__head-dots">
                
                <div id="leftDot${id}" class="cat__head-dots_first"></div>
                <div id="rightDot${id}" class="cat__head-dots_second"></div>
            </div>
            <div id="cat__eye${id}" class="cat__eye">
                <div   class="cat__eye--left">
                    <span id="pupil-left${id}" class="pupil-left"></span>
                </div>
                <div class="cat__eye--right">
                    <span id="pupil-right${id}" class="pupil-right"></span>
                </div>
            </div>
            <div class="cat__nose"></div>

            <div id="mouth-contour${id}" class="cat__mouth-contour"></div>
            <div class="cat__mouth-left"></div>
            <div class="cat__mouth-right"></div>

            <div class="cat__whiskers-left"></div>
            <div class="cat__whiskers-right"></div>
        </div>

        <div class="cat__body">

            <div id="chest${id}" class="cat__chest"></div>

            <div id="chest_inner${id}" class="cat__chest_inner"></div>

           
            <div id="pawLeft${id}" class="cat__paw-left"></div>
            <div id="pawLeftInner${id}" class="cat__paw-left_inner"></div>


            <div id="pawLeft${id}" class="cat__paw-right"></div>
            <div id="pawLeftInner${id}" class="cat__paw-right_inner"></div>
            

            <div id="tail${id}" class="cat__tail"></div>
        </div>
    </div>
    
    <br>
    <div class="dnaDiv" id="catDNA${id}">
    </div>
    
     
    </div>
    <br>
    <ul class="ml-5 ">
        <li><span id="eyeName${id}"></span>eyes</li>
        <li><span id="decorationName${id}">decoration</span></li>
        <li><span id="animationName${id}">animation</span></li>
    </ul>
    </div>`
}