import React, {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import WeaponStashCard from './WeaponStashCard';
import {Box, Button, Stack, ButtonGroup, Typography, ImageList, ImageListItem} from '@mui/material';
import './stakedForgeList.css';
import ErrorModal from './ui/ErrorModal';
import WeaponListingModal from './WeaponListingModal';
import { getUGForgeSmith3, getUGWeapons2, getUGMarket} from '../utils.js';

export default function WeaponStash() {
    const prv = useContext(ProviderContext);       
    const [error, setError] = useState();
    const [isApprovedMarket, setIsApprovedMarket] = useState(false);
    const [listIds, setListIds] = useState([]);
    const [listingModalIsShown, setListingModalIsShown] = useState(false);
    const [weaponIds, setWeaponIds] = useState([]);
    const [selectedWeaponIds, setSelectedWeaponIds] = useState([]);
    const [weaponBals, setWeaponBals] = useState([]);
    const ugForgeSmithContract = getUGForgeSmith3();
    const ugWeaponsContract = getUGWeapons2();
    const ugMarketContract = getUGMarket();

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const approvedMarket = await ugWeaponsContract.isApprovedForAll(accounts[0], ugMarketContract.address);
      setIsApprovedMarket(approvedMarket);
      //get all ids   
      const weaponIds = [...Array(55).keys()].map( x => ++x);

      const addyArray = weaponIds.map(() => { return accounts[0]; })

      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, weaponIds);
      const balances = _balances?.map(id => { return Number(id); })
      
      setWeaponBals(balances);
      setWeaponIds(weaponIds);     
    }

    const approveMarketHandler = async() => {
      const signedContract =  ugWeaponsContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMarketContract.address, true) ;      
      return;  
    }  

    const listHandler = async() => {
      if(selectedWeaponIds.length < 1){
        setError({
          title: 'Please Select a Weapon',
          message: 'Unless your scared..',
        });
        return;
      }
      setListIds(selectedWeaponIds);
      setListingModalIsShown(true);
      //reset selected FYs array
      selectedWeaponIds([]);   

    }

    const hideListingModalHandler = () => {
      setListingModalIsShown(false);
    }

    const unEquipAllBrokenFromFighters = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const addyArray = selectedWeaponIds.map(() => {return accounts[0];})
      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, selectedWeaponIds);
      const balances = _balances?.map(bal => { return Math.floor(Number(bal)/2) * 2; })
      
        
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.unequipWeapons(selectedWeaponIds,balances ) ;
      setSelectedWeaponIds([]);  
    }
    

    const repairHandler = async() => {
      if(selectedWeaponIds.length === 0) {
        setError({
          title: 'nothing selected ',
          message: 'Please choose a broken weapon to repair.',
        });
        return;
      }  
      
      const amountArray = selectedWeaponIds.map(() => { return 2; })
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const addyArray = selectedWeaponIds?.map(() => {return accounts[0]; })  
      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, selectedWeaponIds);
      const checkValidIds = selectedWeaponIds?.filter(id =>  id < 31);
      if(checkValidIds.length > 0) {
        setError({
          title: 'Select only broken weapons ',
          message: 'You got this..',
        });
        return;
      }  
      const zeroCheck = _balances?.filter(bal =>  bal < 2);
      if(zeroCheck.length > 0) {
        setError({
          title: 'Need more Weapons ',
          message: 'Minimum of 2 weapons required to repair.',
        });
        return;
      }  
      
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.repairWeapons(selectedWeaponIds,amountArray ) ;
      setSelectedWeaponIds([]);  
    }

    const repairAllHandler = async() => {
      if(selectedWeaponIds.length === 0) {
        setError({
        title: 'nothing selected ',
        message: 'Please choose a broken weapon to repair.',
        });
        return;
    }  
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const addyArray = selectedWeaponIds?.map(() => {
        return accounts[0];
      })
      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, selectedWeaponIds);
      const balances = _balances?.map(bal => { return Math.floor(Number(bal)/2) * 2; })
      const checkValidIds = selectedWeaponIds?.filter(id =>  id < 31);
      if(checkValidIds.length > 0) {
        setError({
          title: 'Select only broken weapons ',
          message: 'You got this..',
        });
        return;
      } 
      const zeroCheck = _balances?.filter(bal =>  bal < 2);
      if(zeroCheck.length > 0) {
        setError({
          title: 'Need more Weapons ',
          message: 'Minimum of 2 weapons required to repair.',
        });
        return;
      }        
      
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.repairWeapons(selectedWeaponIds,balances ) ;
      setSelectedWeaponIds([]);        
    }

    const upgradeHandler = async() => {
      if(selectedWeaponIds.length === 0) {
        setError({
          title: 'nothing selected ',
          message: 'Please choose a weapon to upgrade.',
        });
        return;
      }  
      
      const amountArray = selectedWeaponIds.map(() => {return 2;})
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const addyArray = selectedWeaponIds.map(() => { return accounts[0]; })
      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, selectedWeaponIds);
      const checkValidIds = selectedWeaponIds?.filter(id =>  id > 30);
      if(checkValidIds.length > 0) {
        setError({
          title: 'Select only unbroken weapons ',
          message: 'You got this..',
        });
        return;
      } 
      const zeroCheck = _balances?.filter(bal =>  bal < 2);
      if(zeroCheck.length > 0) {
        setError({
          title: 'Need more Weapons ',
          message: 'Minimum of 2 weapons required to upgrade.',
        });
        return;
      }  
       
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.upgradeWeapons(selectedWeaponIds,amountArray ) ;
      setSelectedWeaponIds([]); 
      
    }
    const upgradeAllHandler = async() => {
      if(selectedWeaponIds.length === 0) {
        setError({
          title: 'nothing selected ',
          message: 'Please choose a weapon to upgrade.',
        });
        return;
      }  
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const addyArray = selectedWeaponIds.map(() => {return accounts[0];})
      const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, selectedWeaponIds);
      const balances = _balances?.map(bal => { return Math.floor(Number(bal)/2) * 2; })
      const checkValidIds = selectedWeaponIds?.filter(id =>  id > 30);
      if(checkValidIds.length > 0) {
        setError({
          title: 'Select only unbroken weapons ',
          message: 'You got this..',
        });
        return;
      } 
      const zeroCheck = _balances?.filter(bal =>  bal < 2);
      if(zeroCheck.length > 0) {
        setError({
          title: 'Need more Weapons ',
          message: 'Minimum of 2 weapons required to upgrade.',
        });
        return;
      }  
      
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.upgradeWeapons(selectedWeaponIds,balances ) ;
      setSelectedWeaponIds([]);  
    }

    const unselectHandler = () => {
      //reset selected FYs array
      setSelectedWeaponIds([]);
     }
 
 
     const selectedWeaponHandler = (selectedId, clicked) => {
       //first recreate list without them, then add if we need to
       setSelectedWeaponIds((prevState) => {        
         return prevState.filter(id => id !== selectedId)
       });
 
       if(clicked){
        setSelectedWeaponIds((prevState) => {
           return [...prevState, selectedId];
         });
       }

     }

     const errorHandler = () => {
      setError(null);
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
    <div>
        {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
        {listingModalIsShown && <WeaponListingModal 
          weaponIds={listIds}
          hideModal={hideListingModalHandler}
          tokenAddress={ugWeaponsContract.address}
          />}
    <Stack >      
      <Box className="staked-bordr" >
        <Typography variant="h5" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'cyan' }}>
           Repair/Upgrade Weapons
        </Typography>
        
        <ImageList sx={{p:1, width: 5/5, maxHeight:'82vh'}} gap={5} cols={2} rowHeight={340}  >
          {weaponBals?.map((balance, i) => (
            balance > 0 && <ImageListItem key={weaponIds[i]}  >
              <WeaponStashCard 
                id={weaponIds[i]}
                balance={weaponBals[i]}       
                onSelected={selectedWeaponHandler}
                emptyArray={selectedWeaponIds.length > 0 ? false : true}         
              />
         
            </ImageListItem>
          ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center', color: 'aqua' }}>
        <ButtonGroup  color="error" sx={{ borderColor: 'red', border: 3  }}>
          <Stack>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={repairHandler} >Repair </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={repairAllHandler} >Repair All </Button>
          </Stack>
          <Stack>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={upgradeHandler} >Upgrade</Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={upgradeAllHandler} >Upgrade All</Button>
          </Stack>
          {isApprovedMarket && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={listHandler} >List </Button>}
          {!isApprovedMarket && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveMarketHandler} >Approve Market </Button>}
         
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={unselectHandler} >Unselect</Button>
        </ButtonGroup>
      </Stack>
   
    </Box>
  </Stack>
  </div>
  );
}

