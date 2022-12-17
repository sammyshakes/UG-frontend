import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress thickness={2.5} size="1.8rem" variant="determinate"  {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.time/(86400) >= 1 && <Typography variant="caption" component="div" fontSize={'.6rem'} style={{color: Math.round(props.value) < 20 ? "orange" : "cyan"}}>
          {`${Math.floor(props.time/(86400))}D+`}
        </Typography>}
        {Math.floor(props.time/(86400))<1 && Math.round(props.time/(3600))>0 && <Typography variant="caption" component="div" fontSize={'.7rem'} style={{color: Math.round(props.value) < 20 ? "orangered" : "cyan"}}>
          {`${Math.floor(props.time/(3600)).toString() }H+`}
        </Typography>}
        {props.time <=0 && <Typography variant="caption" component="div" fontSize={'.6rem'} style={{color: Math.round(props.value) < 20 ? "orangered" : "cyan"}}>
         0%
        </Typography>}       
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

