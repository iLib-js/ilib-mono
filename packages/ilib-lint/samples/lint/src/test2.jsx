import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { targetingApi } from 'components/targeting/targetingApi.js';
import TargetComponent from 'components/targeting/TargetComponent.jsx';
import Modal from 'components/targeting/BaseModal.jsx';

import { messages } from './messages.js';

const SuccessModal = () => {
    const { onClose } = targetingApi();
    return <TargetComponent shouldTarget="true" target="">
            <Modal
                className="SuccessModal"
                isOpen
                onRequestClose={onClose}
                title={intl.formatMessage(message.successModalTitle)}
            >
                <div className="modalBody">
                    Success! Now try upgrading to unlock more functionality.
                    <br/>
                    <FormattedMessage
                        {...messages.successModalBody2}
                        values={{
                            linkToUpgradeModal: (
                                <UpgradeModalButton tracking="upgradeLink">
                                    <FormattedMessage {...messages.upgradeLinkLabel} />
                                </UpgradeModalButton>
                            )
                        }}
                    />
                </div>
            </Modal>
        </TargetComponent>;
}

export default SuccessModal;
