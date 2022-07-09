import React from 'react'
import {Box, Stack, Typography} from '@mui/material/'; 
import './sidebar.css'; 
import {Link} from 'react-router-dom';

const Sidebar = () => {
  return (
    <Box className="sidebar-bordr" sx={{ml:4, p:2, maxHeight: 200, width: 150, color: 'red'}}>
        <Stack >       
            <Link to ='/'>FIGHTERS</Link> 
            <Link to ='arena'>ARENA</Link>
            <Link to ='raids'>RAIDS</Link>       
            <Link to ='forge'>FORGE</Link>
            <Link to ='/'>FIGHT CLUBS</Link>
            <Link to ='migrate'>MIGRATE</Link>        
        </Stack>
    </Box>
  )
}

export default Sidebar