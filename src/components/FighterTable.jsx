import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import { DataGrid } from '@mui/x-data-grid';
import './fighterTable.css';

import {Avatar} from '@mui/material/';



const columns = [
    { 
    field: 'id', 
    headerName: 'ID', 
    width: 70 ,
    renderCell:(params) =>{
        return(
            <Avatar src={params.row.imageUrl}></Avatar>
        )
    }
    },
    { field: 'level', headerName: 'Level', type: 'number', width: 75,},
    { field: 'brutality', headerName: 'Brutality', type: 'number', width: 75,},
    { field: 'courage', headerName: 'Courage', type: 'number', width: 75,},
    { field: 'cunning', headerName: 'Cunning', type: 'number', width: 75,},
    { field: 'scars', headerName: 'Scars', type: 'number', width: 75,},
    { field: 'knuckles', headerName: 'Knuckles', type: 'number', width: 75,},
    { field: 'chains', headerName: 'Chains', type: 'number', width: 75,},
    { field: 'switchblade', headerName: 'ButterFly', type: 'number', width: 75,},
    { field: 'machete', headerName: 'Machete', type: 'number', width: 75,},
    { field: 'katana', headerName: 'Katana', type: 'number', width: 75,},
  
];




export default function FighterTable() {
    const prv = useContext(ProviderContext);
   
  return (

    <div style={{ height: 700, width: '100%'}}>
      <DataGrid sx={{color: 'aqua', fontSize: '.8rem'}}
        rows={prv.ownedFYs}
        columns={columns}
        pageSize={10}
        rowHeight={55}
        autoHeight
        autoPageSize
        checkboxSelection
      />
    </div>
  );
}

