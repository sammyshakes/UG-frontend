import {Button, Stack, Typography, Box} from '@mui/material';
import './v1RingWidget.css'
import './ringCard.css'
import ringImage from '../assets/images/ring_500.png';
import React, {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context';
import {getUGNft2, getUGArena2, getUGArena3, getUGMarket} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
import ListSingleModal from './ListSingleModal';

const RingCard = (props) => {
    const prv = useContext(ProviderContext);
    const [ring, setRing] = useState();
    const [isApprovedStaking, setIsApprovedStaking] = useState(false);    
    const [isApprovedMarket, setIsApprovedMarket] = useState(false);
    const [error, setError] = useState();
    const ugArenaContract = getUGArena3();
    const ugNftContract = getUGNft2();
    const ugMarketContract = getUGMarket();


    const getUpdates = async() => {      
      const ring = await ugNftContract.getRingAmulet(props.id);
      setRing(ring);   

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const approvedStaking = await ugNftContract.isApprovedForAll(accounts[0], ugArenaContract.address);
      const approvedMarket = await ugNftContract.isApprovedForAll(accounts[0], ugMarketContract.address);
      setIsApprovedStaking(approvedStaking);
      setIsApprovedMarket(approvedMarket);
    }

    const stakeHandler = async() => {
      if(ugArenaContract.paused === true){
        setError({
            title: 'Staking Not Live',
            message: 'Maybe Try Again Later.',
        });
        return;
    }
    if(Number(ring?.level) < 1){
      setError({
          title: 'No Rings To Stake',
          message: '',
      });
      return;
  }
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.stakeRing(props.id) ;
    }

    const listHandler = async(price) => {
      if(Number(price) < 1){
        setError({
            title: 'must enter Listing Price',
            message: '',
        });
        return;
    }
      const signedContract =  ugMarketContract.connect(prv.provider.getSigner());
      await signedContract.functions.addListings(ugNftContract.address, [props.id], [1], [price] );
    }
     

    const approveHandler = async() => {
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugArenaContract.address, true) ;      
      return;  
    }

    const approveMarketHandler = async() => {
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMarketContract.address, true) ;      
      return;  
    }

    const errorHandler = () => {
      setError(null);
    }

    useEffect(() => {   
      
      const init = async() => {   
        getUpdates();
       
          const timer = setInterval(() => {
            getUpdates();
            
          }, 15000);
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
   
    
    <Box height={110}  >
      <Stack direction = "row" className="ring-bx"> 
        <img src={ringImage} alt="ring"  className="ring-crd" />   
      <Stack align="center" sx={{}}>
      
          <Typography  variant="button" component="div" sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', backgroundColor: 'none', color:'red'}}>
              {` ${ring?.level > 0 ?  "Ring Level:" + ring?.level.toString(): "No Ring"}`}
          </Typography>
          <Typography  variant="button" component="div" sx={{pt: 1, fontFamily: 'Alegreya Sans SC', fontSize:'.7rem', backgroundColor: 'none', color:'gold'}}>
              {` ${ring?.level > 0 ?  "Leveled " + (Math.floor((Date.now()/1000 - ring?.lastLevelUpgradeTime)/86400).toString()) + "+ Days Ago" : ""}`}
          </Typography>        
        {(isApprovedStaking && ring?.level > 0) &&  <Button variant="text"  size="small" sx={{  color: 'red'}} onClick={stakeHandler} >Stake </Button>}
        {!isApprovedStaking && <Button  variant="text"  size="small" sx={{ color: 'red'}} onClick={approveHandler} >Approve Staking</Button>}
        {false && (isApprovedMarket && ring?.level > 0) &&  <Button variant="text" size="small" sx={{  color: 'red'}} onClick={listHandler} >List </Button>}
        {(isApprovedMarket && ring?.level > 0) &&  <ListSingleModal tokenAddress={ugNftContract.address} id={props.id} onList={listHandler}/>}
        {!isApprovedMarket && <Button  variant="text" size="small" sx={{ color: 'red'}} onClick={approveMarketHandler} >Approve Market</Button>}        
        
      </Stack>
    
    </Stack>
    </Box>
    </div>
   
  )
}

export default RingCard