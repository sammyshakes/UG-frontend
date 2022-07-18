import {useContext} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ProviderContext from '../context/provider-context';
import FighterV1Card from './FighterV1Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './stakedFighterList.css';

export default function StakedV1FighterList() {
    const prv = useContext(ProviderContext);
    const stakedV1Ids = prv.stakedV1FYIds;
  return (
    <Container className="staked-bordr" sx={{ p:1,width: 440, height: 570 }}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            V1 Staked Fighters
        </Typography>
    <ImageList sx={{ width: 400, height: 500 }} cols={3} rowHeight={250} children="props">
      {stakedV1Ids.map((id) => (
        <ImageListItem key={id}>
            <FighterV1Card key={id} id={id}/>
         
        </ImageListItem>
      ))}
    </ImageList>
    </Container>
  );
}

