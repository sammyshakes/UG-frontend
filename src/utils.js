import bloodAbi from './abis/blood_abi.json';
import ugNftAbi from './abis/ugNft_abi.json';
import ugArenaAbi from './abis/ugArena_abi.json';
import ugGameAbi from './abis/ugGame_abi.json';
import ugRaidAbi from './abis/ugRaid_abi.json';
import oldNftAbi from './abis/oldNft_abi.json';
import oldArenaAbi from './abis/oldArena_abi.json';
import oldGameAbi from './abis/oldGame_abi.json';
import UGWeaponsAbi from './abis/oldGame_abi.json';
import oldRingAbi from './abis/oldRing_abi.json';
import oldAmuletAbi from './abis/oldAmulet_abi.json';
import ugMigrationAbi from './abis/ugMigration_abi.json';
import oldGameTestAbi from './abis/oldGameTestnet_abi.json';
import oldNftTestnetAbi from './abis/oldNftTestnet_abi.json';


const { ethers } = require("ethers");

//const bloodAddress = '0x649A53b481031ff57367F672e07d0A488ad421d9';
const bloodAddress = process.env.REACT_APP_BLOOD_TESTNET_ADDRESS;
//const bloodAddress = process.env.REACT_APP_BLOOD_MAINNET_ADDRESS;
const ugNftAddress = process.env.REACT_APP__UGNFT_TESTNET_ADDRESS;
const ugArenaAddress = process.env.REACT_APP__UGARENA_TESTNET_ADDRES;
const ugGameAddress = process.env.REACT_APP_UGGAME_TESTNET_ADDRESS;
const ugRaidAddress = process.env.REACT_APP_UGRAID_TESTNET_ADDRESS;
const ugWeaponsAddress = process.env.REACT_APP_UGWEAPONS_TESTNET_ADDRESS;
const ugMigrationAddress = process.env.REACT_APP_UGMIGRATION_TESTNET_ADDRESS ;

//const oldNftAddress = process.env.REACT_APP_OLDNFT_MAINNET_ADDRESS;
const oldNftAddress = process.env.REACT_APP_OLDNFT_TESTNET_ADDRESS;
//const oldArenaAddress = process.env.REACT_APP_OLDARENA_MAINNET_ADDRESS;
//const oldGameAddress = process.env.REACT_APP_OLDGAME_MAINNET_ADDRESS;
const oldGameAddress = process.env.REACT_APP_OLDGAME_TESTNET_ADDRESS;
//const oldRingAddress = process.env.REACT_APP_OLDRING_MAINNET_ADDRESS;
//const oldAmuletAddress = process.env.REACT_APP_OLDAMULET_MAINNET_ADDRESS;

const oldRingAddress = process.env.REACT_APP_OLDRING_TESTNET_ADDRESS ;
const oldAmuletAddress = process.env.REACT_APP_OLDAMULET_TESTNET_ADDRESS ;
const oldArenaAddress = process.env.REACT_APP_OLDARENA_TESTNET_ADDRESS ;

const getEthers = () => {
    return new ethers.providers.Web3Provider(window.ethereum);
}
const getBlood = () => {
    return new ethers.Contract(bloodAddress, bloodAbi, getEthers());
}

const getUGNft = () => {
    return new ethers.Contract(ugNftAddress, ugNftAbi, getEthers());
}

const getUGArena = () => {
    return new ethers.Contract(ugArenaAddress, ugArenaAbi, getEthers());
}
const getUGGame = () => {
    return new ethers.Contract(ugGameAddress, ugGameAbi, getEthers());
}
//switch back to these after testing
// const getOldNft = () => {
//     return new ethers.Contract(oldNftAddress, oldNftAbi, getEthers());
// }
// const getOldGame = () => {
//     return new ethers.Contract(oldGameAddress, oldGameAbi, getEthers());
// }
const getOldArena = () => {
    return new ethers.Contract(oldArenaAddress, oldArenaAbi, getEthers());
}
const getUGWeapons= () => {
    return new ethers.Contract(ugWeaponsAddress, UGWeaponsAbi, getEthers());
}
const getUGMigration = () => {
    return new ethers.Contract(ugMigrationAddress, ugMigrationAbi, getEthers());
}
const getUGRaid = () => {
    return new ethers.Contract(ugRaidAddress, ugRaidAbi, getEthers());
}
const getOldRing = () => {
    return new ethers.Contract(oldRingAddress, oldRingAbi, getEthers());
}
const getOldAmulet = () => {
    return new ethers.Contract(oldAmuletAddress, oldAmuletAbi, getEthers());
}
//testversions
const getOldGame = () => {
    return new ethers.Contract(oldGameAddress, oldGameTestAbi, getEthers());
}

const getOldNft = () => {
    return new ethers.Contract(oldNftAddress, oldNftTestnetAbi, getEthers());
}


export {
    getEthers, 
    getBlood, 
    getUGNft, 
    getUGRaid, 
    getUGWeapons, 
    getOldArena, 
    getOldGame, 
    getOldNft, 
    getUGGame, 
    getUGArena,
    getOldRing,
    getOldAmulet,
    getUGMigration
};