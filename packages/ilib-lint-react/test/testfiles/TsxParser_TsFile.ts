import * as React from "react";
import { Component, type CommonProps } from "components";

interface WrappedComponentProps extends CommonProps {
    count: number;
}

export class WrappedComponent extends React.Component<WrappedComponentProps> {
    render(): JSX.Element {
        return React.createElement(Component, {
            label: this.props.label,
            count: this.props.count
        });
    }
}

export default WrappedComponent;
