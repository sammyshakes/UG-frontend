import { useState, useEffect} from 'react';
import { getUGNft2, getEthers} from '../utils.js';
import {Button, Box, Stack, Typography} from '@mui/material';

const TransferUGNft = (props) => {
    const[enteredAddress, setEnteredAddress] = useState('');
    const ugNftContract = getUGNft2();
    const provider = getEthers();

    const enteredAddressChangeHandler = (event) => {
        console.log("1",event.target.value);
         setEnteredAddress(event.target.value);
     }

     const transferHandler = async (event) => {
        event.preventDefault();
        console.log('e',event.target);
        //create amounts array for each item
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const amountArray = props.ids.map((id) => {
            return 1;
        })
        console.log(amountArray);
        console.log(enteredAddress);
        console.log(props.ids);
        console.log(accounts[0]);
        
        const signedContract =  ugNftContract.connect(provider.getSigner());
        await signedContract.functions.safeBatchTransferFrom(accounts[0], enteredAddress,props.ids, amountArray, "0x00");
        setEnteredAddress('');
    }
  return (
    <Box >
    <div> <form className="new-project__controls"  onSubmit={transferHandler}>
    <Box p={1} sx={{color: 'red'}}>
        <div className="row">
            <div className="col-12">
                <div className="new-project-control">
                    <input className="form-control" value={enteredAddress} type="text" placeholder="Transfer selected nfts to:" id="name" onChange={enteredAddressChangeHandler}/>
                </div>
            </div>
        </div>
        <div className="row mt-2">
            
            <div className="row new-project-actions">
            <button style={{color: 'aqua', backgroundColor: 'firebrick', width: '20%'}} className="col">Transfer NFTs</button>
            </div>
        </div>
    </Box>
</form></div>
</Box>
  )
}

export default TransferUGNft