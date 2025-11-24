import { int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	email: text().notNull().unique(),
	created_at: integer({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const properties = sqliteTable("properties", {
	id: int().primaryKey({ autoIncrement: true }),
	street_address: text().notNull(),
	neighborhood: text().notNull(),
	city: text().notNull(),
	state: text().notNull(),
	description: text().notNull(),
	rent_amount: real().notNull(),
	bedrooms: int().notNull(),
	bathrooms: int().notNull(),
	floor_number: int().notNull(),
	laundry: text({ enum: ["in-unit", "in-building", "none"] }).notNull(),
	parking: text({ enum: ["private", "street", "none"] }).notNull(),
	doorman: text({
		enum: ["full-time", "part-time", "virtual", "none"],
	}).notNull(),
	garden: int({ mode: "boolean" }).notNull(),
	balcony: int({ mode: "boolean" }).notNull(),
	roof: int({ mode: "boolean" }).notNull(),
	cats_allowed: int({ mode: "boolean" }).notNull(),
	dogs_allowed: int({ mode: "boolean" }).notNull(),
	furnished: int({ mode: "boolean" }).notNull(),
	air_conditioning: int({ mode: "boolean" }).notNull(),
	dishwasher: int({ mode: "boolean" }).notNull(),
	created_at: integer({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const tenancies = sqliteTable("tenancies", {
	id: int().primaryKey({ autoIncrement: true }),
	contact_id: int()
		.notNull()
		.references(() => contacts.id),
	property_id: int()
		.notNull()
		.references(() => properties.id),
	start_date: text().notNull(),
	end_date: text(),
	rent_amount: real().notNull(),
	created_at: integer({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});



export const messages = sqliteTable("messages", {
	id: int().primaryKey({ autoIncrement: true }),
	contact_id: int()
		.notNull()
		.references(() => contacts.id),
	content: text().notNull(),
	is_from_agency: int({ mode: "boolean" }).notNull(),
	created_at: integer({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});
