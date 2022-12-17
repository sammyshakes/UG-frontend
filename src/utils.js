import bloodAbi from './abis/blood_abi.json';
import ugNftAbi from './abis/ugNft_abi.json';
import ugArenaAbi from './abis/ugArena_abi.json';
import ugGameAbi from './abis/ugGame_abi.json';
import ugRaidAbi from './abis/ugRaid_abi.json';
import oldNftAbi from './abis/oldNft_abi.json';
import oldArenaAbi from './abis/oldArena_abi.json';
import oldGameAbi from './abis/oldGame_abi.json';
import UGWeaponsAbi from './abis/ugWeapons_abi.json';
import oldRingAbi from './abis/oldRing_abi.json';
import oldAmuletAbi from './abis/oldAmulet_abi.json';
import ugMigrationAbi from './abis/ugMigration_abi.json';
import ugForgeSmithAbi from './abis/ugForgeSmith_abi.json';
import ugBloodFomoAbi from './abis/bloodFomo_abi.json';
import ugFighterFomoAbi from './abis/fighterFomo_abi.json';


import ugNft2Abi from './abis/ugNft2_abi.json';
import ugArena2Abi from './abis/ugArena2_abi.json';
import ugGame2Abi from './abis/ugGame2_abi.json';
import ugRaid2Abi from './abis/ugRaid2_abi.json';
import ugRaid3Abi from './abis/ugRaid3_abi.json';
import UGWeapons2Abi from './abis/ugWeapons2_abi.json';
import ugForgeSmith2Abi from './abis/ugForgeSmith2_abi.json';
import ugForgeSmith3Abi from './abis/ugForgeSmith3_abi.json';
import ugFYakuzaAbi from './abis/ugFYakuza_abi.json';
import ugRaidEntryAbi from './abis/raidEntry_abi.json';
import ugMigration2Abi from './abis/ugMigration2_abi.json';
import ugRaidEntry2Abi from './abis/raidEntry2_abi.json';
import ugRaidEntry3Abi from './abis/raidEntry3_abi.json';
import ugGame3Abi from './abis/ugGame3_abi.json';
import ugGame4Abi from './abis/ugGame4_abi.json';
import ugMarketAbi from './abis/ugMarket_abi.json';
import mergeAbi from './abis/merge_abi.json';

const { ethers } = require("ethers");

 //v2 oops contracts mainnet
const ugNftAddress = process.env.REACT_APP__UGNFT_MAINNET_ADDRESS;
const ugArenaAddress = process.env.REACT_APP__UGARENA_MAINNET_ADDRESS;
const ugGameAddress = process.env.REACT_APP_UGGAME_MAINNET_ADDRESS;
const ugRaidAddress = process.env.REACT_APP_UGRAID_MAINNET_ADDRESS;
const ugWeaponsAddress = process.env.REACT_APP_UGWEAPONS_MAINNET_ADDRESS;
const ugForgeSmithAddress = process.env.REACT_APP_UGFORGESMITH_MAINNET_ADDRESS;

//v2 oops contracts testnet
// const ugNftAddress = process.env.REACT_APP__UGNFT_TESTNET_ADDRESS;
// const ugArenaAddress = process.env.REACT_APP__UGARENA_TESTNET_ADDRESS;
// const ugGameAddress = process.env.REACT_APP_UGGAME_TESTNET_ADDRESS;
// const ugRaidAddress = process.env.REACT_APP_UGRAID_TESTNET_ADDRESS;
// const ugRaid3Address = process.env.REACT_APP_UGRAID_TESTNET_ADDRESS;
// const ugWeaponsAddress = process.env.REACT_APP_UGWEAPONS_TESTNET_ADDRESS;
// const ugForgeSmithAddress = process.env.REACT_APP_UGFORGESMITH_TESTNET_ADDRESS;
// const ugMigrationAddress = process.env.REACT_APP_UGMIGRATION_TESTNET_ADDRESS ;
// const forgeMintAddress = process.env.REACT_APP_FORGEMINT_TESTNET_ADDRESS ;

