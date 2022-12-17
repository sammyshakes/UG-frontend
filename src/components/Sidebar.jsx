import {useContext, useEffect, useState} from 'react';
import { getBlood, getUGWeapons2} from '../utils.js';
import ProviderContext from '../context/provider-context.js';
import {Box, Stack} from '@mui/material/'; 
import './sidebar.css'; 
import {NavLink} from 'react-router-dom';
import { ExternalLink } from 'react-external-link';

const Sidebar = () => {
  const prv = useContext(ProviderContext);
  const [balance, setBalance] = useState();
  const [sweatBalance, setSweatBalance] = useState();
  const bloodContract = getBlood();
  const ugWeaponsContract = getUGWeapons2();

  const getBloodBalance = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    if(accounts !== undefined){ 
        const bloodBalance = await bloodContract?.balanceOf(accounts[0]);
        const sweatBalance = await ugWeaponsContract?.balanceOf(accounts[0], 56); 
        setBalance(bloodBalance/(10**18));
        setSweatBalance(sweatBalance);
    }
  }

  useEffect(() => {     
    const init = async() => {  
      getBloodBalance();
      
      
      const timer = setInterval(() => {
        getBloodBalance();
        
      }, 30000);

      return () => {
        clearInterval(timer);
      };

    }
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <ProviderContext.Provider value={{       
      balance: balance
    }}>
    <Box className="sidebar-bordr" sx={{m:4, p:2, maxHeight: 810,  color: 'yellow'}}>
        <Stack direction= {{sm: "row", md: "column"}}  justifyContent={"space-evenly"} align-items="center"  spacing={2}>       
            <NavLink  to ='market' style={{textDecoration: "none", color: 'aqua'}}>Market</NavLink >
            <NavLink  to ='mint' style={{textDecoration: "none", color: 'aqua'}}>Mint</NavLink >
            <NavLink  to ='arena' style={{textDecoration: "none", color: 'aqua'}}>Arena</NavLink >
            <NavLink  to ='raids' style={{textDecoration: "none", color: 'aqua'}}>Raids</NavLink >  
            <NavLink  to ='weapons' style={{textDecoration: "none", color: 'aqua'}}>Weapons</NavLink >   
            <NavLink  to ='sweat' style={{textDecoration: "none", color: 'aqua'}}>Sweat</NavLink >  
            <NavLink  to ='forge' style={{textDecoration: "none", color: 'aqua'}}>Forge</NavLink >
            <NavLink  to ='fightclubs' style={{textDecoration: "none", color: 'aqua'}}>FightClubs</NavLink >
            <NavLink  to ='raidstats' style={{textDecoration: "none", color: 'aqua'}}>Raid Stats</NavLink >
            <NavLink  to ='merge' style={{textDecoration: "none", color: 'aqua'}}>Merge</NavLink >
            <NavLink  to ='wallet' style={{textDecoration: "none", color: 'aqua'}}>Wallet</NavLink >
            <NavLink  to ='bloodGames' style={{textDecoration: "none", color: 'aqua'}}>Blood Fomo</NavLink >
            <NavLink  to ='fighterGames' style={{textDecoration: "none", color: 'aqua'}}>Fighter Fomo</NavLink >
            <ExternalLink href="https://docs.theundergroundresurrection.club/" target="_blank" style={{textDecoration: "none", color: 'aqua'}}>Whitepaper</ExternalLink>
       
            <NavLink  to ='migrate' style={{textDecoration: "none", color: 'aqua'}}>Migrate V1</NavLink > 
            <NavLink  to ='v2fix' style={{textDecoration: "none", color: 'aqua'}}>Fix V2</NavLink >
            
            <Stack  direction= {{sm: "row", md: "column"}} spacing={1} className="sidebar-bordr shadw" p={1} sx={{backgroundColor:'black'}}>
              <Stack sx={{fontSize:'.8rem', color: 'red', pb: 1,borderRadius: 5}}>
                <span >Blood:</span>
                <span>{Math.floor(balance).toString()}</span>
              </Stack>   
              <Stack sx={{fontSize:'.8rem', color: 'deepskyblue', pb: 1,borderRadius: 5}}>
                <span >Sweat:</span>
                <span>{Math.floor(sweatBalance).toString()}</span>
              </Stack> 
            </Stack> 
          </Stack>
    </Box>
    
    </ProviderContext.Provider>
  )
}

export default Sidebar

