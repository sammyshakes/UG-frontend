import { Stack, Container} from '@mui/material/';
import ForgeMintBox from '../components/ForgeMintBox';
import './forge.css';

const Forge = () => {
  return (
   
        <Stack ml= {-20} spacing={3} alignItems="center">
            <Container className="forge-bordr h1" align="center" sx={{color: 'red', width: 1/2 }} >
                Steel Forge Mint
            </Container>
        
            <ForgeMintBox/>
        
        </Stack>
   
  )
}

export default Forge