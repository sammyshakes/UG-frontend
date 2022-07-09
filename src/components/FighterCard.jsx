import {useContext} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader } from '@mui/material';
import {getUGNft} from '../utils.js';
import { useState, useEffect } from 'react';
import './fighterCard.css';
/* global BigInt */

export default function FighterCard(props) {
  const prv = useContext(ProviderContext);
  const ownedFYs = prv.ownedFYs;
  console.log('owned',ownedFYs);

  return (
    <Card raised= {true} className="card-bordr" sx={{ maxWidth: 345 }}>
      <CardActionArea >
       
        <CardMedia
          component="img"
          height="200"
          image={props.imageUrl}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
        {props.isFighter && <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto', fontSize:'.75rem'}}>
          {`#${props.id}   LEVEL: ${props.level}`}
          </Typography>}
          {props.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Roboto', fontSize:'.75rem'}}>
            {`Br: ${props.brutality}  Co: ${props.courage}  Cu: ${props.cunning}`}
          </Typography>}
          {!props.isFighter && <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto',color: 'yellow', fontSize:'.75rem'}}>
          {`#${props.id} RANK:${props.rank}`}
          </Typography>}
          {!props.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', color: 'yellow', fontSize:'.75rem'}}>
            {"YAKUZA"}
          </Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
