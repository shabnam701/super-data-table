import React from 'react';

export default class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true, errorInfo: errorInfo })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1 style={{ color: "tomato" }}>Failed to render data table. Please try again later.</h1>;
        }

        return this.props.children;
    }
}
