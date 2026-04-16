import React from 'react'
import { Dialog, DialogActions, DialogContent, Avatar } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
//import PropTypes from 'prop-types';
import SendInvToEmail from "./popup-element/SendInvToEmail"
import Survey from './popup-element/Survey';

function Success({ success, close }) {
    return (
        <Dialog open={success} scroll='body' className='dialog'>
            <DialogActions>
                <Avatar onClick={close} className='popup-close-button'>
                    <HighlightOff />
                </Avatar>
            </DialogActions>
            <DialogContent>
                <SendInvToEmail />
                <Survey />
            </DialogContent>
        </Dialog>
    )
}

export default Success
