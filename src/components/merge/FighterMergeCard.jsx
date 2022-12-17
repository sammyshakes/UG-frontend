import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useState } from 'react';
import '../fighterCard.css';
/* global BigInt */

export default function FighterCard(props) {
  const [clicked, setClicked] = useState(false);

  const clickHandler = () => {
    setClicked((current) => {
      props.onSelected(props.id, !current);
     // console.log(props.id);
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
          height="100%"
          image={props.imageUrl}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 0,color: 'gold'}}>
        { <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto', fontSize:'.75rem'}}>
          {`#${props.id}   LEVEL: ${props.fy.level}`}
          </Typography>}
          { <Typography variant="body2" sx={{fontFamily: 'Roboto', fontSize:'.75rem', color: 'red'}}>
            {`Br: ${props.fy.brutality}  Co: ${props.fy.courage}  Cu: ${props.fy.cunning}`}
          </Typography>}
          { <Typography variant="body2" sx={{fontFamily: 'Roboto', fontSize:'.75rem', color: 'deepskyblue'}}>
            {`Kn: ${props.fy.knuckles}  Ch: ${props.fy.chains}  Bu: ${props.fy.butterfly} Ma: ${props.fy.machete}  Ka: ${props.fy.katana}`}
          </Typography>}
         
         
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
