"use server";

import { getEnv } from "../../context";
import {
	parsePropertySearchParams,
	serializePropertySearchParams,
	type ValidatedPropertySearchParams,
} from "../../stores/property-search";

export async function aiSearch(searchText: string) {
	const env = getEnv();

	const result = await env.AI.run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
		messages: [
			{
				role: "system",
				content:
					"You are a friendly assistant which can perform searches for properties, given a user query. Do not ask any follow-up questions — just search using the information you have been given. Ignore any superflous information. If you are unable to apply a filter for part of the query (e.g. an invalid value was requested), ignore that field and try to search with the remaining information you have been given.",
			},
			{
				role: "user",
				content: searchText,
			},
		],
		tools: [
			{
				name: "searchForProperty",
				description: "Returns properties which match the given criteria.",
				parameters: {
					type: "object",
					properties: {
						occupancy: {
							required: false,
							type: "string",
							enum: ["vacant", "occupied"],
							description: "Whether the property is vacant or occupied.",
						},
						minRent: {
							required: false,
							type: "number",
							description: "The minimum monthly rent in dollars.",
						},
						maxRent: {
							required: false,
							type: "number",
							description: "The maximum monthly rent in dollars.",
						},
						bedrooms: {
							required: false,
							type: "number",
							description:
								"The minimum number of bedrooms to search for. Studio = 0, 1bdr = 1, etc. Maximum 4.",
						},
						bathrooms: {
							required: false,
							type: "number",
							description:
								"The minimum number of bathrooms to search for. Maximum 3.",
						},
						neighborhood: {
							required: false,
							type: "string",
							enum: [
								"Manhattan",
								"Brooklyn",
								"Queens",
								"Bronx",
								"Staten Island",
							],
							description: "The neighborhood.",
						},
						minFloor: {
							required: false,
							type: "number",
							description:
								"The minimum floor number. 'Garden floor' is a synonym for 'basement' which is floor 0. 'Ground floor' is the first floor, floor 1. etc.",
						},
						maxFloor: {
							required: false,
							type: "number",
							description:
								"The maximum floor number. 'Garden floor' is a synonym for 'basement' which is floor 0. 'Ground floor' is the first floor, floor 1. etc.",
						},
						laundry: {
							required: false,
							type: "string",
							enum: ["in-unit", "in-building"],
							description: "Laundry facilities location.",
						},
						parking: {
							required: false,
							type: "string",
							enum: ["private", "street"],
							description: "Type of parking available.",
						},
						doorman: {
							required: false,
							type: "string",
							enum: ["full-time", "part-time", "virtual"],
							description: "Doorman service availability.",
						},
						garden: {
							required: false,
							type: "boolean",
							description: "Whether the property has a garden.",
						},
						balcony: {
							required: false,
							type: "boolean",
							description: "Whether the property has a balcony.",
						},
						roof: {
							required: false,
							type: "boolean",
							description: "Whether the property has roof access.",
						},
						furnished: {
							required: false,
							type: "boolean",
							description: "Whether the property is furnished.",
						},
						airConditioning: {
							required: false,
							type: "boolean",
							description: "Whether the property has air conditioning.",
						},
						dishwasher: {
							required: false,
							type: "boolean",
							description: "Whether the property has a dishwasher.",
						},
						catsAllowed: {
							required: false,
							type: "boolean",
							description: "Whether cats are allowed.",
						},
						dogsAllowed: {
							required: false,
							type: "boolean",
							description: "Whether dogs are allowed.",
						},
					},
				},
			},
		],
	});

	if (result.tool_calls?.length !== 1) {
		console.error(
			"Invalid AI response. AI did not call the search tool.",
			result,
		);
		if (process.env.NODE_ENV === "development") {
			return { error: JSON.stringify(result) };
		}

		return { error: "Could not discern filters from query." };
	}

	return {
		filters: parsePropertySearchParams(
			serializePropertySearchParams(
				result.tool_calls[0]?.arguments as ValidatedPropertySearchParams,
			),
		),
	};
}
