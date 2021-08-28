pragma solidity ^0.5.12;

import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./Ownable.sol";

contract Kittycontract is IERC721, Ownable {
    uint256 public constant CREATION_LIMIT_GEN0 = 10;

    bytes4 internal constant MAGIC_ERC721_RECEIVED =
        bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    event Birth(
        address owner,
        uint256 kittenId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes
    );

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    // array kitties
    Kitty[] kitties;
    //mapping
    mapping(uint256 => address) public kittyIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;
    mapping(uint256 => address) public kittyIndexToApproved;

    //  MYADDR =>OPERATORADDRESS=>TRUE/FALSE
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    uint256 public gen0Counter;

    //it executes only once when contract is deployed for the first time.
    constructor() public {
        _createKitty(0, 0, uint256(-1), 0, address(0));
    }

    function breed(uint256 _dadId, uint256 _mumId) public returns (uint256) {
        require(_owns(msg.sender, _dadId), "The user doesn't own the tocken");
        require(_owns(msg.sender, _mumId), "The user doesn't own the tocken");

        (uint256 mumDna, , , , uint256 momGeneration) = getKitty(_mumId);
        (uint256 dadDna, , , , uint256 dadGeneration) = getKitty(_dadId);

        uint256 kidGen = 0;
        if (dadGeneration < momGeneration) {
            kidGen = momGeneration + 1;
        } else if (dadGeneration > momGeneration) {
            kidGen = dadGeneration + 1;
        } else {
            kidGen = dadGeneration + 1;
        }

        uint256 newDna = _mixDna(dadDna, mumDna);
        return _createKitty(_mumId, _dadId, kidGen, newDna, msg.sender);
    }

    //  ?????
    function supportsInterface(bytes4 _interfaceId)
        external
        view
        returns (bool)
    {
        return (_interfaceId == _INTERFACE_ID_ERC721 ||
            _interfaceId == _INTERFACE_ID_ERC165);
    }

    function _safeTransfer(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) internal {
        _transfer(_from, _to, _tokenId);
        require(_checkERC721Support(_from, _to, _tokenId, _data));
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        require(_to != address(0));
        require(
            msg.sender == _from ||
                _approvedFor(msg.sender, _tokenId) ||
                isApprovedForAll(_from, msg.sender)
        );
        require(_owns(_from, _tokenId));
        require(_tokenId < kitties.length);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        require(_owns(msg.sender, _tokenId));
        _approve(_tokenId, _to);

        emit Approval(msg.sender, _to, _tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender);

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(tokenId < kitties.length); // Token must exist

        return kittyIndexToApproved[tokenId];
    }

    // This gives us an array of Id's that the adddress owns
    function getKittyByOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](ownershipTokenCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < kitties.length; i++) {
            if (kittyIndexToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getKitty(uint256 _id)
        public
        view
        returns (
            uint256 genes,
            uint256 birthTime,
            uint256 mumId,
            uint256 dadId,
            uint256 generation
        )
    {
        Kitty storage kitty = kitties[_id];

        birthTime = uint256(kitty.birthTime);
        mumId = uint256(kitty.mumId);
        dadId = uint256(kitty.dadId);
        generation = uint256(kitty.generation);
        genes = kitty.genes;
    }

    function createKittyGen0(uint256 _genes)
        public
        onlyOwner
        returns (uint256)
    {
        require(gen0Counter < CREATION_LIMIT_GEN0);

        gen0Counter++;

        return _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function _createKitty(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) private returns (uint256) {
        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(now),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        uint256 newKittenId = kitties.push(_kitty) - 1;

        emit Birth(_owner, newKittenId, _mumId, _dadId, _genes);

        _transfer(address(0), _owner, newKittenId);

        return newKittenId;
    }

    function balanceOf(address owner) external view returns (uint256 balance) {
        return ownershipTokenCount[owner];
    }

    function totalSupply() external view returns (uint256 total) {
        return kitties.length;
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        return kittyIndexToOwner[tokenId];
    }

    function transfer(address to, uint256 tokenId) external {
        require(to != address(0));
        require(to != address(this));
        require(_owns(msg.sender, tokenId));

        _transfer(msg.sender, to, tokenId);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        ownershipTokenCount[_to]++;
        kittyIndexToOwner[_tokenId] = _to;

        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            delete kittyIndexToApproved[_tokenId];
        }

        emit Transfer(_from, _to, _tokenId);
    }

    function _owns(address _claimant, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        return kittyIndexToOwner[_tokenId] == _claimant;
    }

    function _approve(uint256 _tokenId, address _approved) internal {
        kittyIndexToApproved[_tokenId] = _approved;
    }

    function _approvedFor(address _claimant, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        return kittyIndexToApproved[_tokenId] == _claimant;
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    function _checkERC721Support(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) internal returns (bool) {
        if (!_isContract(_to)) {
            return true;
        }
        //call onERC721Received in the _to contract
        bytes4 returnData = IERC721Receiver(_to).onIERC721Received(
            msg.sender,
            _from,
            _tokenId,
            _data
        );
        return returnData == MAGIC_ERC721_RECEIVED;

        //check return value
    }

    function _isContract(address _to) internal view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_to)
        }
        return size > 0;
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external {
        // why "" ?
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    // what does it return?
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public {
        require(_isApprovedOrOwner(msg.sender, _from, _to, _tokenId));
        _safeTransfer(_from, _to, _tokenId, _data);
    }

    function _isApprovedOrOwner(
        address _spender,
        address _from,
        address _to,
        uint256 _tokenId
    ) internal view returns (bool) {
        require(_tokenId < kitties.length); //token must exist
        require(_to != address(0)); // _to address is not zero address
        require(_owns(_from, _tokenId)); //from owns the token
        //spender is from OR spender is approved for tokenID OR spender is operator for from
        return (_spender == _from ||
            _approvedFor(_spender, _tokenId) ||
            isApprovedForAll(_from, _spender));
    }

    function _mixDna(uint256 _dadDna, uint256 _mumDna)
        internal
        returns (uint256)
    {
        uint256[8] memory geneArray;
        uint8 random = uint8(now % 255); // 0-255 binary between  00000000-11111111
        uint256 i = 1; // random number 11001011
        uint256 index = 7;
        for (i = 1; i <= 128; i = i * 2) {
            if (random & i != 0) {
                geneArray[index] = uint8(_mumDna % 100);
            } else {
                geneArray[index] = uint8(_dadDna % 100);
            }
            _mumDna = _mumDna / 100;
            _dadDna = _dadDna / 100;
            index = index - 1;
            // 1, 2, 4, 8, 16, 32, 64, 128

            // 00000001-1
            // 00000010-2
            // 00000100-4
            // 00001000-8
            // 00010000-16
            // 00100000-32
            // 01000000-64
            // 10000000-128
        }

        uint256 newGene;
        // [11, 22, 33, 44, 55, 66, 77, 88]
        for (i = 0; i < 8; i++) {
            newGene = newGene + geneArray[i];
            if (i != 7) {
                newGene = newGene * 100;
            }
        }
        return newGene;
    }
}
