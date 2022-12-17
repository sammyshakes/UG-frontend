import {Button, Stack, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import './v1RingWidget.css'
import React, {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context';
import {getUGNft, getUGMigration2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
/* global BigInt */

const RingWidgetv2Fix = () => {
    const prv = useContext(ProviderContext);
    const [ring, setRing] = useState();
    const [ringId, setRingId] = useState(undefined);
    const[isApproved, setIsApproved] = useState(false);
    const [error, setError] = useState();
    const baseUrl = 'https://the-u.club/reveal/ring/ring_v2.png';
    const ugNftContract = getUGNft();
    const ugMigration2Contract = getUGMigration2();


    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const approved = await ugNftContract.isApprovedForAll(accounts[0], ugMigration2Contract.address);      
      const ownedRingId = await ugNftContract.getNftIDsForUser(accounts[0], 2);
      let ring;
      if(ownedRingId?.length > 0) ring = await ugNftContract.getRingAmulet(ownedRingId[0]);      
        
      setRing(ring);   
      setRingId(Number(ownedRingId[0]));
      setIsApproved(approved);
    }

    const v2FixHandler = async() => {
      if(Number(ring?.level) < 1){
        setError({
            title: 'No V2 Rings To Fix',
            message: 'Either already fixed or still need to unstake..',
        });
        return;
    }
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.migrateV2RingAmulet(ringId, true) ;
    }
     

    const approveHandler = async() => {
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMigration2Contract.address, true) ;      
      return;  
    }

    const errorHandler = () => {
      setError(null);
    }

    useEffect(() => {   
      getUpdates();
      const init = async() => {   
        
       
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
   <Stack sx={{justifyContent:"flex-start", alignItems:"center"}}>
    <Card raised= {true} className="ring-bordr" sx={{ m:4, borderRadius:10, width: 100 , height: 220, backgroundColor: 'black'}}>
       
        <CardMedia
          component="img"
          height="150"
          image={baseUrl}
          alt="Ring"
          loading="lazy"
        />
        <CardContent  align="center"  sx={{p:1, color: 'gold'}}>
            <Typography gutterBottom variant="button" component="div" sx={{fontFamily: 'Alegreya Sans SC', height:10, fontSize:'1rem', backgroundColor: 'black'}}>
                {` ${ring?.level > 0  ?  "Ring Level:" + ring?.level.toString(): "No Ring"}`}
            </Typography>
            <Typography gutterBottom variant="button" component="div" sx={{pt: 1, fontFamily: 'Alegreya Sans SC', height:10, fontSize:'.8rem', backgroundColor: 'black'}}>
                {` ${ring?.level > 0  ?  "Leveled " + (Math.floor((Date.now()/1000 - ring?.lastLevelUpgradeTime)/86400).toString()) + "+ Days Ago" : ""}`}
            </Typography>
        </CardContent>
        
      
    </Card>
    {(isApproved && ring?.level > 0) &&  <Button variant="outlined" size="large" sx={{width: 50/100, backgroundColor: 'black', color: 'aqua'}} onClick={v2FixHandler} >V2 Fix </Button>}
    {!isApproved && <Button  variant="outlined"  sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
   
    </Stack>
    </div>
   
  )
}

export default RingWidgetv2Fix