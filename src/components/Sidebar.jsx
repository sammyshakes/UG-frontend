import {useContext, useEffect, useState} from 'react';
import { getBlood} from '../utils.js';
import ProviderContext from '../context/provider-context.js';
import {Box, Stack, Typography} from '@mui/material/'; 
import './sidebar.css'; 
import {NavLink} from 'react-router-dom';

const Sidebar = () => {
  const prv = useContext(ProviderContext);
  const [balance, setBalance] = useState();
  const bloodContract = getBlood();

  const getBloodBalance = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });    
        const bloodBalance = await bloodContract.balanceOf(accounts[0]);
        setBalance(bloodBalance/(10**18));
        console.log('blood1',bloodBalance/(10**18));
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
    <Box className="sidebar-bordr" sx={{m:4, p:2, maxHeight: 320,  color: 'yellow'}}>
        <Stack direction= {{sm: "row", md: "column"}} justifyContent={"space-evenly"} align-items="center"  spacing={2}>       
            <NavLink  to ='fightclub/' style={{textDecoration: "none", color: 'aqua'}}>Fighters</NavLink > 
            <NavLink  to ='arena' style={{textDecoration: "none", color: 'aqua'}}>Arena</NavLink >
            <NavLink  to ='raids' style={{textDecoration: "none", color: 'aqua'}}>Raids</NavLink >       
            <NavLink  to ='forge' style={{textDecoration: "none", color: 'aqua'}}>Forge</NavLink >
            <NavLink  to ='raids' style={{textDecoration: "none", color: 'aqua'}}>FightClubs</NavLink >
            <NavLink  to ='migrate' style={{textDecoration: "none", color: 'aqua'}}>Migrate</NavLink > 
            <Stack sx={{color: 'red', pb: 1,borderRadius: 5}}><span >BLOOD:</span>
            <span>{Math.floor(balance)}</span></Stack>       
        </Stack>
    </Box>
    
    </ProviderContext.Provider>
  )
}

export default Sidebar

