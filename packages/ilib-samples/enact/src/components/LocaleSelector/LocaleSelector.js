// eslint-disable-next-line
import React,{Component} from 'react';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Button from '@enact/sandstone/Button';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import VirtualList from '@enact/sandstone/VirtualList';
import ri from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {requestLocaleInfo, updateLocale} from '../../actions';

import css from './LocaleSelector.module.less';

const ContextualButton = ContextualPopupDecorator(Button);
ContextualButton.displayName = 'ContextualButton';

class LocaleSelector extends Component {
    static propTypes = {
        allLocaleList: PropTypes.array.isRequired,
        onLocaleChange: PropTypes.func.isRequired,
        requestLocaleInfo: PropTypes.func,
        selectedLocale: PropTypes.string,
        updateLocale: PropTypes.func
    };

    constructor (props) {
        super(props);
        this.state = {
            open: false
        };
    }

    componentDidMount () {
        this.props.requestLocaleInfo();
        let currentLocale = (typeof window === 'object' && window.PalmSystem && window.PalmSystem.locale) ?
            window.PalmSystem.locale : 'en-US';
        this.props.onLocaleChange(currentLocale);
        this.props.updateLocale(currentLocale);
    }

    openContextualPopup = () => {
        this.setState({open: true});
    };

    closeContextualPopup = () => {
        this.setState({open: false});
    };

    contextualPopupContent = () => (
        <VirtualList
            className={css.localeSelectorPopup}
            itemRenderer={this.renderItem}
            dataSize={this.props.allLocaleList.length}
            itemSize={ri.scale(144)}
        />
    );

    handleCheckLocale = (ev) => {
        const value = ev.currentTarget.outerText.trim() || 'en-US';
        const ret = (/^[a-zA-Z]/.test(value) === false) ? value.slice(2).trim() : value;
        this.props.onLocaleChange(ret);
        this.props.updateLocale(ret);
        this.setState({
            open: false
        });
    };

    renderItem = ({index, ...rest}) => {
        const data = this.props.allLocaleList;
        return (
            <CheckboxItem {...rest} className={css.localeSelectorItem} value={data[index].localeName} selected={data[index].active} onClick={this.handleCheckLocale}>
                {data[index].localeName}
            </CheckboxItem>
        );
    };

    render () {
        return (
            <ContextualButton
                open={this.state.open}
                onClick={this.openContextualPopup}
                onClose={this.closeContextualPopup}
                popupComponent={this.contextualPopupContent}
                spotlightRestrict={'self-only'}
                disabled={this.props.isDingbatState || this.props.isEmojiState}
            >
                {this.props.selectedLocale}
            </ContextualButton>
        );
    }
}

const mapStateToProps = ({isDingbatState, isEmojiState, locale, localeInfoData: {payload: payload}}) => {
    return {
        isDingbatState,
        isEmojiState,
        selectedLocale: locale,
        allLocaleList: payload.locales.map((localeInfo) => ({
            localeName: localeInfo.code,
            active: localeInfo.code === locale
        }))
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestLocaleInfo: () => dispatch(requestLocaleInfo()),
        onLocaleChange: (locale) => dispatch(updateLocale(locale))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(I18nContextDecorator({updateLocaleProp: 'updateLocale'}, LocaleSelector));