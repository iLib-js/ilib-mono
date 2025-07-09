// eslint-disable-next-line
import React from 'react';
import kind from '@enact/core/kind';
import $L from '@enact/i18n/$L';
import {Panel, Header} from '@enact/sandstone/Panels';
import LocaleSelector from '../components/LocaleSelector';
import Content from './Content';

const MainPanel = kind({
    name: 'MainPanel',
    render: () => (
        <Panel>
            <Header title={$L('iLib on Enact')}>
                <LocaleSelector />
            </Header>
            <Content />
        </Panel>
    )
});

export default MainPanel;