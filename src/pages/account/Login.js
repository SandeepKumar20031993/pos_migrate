import React, { useEffect, useState } from 'react'
import { Typography, Box, Grid, Card, CardActionArea, CardMedia, Fade, Button, TextField, FormGroup, FormControlLabel, Checkbox, IconButton, InputAdornment } from '@material-ui/core'
import { Close, Visibility, VisibilityOff } from '@material-ui/icons';
import Helper from '../../Helper/storeHelper'
import AccountHelper from '../../Helper/actionHelper/accountHelper'
import { useDispatch } from 'react-redux';
import { loadtStoreData, clearStoreData, loginUser, changeStore } from '../../redux/action/isLoggedInAction';
import { loading, alert, resetInteraction } from '../../redux/action/InterAction';
import { clearCounterData } from '../../redux/action/storeCounterAction';
import { clearProducts } from '../../redux/action/productsAction';
import Cookies from 'universal-cookie';
import BannerImage from './Fete-POS-Login-Home-Banner.png'
import { Helmet } from "react-helmet";

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [username_error, setUsernameError] = useState(false);
    const [password_error, setPasswordError] = useState(false);
    const [isStoreLoaded, setIsStoreLoaded] = useState(false);
    const [phone, setPhone] = useState('');
    const [storeCode, setStoreCode] = useState('');
    const [phone_error] = useState(false);
    const [storecode_error] = useState(false);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(clearCounterData());
        dispatch(clearProducts());
        dispatch(resetInteraction());
        dispatch(clearStoreData());
        if (Helper.getStoreApiUrl() && Helper.getStoreName()) {
            setIsStoreLoaded(true);
        }
    }, [dispatch]);

    const rememberLogin = () => {
        let loginCred = AccountHelper.getLoginCredentials();
        if (loginCred) {
            dispatch(loginUser(loginCred, isRemember));
        }
    }

    const handleUsername = event => {
        setUsername(event.target.value);
    }


    const handlePassword = event => {
        setPassword(event.target.value);
    }

    const handlePhone = event => {
        setPhone(event.target.value);
    }

    const handleStoreCode = event => {
        setStoreCode(event.target.value);
    }

    const rememberMe = () => {
        setIsRemember((prev) => !prev);
    }

    const handleSubmit = event => {
        event.preventDefault();
        if (username === '') {
            setUsernameError(true);
            return;
        } else if (password === '') {
            setPasswordError(true);
            return;
        } else {
            setUsernameError(false);
            setPasswordError(false);
        }
        var storecode = Helper.getStoreCode();

        if (storecode) {
            let formData = {
                username: username,
                pwd: btoa(password),
                storecode: storecode
            }
            dispatch(loginUser(formData, isRemember));
        } else {
            dispatch(changeStore());
        }
    }

    const validateStore = (event) => {
        event.preventDefault();
        var formData = {}
        formData.phone = phone
        formData.store_code = storeCode
        dispatch(loading(true));
        dispatch(loadtStoreData(formData))
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    const cookies = new Cookies();
                    const expiryDate = new Date()
                    expiryDate.setMonth(expiryDate.getMonth() + 12)
                    cookies.set('url', resData.data.url, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
                    cookies.set('store_name', resData.data.storename, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
                    cookies.set('feteon_store_code', storeCode, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
                    setIsStoreLoaded(true);
                    dispatch(loading(false));
                } else {
                    dispatch(loading(false));
                    dispatch(alert(true, resData.message));
                }
            })
            .catch(err => {
                dispatch(loading(false));
                dispatch(alert(true, "Something went wrong!"));
                dispatch(clearStoreData());
            });
    }

    const onLoad = () => {
        setBannerLoaded(true);
    }

    const handleChangeStore = () => {
        let isCleared = dispatch(changeStore());
        if (isCleared) {
            setIsStoreLoaded(false);
        }
    }

    const maskPwd = (word) => {
        word = atob(word)
        var masked = word.substring(0, word.length).replace(/[a-z\d]/gi, "x").replace(/[^a-zA-Z]/g, "x");
        return masked
    }

    const removeSavedCred = () => {
        AccountHelper.removeLoginCredentials();
        window.location.reload();
    }

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    }

    var loginCred = AccountHelper.getLoginCredentials();
    return (
            <React.Fragment>
                <Helmet>
                    <title>{Helper.getStoreName()} -Galla App</title>
                </Helmet>
                {!bannerLoaded ?
                    <Box component="div" className="loader-container position-absolute">
                        <Box component="div" className="loader"></Box>
                        <Box component="div" className="loader-text">Loading...</Box>
                    </Box>
                    : null
                }
                <Fade in={bannerLoaded} timeout={3000}>
                    <Box component="div" className="login-container">
                        <Box className="height-100">
                            <Grid container direction="row" justify="space-between" alignItems="center" className="height-100" >
                                <Grid item xs className="login-container height-100">
                                    <Card className="login-container height-100 no-border-radius">
                                        <CardMedia
                                            overlay={'Hi..'}
                                            image={BannerImage}
                                            title="Fete Banner"
                                            className="login-container height-100"
                                        />
                                    <img onLoad={onLoad} src={BannerImage} style={{ display: "none" }} alt="Fete Banner" />
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg className="login-container height-100 max-width-450">
                                    {isStoreLoaded ?
                                        <Box p={3} className="login-container height-100 background-white">
                                            <Grid container direction="row" justify="space-between" alignItems="center" className="height-100 width-100" >
                                            <form onSubmit={handleSubmit} noValidate autoComplete="on" className="width-100">
                                                    <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                        <Grid item xs={12} className="avatar-container-login">
                                                            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                                <Typography variant="h6" component="strong" >{Helper.getStoreName()}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        {loginCred ?
                                                            <React.Fragment>
                                                                <Box pt={2} className="width-100">
                                                                    <Grid item>
                                                                        <Typography variant="body2" className="align-center display-flex" gutterBottom>
                                                                            Your saved credentials(click to login)
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Card className="width-100 position-relative">
                                                                            <div className="position-absolute right-0">
                                                                            <IconButton size="small" onClick={() => removeSavedCred()}>
                                                                                    <Close />
                                                                                </IconButton>
                                                                            </div>
                                                                        <CardActionArea onClick={() => rememberLogin()}>
                                                                                <Box p={2} className="width-100 background-lite-gray">
                                                                                    <Typography variant="caption" component="span">
                                                                                        Username:&nbsp;
                                                                                    </Typography>
                                                                                    <Typography variant="subtitle2" component="strong">
                                                                                        {loginCred.username}
                                                                                    </Typography>
                                                                                    <br />
                                                                                    <Typography variant="caption" component="span">
                                                                                        Password:&nbsp;
                                                                                    </Typography>
                                                                                    <Typography variant="subtitle2" component="span">
                                                                                    {maskPwd(loginCred.pwd)}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </CardActionArea>
                                                                        </Card>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Box pt={2}>
                                                                            <Typography variant="body2" className="align-center bold-i" component="p" >
                                                                                OR
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                </Box>
                                                            </React.Fragment>
                                                            : null
                                                        }

                                                        <React.Fragment>
                                                            <Box className="width-100">

                                                                <Grid item xs={12}>
                                                                    <TextField
                                                                        required
                                                                        error={username_error}
                                                                        id="username"
                                                                        name="username"
                                                                        type="text"
                                                                        label="Username"
                                                                        margin="normal"
                                                                        className="width-100"
                                                                        value={username}
                                                                    onChange={handleUsername}
                                                                        variant="outlined"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <TextField
                                                                        required
                                                                        error={password_error}
                                                                        id="password"
                                                                        name="password"
                                                                        type={showPassword ? "text" : "password"}
                                                                        label="Password"
                                                                        margin="normal"
                                                                        className="width-100"
                                                                        value={password}
                                                                    onChange={handlePassword}
                                                                        variant="outlined"
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        onClick={() => handleShowPassword()}
                                                                                    >
                                                                                        {showPassword ?
                                                                                            <VisibilityOff />
                                                                                            :
                                                                                            <Visibility />
                                                                                        }
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <FormGroup>
                                                                        <FormControlLabel
                                                                            label="Save for quick login"
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={isRemember}
                                                                                    onChange={rememberMe}
                                                                                />
                                                                            } />
                                                                    </FormGroup>
                                                                </Grid>
                                                                <Grid item container xs={12} justify="space-between" alignItems="flex-end">
                                                                    <Grid item>
                                                                        <Button type="button" size="small" className="light-gray" onClick={() => handleChangeStore()}>
                                                                            Change Store
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Button type="submit" size="large" variant="contained" color="secondary" className="">
                                                                            Login
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </React.Fragment>
                                                    </Grid>
                                                </form>
                                            </Grid>
                                        </Box>
                                        :
                                        <Box p={3} className="login-container height-100 background-white">
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-between"
                                                alignItems="center"
                                                className="height-100"
                                            >
                                            <form onSubmit={validateStore} noValidate autoComplete="on">
                                                    <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                        {/* <Grid item xs={12} className="avatar-container-login">
                                                            <Grid container direction="row" justify="center" alignItems="center" spacing={0}
                                                            >
                                                                <img alt="FETE Logo" src={`https://feteon-content.s3.ap-south-1.amazonaws.com/Feteon.png`} className="fete-logo-icon" />
                                                            </Grid>
                                                        </Grid> */}
                                                        <Grid item xs={12} className="avatar-container-login">
                                                            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                                <Typography variant="h6" component="strong" >Galla</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                error={phone_error}
                                                                id="phone"
                                                                name="phone"
                                                                type="text"
                                                                label="Phone"
                                                                margin="normal"
                                                                className="width-100"
                                                                value={phone}
                                                            onChange={handlePhone}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                error={storecode_error}
                                                                id="storecode"
                                                                name="storecode"
                                                                type="text"
                                                                label="Store Code"
                                                                margin="normal"
                                                                className="width-100"
                                                                value={storeCode}
                                                            onChange={handleStoreCode}
                                                                variant="outlined"
                                                            />
                                                            <Box p={1} />
                                                        </Grid>
                                                        <Grid item container xs={12} justify="flex-end">
                                                            <Button type="submit" size="large" variant="contained" color="secondary" className="">
                                                                Validate
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </Grid>
                                        </Box>
                                    }
                                    <Box className="absolute display-flex align-item-baseline right-15 top-15 galla-app-logo-box">
                                        <img alt="FETE Logo" src={`${process.env.PUBLIC_URL}/assets/images/Galla-Web-Logo-2.png`} className="fete-logo-icon" />
                                        {/* <span className="partner-text">partnered</span>
                                        <img alt="Softomation-Logo" src={`${process.env.PUBLIC_URL}/assets/images/Softomation-Logo.jpg`} className="partner-logo-icon" width="100" /> */}
                                    </Box>

                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                </Fade>
            </React.Fragment>
    )
}

export default Login;
