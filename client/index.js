var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var marketplaceInstance;
var marketplaceAddress ="0xb00a44bbf7fe286cE95C05AB6B0c1e68c0b5fFA8";
var contractAddress = "0xE05694EEB0D9af93FE568A750988D59606bafd2A";
var kittiesOnSaleArr;
var idForSale;
var idForBuy;
var mumId;
var dadId;
var selectingMum = false;
var selectingDad = false;


$(document).ready(function () {
  window.ethereum.enable().then(function (accounts) {
    instance = new web3.eth.Contract(abi.kittyContract, contractAddress, {from: accounts[0]});
      marketplaceInstance=new web3.eth.Contract(abi.marketplace, marketplaceAddress, { from: accounts[0]}) ; 
    //user is an address of the person that is using the wallet once the page connects to the metamask
      user = accounts[0];
      window.ethereum.on("accountsChanged", function(){location.reload()});

    

    //Listening for the events on the blockchain.
      instance.events
        .Birth().on("data", function (event) {
        
          let owner = event.returnValues.owner;
          let kittyId = event.returnValues.kittenId;
          let mumId = event.returnValues.mumId;
          let dadId = event.returnValues.dadId;
          let genes = event.returnValues.genes;

          $("#kittyCreation").css("display", "block");
          $("#kittyCreation").text(
            "owner:" +
              owner +
              "kittyId:" +
              kittyId +
              "mumId:" +
              mumId +
              "dadId:" +
              dadId +
              "genes" +
              genes
          );
        })
        .on("error", console.error);

      marketplaceInstance.events.marketTransaction()
        .on(`data`, (event)=>{
  
          var eventType=event.returnValues["TxType"].toString()
          var tokenId=event.returnValues["tokenId"]
            if(eventType=="Buy"){
              alert('A Kitty has been purchased. Now you own a Kitty with a Token ID:'+tokenId)
            }
            if(eventType=="Create offer"){
              $(`#greenAlert`).removeClass("hidden");
              $(`#greenAlert`).text("Kitty with ID:"+tokenId+" has been put at the Marketplace");
            }
            if(eventType=="Remove offer"){
              alert("Kitty with ID:"+tokenId+" has been removed from the Marketplace")  
            }    
        })
        .on("error", console.error)
  });
});

    // this allows marketplace to use you cats for seelling
async function initMarketplace(){
  var isMarketplaceOperator=await instance.methods.isApprovedForAll(user, marketplaceAddress).call();
    if(isMarketplaceOperator){
      getInventory();  
    }
    else{
      await instance.methods.setApprovalForAll(marketplaceAddress, true).send().on("receipt", function(receipt){
        //tx done
        console.log("tx done");
        getInventory();
      })
    }
}

  //get Kitties for breeding that are not selected
async function getInventory(){
  $(`#pikBuy1`).addClass("hidden");
  $(`#pikBuy`).addClass("hidden");
  $(`#goBack`).addClass("hidden");
  $(`#onSaleCats`).empty();
  //this creates and array with cats on sale
  var arrayId=await marketplaceInstance.methods.getAllTokenOnSale().call();
    for(i=0;i<arrayId.length; i++){
      x= await marketplaceInstance.methods._ownsKitty(user, arrayId[i] ).call();
      // if the user doesn't own the cat and Cat's ID is not equal to 0 then it appends the cat
      if(arrayId[i] !=0 && x==false){
        appendKitty(arrayId[i], "onSaleCats")
      }
    }
}


 // this appends a cat to sell it
 async function selectCatForSale(id) {
  //put previously chosen cat back in the modul
  $(`#hide${idForSale}`).show();
  idForSale = id;
  //this empties the div 
  $(`#catForSale`).empty();
  // this appends the cat div
  $(`#catForSale`).append(appendCatFunction(id, 2));
  const kitty = await instance.methods.getKitty(id).call();
  var dnaObj = catDna(kitty.genes);
  renderCat(dnaObj, id);
    $("#catDNA" + id).html(
      `<span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>GEN:</b>${kitty.generation}</h4></span>
       <br>
      <span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>DNA:</b> 
      ${kitty.genes} 
      </h4></span>
      </br>`
    );
    $("#sell").removeClass("hidden");
    $("#pik").removeClass("hidden");
    $("#exampleModal").modal("hide");      
}

