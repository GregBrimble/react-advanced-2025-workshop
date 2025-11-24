"use client";

import { Button } from "../../components/button";
import {
	Checkbox,
	CheckboxField,
	CheckboxGroup,
} from "../../components/checkbox";
import {
	Fieldset,
	Legend,
	FieldGroup,
	Field,
	Label,
} from "../../components/fieldset";
import { Heading } from "../../components/heading";
import { Input } from "../../components/input";
import { Radio, RadioField, RadioGroup } from "../../components/radio";
import { Select } from "../../components/select";
import type { RawPropertySearchParams } from "../../stores/property-search";
import { useState, useTransition } from "react";

export function PropertySearchFilters({
	searchParams,
}: {
	searchParams: RawPropertySearchParams;
}) {
	const [isPending, startTransition] = useTransition();
	const [filters, setFilters] = useState<RawPropertySearchParams>(searchParams);

	const handleFilterChange = (
		key: keyof RawPropertySearchParams,
		value: string | undefined,
	) => {
		const newFilters = { ...filters };
		if (value === undefined || value === "") {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete newFilters[key];
		} else {
			newFilters[key] = value;
		}
		setFilters(newFilters);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		startTransition(() => {
			const params = new URLSearchParams();
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== "") {
					params.set(key, value);
				}
			});
			window.history.pushState(
				null,
				"",
				`${window.location.pathname}?${params.toString()}`,
			);
		});
	};

	const handleReset = () => {
		setFilters({});
		startTransition(() => {
			window.history.pushState(null, "", window.location.pathname);
		});
	};

	return (
		<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
			<Heading level={3} className="mb-4">
				Filters
			</Heading>

			<form onSubmit={handleSubmit}>
				<div className="space-y-6">
					<Fieldset>
						<Legend>Occupancy</Legend>
						<RadioGroup
							value={filters.occupancy || ""}
							onChange={(value) => {
								handleFilterChange("occupancy", value || undefined);
							}}
						>
							<RadioField>
								<Radio value="" />
								<Label>All</Label>
							</RadioField>
							<RadioField>
								<Radio value="vacant" />
								<Label>Vacant</Label>
							</RadioField>
							<RadioField>
								<Radio value="occupied" />
								<Label>Occupied</Label>
							</RadioField>
						</RadioGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Price Range</Legend>
						<FieldGroup>
							<Field>
								<Label>Min Rent ($)</Label>
								<Input
									type="number"
									name="minRent"
									value={filters.minRent || ""}
									onChange={(e) => {
										handleFilterChange("minRent", e.target.value);
									}}
									placeholder="No minimum"
								/>
							</Field>
							<Field>
								<Label>Max Rent ($)</Label>
								<Input
									type="number"
									name="maxRent"
									value={filters.maxRent || ""}
									onChange={(e) => {
										handleFilterChange("maxRent", e.target.value);
									}}
									placeholder="No maximum"
								/>
							</Field>
						</FieldGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Rooms</Legend>
						<FieldGroup>
							<Field>
								<Label>Bedrooms</Label>
								<Select
									name="bedrooms"
									value={filters.bedrooms || ""}
									onChange={(e) => {
										handleFilterChange("bedrooms", e.target.value || undefined);
									}}
								>
									<option value="">Any</option>
									<option value="0">Studio</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4+</option>
								</Select>
							</Field>
							<Field>
								<Label>Bathrooms</Label>
								<Select
									name="bathrooms"
									value={filters.bathrooms || ""}
									onChange={(e) => {
										handleFilterChange(
											"bathrooms",
											e.target.value || undefined,
										);
									}}
								>
									<option value="">Any</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3+</option>
								</Select>
							</Field>
						</FieldGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Location</Legend>
						<FieldGroup>
							<Field>
								<Label>Neighborhood</Label>
								<Select
									name="neighborhood"
									value={filters.neighborhood || ""}
									onChange={(e) => {
										handleFilterChange(
											"neighborhood",
											e.target.value || undefined,
										);
									}}
								>
									<option value="">Any</option>
									<option value="Manhattan">Manhattan</option>
									<option value="Brooklyn">Brooklyn</option>
									<option value="Queens">Queens</option>
									<option value="Bronx">Bronx</option>
									<option value="Staten Island">Staten Island</option>
								</Select>
							</Field>
						</FieldGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Floor</Legend>
						<FieldGroup>
							<Field>
								<Label>Min Floor</Label>
								<Input
									type="number"
									name="minFloor"
									value={filters.minFloor || ""}
									onChange={(e) => {
										handleFilterChange("minFloor", e.target.value);
									}}
									placeholder="No minimum"
								/>
							</Field>
							<Field>
								<Label>Max Floor</Label>
								<Input
									type="number"
									name="maxFloor"
									value={filters.maxFloor || ""}
									onChange={(e) => {
										handleFilterChange("maxFloor", e.target.value);
									}}
									placeholder="No maximum"
								/>
							</Field>
						</FieldGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Amenities</Legend>
						<FieldGroup>
							<Field>
								<Label>Laundry</Label>
								<Select
									name="laundry"
									value={filters.laundry || ""}
									onChange={(e) => {
										handleFilterChange("laundry", e.target.value || undefined);
									}}
								>
									<option value="">Any</option>
									<option value="in-building">In Building</option>
									<option value="in-unit">In Unit</option>
								</Select>
							</Field>
							<Field>
								<Label>Parking</Label>
								<Select
									name="parking"
									value={filters.parking || ""}
									onChange={(e) => {
										handleFilterChange("parking", e.target.value || undefined);
									}}
								>
									<option value="">Any</option>
									<option value="street">Street</option>
									<option value="private">Private</option>
								</Select>
							</Field>
							<Field>
								<Label>Doorman</Label>
								<Select
									name="doorman"
									value={filters.doorman || ""}
									onChange={(e) => {
										handleFilterChange("doorman", e.target.value || undefined);
									}}
								>
									<option value="">Any</option>
									<option value="virtual">Virtual</option>
									<option value="part-time">Part-Time</option>
									<option value="full-time">Full-Time</option>
								</Select>
							</Field>
						</FieldGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Features</Legend>
						<CheckboxGroup>
							<CheckboxField>
								<Checkbox
									name="garden"
									checked={filters.garden === "true"}
									onChange={(checked) => {
										handleFilterChange("garden", checked ? "true" : undefined);
									}}
								/>
								<Label>Garden</Label>
							</CheckboxField>
							<CheckboxField>
								<Checkbox
									name="balcony"
									checked={filters.balcony === "true"}
									onChange={(checked) => {
										handleFilterChange("balcony", checked ? "true" : undefined);
									}}
								/>
								<Label>Balcony</Label>
							</CheckboxField>
							<CheckboxField>
								<Checkbox
									name="roof"
									checked={filters.roof === "true"}
									onChange={(checked) => {
										handleFilterChange("roof", checked ? "true" : undefined);
									}}
								/>
								<Label>Roof Access</Label>
							</CheckboxField>
							<CheckboxField>
								<Checkbox
									name="furnished"
									checked={filters.furnished === "true"}
									onChange={(checked) => {
										handleFilterChange(
											"furnished",
											checked ? "true" : undefined,
										);
									}}
								/>
								<Label>Furnished</Label>
							</CheckboxField>
							<CheckboxField>
								<Checkbox
									name="airConditioning"
									checked={filters.airConditioning === "true"}
									onChange={(checked) => {
										handleFilterChange(
											"airConditioning",
											checked ? "true" : undefined,
										);
									}}
								/>
								<Label>Air Conditioning</Label>
							</CheckboxField>
							<CheckboxField>
								<Checkbox
									name="dishwasher"
									checked={filters.dishwasher === "true"}
									onChange={(checked) => {
										handleFilterChange(
											"dishwasher",
											checked ? "true" : undefined,
										);
									}}
								/>
								<Label>Dishwasher</Label>
							</CheckboxField>
						</CheckboxGroup>
					</Fieldset>

					<Fieldset>
						<Legend>Pets Allowed</Legend>
						<CheckboxGroup>
							<CheckboxField>
								<Checkbox
									name="catsAllowed"
									checked={filters.catsAllowed === "true"}
									onChange={(checked) => {
										handleFilterChange(
											"catsAllowed",
											checked ? "true" : undefined,
										);
									}}
								/>
								<Label>Cats</Label>
							</CheckboxField>
							<CheckboxField>
								<Checkbox
									name="dogsAllowed"
									checked={filters.dogsAllowed === "true"}
									onChange={(checked) => {
										handleFilterChange(
											"dogsAllowed",
											checked ? "true" : undefined,
										);
									}}
								/>
								<Label>Dogs</Label>
							</CheckboxField>
						</CheckboxGroup>
					</Fieldset>

					<div className="flex gap-3 pt-2">
						<Button
							type="submit"
							color="blue"
							className="flex-1"
							disabled={isPending}
						>
							{isPending ? "Applying..." : "Apply Filters"}
						</Button>
						<Button
							type="button"
							color="white"
							onClick={handleReset}
							disabled={isPending}
						>
							Reset
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
