import {useContext, useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ProviderContext from '../context/provider-context';
import FighterV1Card from './FighterV1Card'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './stakedFighterList.css';

export default function OwnedV1FighterList(props) {
    const prv = useContext(ProviderContext);
    const ownedV1Ids = prv.ownedV1FYIds;
    const[selectedFYs, setSelectedFYs] = useState([]);

    const selectedFYHandler = (selectedId, clicked) => {
      console.log('c',clicked);
      console.log('si',selectedId);
       //first recreate list without them, then add if we need to
       setSelectedFYs((prevState) => {
         return prevState.filter(id => id !== selectedId)
       });
       console.log('c',clicked);
       if(clicked ){
         setSelectedFYs((prevState) => {
           return [...prevState, selectedId];
         });
       }
     }
  return (
    <Container className="staked-bordr" sx={{ p:0,width: 440, height: 570 }}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:1, color: 'red' }}>
            V1 Owned Fighters
        </Typography>
    <ImageList sx={{ width: 400, height: 500 }} cols={3} rowHeight={250} children="props" >
      {ownedV1Ids.map((id) => (
        <ImageListItem key={id}>
            <FighterV1Card key={id} id={id}
            onSelected={selectedFYHandler}
            emptyArray={selectedFYs.length > 0 ? false : true}/>
         
        </ImageListItem>
      ))}
    </ImageList>
    </Container>
  );
}

