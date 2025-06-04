import { NavBar, NavItem } from '../components/NavBar.js';
import { injectRB } from '../utils/i18n.js';
import * as React from 'react';

class LeftNavBar extends React.Component {
    defaultProps = {
        shouldInitialize: false
    };

    state = {
        root: null,
        isLoading: true,
        navId: -1
    };

    componentDidMount() {
        const { navId } = this.props;
        if (shouldIniitalize) {
            this.setNavId(navId);
        }
    }
    
    componentDidUpdate(prevProps) {
        const { navId } = this.props;
        
        if (!prevProps.shouldInitialize && shouldInitialize) {
            this.setNavId(navId);
        }
    }
    
    render() {
        const { navId, isLoading, root } = this.state;
        
        return (
            <div className='navbar-wrapper'>
                <NavBar navId={navId}>
                    <NavItem label={RB.getString("Products")} target="./products/" />
                    <NavItem label={RB.getString("Solutions")} target="./solutions/" />
                    <NavItem label={ RB.getString ( "Documentation" ) } target="./docs/" />
                    <NavItem label={RB.getString("For Developers", "navbar.label.for.developers")} target="./dev/" />
                    <NavItem label={RB.getString("About Us")} target="./aboutus/" />
                </NavBar>
            </div>
        );
    }
}

export default injectRB(LeftNavBar);
