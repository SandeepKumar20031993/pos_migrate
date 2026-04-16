import React, { Fragment, useCallback, useRef, useState } from 'react'

import toast from 'react-hot-toast';
import ReactToPrint from 'react-to-print';

import 'date-fns';

import { Box, Button, Card, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, CardContent } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';

import { getCashRegisterReport } from '../../redux/action/salesRecordAction';
import StoreHelper from '../../Helper/storeHelper';

import DateRangeIcon from '@material-ui/icons/DateRange';
import { formattDate } from '../../utils/date-time';
import ReportPrint from '../../components/CheckOutPage/Print/ReportPrint';

function CashRegisterReport() {
    const componentRef = useRef(null);
    const [reports, setReports] = useState(null);
    const [resp, setResp] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [timeRange, setTimeRange] = useState({
        startTime: '00:00',
        endTime: '23:59'
    });

    const handleDateChange = useCallback((ranges) => {
        const selectedRange = ranges.selection;
        setDateRange(selectedRange);
        setTimeRange({
            startTime: '00:00',
            endTime: '23:59'
        });
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handleApply = useCallback(async () => {
        const from_date = formattDate(dateRange?.startDate);
        const to_date = formattDate(dateRange?.endDate);

        setReports(null);
        const location = StoreHelper.getLocationId();
        const nextResp = await getCashRegisterReport({
            location,
            from_date,
            to_date,
            "salestype": "all"
        })
            .then((result) => {
                return result;
            }).catch((err) => {
                console.error("error", err);
                return null
            });

        if (nextResp?.success) {
            setReports(nextResp?.data);
            setResp(nextResp);
        } else {
            toast.error(nextResp?.msg ?? 'Error fetching details!.');
        }

        handleCloseDialog();
    }, [dateRange?.endDate, dateRange?.startDate, handleCloseDialog]);

    React.useEffect(() => {
        handleApply();
    }, [handleApply]);

    return (
        <Fragment>
            <Container>
                <Card p={3}>
                    <CardHeader title={
                        <Box style={{ display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '40px' }} >
                            <Typography>Cash Register Report</Typography>
                        </Box>}
                        action={
                            <Button
                                variant='contained'
                                color='secondary'
                                endIcon={<DateRangeIcon />}
                                onClick={() => { setDialogOpen(true) }}>
                                Select  Date Range
                            </Button>
                        }
                    />
                    <CardContent>
                        <Typography>
                            {'Reports from ' + formattDate(dateRange?.startDate) + ' to ' + formattDate(dateRange?.endDate)}
                        </Typography>
                        {resp && resp?.success && resp?.data == null && <>{resp?.msg}</>}
                        <Divider />
                        {reports && <>
                            {reports?.date_range &&
                                <>
                                    <Typography variant='h5' style={{ marginBottom: '16px' }} align='center'>{reports?.date_range}</Typography>
                                    <Typography variant='h5' style={{ marginBottom: '16px' }} align='center'>Time : {timeRange?.startTime} to {timeRange?.endTime}</Typography>
                                </>}
                            <ReportData reports={reports} timeRange={timeRange} />

                            <ReactToPrint
                                trigger={() => <Button variant="contained" color="secondary" className={'success-page-button print-button'} >PRINT</Button>}
                                content={() => componentRef.current}
                            />
                            <div style={{ display: "none" }}><ReportPrint reports={reports} timeRange={timeRange} ref={componentRef} /></div>
                        </>}
                    </CardContent>
                </Card>
            </Container>

            <Dialog open={dialogOpen}>
                <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                    Select Date Range
                </DialogTitle>
                <DialogContent>
                    <DateRangePicker
                        maxDate={new Date()}
                        ranges={[dateRange]}
                        onChange={handleDateChange}
                    />
                    <Grid container spacing={6} >
                        <Grid item xs={6} >
                            <TextField
                                id="startTime"
                                name="startTime"
                                value={timeRange.startTime}
                                fullWidth
                                onChange={(e) => {
                                    setTimeRange({ ...timeRange, [e.currentTarget.name]: e.currentTarget.value })
                                }}
                                label="Start Time"
                                type="time"
                                inputProps={{
                                    step: 300,
                                }} />
                        </Grid>

                        <Grid item xs={6} >
                            <TextField
                                id="endTime"
                                name="endTime"
                                value={timeRange.endTime}
                                fullWidth
                                onChange={(e) => {
                                    setTimeRange({ ...timeRange, [e.currentTarget.name]: e.currentTarget.value })
                                }}
                                label="End Time"
                                type="time"
                                inputProps={{
                                    step: 300,
                                }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => {
                        setDialogOpen(false)
                    }} >
                        Close
                    </Button>
                    <Button autoFocus onClick={handleApply} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default CashRegisterReport


function ReportData({ reports }) {
    const payments = reports?.payments_modes
    const total = reports?.totals
    let rows = {
        'Total Bills': total?.total_bills,
        'Total Items Sold': total?.total_items_sold,
        // 'Total MRP': total?.total_mrp,
        'Total Subtotal': total?.total_subtotal,
        'Total Tax': total?.total_tax,
        'Total Net Sales Amount': total?.total_net_total,
        'Total Taxable Amount': total?.total_taxable_tax,
        'Total CGST': total?.total_sgst,
        'Total SGST': total?.total_cgst,
    }
    /* total_taxable_tax
total_sgst
total_cgst*/

    return <Fragment>
        <TableContainer component={Container} maxWidth={"sm"} >
            <Typography>Total Amount</Typography>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Value ({StoreHelper.getCurrencySymbol()})</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(rows).map((row, index) => (

                        <TableRow key={'total-amount-report bil' + index}>
                            <TableCell component="th" scope="row">
                                {row}
                            </TableCell>
                            <TableCell align="right">{rows[row]}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>


            <Typography style={{ marginTop: '10px' }}>Payment Modes</Typography>
            <Table aria-label="simple table">

                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Value ({StoreHelper.getCurrencySymbol()})</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(payments).map((payment, index) => (

                        <TableRow key={'payment-type-total' + index}>
                            <TableCell component="th" scope="row">
                                {payment}
                            </TableCell>
                            <TableCell align="right">{payments[payment]}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>




        {/* Print report code blow */}
        {/* <Box display={'inline-flex'} justifyContent={'end'}>
            <Button variant='contained' color='secondary'> Print</Button>
        </Box>

        <ReactToPrint
            trigger={() => <Button ref={this.state.buttonref} variant="contained" color="secondary" className={'success-page-button print-button'} >PRINT</Button>}
            content={() => this.componentRef}
        />
        <div style={{ display: "none" }}><ReportPrint ref={el => (this.componentRef = el)} /></div> */}


    </Fragment>
}
