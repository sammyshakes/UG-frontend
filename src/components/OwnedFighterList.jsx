import {useContext} from 'react';
import ProviderContext from '../context/provider-context';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import FighterCard from './FighterCard'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './stakedFighterList.css';

export default function OwnedFighterList() {
    const prv = useContext(ProviderContext);
    const ownedFYs = prv.ownedFYs;
    console.log('owned',ownedFYs);
  return (
    <Container className="staked-bordr" sx={{ p:0,width: 440, height: 570 }}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'red' }}>
            Fighters Ready
        </Typography>
    <ImageList sx={{ width: 400, height: 500 }} cols={3} rowHeight={250} children="props" >
      {ownedFYs?.map((fy) => (
        <ImageListItem key={fy.imageId}>
            <FighterCard key={fy.imageId} 
            id={fy.id}
            brutality= {fy.brutality}
            courage={fy.courage}
            cunning={fy.cunning}
            level={fy.level}
            rank={fy.rank}
            isFighter={fy.isFighter}
            imageUrl={fy.imageUrl}
            />
         
        </ImageListItem>
      ))}
    </ImageList>
    </Container>
  );
}

