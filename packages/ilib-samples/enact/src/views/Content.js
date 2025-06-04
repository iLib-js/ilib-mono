// eslint-disable-next-line
import React,{Component} from 'react';
import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import DateFormat from '../components/DateFormat';
import Localization from '../components/Localization';

const pages = {
    'Date Format': <DateFormat />,
    'Localization': <Localization />
};

class Content extends Component {
    constructor (props) {
        super(props);
    }

    pageList = () => {
        let contentList = [];
        function getTab (pageName, page, index) {
            return (
                <Tab
                    key={index}
                    title={pageName}
                >
                    {page}
                </Tab>
            );
        }

        for (const [pageName, page] of Object.entries(pages)) {
            contentList.push(getTab(pageName, page, contentList.length));
        }
        return contentList;
    };

    render () {
        return (
            <TabLayout>
                {this.pageList()}
            </TabLayout>
        );
    }
}

export default Content;
