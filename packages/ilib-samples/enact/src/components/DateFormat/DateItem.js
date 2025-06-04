 // eslint-disable-next-line
import React from 'react';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import DateFmt from 'ilib/lib/DateFmt';
import PropTypes from 'prop-types';

import {dateTypeList} from './DateFormat';

const DateItem = kind({
    name: 'DateItem',

    propTypes: {
        selectedDate: PropTypes.object.isRequired,
        index: PropTypes.number
    },

    computed: {
        iLibFormat: ({index/* , selectedDate*/}) => {
            const selectedDateType = dateTypeList[index];

            return new DateFmt({
                date: selectedDateType['date'],
                length: selectedDateType['length'],
                type: selectedDateType['type'],
                time: selectedDateType['time'],
                clock: selectedDateType['clock']
            });
        }
    },

    render: ({iLibFormat, type, selectedDate, ...rest}) => {
        delete rest['selectedDateType'];

        return (
            <Row {...rest}>
                <Cell>{type}</Cell>
                <Cell>{iLibFormat.template}</Cell>
                <Cell>{iLibFormat.format(selectedDate)}</Cell>
            </Row>
        );
    }
});

export default DateItem;