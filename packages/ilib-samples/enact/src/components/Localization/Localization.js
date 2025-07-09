// eslint-disable-next-line
import React,{Component} from 'react';
import $L from '@enact/i18n/$L';
import BodyText from '@enact/sandstone/BodyText';
import Heading from '@enact/sandstone/Heading';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Localization extends Component {
    static propTypes = {
        currentLocale: PropTypes.string
    };

    constructor (props) {
        super(props);
    }

    handleChange = (ev) => {
        this.setState({
            value: ev.value
        });
    };

    getStringWithVariable = () => {
        let currentLocale = this.props.currentLocale;
        let str = new IString($L("Current locale is '{localeStr}'"));
        let fmtStr = str.format({localeStr: currentLocale});
        return fmtStr;
    };

    render () {
        return (
            <div>
                <Heading>[ Localization String Test ]</Heading>
                <BodyText>{$L('Hello')}</BodyText>
                <BodyText>{this.getStringWithVariable()}</BodyText>
            </div>
        );
    }
}

const mapStateToProps = ({
    locale
}) => {
    return {
        currentLocale: locale
    };
};

export default connect(mapStateToProps)(Localization);
