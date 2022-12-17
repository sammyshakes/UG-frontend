import {Box, Stack} from '@mui/material/'; 
import '../sidebar.css'; 
import {NavLink} from 'react-router-dom';

const MarketMenuBar = () => {


  return (
   
    <Box className="raid-bordr" sx={{m:4, p:2, maxHeight: 60,  color: 'yellow'}}>
        <Stack direction= "row"  justifyContent={"space-evenly"} align-items="center"  spacing={2}>       
            <NavLink  to ='fighters' style={{textDecoration: "none", color: 'cyan'}}>Fighters</NavLink >
            <NavLink  to ='yakuza' style={{textDecoration: "none", color: 'cyan'}}>Yakuza</NavLink >
            <NavLink  to ='clubs' style={{textDecoration: "none", color: 'cyan'}}>Fight Clubs</NavLink >
            <NavLink  to ='forges' style={{textDecoration: "none", color: 'cyan'}}>Forges</NavLink >  
            <NavLink  to ='rings' style={{textDecoration: "none", color: 'cyan'}}>Rings</NavLink >   
            <NavLink  to ='amulets' style={{textDecoration: "none", color: 'cyan'}}>Amulets</NavLink >  
            <NavLink  to ='weapon' style={{textDecoration: "none", color: 'cyan'}}>Weapons</NavLink >
          </Stack>
    </Box>
    
  )
}

export default MarketMenuBar

