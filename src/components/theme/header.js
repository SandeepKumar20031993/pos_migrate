import React, { useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import LeftDrawer from './drawer';
import { Grid, Typography, Toolbar, IconButton, Box } from '@material-ui/core';
//import { NotificationsNone} from '@material-ui/icons';
//import CategoryItem from '../AppBar/Category';
//import CustomerItem from '../AppBar/Customer';
//import Item from '../AppBar/Item';
import SearchByName from '../Search/searchByName';
//import SearchCustomer from '../Search/searchCustomer';
//import SearchByCategory from '../Search/searchByCategory';
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import StoreHelper from '../../Helper/storeHelper'
import Clock from './Clock';
import Helper from '../../Helper/storeHelper';
import { Helmet } from "react-helmet";
import CheckDueDate from '../account/CheckDueDate';
import SyncMenu from '../common/header/SyncMenu';

function Header() {
    const theme = useSelector((state) => state.theme);
    const isLogged = useSelector((state) => state.isLogged);
    const [open, setOpen] = useState(false);
    const [productSearch] = useState(true);

    const handleMenu = () => {
        setOpen(true);
    }

    const handleMenuClose = () => {
        setOpen(false);
    }

    return (
            <React.Fragment>
                <Helmet>
                    <title>{Helper.getStoreName()} -Galla App</title>
                </Helmet>
            {isLogged && StoreHelper.isLoggedIn() ?
                    <>
                        {/* position="fixed" */}
                        <Box style={{ width: '100%', backgroundColor: '#ffffff' }} position={'relative'} elevation={1} id='main-header' className="padding-0">
                            <Toolbar style={{ backgroundColor: '#fff', borderBottomColor: "#111", borderBottomWidth: '2px', boxShadow: '0px 0px 5px 5px #f2f2f2', zIndex: 50 }}  >
                            <IconButton title="Menu [Alt+M]" id="menu-icon-btn" edge="start" color="inherit" aria-label="menu" onClick={handleMenu}>
                                    <MenuIcon />
                                </IconButton>
                                <Grid container direction="row" justifyContent={'space-between'} alignItems="center">
                                    <Grid item xs={2} className="page-title-max-width">
                                        <Typography variant="subtitle1" component="strong" className="font-weight-900">
                                        {theme.pageTitle}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs container direction="row" alignItems="center">
                                        {/* {categorySearch ?
                                            <Grid item xs className={'position-relative'}>
                                                <Box pr={1}>
                                                    <SearchByCategory />
                                                </Box>
                                            </Grid>
                                            : null} */}
                                        {productSearch ?
                                            <Grid item xs className="position-relative product-search-maxwidth">
                                                <Box pr={1}>
                                                    <SearchByName />
                                                </Box>
                                            </Grid>
                                            : null}
                                        {/* {customerSearch ?
                                            <Grid item xs>
                                                <Box pr={1}>
                                                    <SearchCustomer />
                                                </Box>
                                            </Grid>
                                            : null} */}
                                    </Grid>
                                    <Grid item>
                                        <Box pl={1} pr={2}>
                                            <CheckDueDate />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Grid container justifyContent="flex-end" alignItems="center">
                                            <Grid item>
                                                <Box pr={2} className="align-right-important display-grid">
                                                    <Typography variant='body2' component='span' noWrap={true}>
                                                        Store : {Helper.getLocationName()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box pl={2} className="align-right-important">
                                                    <Clock />
                                                    {/* <IconButton>
                                                        <NotificationsNone className={'notification'} />
                                                    </IconButton> */}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <SyncMenu />
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </Box>
                        {/* <Box p={4} /> */}
                    <LeftDrawer open={open} close={handleMenuClose} />
                    </>
                    : <Redirect to={`${process.env.PUBLIC_URL}/login`} />}
            </React.Fragment>
    )
}

export default Header
