import { Heading } from "../../components/heading";
import { Text } from "../../components/text";
import { getEnv, getRequest } from "../../context";
import { getDb } from "../../db";
import { propertySearch } from "../../stores/property-search";
import {
	parsePropertySearchParams,
	type ValidatedPropertySearchParams,
} from "../../stores/property-search";
import { PropertyCard } from "./property-card";
import { PropertySearchFilters } from "./search-filters";

export async function PropertySearchPage() {
	const env = getEnv();
	const request = getRequest();
	const db = getDb(env);

	const url = new URL(request.url);
	const searchParams: Record<string, string> = Object.fromEntries(
		url.searchParams.entries(),
	);

	const validatedParams: ValidatedPropertySearchParams =
		parsePropertySearchParams(searchParams);

	const propertiesList = await propertySearch(db, validatedParams);

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Heading level={1} className="capitalize">
						Property search
					</Heading>
					<Text className="mt-2 text-zinc-600 dark:text-zinc-400">
						{propertiesList.length}{" "}
						{propertiesList.length === 1 ? "property" : "properties"}
					</Text>
				</div>

				<div className="grid gap-8 lg:grid-cols-[280px_1fr]">
					<aside className="lg:sticky lg:top-8 lg:h-fit">
						<PropertySearchFilters searchParams={searchParams} />
					</aside>

					<main>
						{propertiesList.length === 0 ? (
							<div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
								<Heading level={3} className="mb-2">
									No properties found
								</Heading>
								<Text className="text-zinc-600 dark:text-zinc-400">
									Try adjusting your filters to see more results
								</Text>
							</div>
						) : (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
								{propertiesList.map((row) => (
									<PropertyCard
										key={row.property.id}
										property={row.property}
										tenancy={row.tenancy}
									/>
								))}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
