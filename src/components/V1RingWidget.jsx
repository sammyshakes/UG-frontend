import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import './v1RingWidget.css'
import {useContext} from 'react';
import ProviderContext from '../context/provider-context';

const V1RingWidget = () => {
    const prv = useContext(ProviderContext);
    const oldRingIds = prv.v1RingIds;
    const baseUrl = 'https://the-u.club/reveal/ring/ring_v2.png';
  return (
   
    <Card raised= {true} className="ring-bordr" sx={{ m:4, borderRadius:10, width: 100 , backgroundColor: 'black'}}>
       
        <CardMedia
          component="img"
          height="150"
          image={baseUrl}
          alt="V1Ring"
          loading="lazy"
        />
        <CardContent  align="center"  sx={{p:0, color: 'red'}}>
            <Typography gutterBottom variant="button" component="div" sx={{fontFamily: 'Alegreya Sans SC', height:10, fontSize:'1rem', backgroundColor: 'black'}}>
                {`V1 RINGS: ${oldRingIds.length}`}
            </Typography>
        </CardContent>
      
    </Card>
   
  )
}

export default V1RingWidget