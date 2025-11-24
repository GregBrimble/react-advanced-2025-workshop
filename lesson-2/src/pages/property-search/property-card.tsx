import { Badge } from "../../components/badge";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "../../components/card";
import { Heading } from "../../components/heading";
import { Text } from "../../components/text";
import type { properties, tenancies } from "../../db/schema";
import { HomeIcon, MapPinIcon } from "@heroicons/react/24/outline";

type Property = typeof properties.$inferSelect;
type Tenancy = typeof tenancies.$inferSelect;

export function PropertyCard({
	property,
	tenancy,
}: {
	property: Property;
	tenancy: Tenancy | null;
}) {
	const features = [];
	if (property.garden) features.push("Garden");
	if (property.balcony) features.push("Balcony");
	if (property.roof) features.push("Roof Access");
	if (property.furnished) features.push("Furnished");
	if (property.air_conditioning) features.push("AC");
	if (property.dishwasher) features.push("Dishwasher");

	const pets = [];
	if (property.cats_allowed) pets.push("Cats");
	if (property.dogs_allowed) pets.push("Dogs");

	return (
		<Card className="group transition-shadow hover:shadow-md">
			<CardHeader className="bg-zinc-50 dark:bg-zinc-900">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1">
						<Heading level={4} className="truncate">
							{property.street_address}
						</Heading>
						<div className="mt-1 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
							<MapPinIcon className="h-4 w-4" />
							<Text>
								{property.neighborhood}, {property.city}
							</Text>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<div className="flex items-center gap-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
							<span className="tabular-nums">
								${property.rent_amount.toLocaleString()}
							</span>
						</div>
						<Text className="text-sm text-zinc-600 dark:text-zinc-400">
							per month
						</Text>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="mb-4 flex gap-4">
					<div className="flex items-center gap-1">
						<HomeIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
						<Text className="font-medium">
							{property.bedrooms === 0
								? "Studio"
								: `${String(property.bedrooms)} bed`}
							, {property.bathrooms} bath
						</Text>
					</div>
					<Text className="text-zinc-600 dark:text-zinc-400">
						{property.floor_number === 0
							? "Garden floor"
							: `Floor ${String(property.floor_number)}`}
					</Text>
				</div>

				<Text className="mb-4 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
					{property.description}
				</Text>

				<div className="mb-4 space-y-2">
					<div className="flex flex-wrap gap-2 text-sm">
						<Badge color="zinc">
							{property.laundry === "in-unit"
								? "In-Unit Laundry"
								: property.laundry === "in-building"
									? "Building Laundry"
									: "No Laundry"}
						</Badge>
						<Badge color="zinc">
							{property.parking === "private"
								? "Private Parking"
								: property.parking === "street"
									? "Street Parking"
									: "No Parking"}
						</Badge>
						{property.doorman !== "none" && (
							<Badge color="zinc">
								{property.doorman === "full-time"
									? "Full-Time Doorman"
									: property.doorman === "part-time"
										? "Part-Time Doorman"
										: "Virtual Doorman"}
							</Badge>
						)}
					</div>
				</div>

				{features.length > 0 && (
					<div className="mb-4 flex flex-wrap gap-2">
						{features.map((feature) => (
							<Badge key={feature} color="blue">
								{feature}
							</Badge>
						))}
					</div>
				)}

				{pets.length > 0 && (
					<div className="flex gap-2">
						{pets.map((pet) => (
							<Badge key={pet} color="orange">
								{pet} OK
							</Badge>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="text-right">
				{tenancy ? (
					<Badge color="red">Occupied</Badge>
				) : (
					<Badge color="green">Vacant</Badge>
				)}
			</CardFooter>
		</Card>
	);
}