async function selectCatForBuy(id) {
  idForBuy = id;
  $(`#onSaleCats`).empty();
  $(`#goBack`).removeClass("hidden");
  $(`#onSaleCats`).append(appendCatFunction(id, 1));
  const kitty = await instance.methods.getKitty(id).call();
  var dnaObj = catDna(kitty.genes);
  renderCat(dnaObj, id);
  $("#catDNA" + id).html(
      `<span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>GEN:</b>${kitty.generation}</h4></span>
      <br>
      <span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>DNA:</b> 
        ${kitty.genes} 
        </h4></span>
        </br>
    `
    );
    setPrice(id);
    $("#buyButton").removeClass("hidden");
    $("#pikBuy").removeClass("hidden");
    $("#pikBuy1").removeClass("hidden");
      if(id!=idForBuy){
        $(`#hide${id}`).addClass("hidden");
      
      } 
}

  //Appending cats for catalog
async function appendKitty(id, onSaleCats="onSaleCats"){
  var kitty= await instance.methods.getKitty(id).call()
  appendCat(kitty[0], id,  kitty["generation"], onSaleCats, 3)
}

 //this sells a cat and puts it on the marketplace
async function sellCat(){
  $(`#onSaleCats`).addClass("hidden");
  var price=$("#catPrice").val()
  var amount=web3.utils.toWei(price, "ether")
    try{
      await initMarketplace();
      await marketplaceInstance.methods.setOffer(amount, idForSale).send();
    } 
    catch(err) {
      console.log(err);
    } 
    setTimeout(function(){window.location.href = "kittiesYouOwn.html"; }, 2000);
    
}

 //this buys a cat from the marketplace
async function buyKitten(){
  var price=$("#pikBuy").val()
  var amount=web3.utils.toWei(price, "ether")
  try{
    await marketplaceInstance.methods.buyKitty(idForBuy).send({value:amount});
  }
  catch(err){
    console.log(err);
    window.location.href = "kittiesYouOwn.html";
  }
  
}

  //this adds "Cancel" button to every Kitty that is on sale
async function KittiesOnSale(){
  kittiesOnSaleArr= await marketplaceInstance.methods.getAllTokenOnSale().call();
    for(i=0; i<kittiesOnSaleArr.length; i++){
      x= await marketplaceInstance.methods._ownsKitty(user, kittiesOnSaleArr[i]).call();
        if(x){
          $(`#cancelBut${kittiesOnSaleArr[i]}`).removeClass("hidden")
        }
      }
}


 //this creates Kittie  of Gen "0"  you can only have 10 gen 0 cats and only the owner of the contract can create them.
function getCat() {
  var dnaStr = getDna();
  instance.methods.createKittyGen0(dnaStr).send({}, function (error, txHash) {
    if (error) console.log(error);
      else {
      console.log(txHash);
      }
      window.location.href = "kittiesYouOwn.html";
  });
}


    // This shows all the Kitties  I own and appends them to differnt divs
async function getKitties() {
  var arrayId;
  var kitty;
    try {
      arrayId = await instance.methods.getKittyByOwner(user).call();
    }    
    catch (err) {
      console.log(err);
    }
    for (i = 0; i < arrayId.length; i++) {
      kitty = await instance.methods.getKitty(arrayId[i]).call();
      appendCat(kitty.genes, arrayId[i], kitty.generation, "catsDiv1", 3);
      appendCat(kitty.genes, arrayId[i], kitty.generation, "catsDiv", 4);
    
    }
    KittiesOnSale();
}

  // this removes the cat from Marketplace
async function removeFromSale(id){
  marketplaceInstance.methods.removeOffer(id).send({}, function (error, txHash) {
    if (error) console.log(error);
      else {
        console.log(txHash);
        setTimeout(function(){window.location.href = "kittiesYouOwn.html"; }, 2000);
      }
  });
}
    
//when sell image is clicked
$("#catForSale").click(function (){
  $("#exampleModal").modal("show");
  $(`#hide${idForSale}`).hide();
  // we take all the cats on sale and hide them from the modal
  for(i=0; i<kittiesOnSaleArr.length; i++){
    $(`#hide${kittiesOnSaleArr[i]}`).hide();
  } 
});

 //when you click "Sell a cat" button
