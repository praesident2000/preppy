import { useAppContext } from "../context/AppContext";
import { useFood } from "./useFood";
import { getVisibleCategories, getActiveMerges, computeItemTotal } from "../utils/dietFilter";

export function useMissingFood() {
	const { state } = useAppContext();
	const { data: food } = useFood();

	const visibleFood = getVisibleCategories(food, state.people).map((cat) => {
		if (cat.category !== "miscellaneous") return cat;
		const extras = [
			...(state.baby ? [{ label: "Baby futter", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
			...(state.pet ? [{ label: "Tierfutter", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
		];
		return extras.length > 0 ? { ...cat, items: [...cat.items, ...extras] } : cat;
	});

	const activeMerges = getActiveMerges(visibleFood, food);

	const missingFoodList = visibleFood.flatMap(({ category, items }) =>
		items
			.filter((item) => !state.shoppingList[category]?.includes(item.label))
			.map((item) => ({
				...item,
				total:
					category !== "miscellaneous"
						? `${computeItemTotal(category, item.label, item.perPersonPerDay, state.people, state.days, food, activeMerges).toLocaleString("de-DE")} ${item.unit}`
						: null,
			})),
	);

	return { missingFoodList };
}
