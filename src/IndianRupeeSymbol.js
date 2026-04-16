import { SvgIcon } from '@material-ui/core';
import React from 'react';

const IndianRupeeSymbol = (props) => {
    return (
        <SvgIcon {...props}>
            <path d="M12 2c6.08 0 11 4.92 11 11s-4.92 11-11 11S1 19.08 1 13 5.92 2 12 2zm0 2c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9zm2 7h3.05c.03-.26.05-.52.05-.79 0-1.63-1.32-2.95-2.95-2.95-1.63 0-2.95 1.32-2.95 2.95 0 .27.02.53.05.79H10c.38-1.25 1.57-2.14 2.95-2.14 1.7 0 3.08 1.38 3.08 3.08S15.7 14 14 14c-1.38 0-2.57-.89-2.95-2.14z" />
        </SvgIcon>
    );
};

export default IndianRupeeSymbol;
