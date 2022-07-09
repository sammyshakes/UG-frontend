import {Stack, Button, Box, Container, Typography} from '@mui/material/';
import {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context';
import {getOldGame, getUGMigration, getEthers, getOldNft} from '../utils.js';
import BigNumber from "bignumber.js";
/* global BigInt */


import '../components/migrateButtons.css';

const { ethers } = require("ethers");

const MigrateButtons = () => {
    const prv = useContext(ProviderContext);
    const stakedV1Ids = prv.stakedV1FYIds;
    const ownedV1Ids = prv.ownedV1FYIds;
    const oldRingIds = prv.v1RingIds;
    const oldAmuletIds = prv.v1AmuletIds;
    const ugMigrationContract = getUGMigration();
    const provider = getEthers();
    const oldNftContract = getOldNft();

    const walletFighterHandler = async () => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = ownedV1Ids[0]?.map(id => { return Number(id.toString()); })

      console.log(ids);
      await signedContract.functions.migrateFighters(ids) ;
    }

    const stakedFighterHandler = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = stakedV1Ids[0]?.map(id => { return Number(id.toString()); })

      console.log(ids);
      await signedContract.functions.migrateFighters(ids) ;

    }
   
    const oldRingHandler = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = oldRingIds[0]?.map(id => { return Number(id.toString()); })
      await signedContract.functions.migrateRingAmulet(ids, true) ;
    }
    const oldAmuletHandler = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = oldAmuletIds[0]?.map(id => { return Number(id.toString()); })
      await signedContract.functions.migrateRingAmulet(ids, false) ;

    }

    useEffect(() => {
        const init = async () =>{
            
        };
        init();
    }, []);

  return (
    <Container className="migratebox-bordr" sx={{p:1, mt:5, height: 150, width: 460}}>
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt:2
      }}
    >
      <Typography variant="button" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.6rem',color:'yellow'}}>Migrate Your V1 Assets:</Typography>
     <Stack direction="row" spacing={2} >
        <Button variant="outlined" color="error" sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={stakedFighterHandler}>Staked Fighters</Button>
        <Button variant="outlined" color="error" sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={walletFighterHandler}>Wallet Fighters</Button>
        <Button variant="outlined" color="error" sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={oldRingHandler}>Rings</Button>
        <Button variant="outlined" color="error" sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={oldAmuletHandler}>Amulets</Button>
      </Stack>
    </Box>
    </Container>
  )
}

export default MigrateButtons