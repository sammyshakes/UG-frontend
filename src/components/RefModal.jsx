import classes from './RefereeModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';

const Backdrop = props => {
    return <div className={classes.backdrop}/>
}

const ModalOverlay = props => {
    return <div className={classes.modal}>
        <div className={classes.content}>{props.children}</div>
    </div>
}

const portalElement = document.getElementById('overlays');

const RefModal = (props) => {
  return (
    <React.Fragment>
        {ReactDOM.createPortal(<Backdrop />, portalElement)}
        {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
    </React.Fragment>
  )
}

export default RefModal