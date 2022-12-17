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

const AmuletWidget2Fix = () => {
    const prv = useContext(ProviderContext);
    const [amulet, setAmulet] = useState({});
    const [amuletId, setAmuletId] = useState(undefined);
    const[isApproved, setIsApproved] = useState(false);
    const [error, setError] = useState();
    const baseUrl = 'https://the-u.club/reveal/amulet/amulet_v2.png';
    const ugNftContract = getUGNft();
    const ugMigration2Contract = getUGMigration2();


    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const approved = await ugNftContract.isApprovedForAll(accounts[0], ugMigration2Contract.address);
      setIsApproved(approved);
    }

    const v2fixHandler = async() => {
      if(Number(amulet?.level) < 1){
        setError({
            title: 'No V2 Amulets To Fix',
            message: 'Either already fixed or still need to unstake..',
        });
        return;
      }
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.migrateV2RingAmulet(amuletId, false) ;
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
      
      const init = async() => {   
        getUpdates();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  
        const ownedAmuletId = await ugNftContract.getNftIDsForUser(accounts[0], 3);
        let amulet;
        if(ownedAmuletId.length > 0) amulet = await ugNftContract.getRingAmulet(ownedAmuletId[0]);
        setAmulet(amulet);   
        setAmuletId(Number(ownedAmuletId[0]));
       
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
          alt="Amulet"
          loading="lazy"
        />
        <CardContent  align="center"  sx={{p:1, color: 'gold'}}>
            <Typography gutterBottom variant="button" component="div" sx={{fontFamily: 'Alegreya Sans SC', height:10, fontSize:'1rem', backgroundColor: 'black'}}>
                {` ${amulet?.level > 0 ?  "Amulet Level:" + amulet?.level.toString(): "No Amulet"}`}
            </Typography>
            <Typography gutterBottom variant="button" component="div" sx={{pt: 1, fontFamily: 'Alegreya Sans SC', height:10, fontSize:'.8rem', backgroundColor: 'black'}}>
                {` ${amulet?.level > 0 ?  "Leveled " + (Math.floor((Date.now()/1000 - amulet?.lastLevelUpgradeTime)/86400).toString()) + "+ Days Ago" : ""}`}
            </Typography>
        </CardContent>
        
      
    </Card>
    {(isApproved && amulet?.level > 0) &&  <Button variant="outlined" size="large" sx={{width: 50/100, backgroundColor: 'black', color: 'aqua'}} onClick={v2fixHandler} >V2 Fix </Button>}
    {!isApproved && <Button  variant="outlined"  sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
   
    </Stack>
   </div>
  )
}

export default AmuletWidget2Fix