import type { getDb } from "../db";
import { properties, tenancies } from "../db/schema";
import { and, eq, gte, isNotNull, isNull, lte, or, SQL } from "drizzle-orm";
import { z } from "zod";

export const propertySearchParamsSchema = z.object({
	occupancy: z
		.enum(["vacant", "occupied"])
		.optional()
		.describe("Whether the property is vacant or occupied."),

	minRent: z.coerce
		.number()
		.positive()
		.optional()
		.describe("The minimum monthly rent in dollars."),
	maxRent: z.coerce
		.number()
		.positive()
		.optional()
		.describe("The maximum monthly rent in dollars."),

	bedrooms: z.coerce
		.number()
		.int()
		.min(0)
		.max(4)
		.optional()
		.describe(
			"The minimum number of bedrooms to search for. Studio = 0, 1bdr = 1, etc. Maximum 4.",
		),
	bathrooms: z.coerce
		.number()
		.int()
		.positive()
		.max(3)
		.optional()
		.describe("The minimum number of bathrooms to search for. Maximum 3."),

	neighborhood: z
		.enum(["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"])
		.optional()
		.describe("The neighborhood."),

	minFloor: z.coerce
		.number()
		.int()
		.optional()
		.describe(
			"The minimum floor number. 'Garden floor' is a synonym for 'basement' which is floor 0. 'Ground floor' is the first floor, floor 1. etc.",
		),
	maxFloor: z.coerce
		.number()
		.int()
		.optional()
		.describe(
			"The maximum floor number. 'Garden floor' is a synonym for 'basement' which is floor 0. 'Ground floor' is the first floor, floor 1. etc.",
		),

	laundry: z
		.enum(["in-unit", "in-building"])
		.optional()
		.describe("Laundry facilities location."),
	parking: z
		.enum(["private", "street"])
		.optional()
		.describe("Type of parking available."),
	doorman: z
		.enum(["full-time", "part-time", "virtual"])
		.optional()
		.describe("Doorman service availability."),

	garden: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether the property has a garden."),
	balcony: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether the property has a balcony."),
	roof: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether the property has roof access."),
	furnished: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether the property is furnished."),
	airConditioning: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether the property has air conditioning."),
	dishwasher: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether the property has a dishwasher."),

	catsAllowed: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether cats are allowed."),
	dogsAllowed: z
		.enum(["true"])
		.transform(() => true)
		.optional()
		.describe("Whether dogs are allowed."),
});

export type ValidatedPropertySearchParams = z.infer<
	typeof propertySearchParamsSchema
>;

export type RawPropertySearchParams = {
	[K in keyof ValidatedPropertySearchParams]?: string;
};

export function parsePropertySearchParams(
	rawParams: Record<string, string>,
): ValidatedPropertySearchParams {
	const result = propertySearchParamsSchema.safeParse(rawParams);

	if (!result.success) {
		console.error("Search params parsing failed:", result.error.flatten());
		return {};
	}

	return result.data;
}

export function serializePropertySearchParams(
	params: ValidatedPropertySearchParams,
): RawPropertySearchParams {
	const result: RawPropertySearchParams = {};

	for (const [key, value] of Object.entries(params)) {
		result[key as keyof ValidatedPropertySearchParams] = String(value);
	}

	return result;
}

const LAUNDRY_HIERARCHY = {
	"in-unit": ["in-unit"],
	"in-building": ["in-building", "in-unit"],
} as const;

const PARKING_HIERARCHY = {
	private: ["private"],
	street: ["street", "private"],
} as const;

const DOORMAN_HIERARCHY = {
	"full-time": ["full-time"],
	"part-time": ["part-time", "full-time"],
	virtual: ["virtual", "part-time", "full-time"],
} as const;

export const propertySearch = async (
	db: ReturnType<typeof getDb>,
	searchParams: ValidatedPropertySearchParams,
) => {
	const conditions: SQL[] = [];

	if (searchParams.minRent) {
		conditions.push(gte(properties.rent_amount, searchParams.minRent));
	}

	if (searchParams.maxRent) {
		conditions.push(lte(properties.rent_amount, searchParams.maxRent));
	}

	if (searchParams.bedrooms) {
		conditions.push(gte(properties.bedrooms, searchParams.bedrooms));
	}

	if (searchParams.bathrooms) {
		conditions.push(gte(properties.bathrooms, searchParams.bathrooms));
	}

	if (searchParams.neighborhood) {
		conditions.push(eq(properties.neighborhood, searchParams.neighborhood));
	}

	if (searchParams.minFloor) {
		conditions.push(gte(properties.floor_number, searchParams.minFloor));
	}

	if (searchParams.maxFloor) {
		conditions.push(lte(properties.floor_number, searchParams.maxFloor));
	}

	if (searchParams.laundry) {
		const allowedValues = LAUNDRY_HIERARCHY[searchParams.laundry];
		const condition = or(
			...allowedValues.map((val) => eq(properties.laundry, val)),
		);
		if (condition) conditions.push(condition);
	}

	if (searchParams.parking) {
		const allowedValues = PARKING_HIERARCHY[searchParams.parking];
		const condition = or(
			...allowedValues.map((val) => eq(properties.parking, val)),
		);
		if (condition) conditions.push(condition);
	}

	if (searchParams.doorman) {
		const allowedValues = DOORMAN_HIERARCHY[searchParams.doorman];
		const condition = or(
			...allowedValues.map((val) => eq(properties.doorman, val)),
		);
		if (condition) conditions.push(condition);
	}

	if (searchParams.garden) {
		conditions.push(eq(properties.garden, true));
	}

	if (searchParams.balcony) {
		conditions.push(eq(properties.balcony, true));
	}

	if (searchParams.roof) {
		conditions.push(eq(properties.roof, true));
	}

	if (searchParams.furnished) {
		conditions.push(eq(properties.furnished, true));
	}

	if (searchParams.airConditioning) {
		conditions.push(eq(properties.air_conditioning, true));
	}

	if (searchParams.dishwasher) {
		conditions.push(eq(properties.dishwasher, true));
	}

	if (searchParams.catsAllowed) {
		conditions.push(eq(properties.cats_allowed, true));
	}

	if (searchParams.dogsAllowed) {
		conditions.push(eq(properties.dogs_allowed, true));
	}

	if (searchParams.occupancy === "vacant") {
		conditions.push(isNull(tenancies.id));
	} else if (searchParams.occupancy === "occupied") {
		conditions.push(isNotNull(tenancies.id));
	}

	const propertiesList = await db
		.select({
			property: properties,
			tenancy: tenancies,
		})
		.from(properties)
		.leftJoin(
			tenancies,
			and(eq(properties.id, tenancies.property_id), isNull(tenancies.end_date)),
		)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.all();

	return propertiesList;
};
