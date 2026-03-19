import type { Diet } from "../types/types";
import type { TypeFood } from "../api/fetchFood";

export const categoryDiets: Record<string, Diet[]> = {
	drinks:					["omnivore", "vegetarian", "vegan"],
	grains:					["omnivore", "vegetarian", "vegan"],
	veggies:					["omnivore", "vegetarian", "vegan"],
	fats:						["omnivore", "vegetarian", "vegan"],
	nuts:						["omnivore", "vegetarian"],
	nuts_vegan:				["vegan"],
	dairy:					["omnivore", "vegetarian"],
	vegan_alternatives:	["vegan"],
	meat:						["omnivore"],
	beans_veget:			["vegetarian"],
	beans_vegan:			["vegan"],
	miscellaneous:			["omnivore", "vegetarian", "vegan"],
};

// When both sides of a pair are needed, secondary gets merged into primary
export const mergePairs: { primary: string; secondary: string }[] = [
	{ primary: "nuts",        secondary: "nuts_vegan"  },
	{ primary: "beans_veget", secondary: "beans_vegan" },
];

export function getActiveMerges(
	visibleFood: TypeFood[],
	allFood: TypeFood[],
): Map<string, string> {
	const visibleKeys = new Set(visibleFood.map((f) => f.category));
	return new Map(
		mergePairs
			.filter(
				({ primary, secondary }) =>
					visibleKeys.has(primary) &&
					!visibleKeys.has(secondary) &&
					allFood.some((f) => f.category === secondary),
			)
			.map(({ primary, secondary }) => [primary, secondary]),
	);
}

export function computeItemTotal(
	category: string,
	label: string,
	perPersonPerDay: number,
	people: Diet[],
	days: number,
	allFood: TypeFood[],
	activeMerges: Map<string, string>,
): number {
	const secondaryCategory = activeMerges.get(category);
	if (secondaryCategory) {
		const secondaryPpd =
			allFood
				.find((f) => f.category === secondaryCategory)
				?.items.find((i) => i.label === label)?.perPersonPerDay ?? perPersonPerDay;
		const primaryCount = people.filter((d) => categoryDiets[category]?.includes(d)).length;
		const secondaryCount = people.filter((d) =>
			categoryDiets[secondaryCategory]?.includes(d),
		).length;
		return (primaryCount * perPersonPerDay + secondaryCount * secondaryPpd) * days;
	}
	const diets = categoryDiets[category];
	const count = diets ? people.filter((d) => diets.includes(d)).length : people.length;
	return perPersonPerDay * count * days;
}

export function formatTotal(value: number, unit: string): string {
	if (unit === "g" && value >= 1000) {
		return `${(value / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Kilogramm`;
	}
	const labels: Record<string, string> = { g: "Gramm", l: "Liter" };
	return `${value} ${labels[unit] ?? unit}`;
}

export function getVisibleCategories(food: TypeFood[], people: Diet[]): TypeFood[] {
	const dietsPresent = new Set(people);

	const relevantCategories = new Set(
		food
			.filter(({ category }) =>
				categoryDiets[category]?.some((d) => dietsPresent.has(d)) ?? true,
			)
			.map((f) => f.category),
	);

	const activeMerges = new Map(
		mergePairs
			.filter(({ primary, secondary }) =>
				relevantCategories.has(primary) && relevantCategories.has(secondary),
			)
			.map(({ primary, secondary }) => [primary, secondary]),
	);

	const skippedCategories = new Set(activeMerges.values());

	return food.filter(({ category }) => {
		if (!relevantCategories.has(category)) return false;
		if (skippedCategories.has(category)) return false;
		return true;
	});
}
