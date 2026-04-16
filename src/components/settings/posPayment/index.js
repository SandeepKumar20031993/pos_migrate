import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Card, CardContent, CardHeader, Checkbox, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";

import { pageTitle } from "../../../redux/action/themeAction";
import StoreHelper from '../../../Helper/storeHelper'
import PhonelinkRingIcon from '@material-ui/icons/PhonelinkRing';
import { Alert } from "@material-ui/lab";

function PosPaymentSettings() {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        dispatch(pageTitle("POS Settings"));
        const val = StoreHelper.getDefaultPineLabsTerminal() ?? null;
        setSelected(val);
    }, [dispatch]);

    const handleSetDefault = (item) => {
        StoreHelper.setInSession('default_pinelabs_terminal', JSON.stringify(item))
        setSelected(item);
    };

    const pineLabsTerminals = StoreHelper.getPineLabsTerminals();

    return <Card>
            <CardHeader title={<Typography>POS payment Settings</Typography>} />
            <CardContent>
                Select Pinelabs Terminal
                <Grid container>
                    <Grid item xs={6}>

                        <List dense >
                            {Boolean(pineLabsTerminals?.length) ? pineLabsTerminals.map((item, index) => {
                                const labelId = `checkbox-list-secondary-label-${index}`;
                                return (
                                    <ListItem key={index} button>
                                        <ListItemAvatar>
                                            {/* <Avatar
                alt={`Avatar n°${value + 1}`}
                src={`/static/images/avatar/${value + 1}.jpg`}
              /> */}
                                            <PhonelinkRingIcon />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={item?.terminal_name} />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={() => { handleSetDefault(item) }}
                                                checked={item?.terminal_name === selected?.terminal_name}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            }) : <Alert severity="warning" >No terminals data found. Contact System Admin</Alert>}
                        </List>

                    </Grid>
                </Grid>

            </CardContent>
        </Card >;
}

export default PosPaymentSettings;