//v2 contracts testnet
// const ugNft2Address = process.env.REACT_APP__UGNFT2_TESTNET_ADDRESS;
// const ugArena2Address = process.env.REACT_APP__UGARENA2_TESTNET_ADDRESS;
// const ugGame2Address = process.env.REACT_APP_UGGAME2_TESTNET_ADDRESS;
// const ugGame3Address = process.env.REACT_APP_UGGAME2_TESTNET_ADDRESS;
// const ugGame4Address = process.env.REACT_APP_UGGAME2_TESTNET_ADDRESS;
// const ugRaid2Address = process.env.REACT_APP_UGRAID2_TESTNET_ADDRESS;
// const ugWeapons2Address = process.env.REACT_APP_UGWEAPONS2_TESTNET_ADDRESS;
// const ugForgeSmith2Address = process.env.REACT_APP_UGFORGESMITH2_TESTNET_ADDRESS;
// const ugForgeSmith3Address = process.env.REACT_APP_UGFORGESMITH2_TESTNET_ADDRESS;
// const ugFYakuzaAddress = process.env.REACT_APP__UGFYAKUZA_TESTNET_ADDRESS;
// const raidEntryAddress = process.env.REACT_APP_RAIDENTRY_TESTNET_ADDRESS;
// const raidEntry2Address = process.env.REACT_APP_RAIDENTRY_TESTNET_ADDRESS;
// const ugMigration2Address = process.env.REACT_APP_UGMIGRATION2_TESTNET_ADDRESS ;
// const ugMarketAddress = process.env.REACT_APP_UGMARKET_TESTNET_ADDRESS;
// const ugBloodFomoAddress = process.env.REACT_APP_BLOODFOMO_TESTNET_ADDRESS;
// const ugFighterFomoAddress = process.env.REACT_APP_FIGHTERFOMO_TESTNET_ADDRESS;
// const mergeAddress = process.env.REACT_APP_MERGE_TESTNET_ADDRESS;

//v2 contracts mainnet
const ugFYakuzaAddress = process.env.REACT_APP__UGFYAKUZA_MAINNET_ADDRESS;
const ugNft2Address = process.env.REACT_APP__UGNFT2_MAINNET_ADDRESS;
const ugArena2Address = process.env.REACT_APP__UGARENA2_MAINNET_ADDRESS;
const ugGame2Address = process.env.REACT_APP_UGGAME2_MAINNET_ADDRESS;
const ugGame3Address = process.env.REACT_APP_UGGAME3_MAINNET_ADDRESS;
const ugGame4Address = process.env.REACT_APP_UGGAME4_MAINNET_ADDRESS;
const ugRaid2Address = process.env.REACT_APP_UGRAID2_MAINNET_ADDRESS;
const ugRaid3Address = process.env.REACT_APP_UGRAID3_MAINNET_ADDRESS;
const ugWeapons2Address = process.env.REACT_APP_UGWEAPONS2_MAINNET_ADDRESS;
const ugForgeSmith2Address = process.env.REACT_APP_UGFORGESMITH2_MAINNET_ADDRESS;
const ugForgeSmith3Address = process.env.REACT_APP_UGFORGESMITH3_MAINNET_ADDRESS;
const raidEntryAddress = process.env.REACT_APP_RAIDENTRY_MAINNET_ADDRESS;
const raidEntry2Address = process.env.REACT_APP_RAIDENTRY2_MAINNET_ADDRESS;
const raidEntry3Address = process.env.REACT_APP_RAIDENTRY3_MAINNET_ADDRESS;
const ugMigration2Address = process.env.REACT_APP_UGMIGRATION2_MAINNET_ADDRESS ;
const ugMarketAddress = process.env.REACT_APP_UGMARKET_MAINNET_ADDRESS;
const ugBloodFomoAddress = process.env.REACT_APP_BLOODFOMO_MAINNET_ADDRESS;
const ugFighterFomoAddress = process.env.REACT_APP_FIGHTERFOMO_MAINNET_ADDRESS;
const mergeAddress = process.env.REACT_APP_MERGE_MAINNET_ADDRESS;



//v1 contracts mainnet
const bloodAddress = process.env.REACT_APP_BLOOD_MAINNET_ADDRESS;
const oldNftAddress = process.env.REACT_APP_OLDNFT_MAINNET_ADDRESS;
const oldArenaAddress = process.env.REACT_APP_OLDARENA_MAINNET_ADDRESS;
const oldGameAddress = process.env.REACT_APP_OLDGAME_MAINNET_ADDRESS;
const oldRingAddress = process.env.REACT_APP_OLDRING_MAINNET_ADDRESS;
const oldAmuletAddress = process.env.REACT_APP_OLDAMULET_MAINNET_ADDRESS;

//v1 contracts testnet
// const bloodAddress = process.env.REACT_APP_BLOOD_TESTNET_ADDRESS;
// const oldGameAddress = process.env.REACT_APP_OLDGAME_TESTNET_ADDRESS;
// const oldNftAddress = process.env.REACT_APP_OLDNFT_TESTNET_ADDRESS;
// const oldRingAddress = process.env.REACT_APP_OLDRING_TESTNET_ADDRESS ;
// const oldAmuletAddress = process.env.REACT_APP_OLDAMULET_TESTNET_ADDRESS ;
// const oldArenaAddress = process.env.REACT_APP_OLDARENA_TESTNET_ADDRESS ;

