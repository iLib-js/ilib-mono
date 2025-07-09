 // eslint-disable-next-line
import React,{Component} from 'react';
import $L from '@enact/i18n/$L';
import BodyText from '@enact/sandstone/BodyText';
import DatePicker from '@enact/sandstone/DatePicker';
import Heading from '@enact/sandstone/Heading';
import Spottable from '@enact/spotlight/Spottable';
import TimePicker from '@enact/sandstone/TimePicker';
import VirtualList from '@enact/sandstone/VirtualList';
import Changeable from '@enact/ui/Changeable';
import {Column, Row, Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import DateFmt from 'ilib/lib/DateFmt';
import DateItem from './DateItem';
import css from './DateFormat.module.less';

const types = {
    dateType: {
        date: ['dmwy'],
        length: ['short', /*'medium', 'long',*/ 'full']
    },
    timeType: {
        clock: [''/*, '12', '24'*/],
        time: ['ahmsz', 'ahms']
    },
    datetimeType: {
        length: ['short', /*'medium', 'long',*/ 'full']
    }
};

export let dateTypeList = [];
let idx = 0;

for (let i = 0; i < types.dateType.date.length; i++) {
    for (let j = 0; j < types.dateType.length.length; j++) {
        let obj = {};
        obj['type'] = 'date';
        obj['date'] = types.dateType.date[i];
        obj['length'] = types.dateType.length[j];
        dateTypeList[idx++] = obj;
    }
}

for (let i = 0; i < types.timeType.clock.length; i++) {
    for (let j = 0; j < types.timeType.time.length; j++) {
        let obj = {};
        obj['type'] = 'time';
        obj['clock'] = types.timeType.clock[i];
        obj['time'] = types.timeType.time[j];
        dateTypeList[idx++] = obj;
    }
}

for (let i = 0; i < types.datetimeType.length.length; i++) {
    let obj = {};
    obj['type'] = 'datetime';
    obj['length'] = types.datetimeType.length[i];
    dateTypeList[idx++] = obj;
}

const Picker = Changeable(DatePicker);
const ChangeableTimePicker = Changeable(TimePicker);

const SpottableDateItem = Spottable(({...rest}) => (
    <DateItem {...rest} />
));

const SpottableBodyText = Spottable(({...rest}) => (
    <BodyText {...rest} />
));

class DateFormat extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dateNow: new Date()
        };
    }

    handleOnChangeDateByDate = (e) => {
        this.setState((prevState) => {
            const date = prevState.dateNow;
            date.setFullYear(e.value.getFullYear());
            date.setMonth(e.value.getMonth());
            date.setDate(e.value.getDate());
            return {dateNow: date};
        });
    };

    handleOnChangeDateByTime = (e) => {
        this.setState((prevState) => {
            const date = prevState.dateNow;
            date.setHours(e.value.getHours());
            date.setMinutes(e.value.getMinutes());
            date.setSeconds(e.value.getSeconds());
            return {dateNow: date};
        });
    };

    renderItem = ({index, key, ...rest}) => {
        return (
            <SpottableDateItem
                key={key}
                className={css.formattedDateListItem}
                index={index}
                selectedDate={this.state.dateNow}
                {...rest}
            />
        );
    };

    render = () => {
        const formatter = new DateFmt({type:"datetime", length:"full"});

        return (
            <Column>
                <Row>
                    <Cell>
                        <BodyText>{$L('Pick a Date')}</BodyText>
                        <Picker onChange={this.handleOnChangeDateByDate}>
                            Date Picker
                        </Picker>
                    </Cell>
                    <Cell>
                        <BodyText>{$L('Pick a Time')}</BodyText>
                        <ChangeableTimePicker onChange={this.handleOnChangeDateByTime}>
                            Time Picker
                        </ChangeableTimePicker>
                    </Cell>
                    <Cell>
                        <BodyText>{$L('Converted DateTime')}</BodyText>
                        <SpottableBodyText className={css.convertedDateText}>
                            {formatter.format(this.state.dateNow)}
                        </SpottableBodyText>
                    </Cell>
                </Row>
                <Row>
                    <Cell>
                        <Heading size="medium">{$L('Formatted Date')}</Heading>
                        <VirtualList
                            className={css.formattedDateList}
                            dataSize={dateTypeList.length}
                            itemSize={ri.scale(136)}
                            itemRenderer={this.renderItem}
                        />
                    </Cell>
                </Row>
            </Column>
        );
    };
}

export default DateFormat;
