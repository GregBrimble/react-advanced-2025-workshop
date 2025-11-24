import clsx from "clsx";
import type React from "react";

export function Card({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={clsx(
				className,
				"divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white shadow-sm dark:divide-white/10 dark:bg-zinc-950 dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-white/10",
			)}
			{...props}
		/>
	);
}

export function CardHeader({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div className={clsx(className, "px-4 py-5 sm:px-6")} {...props} />;
}

export function CardContent({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div className={clsx(className, "px-4 py-5 sm:p-6")} {...props} />;
}

export function CardFooter({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div className={clsx(className, "px-4 py-4 sm:px-6")} {...props} />;
}
