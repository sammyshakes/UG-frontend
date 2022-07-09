import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader } from '@mui/material';
import {getOldGame} from '../utils.js';
import { useState, useEffect } from 'react';
import './fighterCard.css';
/* global BigInt */

export default function FighterV1Card(props) {
    const [brutality, setBrutality] = useState(undefined);
    const [courage, setCourage] = useState(undefined);
    const [cunning, setCunning] = useState(undefined);
    const [level, setLevel] = useState(undefined);
    const [rank, setRank] = useState(undefined);
    const [isYakuza, setIsYakuza] = useState(false);
    const [fighterUrl, setFighterUrl] = useState("fighter/");

    const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';

    useEffect(() => {  
        const init = async() => {   
            // get contracts
            const oldGameContract = getOldGame();
            const fyTraits = await oldGameContract.functions.getFyTokenTraits(props.id);
            const fighter_Url = !fyTraits[0].isFighter ?  "yakuza/" : "fighter/";
            setFighterUrl(fighter_Url);
            setBrutality(fyTraits[0].brutality);
            setCourage(fyTraits[0].courage);
            setCunning(fyTraits[0].cunning);
            setLevel(fyTraits[0].level);
            setIsYakuza(!fyTraits[0].isFighter);
            setRank(fyTraits[0].rank);
            
        }
        init();
        // eslint-disable-next-line
      }, []);



  return (
    <Card raised= {true} className="card-bordr" sx={{ maxWidth: 345 }}>
      <CardActionArea >
       
        <CardMedia
          component="img"
          height="200"
          image={baseUrl + fighterUrl + `${props.id}.png`}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
        {!isYakuza && <Typography gutterBottom variant="body2" component="div" sx={{ fontSize:'.75rem'}}>
          {`#${props.id} LEVEL:${level}`}
          </Typography>}
          {!isYakuza &&   <Typography variant="body2" sx={{ fontSize:'.75rem'}}>
            {`Br:${brutality} Co:${courage} Cu:${cunning}`}
          </Typography>}
          {isYakuza && <Typography gutterBottom variant="body2" component="div" sx={{color: 'yellow', fontSize:'.75rem'}}>
          {`#${props.id} RANK:${rank}`}
          </Typography>}
          {isYakuza &&   <Typography variant="body2" sx={{ color: 'yellow', fontSize:'.75rem'}}>
            {"YAKUZA"}
          </Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
