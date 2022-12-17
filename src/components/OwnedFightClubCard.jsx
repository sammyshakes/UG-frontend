import {useContext, useState} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Stack } from '@mui/material';
import './ownedFightclubcard.css';
/* global BigInt */

const OwnedFightClubCard = (props) => {
  
  const [clicked, setClicked] = useState(false);
  const prv = useContext(ProviderContext);
  const baseUrl = 'https://the-u.club/reveal/fightclub/';
  const fclubUrl = baseUrl.concat(props.id).concat('.jpg');  

  const clickHandler = () => {
    setClicked((current) => {
      props.onSelected(props.id, !current);
      return !current;
    });
  }

  if(clicked && props.emptyArray) setClicked(false);

  

  return (
    <Card raised= {true}  
    className={clicked ? "card-bordr clicked": "card-bordr"}
    sx={{
      borderRadius: 6, 
      maxHeight: 420,
      maxWidth: 350, 
      borderColor: clicked ? 'aqua' : 'red' ,
      borderWidth: 2
    }}>
      <CardActionArea onClick={clickHandler} >
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
         
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image={fclubUrl}
          alt="Fight Club"
        />
        <CardContent  align="center" sx={{p: 1,color: 'cyan'}}>
        <Stack   >
          <Box  sx={{ display: 'inline-flex',justifyContent: 'space-around' }}>
                              <Stack direction="row"  spacing={5} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
                             
                              </Stack>
                              </Box>
                              <Box  sx={{ display: 'inline-flex',justifyContent: 'space-evenly' }}>
                                <Typography sx={{ fontSize: '1rem'}}>LEVEL {props.level}</Typography>
                                <Typography sx={{ fontSize: '1rem'}}>SIZE {props.size}</Typography>                              
                              </Box>
                            </Stack>
                            
        <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto',color: 'yellow', fontSize:'1rem'}}>
                              {`FIGHT CLUB #${props.id} `}
                            </Typography>
            
        </CardContent>
      </CardActionArea>
    </Card>
  );
  
};

export default OwnedFightClubCard