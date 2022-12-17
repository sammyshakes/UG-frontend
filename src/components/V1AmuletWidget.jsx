import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import amuletImage from '../assets/images/amulet_500.png';
import './v1RingWidget.css'
import {useContext} from 'react';
import ProviderContext from '../context/provider-context';

const V1RingWidget = () => {
    const prv = useContext(ProviderContext);
    const oldAmuletIds = prv.v1AmuletIds;
  return (
   
    <Card raised= {true} className="ringv1-bordr"  sx={{ m:4, borderRadius:10, width: 7.5/10, backgroundColor: 'black'}}>
       <Container>
        <img
          component="img"
          height="150"
          src={amuletImage}
          alt="V1Amulet"
          loading="lazy"
        />
       
        <CardContent  align="center"  sx={{p:0, color: 'red'}}>
            <Typography gutterBottom variant="button" component="div" sx={{fontFamily: 'Alegreya Sans SC', height:10, fontSize:'1rem', backgroundColor: 'black'}}>
                {`V1 Amulets: ${oldAmuletIds.length}`}
            </Typography>
        </CardContent>
        </Container>
      
    </Card>
   
  )
}

export default V1RingWidget