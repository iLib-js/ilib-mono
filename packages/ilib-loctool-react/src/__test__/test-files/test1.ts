function test1() {
    const messages = defineMessages({
        greeting: {
            id: 'app.bye',
            defaultMessage: 'Bye, {name}!',
            description: 'Bye bye to the user of the app',
        },
    })

    return intl.formatMessage(messages.greeting, {name: 'Natka'})
}
