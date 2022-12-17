import React, {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import OwnedForgeCard from './OwnedForgeCard';
import {Box, Button, Stack, ButtonGroup, Typography, ImageList, ImageListItem} from '@mui/material';
import './stakedForgeList.css';
import ErrorModal from './ui/ErrorModal';
import {getUGNft2, getUGForgeSmith3, getUGMarket} from '../utils.js';
import ListSingleModal from './ListSingleFclubModal';
import TransferUGNft from './TransferUGNfts'

export default function OwnedForgeList() {
    const prv = useContext(ProviderContext);    
    const [fclubs, setFclubs] = useState([]);
    const [isApproved, setIsApproved] = useState();
    const [isApprovedMarket, setIsApprovedMarket] = useState(false);
    const [selectedForges, setSelectedForges] = useState([]);
    const [ownedForgeIds, setOwnedForgeIds] = useState([]);
    const [ownedForges, setOwnedForges] = useState([]);    
    const [error, setError] = useState();
    const ugForgeSmithContract = getUGForgeSmith3();
    const ugNftContract = getUGNft2();
    const ugMarketContract = getUGMarket();

    const listHandler = async(price) => {
      if(selectedForges.length > 1){
        setError({
          title: 'Please Select only one Forge',
          message: '',
        });
        return;
        }
      if(Number(price) < 1){
        setError({
            title: 'must enter Listing Price',
            message: '',
        });
        return;
    }
      const signedContract =  ugMarketContract.connect(prv.provider.getSigner());
      await signedContract.functions.addListings(ugNftContract.address, selectedForges, [1], [price] );
      
      setSelectedForges([]);
    }

    
    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedForges([]);
    }


    const selectedForgeHandler = (selectedId, clicked) => {
      //first recreate list without them, then add if we need to
      setSelectedForges((prevState) => {
        return prevState.filter(id => id !== selectedId)
      });

      if(clicked){
        setSelectedForges((prevState) => {
          return [...prevState, selectedId];
        });
      }
    }

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forgeIds = await ugNftContract.getNftIDsForUser(accounts[0], 4);
      setOwnedForgeIds(forgeIds);
  
      const forges = await ugNftContract.getForgeFightClubs(forgeIds);
      setOwnedForges(forges);
  
      const approved = await ugNftContract.isApprovedForAll(accounts[0], ugForgeSmithContract.address);
      setIsApproved(approved);

      const approvedMarket = await ugNftContract.isApprovedForAll(accounts[0], ugMarketContract.address);
      setIsApprovedMarket(approvedMarket);
    }
  
    const approveHandler = async() => {   
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugForgeSmithContract.address, true) ;      
      return;      
    }

    const approveMarketHandler = async() => {   
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMarketContract.address, true) ;      
      return;      
    }

    const stakeHandler = async() => {
      if(selectedForges.length < 1){
        setError({
          title: 'Must SELECT at least 1 Forge',
          message: 'Have another go..',
        });
        return;
      } 
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.stakeForges(selectedForges) ;
      //reset selected FYs array
      setSelectedForges([]);      
    }
  
    const stakeAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forgeIds = await ugNftContract.getNftIDsForUser(accounts[0],4);
      if(forgeIds.length < 1){
      setError({
        title: 'No Forges to Stake',
        message: '',
      });
      return;
      } 
      console.log(ugForgeSmithContract);
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.stakeForges(forgeIds) ;
      
      return;
      
    }

    const claimWeaponAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const _forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
      if(_forgeIds.length < 1){
        setError({
          title: 'No Forges to claim',
          message: 'Stake a Forge to mint Weapons.',
        });
        return;
      } 
      const forgeIds = _forgeIds?.map(id => { return Number(id.toString()); })
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimAllStakingRewards(accounts[0]) ;
      setSelectedForges([]);      
    }  
  
    const unstakeAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
      if(forgeIds.length < 1){
        setError({
          title: 'No Forges to unstake',
          message: '',
        });
        return;
      } 
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.unstakeForges(forgeIds) ;
      setSelectedForges([]);      
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
    <Stack >      
      <Box className="forge-bordr" maxWidth={800} sx={{my: 4, p: 1 }}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Wallet Forges
        </Typography>
        
        <ImageList sx={{p:1, maxWidth: 800, maxHeight: 600}} cols={2} rowHeight={200}  >
          {ownedForges?.map((forge) => (
            <ImageListItem key={forge.id}  >
              <OwnedForgeCard key={forge.id} 
                id={forge.id}
                level={forge.level}
                size={forge.size}
                lastLevelTime={forge.lastLevelUpgradeTime}
                lastUnstakeTime={forge.lastUnstakeTime}
                onSelected={selectedForgeHandler}
              emptyArray={selectedForges.length > 0 ? false : true} 
              />
         
            </ImageListItem>
          ))}
     
      </ImageList>
      <Stack >
      
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup  color="error" sx={{ borderColor: 'red', border: 3  }}>
        
        {isApproved &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeAllHandler} >Stake All</Button>}
          {!isApproved &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
       
          {isApproved &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeHandler} >stake </Button>}
          {!isApprovedMarket &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveMarketHandler} >approve market </Button>}
          {isApprovedMarket &&  <ListSingleModal tokenAddress={ugNftContract.address} id={selectedForges[0]} onList={listHandler}/>}
        
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
      </Stack>
      <TransferUGNft ids={selectedForges}/>
    </Box>
  </Stack>
  </div>
  );
}

