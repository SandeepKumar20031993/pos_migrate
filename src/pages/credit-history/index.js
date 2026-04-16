import React, { useCallback, useEffect, useState } from 'react'
import { Box, Paper, Grid, List, ListItem, Divider, Typography, TextField, Button } from '@material-ui/core';
import 'date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Search } from '@material-ui/icons';
import { useDispatch } from "react-redux";
import { loadCreditPayments } from '../../redux/action/creditAction';
import CartHelper from '../../Helper/cartHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { loading } from '../../redux/action/InterAction';
import CreditPayPopup from "../../pages/customer-history/CreditPayPopup"

function CreditHistory() {
    const dispatch = useDispatch();
    const today = new Date();
    const initialFromDate = new Date().setMonth(today.getMonth() - 1);

    const [mobile, setMobile] = useState("");
    const [from, setFrom] = useState(initialFromDate);
    const [to, setTo] = useState(today);
    const [creditRecord, setCreditRecord] = useState({});
    const [popup, setPopup] = useState(false);
    const [creditData, setCreditData] = useState({});

    const formatDate = useCallback((params) => {
        if (params) {
            const dd = params.getDate();
            const mm = params.getMonth() + 1;
            const yyyy = params.getFullYear();
            return dd + '/' + mm + '/' + yyyy;
        }
        return "";
    }, []);

    const fetchCreditPayments = useCallback((pageseq) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const form = {};
        form.phone = mobile
        form.from_date = formatDate(fromDate)
        form.to_date = formatDate(toDate)
        form.pageseq = pageseq
        dispatch(loading(true))
        dispatch(loadCreditPayments(form))
            .then(res => res.json())
            .then(res => {
                dispatch(loading(false))
                if (res && res.success) {
                    setCreditRecord(res)
                }
            })
            .catch(() => {
                dispatch(loading(false))
            })
    }, [dispatch, formatDate, from, mobile, to]);

    useEffect(() => {
        dispatch(pageTitle('Credit history'));
        fetchCreditPayments(1);
    }, [dispatch, fetchCreditPayments]);

    const payCredit = useCallback(() => {
        const nextCreditData = {
            "credit_amt": creditRecord.data[0].closing_bal,
            "customer_phone": mobile,
            "customer_name": creditRecord.data[0].cname

        };

        setCreditData(nextCreditData);
        setPopup(true);
    }, [creditRecord.data, mobile]);

    const handleMobile = useCallback((e) => {
        const mobNo = e.target.value;
        setMobile(mobNo);
        setCreditRecord({});
    }, []);

    const closePopup = useCallback(() => {
        fetchCreditPayments(1);
        setPopup(false);
    }, [fetchCreditPayments]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        fetchCreditPayments(1);
    }, [fetchCreditPayments]);

    const getTransText = useCallback((trans) => {
        let text = "";
        const creditAmt = Number(trans.credit_amt);
        const debitAmt = Number(trans.debit_amt);
        if (creditAmt) {
            text = "Credit:" + CartHelper.getCurrencyFormatted(trans.credit_amt);
        } else {
            text = (debitAmt) ? "Paid:" + CartHelper.getCurrencyFormatted(trans.debit_amt) : "";
        }
        return text;
    }, []);

    return (
        <Box p={1} className="height-100-overflow">
            <form className=" height-100" onSubmit={onSubmit}>
                    <Box p={2} pl={0} pb={1}>
                        <Grid container direction="row">
                            <Grid item xs sm={10} md={8} lg={6}>
                                <Grid container direction="row" alignItems="flex-start" spacing={2}>
                                    <Grid item xs>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="flex-start">
                                                <KeyboardDatePicker
                                                    required
                                                    id="from-date-picker-dialog"
                                                    label="From"
                                                    format="dd/MM/yyyy"
                                                    value={from}
                                                    size="small"
                                                    inputVariant="outlined"
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={setFrom}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    required
                                                    id="to-date-picker-dialog"
                                                    label="To"
                                                    format="dd/MM/yyyy"
                                                    value={to}
                                                    size="small"
                                                    inputVariant="outlined"
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={setTo}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs={5}>
                                        <Grid container direction="row" alignItems="flex-start">
                                            <Grid item xs>
                                                <TextField
                                                    // required
                                                    label="Mobile"
                                                    variant="outlined"
                                                    value={mobile}
                                                    className="width-100"
                                                    size="small"
                                                    type="number"
                                                    onChange={handleMobile}
                                                    // error={mobileError}
                                                />
                                                {/* {mobileError ?
                                                    <Typography variant="caption">Enter valid mobile number</Typography>
                                                    :
                                                    <Typography variant="caption">&nbsp;</Typography>} */}
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    className="search-button"
                                                    variant="contained"
                                                    color="secondary"
                                                    size="large"
                                                >
                                                    <Search />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {mobile && !CartHelper.isEmpty(creditRecord) && creditRecord.data.length > 0 && creditRecord.data[0].closing_bal > 0 ?
                                        <Grid item xs={2}>
                                            <Grid container direction="row" alignItems="flex-start">
                                                <Grid item>
                                                    <Button
                                                        onClick={payCredit}
                                                        className="search-button"
                                                        variant="contained"
                                                        color="secondary"
                                                        size="large"
                                                    >
                                                        Pay Credit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        : ""}

                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {!CartHelper.isEmpty(creditRecord) && creditRecord.success ?
                        <Paper className="width-100 clearfix" square={true}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box p={1}>
                                        <Grid container>
                                            <Grid item>
                                                <Typography variant="subtitle2" component="strong">
                                                    Records found:{!CartHelper.isEmpty(creditRecord) && creditRecord.recordscount ? creditRecord.recordscount : 0}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" component="strong"></Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Grid container direction="row" justify="center" spacing={1} className="align-center-important">
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Date</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Customer</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Customer Phone</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Opening Balance</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Transaction Amount</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Closing Balance</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Comment</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {creditRecord.data && creditRecord.data.length > 0 ?
                                        <List>
                                            {creditRecord.data.map((transaction, i) => (
                                                <React.Fragment key={i}>
                                                    {i !== 0 ? <Divider /> : null}
                                                    <ListItem className="user-select-auto" >
                                                        <Grid container direction="row" justify="center" spacing={1} className="align-center-important">
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{transaction.cdate}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{transaction.cname}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{transaction.cphone}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{CartHelper.getCurrencyFormatted(transaction.opening_bal)}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{getTransText(transaction)}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{CartHelper.getCurrencyFormatted(transaction.closing_bal)}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{transaction.comment}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                        : null
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                        : <Paper square={true}>
                            <Box pt={3} pb={3} className="height-100">
                                <Grid container direction="row" justify="center">
                                    <Typography variant="h6" component="span">Records not found</Typography>
                                </Grid>
                            </Box>
                        </Paper>
                    }
            </form>
            {!CartHelper.isEmpty(creditRecord) && creditRecord.success ?
                <CreditPayPopup popup={popup && !CartHelper.isEmpty(creditRecord)} credit={creditData} closePopup={closePopup} />
                : null
            }
        </Box>
    )
}

export default CreditHistory
