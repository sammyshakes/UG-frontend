import {useContext} from 'react';
import ProviderContext from '../context/provider-context';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import StakedFighterCard from './StakedFighterCard';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './stakedFighterList.css';

export default function StakedFighterList() {
    const prv = useContext(ProviderContext);    
    const stakedFYs = prv.stakedFYs;
  return (
    <Container className="staked-bordr" sx={{ p:1,width: 440, height: 570 }}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Staked Fighters
        </Typography>
    <ImageList sx={{ width: 400, height: 500 }} cols={3} rowHeight={250} >
      {stakedFYs?.map((fy) => (
        <ImageListItem key={fy.id}>
            <StakedFighterCard key={fy.id} 
             id={fy.id}
             brutality= {fy.brutality}
             courage={fy.courage}
             cunning={fy.cunning}
             level={fy.level}
             rank={fy.rank}
             isFighter={fy.isFighter}
             imageUrl={fy.imageUrl}
             lastLevelTime={fy.lastLevelUpgradeTime}
             lastRaidTime={fy.lastRaidTime}/>
         
        </ImageListItem>
      ))}
    </ImageList>
    </Container>
  );
}

