/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type FallBackProps = {
    error: object
}
type ErrorBoundaryProps = {
    fallback: React.FC<FallBackProps>,
    children: React.ReactNode
}

type ErrorBoundaryState = { error?: object };

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {} as ErrorBoundaryState;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return {error: error};
    }

    componentDidCatch(error: Error, info: any) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        // logErrorToMyService(error, info.componentStack);
        console.log(error.message, info.componentStack)
    }

    render() {
        const state = this.state as ErrorBoundaryState;
        const props = this.props as ErrorBoundaryProps;
        if (state.error !== undefined) {
            return <props.fallback error={state.error}/>;
        }
        return props.children;
    }
}
