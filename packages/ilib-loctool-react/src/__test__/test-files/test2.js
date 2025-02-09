function test2() {
    const messages = defineMessages({
        greeting: {
            id: 'app.greeting',
            defaultMessage: 'Hello, {name}!',
            description: 'Greeting to welcome the user to the app',
        },
    })

    return intl.formatMessage(messages.greeting, {name: 'Natka'})
}
