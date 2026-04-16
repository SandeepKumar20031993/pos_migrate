import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { withRouter } from 'react-router';
import { Chip } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { checkDueDate } from "../../redux/action/customerAction"
import StoreHelper from '../../Helper/storeHelper';

export function CheckDueDate({ history }) {
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state.storeData);
    const timeOutRef = useRef(null);
    const reDirTimerRef = useRef(null);

    const subsData = useMemo(() => storeData?.subs_data || "", [storeData]);
    const days = subsData?.days ? subsData.days : 0;
    const showSubsMsg = Boolean(subsData && Number(days) <= 5);

    const runCheckDueDate = useCallback(() => {
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
            dispatch(checkDueDate());
            StoreHelper.setInCookie('galla_subs_checked', true);
        }, 1000);
    }, [dispatch]);

    const redirect = useCallback(() => {
        let currentLocation = history.location.pathname;
        let paymentduepage = `${process.env.PUBLIC_URL}/paymentdue`;
        if (currentLocation !== paymentduepage) {
            history.push(paymentduepage);
        }
    }, [history]);

    useEffect(() => {
        runCheckDueDate();

        return () => {
            clearTimeout(timeOutRef.current);
            clearTimeout(reDirTimerRef.current);
        };
    }, [runCheckDueDate]);

    useEffect(() => {
        if (!StoreHelper.getFromCookie('galla_subs_checked')) {
            runCheckDueDate();
        }

        clearTimeout(reDirTimerRef.current);
        reDirTimerRef.current = setTimeout(() => {
            if (subsData && days <= 0) {
                redirect();
            }
        }, 1000);

        return () => {
            clearTimeout(reDirTimerRef.current);
        };
    }, [days, redirect, runCheckDueDate, subsData]);

    return (
        <>
            {showSubsMsg ?
                <>
                    {Number(days) > 0 ?
                        <div>
                            <Chip label={"Remaining days " + days + " to renew."} variant="outlined" className="warning-btn width-100" />
                        </div>
                        :
                        <div>
                            <Chip label={"Subscription expired."} variant="default" className="warning-btn width-100" />
                        </div>
                    }
                </>
                : null
            }
        </>
    )
}

export default withRouter(CheckDueDate);
