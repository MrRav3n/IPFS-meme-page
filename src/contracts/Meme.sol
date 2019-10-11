pragma solidity ^0.5.8;

contract Meme {
   string public memePath;

    function setMeme(string memory _mamePath) public {
        memePath = _mamePath;
    }
}
