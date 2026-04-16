import React, { useCallback, useState } from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux"
import { notifyCustomer } from '../../../../redux/action/customerAction';
import PrintButton from "./PrintButton";


function SendInvToEmail() {
    const dispatch = useDispatch();
    const checkoutData = useSelector((state) => state.checkoutData);
    const [email, setEmail] = useState("");
    const [responseMsgS, setResponseMsgS] = useState("");
    const [responseMsgE, setResponseMsgE] = useState("");

    const closeResMsg = useCallback(() => {
        setTimeout(() => {
            setResponseMsgE("");
            setResponseMsgS("");
        }, 5000)
    }, [])

    const onEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const sendEmail = () => {
        var form = {}
        var responseData = checkoutData.responseData
        form.invoice_no = responseData.invoice_num
        form.email = email
        if (email) {
            dispatch(notifyCustomer(form))
                .then(res => res.json())
                .then(resData => {
                    if (resData.success) {
                        setResponseMsgS(resData.msg)
                        setEmail("")
                    } else {
                        setResponseMsgE(resData.msg)
                    }
                    closeResMsg();
                });
        } else {
            setResponseMsgE("Please enter valid email address to send invoice.")
            closeResMsg();
        }
    }

    return (
        <>
            <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                <Grid item xs={12} className={'align-center'}>
                    <Check />
                </Grid>
                <Grid item xs={12} className={'align-center'}>
                    <Typography variant="h5" component="h5">Order successfully placed</Typography>
                </Grid>
                <Grid item xs={12} className={'align-center'}>
                    <Typography variant="body2" component="p">We recommend to send invoice via email or sms </Typography>
                </Grid>
                <Grid item xs={12} className={'align-center'}>
                    <Box>
                        <input type="email" name={'email'} className={'input customer-email'} placeholder={'Email'} value={email} onChange={onEmailChange} />
                    </Box>
                </Grid>
                {/* <Grid item xs={12} className={'align-center'}>
                            <Box>
                                <input type="number" name={'mobile'} className={'input customer-mobile'} placeholder={'Mobile'}/>
                            </Box>
                        </Grid> */}
                <Grid item xs={6} className={'align-right'}>
                    <PrintButton />
                </Grid>
                <Grid item xs={6} className={'align-left'}>
                    <Box>
                        <Button variant="contained" color="secondary" className={'success-page-button email-sms-button'} onClick={sendEmail}>EMAIL</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} className="align-center">
                    {responseMsgS ?
                        <Alert severity="success">
                            {responseMsgS}</Alert>
                        : null}
                    {responseMsgE ?
                        <Alert severity="error">
                            {responseMsgE}</Alert>
                        : null}
                </Grid>
            </Grid>
        </>
    );
}

export default SendInvToEmail;
