import { getRequest } from "./context";
import "./index.css";
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/not-found";
import { PropertySearchPage } from "./pages/property-search";
import "@fontsource-variable/inter";

export function Root() {
	const request = getRequest();
	const url = new URL(request.url);

	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>React Rental Agency</title>
			</head>
			<body className="antialiased">
				{(() => {
					switch (url.pathname) {
						case "/": {
							return <HomePage />;
						}
						case "/search-properties": {
							return <PropertySearchPage />;
						}
						default: {
							return <NotFoundPage />;
						}
					}
				})()}
			</body>
		</html>
	);
}
