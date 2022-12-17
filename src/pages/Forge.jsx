import { Stack, Container, Box} from '@mui/material/';
import StakedForgeList from '../components/StakedForgeList';
import WeaponStash from '../components/WeaponStash';
import './forge.css';

const Forge = () => {
  return (
   
        <Stack ml= {0} spacing={3} m={3} mt={4} alignItems="center" >
            
          <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} spacing={3}>
            <Box  sx={{zIndex: 10}}>
            <StakedForgeList/> 
            </Box>
            <Box  sx={{zIndex: 10}}>
            <WeaponStash/>
            </Box>
          </Stack>
        </Stack>
   
  )
}

export default Forge