import { useAppContext } from "../context/AppContext";
import { useFood } from "./useFood";
import { getVisibleCategories, getActiveMerges, computeItemTotal } from "../utils/dietFilter";
import type { FoodItem } from "../api/fetchFood";

export function useMissingFood() {
	const { state } = useAppContext();
	const { data: food } = useFood();

	const visibleFood = getVisibleCategories(food, state.people).map((cat) => {
		if (cat.category !== "miscellaneous") return cat;
		const extras: FoodItem[] = [
			...(state.baby ? [{ label: "Baby- und Kleinkindnahrung (z. B. Milchpulver + zusätzliches Wasser, Fertignahrung, Snacks)", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
			...(state.pet ? [{ label: "Haustierfutter", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
		];
		return extras.length > 0 ? { ...cat, items: [...cat.items, ...extras] } : cat;
	});

	const activeMerges = getActiveMerges(visibleFood, food);

	const missingFoodList = visibleFood.flatMap(({ category, items }) =>
		items
			.filter((item) => !state.shoppingList[category]?.includes(item.label))
			.map((item) => {
				const totalNum =
					category !== "miscellaneous"
						? computeItemTotal(category, item.label, item.perPersonPerDay, state.people, state.days, food, activeMerges)
						: 0;
				const totalPacks = item.packSize ? Math.ceil(totalNum / Number(item.packSize)) : 0;
				return {
					...item,
					category,
					totalNum,
					totalPacks,
					total:
						category !== "miscellaneous"
							? `${totalNum.toLocaleString("de-DE")} ${item.unit}`
							: null,
				};
			}),
	);

	return { missingFoodList };
}
