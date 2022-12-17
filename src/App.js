import {useEffect, useState} from 'react';
import {Route, Router, Routes} from 'react-router-dom';
import Header from "./components/Header";
import Sidebar from './components/Sidebar';
import "./App.css";
import ProviderContext from './context/provider-context';
import {getEthers, getBlood, getOldArena, getOldNft, getUGArena, getUGNft, getOldRing, getOldAmulet} from './utils';
import {Container, Box, Stack, CssBaseline} from '@mui/material/';
import Home from './pages/Home';
import Arena from './pages/Arena';
import Raids from './pages/Raids';
import Weapons from './pages/Weapons';
import Migrate from './pages/Migrate';
import Mint from './pages/Mint';
import Forge from './pages/Forge';
import FightClubs from './pages/FightClubs'
import Sweat from './pages/Sweat'
import Wallet from './pages/Wallet'
import RaidStats from './pages/RaidStats'
import Market from './pages/Market'
import BloodGames from './pages/BloodGames'
import FighterGames from './pages/FighterGames'
import Merge from './pages/Merge'

import ArenaFix from './pages/ArenaFix';
import { DeepMerger } from '@apollo/client/utilities';

const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';


/* global BigInt */

function App() {
  const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [stakedFYIds, setStakedFYIds] = useState([]);
  const [ownedFYIds, setOwnedFYIds] = useState([]);
  const [stakedFYs, setStakedFYs] = useState([]);
  const [ownedFYs, setOwnedFYs] = useState([]);
  const [stakedV1FYIds, setStakedV1FYIds] = useState([]);
  const [ownedV1FYIds, setOwnedV1FYIds] = useState([]);
  const [v1RingIds, setV1RingIds] = useState([]);
  const [v1AmuletIds, setV1AmuletIds] = useState([]);
  const [activeRing, setActiveRing] = useState([]);
  const [activeAmulet, setActiveAmulet] = useState([]);
  const [ownedForgeIds, setOwnedForgeIds] = useState();
  
  const provider = getEthers();
  // get contracts
  const oldArenaContract = getOldArena();
  const oldNftContract = getOldNft();
  const oldRingContract = getOldRing();
  const oldAmuletContract = getOldAmulet();
  const ugArenaContract = getUGArena();
  const ugNftContract = getUGNft();
  const bloodContract = getBlood();

  const getUpdates = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const _balance = await bloodContract.balanceOf(accounts[0]);

    const _stakedIds = await ugArenaContract.getStakedFighterIDsForUser(accounts[0]);
    const stakedIds = _stakedIds.map(id => { return Number(id.toString()); });
    const _stakedFYs = await ugNftContract.getFighters(stakedIds);
    const stakedFYs = stakedIds.map((id, i) => {        
      let imageUrl = !_stakedFYs[i].isFighter ?  "yakuza/" : "fighter/";
      
      imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
      let fy = {id, imageUrl, ..._stakedFYs[i]};
      //console.log('fy',fy);
      return fy;
    })  
    
    setBalance(_balance);
    setStakedFYs(stakedFYs);
  }
  

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {

      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changed: ', accounts[0]);
        setAccounts(accounts);
        window.location.reload();
      })

      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        if(chainId !== '43114' || chainId !== '43113'){
          alert('Please Switch to Avalanche C-Chain Mainnet')
        }
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
    }
    else alert('MetaMask is not installed!');
    
    const init = async() => {         
         
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const stakedRing = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
      const stakedAmulet = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
      const v1StakedIds = await oldArenaContract.getStakedTokenIds(accounts[0]);
      const v1OwnedIds = await oldNftContract.walletOfOwner(accounts[0]);
      const v1RingIds = await oldRingContract.walletOfOwner(accounts[0]);
      const v1AmuletIds = await oldAmuletContract.walletOfOwner(accounts[0]);
      const _stakedIds = await ugArenaContract.getStakedFighterIDsForUser(accounts[0]);
      const _ownedIds = await ugNftContract.getNftIDsForUser(accounts[0], 1);
      //console.log('_ownedIds',_ownedIds.toString());
      const _ownedForgeIds = await ugNftContract.getNftIDsForUser(accounts[0], 4);
      const _balance = await bloodContract.balanceOf(accounts[0]);
      const ownedForgeIds = _ownedForgeIds?.map(id => { return Number(id.toString()); })
      
      const stakedIds = _stakedIds?.map(id => { return Number(id.toString()); })
      const ownedIds = _ownedIds?.map(id => { return Number(id.toString()); })
      const _stakedFYs = await ugNftContract.getFighters(stakedIds);
      const _ownedFYs = await ugNftContract.getFighters(ownedIds);      
      const ring = await ugNftContract.getRingAmulet(stakedRing);
      const amulet = await ugNftContract.getRingAmulet(stakedAmulet);

      const ownedFYs = ownedIds?.map((id, i) => {        
        let imageUrl = !_ownedFYs[i]?.isFighter ?  "yakuza/" : "fighter/";
        imageUrl = baseUrl.concat(imageUrl.concat(_ownedFYs[i]?.imageId).concat('.png'));
        let fy = {id, imageUrl, ..._ownedFYs[i]};
        return fy;
      })
      const stakedFYs = stakedIds?.map((id, i) => {        
        let imageUrl = !_stakedFYs[i]?.isFighter ?  "yakuza/" : "fighter/";
        
        imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i]?.imageId).concat('.png'));
        let fy = {id, imageUrl, ..._stakedFYs[i]};
        //console.log('fy',fy);
        return fy;
      })


      setBalance(Number(_balance));
      setAccounts(accounts[0]);    
      setStakedV1FYIds(v1StakedIds);    
      setOwnedV1FYIds(v1OwnedIds);   
      setV1RingIds(v1RingIds);
      setV1AmuletIds(v1AmuletIds);
      setOwnedFYIds(ownedIds);
      setStakedFYs(stakedFYs);
      setOwnedFYs(ownedFYs);
      setActiveAmulet(amulet);
      setActiveRing(ring);
      setOwnedForgeIds(ownedForgeIds);
      
    }
    init();

    const interval = setInterval(() => {
      getUpdates();
    }, 300000);
  return () => clearInterval(interval);  
    // eslint-disable-next-line
  }, []);
  
  return (
    <ProviderContext.Provider value={{
      provider: provider,
      accounts: accounts,
      stakedFYIds: stakedFYIds,
      ownedFYIds: ownedFYIds,
      stakedFYs: stakedFYs,
      ownedFYs: ownedFYs,
      stakedV1FYIds: stakedV1FYIds,
      ownedV1FYIds: ownedV1FYIds,
      v1RingIds: v1RingIds,
      v1AmuletIds: v1AmuletIds,
      stakedRing: activeRing,
      stakedAmulet: activeAmulet,
      balance: balance,
      ownedForgeIds: ownedForgeIds
    }}>
      <div className=" bg-img" style={{height: {xs: '155vh', sm: '130vh', md: '100vh'}}}>
        <Stack spacing={6} >
          <Header/>          
          <Box sx={{ my: 0 }} ></Box>
          <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} sx={{justifyContent: 'center'}}spacing={2} >            
            <Sidebar />            
            <Container >
              <Routes>
                <Route path="/">
                  <Route index element={<Arena />}/>
                  <Route path="market/*" element={<Market account={accounts}/>}/>
                  <Route path="mint" element={<Mint />}/>
                  <Route path="arena" element={<Arena />}/>
                  <Route path="raids" element={<Raids />} />
                  <Route path="weapons" element={<Weapons />} />
                  <Route path="forge" element={<Forge />}/>
                  <Route path="fightclubs" element={<FightClubs />}/>
                  <Route path="sweat" element={<Sweat />}/>
                  <Route path="merge" element={<Merge />}/>
                  <Route path="wallet" element={<Wallet />}/>
                  <Route path="raidStats" element={<RaidStats />}/>
                  <Route path="bloodGames" element={<BloodGames />}/>
                  <Route path="fighterGames" element={<FighterGames />}/>
                  <Route path="migrate" element={<Migrate />}/>
                  <Route path="v2fix" element={<ArenaFix />}/>
                </Route>               
              </Routes>
            </Container>
         
          </Stack>
        </Stack>
      
       
      </div>
      </ProviderContext.Provider>
  );
}

export default App;