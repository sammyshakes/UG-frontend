import React, {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import WeaponStashCard from './WeaponStashCard';
import {Box, Container, Stack, ButtonGroup, Typography, ImageList, ImageListItem} from '@mui/material';
import './stakedForgeList.css';
import ErrorModal from './ui/ErrorModal';
import { getUGForgeSmith2, getUGWeapons2} from '../utils.js';

export default function WeaponStash() {
    const prv = useContext(ProviderContext);       
    const [error, setError] = useState();
    const [weaponIds, setWeaponIds] = useState([]);
    const [weaponBals, setWeaponBals] = useState([]);
    const ugForgeSmithContract = getUGForgeSmith2();
    const ugWeaponsContract = getUGWeapons2();

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //get all ids   
      const weaponIds = [...Array(30).keys()].map( x => ++x);

      const addyArray = weaponIds.map((id, i ) => {
        return accounts[0];
      })
  
      console.log(weaponIds);    
      console.log(addyArray);

      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, weaponIds);
      const balances = _balances?.map(id => { return Number(id); })
      setWeaponBals(balances);
      setWeaponIds(weaponIds);

      console.log('b',balances);
     
    }

    const getWeaponBalancess = async() => {
             
          
    }
   

    useEffect(() => {   
        const init = async() => {   
          getUpdates();
          
          const timer = setInterval(() => {
            getUpdates();
            
          }, 5000);
     
          return () => {
            clearInterval(timer);
          };
        }
        init();
        // eslint-disable-next-line
      }, []);
    
  return (
    <Stack >      
      <Box className="staked-bordr" maxWidth={{sm: 450, md: 450}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Weapon Stash
        </Typography>
        
        <ImageList sx={{p:1, maxWidth: 400, maxHeight: 750}} cols={1} rowHeight={340}  >
          {weaponBals?.map((balance, i) => (
            balance > 0 && <ImageListItem key={weaponIds[i]}  >
              <WeaponStashCard 
                id={weaponIds[i]}
                balance={weaponBals[i]}               
              />
         
            </ImageListItem>
          ))}
     
      </ImageList>
      
   
    </Box>
  </Stack>
  );
}

