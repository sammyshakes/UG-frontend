import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader } from '@mui/material';
import {getOldGame} from '../utils.js';
import { useState, useEffect } from 'react';
import './fighterCard.css';
import toothImage from '../assets/tooth-800.png';
/* global BigInt */

export default function FighterV1Card(props) {
    const [brutality, setBrutality] = useState(undefined);
    const [courage, setCourage] = useState(undefined);
    const [cunning, setCunning] = useState(undefined);
    const [level, setLevel] = useState(undefined);
    const [rank, setRank] = useState(undefined);
    const [isYakuza, setIsYakuza] = useState(false);
    const [clicked, setClicked] = useState();    
    const[isMigrated, setIsMigrated] = useState(false);
    const [fighterUrl, setFighterUrl] = useState("fighter/");
    const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';
    

    const clickHandler = () => {
      setClicked((current) => {
        props.onSelected(Number(props.id), !current);
        return !current;
      });
    
    }
  
    if(clicked && props.emptyArray) setClicked(false);

    useEffect(() => {  
        const init = async() => {   
            // get contracts
            const oldGameContract = getOldGame();
            const fyTraits = await oldGameContract.functions.getFyTokenTraits(props.id);
            const fighter_Url = !fyTraits[0].isFighter ?  "yakuza/" : "fighter/";
            const migrated = props.level === undefined ? true : false;
            setFighterUrl(fighter_Url);
            setBrutality(fyTraits[0].brutality);
            setCourage(fyTraits[0].courage);
            setCunning(fyTraits[0].cunning);
            setLevel(fyTraits[0].level);
            setIsYakuza(!fyTraits[0].isFighter);
            setRank(fyTraits[0].rank);
            setIsMigrated(migrated);
            
        }
        init();
        // eslint-disable-next-line
      }, []);



  return (
    <Card raised= {true} className={clicked ? "card-bordr clicked": "card-bordr"} sx={{ maxWidth: 340, borderColor: clicked ? 'aqua' : 'red'  }}>
      <CardActionArea onClick={clickHandler}>
       
        <CardMedia
          component="img"
          height={level >= 0 ?"200" : "80"}
          image={level !== undefined ? baseUrl + fighterUrl + `${props.id}.png` : toothImage}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
        {!isYakuza && <Typography gutterBottom variant="body2" component="div" sx={{ fontSize:'.75rem'}}>
          {`#${props.id } LEVEL:${level >= 0 ? level : 'MIGRATED'}`}
          </Typography>}
          {!isYakuza &&   <Typography variant="body2" sx={{ fontSize:'.75rem'}}>
            {`Br:${level >= 0 ? brutality : 'MIGRATED'} Co:${level >= 0 ? courage : 'MIGRATED'} Cu:${level >= 0 ? cunning : 'MIGRATED'}`}
          </Typography>}
          {isYakuza && <Typography gutterBottom variant="body2" component="div" sx={{color: 'yellow', fontSize:'.75rem'}}>
          {`#${props.id} RANK:${level >= 0 ? rank : 'MIGRATED'}`}
          </Typography>}
          {isYakuza &&   <Typography variant="body2" sx={{ color: 'yellow', fontSize:'.75rem'}}>
            {"YAKUZA"}
          </Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
