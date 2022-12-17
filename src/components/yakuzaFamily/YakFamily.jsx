import {useState} from 'react'
import yamaguchi from '../../assets/images/yakuza_families/Yamaguchi.png';
import sumiyoshi from '../../assets/images/yakuza_families/Sumiyoshi1.png';
import inagawa from '../../assets/images/yakuza_families/Inagawa.png';
import {Box, Stack, Typography} from '@mui/material';


const YakFamily = (props) => {
    const [selectedYak, setSelectedYak] = useState(undefined);

    const clickHandler = (e) => {
        console.log(e.target.alt);
        const selection = e.target.alt;
        if(selection === "yamaguchi") props.onYakFamily(0);
        if(selection === "sumiyoshi") props.onYakFamily(1);
        if(selection === "inagawa") props.onYakFamily(2);
        setSelectedYak(e.target.alt);
    }

    if(selectedYak === undefined){
        return (            
            <Box className="sweat1-box">
                <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                    <Typography variant='body2' sx={{pt:1.5, fontFamily: 'Alegreya Sans SC', color: 'orangered',  fontSize:'1.25rem'}}>Yakuza Family</Typography>  
                    <Box width={50} sx={{pl: .2, pt: 1.2, borderRadius: 2, backgroundColor: 'palegreen'}} onClick={clickHandler} value={0}><img src={yamaguchi} alt="yamaguchi" height='30/100'  />  </Box>
                    <Box width={50} sx={{pr: .5, borderRadius: 2, backgroundColor: 'aqua'}} onClick={clickHandler} value={1}><img src={sumiyoshi} alt="sumiyoshi" height='50/100' />  </Box>
                    <Box width={50} sx={{pr: .5, borderRadius: 2, backgroundColor: 'peachpuff'}} onClick={clickHandler} value={2}><img src={inagawa} alt="inagawa" height='50/100' />  </Box>                    
                </Stack>
            </Box>
        )
    }

    if(selectedYak === "yamaguchi"){
        return (            
            <Box className="sweat1-box">
                <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                    <Typography variant='body2' sx={{p:1.5, fontFamily: 'Alegreya Sans SC', color: 'orangered',  fontSize:'1.25rem'}}>Yakuza Family</Typography>  
                    <Box width={50} sx={{pl: .2, pt: 1.2, borderRadius: 2, backgroundColor: 'palegreen'}} onClick={clickHandler} value={0}><img src={yamaguchi} alt="yamaguchi" height='30/100'  />  </Box>
                    <Typography variant='body2' sx={{p:1.5, fontFamily: 'Alegreya Sans SC', color: 'palegreen',  fontSize:'1.25rem'}}>Yamaguchi</Typography>                   
                </Stack>
            </Box>
        )
    }

    if(selectedYak === "sumiyoshi"){
        return (            
            <Box className="sweat1-box">
                <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                    <Typography variant='body2' sx={{p:1.5, fontFamily: 'Alegreya Sans SC', color: 'orangered',  fontSize:'1.25rem'}}>Yakuza Family</Typography>  
                    <Box width={50} sx={{pr: .5, borderRadius: 2, backgroundColor: 'aqua'}} onClick={clickHandler} value={1}><img src={sumiyoshi} alt="sumiyoshi" height='50/100' />  </Box>
                    <Typography variant='body2' sx={{p:1.5, fontFamily: 'Alegreya Sans SC', color: 'aqua',  fontSize:'1.25rem'}}>Sumiyoshi</Typography>                   
                </Stack>
            </Box>
        )
    }

    if(selectedYak === "inagawa"){
        return (            
            <Box className="sweat1-box">
                <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                    <Typography variant='body2' sx={{p:1.5, fontFamily: 'Alegreya Sans SC', color: 'orangered',  fontSize:'1.25rem'}}>Yakuza Family</Typography>  
                    <Box width={50} sx={{pr: .5, borderRadius: 2, backgroundColor: 'peachpuff'}} onClick={clickHandler} value={2}><img src={inagawa} alt="inagawa" height='50/100' />  </Box>                    
                    <Typography variant='body2' sx={{p:1.5, fontFamily: 'Alegreya Sans SC', color: 'peachpuff',  fontSize:'1.25rem'}}>Inagawa</Typography>                   
                </Stack>
            </Box>
        )
    }

    

 
}

export default YakFamily