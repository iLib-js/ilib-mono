// eslint-disable-next-line
import React,{Component} from 'react';
import {Panels} from '@enact/sandstone/Panels';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import {connect} from 'react-redux';
import MainPanel from '../views/MainPanel';

class App extends Component {
    constructor (props) {
        super(props);

        if (typeof document !== 'undefined') {
            document.addEventListener('webOSLocaleChange', function () {
                document.location.reload();
                console.log('webOSLocaleChange');
            }, false);
        }
    }

    onClose = () => {
        if (window) {
            window.close();
        }
    };

    render () {
        const {...props} = this.props;
        delete props.dispatch;

        return (
            <div {...props}>
                <Panels onClose={this.onClose}>
                    <MainPanel />
                </Panels>
            </div>
        );
    }
}

const mapStateToProps = ({locale}) => ({locale});

export default connect(mapStateToProps)(ThemeDecorator(App));
