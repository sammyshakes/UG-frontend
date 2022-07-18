import { Stack, Container} from '@mui/material/';
import ForgeMintBox from '../components/ForgeMintBox';
import ForgeCard from '../components/ForgeCard';
import './forge.css';

const Forge = () => {
  return (
   
        <Stack ml= {0} spacing={3} alignItems="center">
            <Container className="forge-bordr h1" align="center" sx={{color: 'red', width: 1/2 }} >
                Steel Forge Mint
            </Container>
        <Stack direction="row">
            <ForgeMintBox/>
            
           
            </Stack>
        </Stack>
   
  )
}

export default Forge