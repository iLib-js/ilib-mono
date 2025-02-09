export function List(props) {
    return (
        <section>
            <header>
                <FormattedMessage
                    defaultMessage="JSX Control Panel"
                    description="A sample message for JSX file"
                />
            </header>
            <ul>
                <li>
                    <button>
                        <FormattedMessage
                            defaultMessage="JSX with props interpolation {name}"
                            description="Interpolated name prop"
                            values={{
                                name: props.name,
                            }}
                        />
                    </button>
                </li>
                <PasswordChange />
            </ul>
        </section>
    )
}
