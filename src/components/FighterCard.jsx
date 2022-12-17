import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useState } from 'react';
import './fighterCard.css';
/* global BigInt */

export default function FighterCard(props) {
  const [clicked, setClicked] = useState(false);

  const clickHandler = () => {
    setClicked((current) => {
      props.onSelected(props.id, !current);
      console.log(props.id);
      return !current;
    });
  }
  if(clicked && props.emptyArray) setClicked(false);

  return (
    <Card raised= {true} className={clicked ? "card-bordr clicked": "card-bordr"}
    sx={{
      borderRadius: 6, 
      maxWidth: 345, 
      borderColor: clicked ? 'aqua' : 'red' ,
      borderWidth: 2
    }}>
      <CardActionArea onClick={clickHandler}>
       
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