const getEthers = () => {
    return new ethers.providers.Web3Provider(window.ethereum);
}
const getBlood = () => {
    return new ethers.Contract(bloodAddress, bloodAbi, getEthers());
}

const getUGFYakuza = () => {
    return new ethers.Contract(ugFYakuzaAddress, ugFYakuzaAbi, getEthers());
}

const getUGNft2 = () => {
    return new ethers.Contract(ugNft2Address, ugNft2Abi, getEthers());
}

const getUGArena2 = () => {
    return new ethers.Contract(ugArena2Address, ugArena2Abi, getEthers());
}
const getUGGame2 = () => {
    return new ethers.Contract(ugGame2Address, ugGame2Abi, getEthers());
}

const getUGGame3 = () => {
    return new ethers.Contract(ugGame3Address, ugGame3Abi, getEthers());
}

const getUGGame4 = () => {
    return new ethers.Contract(ugGame4Address, ugGame4Abi, getEthers());
}

const getRaidEntry2 = () => {
    return new ethers.Contract(raidEntry2Address, ugRaidEntry2Abi, getEthers());
}

const getRaidEntry3 = () => {
    return new ethers.Contract(raidEntry3Address, ugRaidEntry3Abi, getEthers());
}

const getUGWeapons2 = () => {
    return new ethers.Contract(ugWeapons2Address, UGWeapons2Abi, getEthers());
}

const getUGRaid2 = () => {
    return new ethers.Contract(ugRaid2Address, ugRaid2Abi, getEthers());
}
const getUGRaid3 = () => {
    return new ethers.Contract(ugRaid3Address, ugRaid3Abi, getEthers());
}
const getRaidEntry = () => {
    return new ethers.Contract(raidEntryAddress, ugRaidEntryAbi, getEthers());
}

const getUGForgeSmith2 = () => {
    return new ethers.Contract(ugForgeSmith2Address, ugForgeSmith2Abi, getEthers());
}

const getUGForgeSmith3 = () => {
    return new ethers.Contract(ugForgeSmith3Address, ugForgeSmith3Abi, getEthers());
}
const getUGMigration2 = () => {
    return new ethers.Contract(ugMigration2Address, ugMigration2Abi, getEthers());
}
const getUGMarket = () => {
    return new ethers.Contract(ugMarketAddress, ugMarketAbi, getEthers());
}

const getBloodFomo = () => {
    return new ethers.Contract(ugBloodFomoAddress, ugBloodFomoAbi, getEthers());
}

const getFighterFomo = () => {
    return new ethers.Contract(ugFighterFomoAddress, ugFighterFomoAbi, getEthers());
}

const getMerge = () => {
    return new ethers.Contract(mergeAddress, mergeAbi, getEthers());
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

const getOldNft = () => {
    return new ethers.Contract(oldNftAddress, oldNftAbi, getEthers());
}
const getOldGame = () => {
    return new ethers.Contract(oldGameAddress, oldGameAbi, getEthers());
}
const getOldArena = () => {
    return new ethers.Contract(oldArenaAddress, oldArenaAbi, getEthers());
}
const getUGWeapons = () => {
    return new ethers.Contract(ugWeaponsAddress, UGWeaponsAbi, getEthers());
}
// const getUGMigration = () => {
//     return new ethers.Contract(ugMigrationAddress, ugMigrationAbi, getEthers());
// }
const getUGRaid = () => {
    return new ethers.Contract(ugRaidAddress, ugRaidAbi, getEthers());
}
const getOldRing = () => {
    return new ethers.Contract(oldRingAddress, oldRingAbi, getEthers());
}
const getOldAmulet = () => {
    return new ethers.Contract(oldAmuletAddress, oldAmuletAbi, getEthers());
}
const getUGForgeSmith = () => {
    return new ethers.Contract(ugForgeSmithAddress, ugForgeSmithAbi, getEthers());
}



export {
    getEthers, 
    getBlood, 
    getUGFYakuza,
    getUGNft2, 
    getUGRaid2, 
    getUGRaid3, 
    getUGWeapons2,      
    getUGGame2, 
    getUGGame3, 
    getUGGame4, 
    getUGArena2,    
    getUGForgeSmith2,
    getUGForgeSmith3,
    getRaidEntry,
    getRaidEntry2,
    getRaidEntry3,
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
    //getUGMigration,
    getUGMigration2,
    getUGForgeSmith,
    getUGMarket,
    getBloodFomo,
    getFighterFomo,
    getMerge
};