$("#sellACat").click(function () {
  //$(`#hide${idForSale}`).show();
  //this puts all the cats back into the modul
  idForSale=null;
  $("#catForBuy").addClass("hidden");
  $("#catForSale").removeClass("hidden");
  $("#sell").addClass("hidden");
  $("#pik").addClass("hidden");
  $(`#onSaleCats`).empty();
  $(`#catForSale`).empty();
  $(`#catForSale`).append(`<input type="image"  src="./sell.jpg" />`);
  $("#buyButton").addClass("hidden");
  $("#pikBuy").addClass("hidden");
  $("#pikBuy1").addClass("hidden");
  $("#goBack").addClass("hidden");
});

$("#buyACat").click(function () {
  $("#catForSale").addClass("hidden");
  $("#catForBuy").removeClass("hidden");
  $("#pik").addClass("hidden");
  $("#sell").addClass("hidden"); 
});

//when you click on the mom egg
$("#mother").click(function () {
  selectingMum = true;
  selectingDad = false;
  $("#exampleModal").modal("show");
  // this hides current mom cat from the modul
  $(`#hide${mumId}`).hide();
  //this hides current dad cat from the modul
  $(`#hide${dadId}`).hide();
});


$("#father").click(function () {
  selectingDad = true;
  selectingMum = false;
  $("#exampleModal").modal("show");
  $(`#hide${dadId}`).hide();
  $(`#hide${mumId}`).hide();
});
   
  
    // executes either buying or selling fucntion
async function sellOrBuy(id){
  const  x= await marketplaceInstance.methods._ownsKitty(user, id).call();
    // if a cat you click on is yours, then you are selling it.
    if(x){
      selectCatForSale(id);
    }
    // if a cat you click on is not yours, then you are buying it.
    else{
        selectCatForBuy(id);
    }
}
//this figures out the price to buy a cat and posts it on the page
async function setPrice(id){
  // this takes the actual number from the from the offer 
  const x =await marketplaceInstance.methods.getOffer(id).call();
  // this converts the price from wei to ether
  var amount=web3.utils.fromWei(x.price)
  // this takes the value for the buying function
  $("#pikBuy").val(amount);
  // show the value on the screen
  $("#pikBuy").html(amount);
}

async function selectParents(id) {
  // we click mom(left) egg
  if (selectingMum) {
    mumId = id;
    // remove the previous mom if there was any
    $(`#mother`).empty();
    // append a new mum
    $(`#mother`).append(appendCatFunction(id, 2));
    //call for a kitty characteristics
    const kitty = await instance.methods.getKitty(id).call();
    //take a genes(DNA) as a string of numbers
    var dnaObj = catDna(kitty.genes);
    //create a picture on the screen
    renderCat(dnaObj, id);
    //close the module
    $("#exampleModal").modal("hide");
    // the numbers that are below the cats picture
    $("#catDNA" + id).html(
      `<span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>GEN:</b>${kitty.generation}</h4></span>
      <br>
      <span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>DNA:</b> 
        ${kitty.genes} 
        </h4></span>
        </br>`
    );
  }
      //DO THE SAME THING WITH DAD EGG
  if (selectingDad) {
    $(`#hide${dadId}`).show();
    dadId = id;
    $(`#father`).empty();
    $(`#father`).append(appendCatFunction(id, 2));
  }
  const kitty = await instance.methods.getKitty(id).call();
  var dnaObj = catDna(kitty.genes);
  renderCat(dnaObj, id);
  $("#exampleModal").modal("hide");
  $("#catDNA" + id).html(
    `<span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>GEN:</b>${kitty.generation}</h4></span>
    <br>
    <span class= "badge badge-light"><h4 class= "tsp-2 m-0"><b>DNA:</b> 
    ${kitty.genes} 
    </h4></span>
    </br>`
  );
}

// this creates a new cat when we press the button "give the msome privacy"
$("#privacy").click(function () {
  // execute breed fucnction with the ID's we now have 
  instance.methods.breed(mumId, dadId).send({}, function (error, txHash) {
    if (error) console.log(error);
    else {
      console.log(txHash);
      // If transaction goes through, return to "Kitties you own" page
      window.location.href = "kittiesYouOwn.html";
    }
    
  });
})


