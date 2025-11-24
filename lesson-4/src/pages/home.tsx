import { Button } from "../components/button";
import { Heading } from "../components/heading";
import { Text } from "../components/text";

export function HomePage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-blue-950">
			<div className="mx-auto max-w-4xl px-4 text-center">
				<Heading
					level={1}
					className="mb-6 text-5xl font-bold sm:text-6xl lg:text-7xl"
				>
					React Rental Agency
				</Heading>

				<Text className="mb-8 text-xl text-zinc-600 sm:text-2xl dark:text-zinc-400">
					Coming soon: the latest and greatest AI features
				</Text>

				<div className="flex justify-center gap-4">
					<Button
						href="/search-properties"
						color="blue"
						className="px-8 py-3 text-lg capitalize"
					>
						Search properties
					</Button>
				</div>
			</div>
		</div>
	);
}
