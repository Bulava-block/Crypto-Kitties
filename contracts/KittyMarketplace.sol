pragma solidity ^0.5.12;

import "./Kittycontract.sol";
import "./Ownable.sol";
import "./IKittyMarketplace.sol";

contract KittyMarketPlace is Ownable {
    Kittycontract private _kittyContract;

    struct Offer {
        address payable seller;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }
    Offer[] offers;
    mapping(uint256 => Offer) tokenIdToOffer;

    event marketTransaction(string TxType, address owner, uint256 tokenId);

    function setKittyContract(address _kittyContractAddress) public onlyOwner {
        _kittyContract = Kittycontract(_kittyContractAddress);
    }

    constructor(address _kittyContractAddress) public {
        setKittyContract(_kittyContractAddress);
    }

    function getOffer(uint256 _tokenId)
        external
        view
        returns (
            address seller,
            uint256 price,
            uint256 index,
            uint256 tokenId,
            bool active
        )
    {
        Offer memory offer = tokenIdToOffer[_tokenId];
        return (
            offer.seller,
            offer.price,
            offer.index,
            offer.tokenId,
            offer.active
        );
    }

    function getAllTokenOnSale()
        external
        view
        returns (uint256[] memory listOfOffers)
    {
        uint256 totalOffers = offers.length;

        if (totalOffers == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](totalOffers);

            uint256 offerId;

            for (offerId = 0; offerId < totalOffers; offerId++) {
                if (offers[offerId].active == true) {
                    result[offerId] = offers[offerId].tokenId;
                }
            }
            return result;
        }
    }

    function _ownsKitty(address _address, uint256 _tokenId)
        public
        view
        returns (bool)
    {
        return (_kittyContract.ownerOf(_tokenId) == _address);
    }

    function setOffer(uint256 _price, uint256 _tokenId) public {
        require(
            _ownsKitty(msg.sender, _tokenId),
            "You are no the owner of that kitty"
        );
        require(
            tokenIdToOffer[_tokenId].active == false,
            "You can't sell it twice"
        );
        require(
            _kittyContract.isApprovedForAll(msg.sender, address(this)),
            "Contract needs to be an approved operator"
        );

        Offer memory _offer = Offer({
            seller: msg.sender,
            price: _price,
            active: true,
            tokenId: _tokenId,
            index: offers.length
        });

        tokenIdToOffer[_tokenId] = _offer;
        offers.push(_offer);
        emit marketTransaction("Create offer", msg.sender, _tokenId);
    }

    function removeOffer(uint256 _tokenId) public {
        Offer memory offer = tokenIdToOffer[_tokenId];
        require(
            offer.seller == msg.sender,
            "You are not the owner of that kitty"
        );
        delete tokenIdToOffer[_tokenId];
        offers[offer.index].active = false;
        emit marketTransaction("Remove offer", msg.sender, _tokenId);
    }

    function buyKitty(uint256 _tokenId) external payable {
        Offer memory offer = tokenIdToOffer[_tokenId];
        require(msg.value == offer.price, "The price is incorect");
        require(
            tokenIdToOffer[_tokenId].active == true,
            "No active order present"
        );
        // IMPORTANT: Delete the kitty from the mapping before paying out to prevent reentry attacks

        delete tokenIdToOffer[_tokenId];
        offers[offer.index].active = false;

        // Transfer the funds to the seller
        //TODO: make this logic pull instead of push. If I want. It's not necessary
        if (offer.price > 0) {
            offer.seller.transfer(offer.price);
        }

        //Transfer the ownership of the kitty
        _kittyContract.transferFrom(offer.seller, msg.sender, _tokenId);

        emit marketTransaction("Buy", msg.sender, _tokenId);
    }
}
