"use client";

import React from "react";

export function GlobalErrorBoundary(props: { children?: React.ReactNode }) {
	return (
		<ErrorBoundary errorComponent={DefaultGlobalErrorPage}>
			{props.children}
		</ErrorBoundary>
	);
}

class ErrorBoundary extends React.Component<{
	children?: React.ReactNode;
	errorComponent: React.FC<{
		error: Error;
		reset: () => void;
	}>;
}> {
	override state: { error?: Error } = {};

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	reset = () => {
		this.setState({ error: null });
	};

	override render() {
		const error = this.state.error;
		if (error) {
			return <this.props.errorComponent error={error} reset={this.reset} />;
		}
		return this.props.children;
	}
}

function DefaultGlobalErrorPage(props: { error: Error; reset: () => void }) {
	return (
		<html>
			<head>
				<title>Unexpected Error</title>
			</head>
			<body
				style={{
					fontFamily:
						'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
					height: "100vh",
					margin: 0,
					display: "flex",
					flexDirection: "column",
					placeContent: "center",
					placeItems: "center",
					fontSize: "16px",
					fontWeight: 400,
					lineHeight: "28px",
				}}
			>
				<div>Caught an unexpected error</div>
				<pre style={{ maxWidth: "80%", textWrap: "wrap" }}>
					Error:{" "}
					{import.meta.env.DEV && "message" in props.error
						? props.error.message
						: "(Unknown)"}
				</pre>
				<button
					onClick={() => {
						React.startTransition(() => {
							props.reset();
						});
					}}
				>
					Reset
				</button>
			</body>
		</html>
	);
}
