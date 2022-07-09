import {useEffect, useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import Sidebar from './components/Sidebar';
import "./App.css";
import ProviderContext from './context/provider-context';
import {getEthers, getBlood, getOldArena, getOldNft, getUGArena, getUGNft, getOldRing, getOldAmulet} from './utils';
import {Container, Box, Stack} from '@mui/material/';
import Home from './pages/Home';
import Arena from './pages/Arena';
import Raids from './pages/Raids';
import Migrate from './pages/Migrate';
import Forge from './pages/Forge';

const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';

/* global BigInt */

function App() {
  const [provider, setProvider] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState('');
  const [stakedFYIds, setStakedFYIds] = useState([]);
  const [ownedFYIds, setOwnedFYIds] = useState([]);
  const [stakedFYs, setStakedFYs] = useState([]);
  const [ownedFYs, setOwnedFYs] = useState([]);
  const [stakedV1FYIds, setStakedV1FYIds] = useState([]);
  const [ownedV1FYIds, setOwnedV1FYIds] = useState([]);
  const [v1RingIds, setV1RingIds] = useState([]);
  const [v1AmuletIds, setV1AmuletIds] = useState([]);
  const [totalUserUnclaimedArena,  setTotalUserUnclaimedArena] = useState([]);
  const [activeRing, setActiveRing] = useState(undefined);
  const [activeAmulet, setActiveAmulet] = useState(undefined);
  const [isRingExpired, setIsRingExpired] = useState(undefined);
  const [isAmuletExpired, setIsAmuletExpired] = useState(undefined);
  

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
      // get contracts
      const bloodContract = getBlood();
      const oldArenaContract = getOldArena();
      const oldNftContract = getOldNft();
      const oldRingContract = getOldRing();
      const oldAmuletContract = getOldAmulet();
      const ugArenaContract = getUGArena();
      const ugNftContract = getUGNft();
      const provider = getEthers();
         
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const stakedRing = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
      const ring = await ugNftContract.functions.getRingAmulet(stakedRing);
      const stakedAmulet = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
      const amulet = await ugNftContract.functions.getRingAmulet(stakedAmulet);
      const userBloodBalance = await bloodContract.balanceOf(accounts[0]); 
      const v1StakedIds = await oldArenaContract.functions.getStakedTokenIds(accounts[0]);
      const v1OwnedIds = await oldNftContract.functions.walletOfOwner(accounts[0]);
      const v1RingIds = await oldRingContract.functions.walletOfOwner(accounts[0]);
      const v1AmuletIds = await oldAmuletContract.functions.walletOfOwner(accounts[0]);
      const _stakedIds = await ugArenaContract.functions.getStakedFighterIDsForUser(accounts[0]);
      const _ownedIds = await ugNftContract.functions.getFighterIDsForUser(accounts[0]);
      const stakedIds = _stakedIds[0]?.map(id => { return Number(id.toString()); })
      const ownedIds = _ownedIds[0]?.map(id => { return Number(id.toString()); })
      const _stakedFYs = await ugNftContract.functions.getFighters(stakedIds);
      const _ownedFYs = await ugNftContract.functions.getFighters(ownedIds);      
      const ttlUserUnclaimedArena = await ugArenaContract.functions.calculateAllStakingRewards(stakedIds);

      const ownedFYs = ownedIds?.map((id, i) => {        
        let imageUrl = !_ownedFYs[0][i].isFighter ?  "yakuza/" : "fighter/";
        imageUrl = baseUrl.concat(imageUrl.concat(_ownedFYs[0][i].imageId).concat('.png'));
        let fy = {id, imageUrl, ..._ownedFYs[0][i]};
        return fy;
      })
      const stakedFYs = stakedIds?.map((id, i) => {        
        let imageUrl = !_stakedFYs[0][i].isFighter ?  "yakuza/" : "fighter/";
        
        imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[0][i].imageId).concat('.png'));
        let fy = {id, imageUrl, ..._stakedFYs[0][i]};
        console.log('fy',fy);
        return fy;
      })


      setBalance(userBloodBalance);
      setAccounts(accounts);    
      setStakedV1FYIds(v1StakedIds);    
      setOwnedV1FYIds(v1OwnedIds);   
      setProvider(provider);
      setV1RingIds(v1RingIds);
      setV1AmuletIds(v1AmuletIds);
      setStakedFYIds(stakedIds);
      setOwnedFYIds(ownedIds);
      setStakedFYs(stakedFYs);
      setOwnedFYs(ownedFYs);
      setTotalUserUnclaimedArena(ttlUserUnclaimedArena);
      setActiveAmulet(amulet);
      setActiveRing(ring);
    }
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <ProviderContext.Provider value={{
      provider: provider,
      accounts: accounts,
      balance:  balance,
      totalUserUnclaimedArena: totalUserUnclaimedArena,
      stakedFYIds: stakedFYIds,
      ownedFYIds: ownedFYIds,
      stakedFYs: stakedFYs,
      ownedFYs: ownedFYs,
      stakedV1FYIds: stakedV1FYIds,
      ownedV1FYIds: ownedV1FYIds,
      v1RingIds: v1RingIds,
      v1AmuletIds: v1AmuletIds,
      stakedRing: activeRing,
      stakedAmulet: activeAmulet
    }}>
      <div className=" bg-img" >
        <Stack spacing={6}>
          <Header/>          
          <Box sx={{ my: 0 }} ></Box>
          <Stack direction="row" spacing={2} >        
            <Sidebar />
            <Container >
              <Routes>
                <Route path="/">
                  <Route index element={<Home />}/>
                  <Route path="arena" element={<Arena />}/>
                  <Route path="raids" element={<Raids />} />
                  <Route path="forge" element={<Forge />}/>
                  <Route path="migrate" element={<Migrate />}/>
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