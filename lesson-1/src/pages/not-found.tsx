import { Button } from "../components/button";
import { Heading } from "../components/heading";
import { Text } from "../components/text";

export function NotFoundPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
			<div className="text-center">
				<Heading level={1} className="capitalize">
					404 — Page not found
				</Heading>
				<Text className="mt-4 text-zinc-600 dark:text-zinc-400">
					The page you're looking for doesn't exist.
				</Text>
				<Button href="/" className="mt-6 capitalize">
					Go home
				</Button>
			</div>
		</div>
	);
}
