import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import './v1RingWidget.css'
import {useContext} from 'react';
import ProviderContext from '../context/provider-context';

const V1AmuletWidget = () => {
    const prv = useContext(ProviderContext);
    const oldAmuletIds = prv.v1AmuletIds;
    const baseUrl = 'https://the-u.club/reveal/amulet/amulet_reveal.png.png';
  return (
   
    <Card raised= {true} className="ring-bordr"  sx={{ m:4, borderRadius:10, width: 165, backgroundColor: 'black'}}>
       
        <CardMedia
          component="img"
          height="150"
          image={baseUrl}
          alt="V1Amulet"
          loading="lazy"
        />
        <CardContent  align="center"  sx={{p:0, color: 'red'}}>
            <Typography gutterBottom variant="button" component="div" sx={{fontFamily: 'Alegreya Sans SC', height:0, fontSize:'1rem', backgroundColor: 'black'}}>
                {`V1 Amulets: ${oldAmuletIds.length}`}
            </Typography>
        </CardContent>
      
    </Card>
   
  )
}

export default V1AmuletWidget