import {Stack, Button, Box, Container, Typography} from '@mui/material/';
import {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context';
import {getOldGame, getUGMigration2, getEthers, getOldNft} from '../utils.js';
/* global BigInt */


import '../components/migrateButtons.css';

const { ethers } = require("ethers");

const MigrateButtons = () => {
    const prv = useContext(ProviderContext);
    const stakedV1Ids = prv.stakedV1FYIds;
    const ownedV1Ids = prv.ownedV1FYIds;
    const oldRingIds = prv.v1RingIds;
    const oldAmuletIds = prv.v1AmuletIds;
    const ugMigrationContract = getUGMigration2();

    const walletFighterHandler = async () => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = ownedV1Ids?.map(id => { return Number(id.toString()); })
      if(ids.length > 40) {
        const slicedArray = ids.slice(0, 40);
        await signedContract.functions.migrateFighters(slicedArray) ;
        if(ids.length > 80) {
          const slicedArray = ids.slice(40, 80);
          await signedContract.functions.migrateFighters(slicedArray) ;
          } else {
            const slicedArray = ids.slice(40, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
        if(ids.length > 120) {
          const slicedArray = ids.slice(80, 120);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 80 && ids.length <= 120){
          const slicedArray = ids.slice(80, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 160) {
          const slicedArray = ids.slice(120, 160);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 120 && ids.length <= 160){
          const slicedArray = ids.slice(120, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 200) {
          const slicedArray = ids.slice(160, 200);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 160 && ids.length <= 200){
          const slicedArray = ids.slice(160, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 240) {
          const slicedArray = ids.slice(200, 240);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 200 && ids.length <= 240){
          const slicedArray = ids.slice(200, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 280) {
          const slicedArray = ids.slice(240, 280);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 240 && ids.length <= 280){
          const slicedArray = ids.slice(240, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 320) {
          const slicedArray = ids.slice(280, 320);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 280 && ids.length <= 320){
          const slicedArray = ids.slice(280, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 360) {
          const slicedArray = ids.slice(320, 360);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 320 && ids.length <= 360){
          const slicedArray = ids.slice(320, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
          return;
        }
      await signedContract.functions.migrateFighters(ids) ;
    }

    const stakedFighterHandler = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = stakedV1Ids?.map(id => { return Number(id.toString()); })
      
      if(ids.length > 30) {
        const slicedArray = ids.slice(0, 30);
        await signedContract.functions.migrateFighters(slicedArray) ;
        if(ids.length > 60) {
          const slicedArray = ids.slice(30, 60);
          await signedContract.functions.migrateFighters(slicedArray) ;
          } else {
            const slicedArray = ids.slice(30, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 90) {
            const slicedArray = ids.slice(60, 90);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length <= 90 && ids.length > 60){
            const slicedArray = ids.slice(60, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 120) {
            const slicedArray = ids.slice(90, 120);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 90 && ids.length <= 120){
            const slicedArray = ids.slice(90, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 150) {
            const slicedArray = ids.slice(120, 150);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 120 && ids.length <= 150){
            const slicedArray = ids.slice(120, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 180) {
            const slicedArray = ids.slice(150, 180);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 150 && ids.length <= 180){
            const slicedArray = ids.slice(150, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 210) {
            const slicedArray = ids.slice(180, 210);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 180 && ids.length <= 210){
            const slicedArray = ids.slice(180, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 240) {
            const slicedArray = ids.slice(210, 240);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 210 && ids.length <= 240){
            const slicedArray = ids.slice(210, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 270) {
            const slicedArray = ids.slice(240, 270);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 240 && ids.length <= 270){
            const slicedArray = ids.slice(240, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 300) {
            const slicedArray = ids.slice(270, 300);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 270 && ids.length <= 300){
            const slicedArray = ids.slice(270, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
        return;
      }
      await signedContract.functions.migrateFighters(ids) ;
    }

    const walletFighterHandler2 = async () => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = ownedV1Ids?.map(id => { return Number(id.toString()); })
      if(ids.length > 40) {
        
        if(ids.length > 80) {
        const slicedArray = ids.slice(40, 80);
        await signedContract.functions.migrateFighters(slicedArray) ;
        } else {
          const slicedArray = ids.slice(40, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 120) {
          const slicedArray = ids.slice(80, 120);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 80 && ids.length <= 120){
          const slicedArray = ids.slice(80, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 160) {
          const slicedArray = ids.slice(120, 160);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 120 && ids.length <= 160){
          const slicedArray = ids.slice(120, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 200) {
          const slicedArray = ids.slice(160, 200);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 160 && ids.length <= 200){
          const slicedArray = ids.slice(160, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 240) {
          const slicedArray = ids.slice(200, 240);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 200 && ids.length <= 240){
          const slicedArray = ids.slice(200, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 280) {
          const slicedArray = ids.slice(240, 280);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 240 && ids.length <= 280){
          const slicedArray = ids.slice(240, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 320) {
          const slicedArray = ids.slice(280, 320);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 280 && ids.length <= 320){
          const slicedArray = ids.slice(280, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 360) {
          const slicedArray = ids.slice(320, 360);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
         if(ids.length > 320 && ids.length <= 360){
          const slicedArray = ids.slice(320, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        return;
      }
      await signedContract.functions.migrateFighters(ids) ;
    }

    const stakedFighterHandler2 = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = stakedV1Ids?.map(id => { return Number(id.toString()); })
      if(ids.length > 30) {
       
        if(ids.length > 60) {
        
        } else {
          const slicedArray = ids.slice(30, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 90) {
          const slicedArray = ids.slice(60, 90);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length <= 90 && ids.length > 60){
          const slicedArray = ids.slice(60, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 120) {
          const slicedArray = ids.slice(90, 120);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 90 && ids.length <= 120){
          const slicedArray = ids.slice(90, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 150) {
          const slicedArray = ids.slice(120, 150);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 120 && ids.length <= 150){
          const slicedArray = ids.slice(120, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 180) {
          const slicedArray = ids.slice(150, 180);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 150 && ids.length <= 180){
          const slicedArray = ids.slice(150, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 210) {
          const slicedArray = ids.slice(180, 210);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 180 && ids.length <= 210){
          const slicedArray = ids.slice(180, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 240) {
          const slicedArray = ids.slice(210, 240);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 210 && ids.length <= 240){
          const slicedArray = ids.slice(210, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
       
        if(ids.length > 270) {
          const slicedArray = ids.slice(240, 270);
        await signedContract.functions.migrateFighters(slicedArray) ;
        }
        if(ids.length > 240 && ids.length <= 270){
          const slicedArray = ids.slice(240, ids.length);
          await signedContract.functions.migrateFighters(slicedArray) ;
        }
        return;
      }
      await signedContract.functions.migrateFighters(ids) ;
    }

   
    const oldRingHandler = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = oldRingIds.map(id => { return Number(id.toString()); })
      await signedContract.functions.migrateRingAmulet(ids, true) ;
    }
    const oldAmuletHandler = async() => {
      const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());
      const ids = oldAmuletIds.map(id => { return Number(id.toString()); })
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
       {!true && <Button variant="outlined" color="error"  sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={stakedFighterHandler}>Staked Fighters</Button>}
        <Button variant="outlined" color="error"  sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={walletFighterHandler}>Wallet Fighters</Button>
        <Button variant="outlined" color="error"  sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={oldRingHandler}>Rings</Button>
        <Button variant="outlined" color="error"  sx={{fontFamily: 'Alegreya Sans SC', border: 1, color:'yellow'}} onClick={oldAmuletHandler}>Amulets</Button>
      </Stack>
      
    </Box><Container>
    <Stack direction="row" spacing={2} pt={2}>
        </Stack></Container>
    </Container>
  )
}

export default MigrateButtons