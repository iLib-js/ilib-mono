import { defineMessages } from 'react-intl';

const messages = defineMessages({
    message1: {
        id: "myprogram.message1",
        description: "this is a test",
        defaultMessage: "{count, plural, one {This is singular} other {This is plural}}"
    },
    message2: {
        id: "myprogram.message2",
        description: "this is also a test",
        defaultMessage: "{count, plural, one {This is singular} other {This is plural}"
    },
    message3: {
        id: "myprogram.message3",
        description: "this is also a test",
        defaultMessage: "{count, plural, one {This is {singular} other {This is plural}}"
    }
});

export default messages;
