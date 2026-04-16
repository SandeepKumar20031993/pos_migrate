import { createTheme } from "@material-ui/core";



const AppTheme = createTheme({
    palette: {
        primary: { main: '#ff2e2e' },
        secondary: { main: '#111', light: '#777' },
        error: { main: '#DC143C', light: '#DC143C' },
        action: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        }

    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            ls: 1080,
            lg: 1280,
            xl: 1920,
            xxl: 2560,
        },
    },
    overrides: {
        MuiFormLabel: {
            root: {
                "&$focused": {
                    color: "#000",
                    BorderColor: "#000 !important"
                }
            },
            focused: {}
        },
        MuiOutlinedInput: {
            root: {
                position: 'relative',
                '& $notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    borderColor: '#000',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                },
                '&$focused $notchedOutline': {
                    borderColor: '#000',
                    borderWidth: 1,
                },
            },
        },
        MuiPickersDay: {
            daySelected: {
                backgroundColor: "#ccc",
                color: "#000"
            },
            current: {
                color: "#000"
            }
        },
    }
});

export default AppTheme
