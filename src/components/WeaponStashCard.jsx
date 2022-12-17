import {useState, useEffect} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea, Box, Stack } from '@mui/material';
import { getUGWeapons2, getUGForgeSmith3} from '../utils.js';
import './stakedforgecard.css';
/* global BigInt */

const WeaponStashCard = (props) => {
    const [brokenBalance, setBrokenBalance] = useState(undefined);
    const [upgradeCost, setUpgradeCost] = useState(undefined);
    const [weaponString, setWeaponString] = useState('');
    const [clicked, setClicked] = useState(false);
    const ugWeaponsContract = getUGWeapons2();
    const ugForgeSmithContract = getUGForgeSmith3();

    let baseUrl = 'https://the-u.club/reveal/weapons/';
    if(props.id > 30){
      baseUrl = 'https://the-u.club/reveal/weapons/broken/';
    } 

    const weaponUrl = baseUrl.concat(props.id).concat('.png');  

    const getWeapon = () => {
      let string = "";
      let id = props?.id;
      //const id = props.id;
      if(id > 30) {
        id = id - 30;
      }
      if(Math.floor((id - 1)/5) === 0) {
        string = string?.concat("Steel");
      }
      if(Math.floor((id - 1)/5) === 1) {
        string = string?.concat("Bronze");
      }
      if(Math.floor((id - 1)/5) === 2) {
        string = string?.concat("Gold");
      }
      if(Math.floor((id - 1)/5) === 3) {
        string = string?.concat("Platinum");
      }
      if(Math.floor((id - 1)/5) === 4) {
        string = string?.concat("Titanium");
      }
      if(Math.floor((id - 1)/5) === 5) {
        string = string?.concat("Diamond");
      }
      if(id%5 === 1) {
        return string?.concat(" ").concat( "Knuckles");
      }
      if(id%5 === 2) {
        return string?.concat(" ").concat( "Chains");
      }
      if(id%5 === 3) {
        return string?.concat(" ").concat( "Butterfly");
      }
      if(id%5 === 4) {
        return string?.concat(" ").concat( "Machetes");
      }
      if(id%5 === 0) {
        return string?.concat(" ").concat( "Katanas");
      }

    }

    const getUpdates = async() => {
      const weaponString = getWeapon();
      setWeaponString(weaponString);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const brokenBalance = await ugWeaponsContract.balanceOf(accounts[0], props.id + 30);
      const upgradeCost = await ugForgeSmithContract.getBloodRepairFee(props.id + 5);
      setBrokenBalance(Number(brokenBalance));
      setUpgradeCost(Number(upgradeCost));
    }
  
    const clickHandler = () => {
      setClicked((current) => {
        //  console.log(props.id);
        props.onSelected(props.id, !current);
        return !current;
      });
    }
  
    if(clicked && props.emptyArray) setClicked(false);
    

  useEffect(() => {   
    const init = async() => {    

        getUpdates();
        
      
      const timer = setInterval(() => {
       
        getUpdates();
        
      }, 5000);

      
      return () => {
        clearInterval(timer);
      };
    }
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <Card raised= {true}  
    className={clicked ? "card-bordr clicked": "card-bordr"}
    sx={{
      borderRadius: 1, 
      maxHeight: 400,
      maxWidth: 250, 
      borderColor: clicked ? 'aqua' : 'red',
      borderWidth: clicked ? 3 : 1
    }}>
      <CardActionArea  onClick={clickHandler}>
      
        <CardMedia
          component="img"
          height={250}
          image={weaponUrl}
          alt="FYakuza"
          loading="lazy"
          border="2"
        />
        <CardContent  align="center" sx={{pt:0.5, color: 'cyan', height: 60}}>
          <Stack>
            <Stack direction='row' sx={{display: 'inline-flex',justifyContent: 'space-around' }}>
              {props.id < 31 && <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.25rem'}}>{props.balance} </Typography> }
              {props.id > 30 && <Typography sx={{fontFamily: 'Alegreya Sans SC', color: 'red',fontSize: '1.25rem'}}>{props.balance} </Typography> }      
              {props.id > 30 && <Typography gutterBottom variant="h1" align='center' component="div" sx={{pt: 1, fontFamily: 'Alegreya Sans SC',color: 'red', fontSize:'0.95rem'}}>
                {weaponString}
              </Typography>}
              {props.id < 31 && <Typography gutterBottom variant="h1" align='center' component="div" sx={{pt: 1, fontFamily: 'Alegreya Sans SC', fontSize:'0.99rem'}}>
                {weaponString}
              </Typography>}
            </Stack>
           
            <Stack direction="row" minWidth={150} spacing={0} sx={{ display: 'inline-flex',justifyContent: 'center' }}> 
            
              {props.id < 26 && <Typography sx={{p:0, fontFamily: 'Alegreya Sans SC',color: 'deepskyblue',fontSize: '1rem'}}>Upgrade Cost: {upgradeCost} </Typography>}
              {props.id > 30 && <Typography sx={{p:0, fontFamily: 'Alegreya Sans SC',color: 'gold',fontSize: '1rem'}}>Repair Cost: {upgradeCost} </Typography>}
          
                        
              </Stack>                    
        </Stack>             
      </CardContent>
     
      </CardActionArea>
    </Card>
  );
  
};

export default WeaponStashCard