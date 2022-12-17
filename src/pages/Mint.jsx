import {React, useState, useEffect} from 'react'
import OwnedFightClubList from '../components/OwnedFightClubList';
import FightClubMintBox from '../components/FightClubMintBox';
import ForgeMintBox from '../components/ForgeMintBox';
import RingMintBox from '../components/RingMintBox';
import AmuletMintBox from '../components/AmuletMintBox';
import ForgeCard from '../components/ForgeCard';
import {Box, Typography, Stack, Container} from '@mui/material/';
import {getUGNft2} from '../utils.js';

const Mint = () => {
  const [numMinted, setNumMinted] = useState();
  const [numForgesMinted, setNumForgesMinted] = useState();
  const ugNftContract = getUGNft2();
  
  const getUpdates = async() => {
    const fightClubsMinted = await ugNftContract.ttlFightClubs(); 
    setNumMinted(fightClubsMinted?.toString());
    const forgesMinted = await ugNftContract.ttlForges(); 
    setNumForgesMinted(forgesMinted?.toString());

  }

  useEffect(() => {   
    getUpdates();  
      const init = async() => {      
             
          const timer = setInterval(() => {
            getUpdates();
            
          }, 60000);
          return () => {
            clearInterval(timer);
          };
         
      }
      init();  
      
      // eslint-disable-next-line
    }, []);

  return (
    <Stack padding={1} margin={1} >
      <Container className="forge-bordr h1" align="center" sx={{color: 'red',  fontSize: '4rem' }} >
            UG Resurrection Mint Page
        </Container>
      <Stack  spacing={3} alignItems="center">
      <Container className="forge-bordr h1" align="center" sx={{color: 'aqua', width: 1/2 }} >
            Ring and Amulet Mint
        </Container>
        <Stack direction="row" spacing = {4}>
          <RingMintBox/>
          <AmuletMintBox/>
        </Stack>
        <Container className="forge-bordr h1" align="center" sx={{color: 'aqua', width: 1/2 }} >
            Fight Club Mint
        </Container>
        <Box p={2} m={1} className="fclub-bordr">
            <Stack direction="row" spacing={2} justifyContent='space-around'>
                <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'red'}}>Total Minted </Typography>
                <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'gold'}}>{numMinted} / 200 </Typography>
            </Stack>
        </Box>
        <Stack direction="row" spacing = {4} >
          <FightClubMintBox/>
        </Stack>
        
      </Stack>
      <Stack ml= {0} spacing={3} alignItems="center">
        <Container className="forge-bordr h1" align="center" sx={{color: 'aqua', width: 1/2 }} >
            Steel Forge Mint
        </Container>
        <Box p={2} className="forge-bordr" m={2}  maxWidth={350}>
            <Stack direction="row" spacing={2} justifyContent='space-around'>
            <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'red'}}>Total Minted </Typography>
            <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'gold'}}>{numForgesMinted} / 500 </Typography>
            
            </Stack>
            </Box>
        <Stack direction="row"spacing={3}>
          <ForgeMintBox/>    
               
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Mint