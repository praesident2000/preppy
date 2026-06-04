import type { State } from "../reducer";

const PARAM_CONFIG_SET = [
	// { key: "step", serialize: (v: number) => v.toString() },
	{ key: "themes", serialize: (v: string[]) => v.join(",") },
	{ key: "days", serialize: (v: number) => v.toString() },
	{ key: "people", serialize: (v: string[]) => v.join(",") },
	{ key: "equipment", serialize: (v: string[]) => v.join(",") },
] as const;

export function useSetUrl(state: State) {
	const setUrl = async () => {
		const params = new URLSearchParams();

		const STATE = {
			step: 5,
			themes: state.themes,
			days: state.days,
			people: state.people,
			shoppinglist: state.shoppingList,
			equipment: state.equipment,
		};

		PARAM_CONFIG_SET.forEach(({ key, serialize }) => {
			const value = STATE[key];
			if (value) params.set(key, (serialize as (v: any) => string)(value));
		});

		// then "baby" separately
		if (state.baby) params.set("baby", "1");

		// then "pet" separately
		if (state.pet) params.set("pet", "1");

		// then "shoppinglist" separately
		if (Object.keys(state.shoppingList).length) {
			params.set("shoppinglist", JSON.stringify(state.shoppingList));
		}

		// then "house" separately
		if (state.house.category) params.set("house", state.house.category);
		if (state.house.subcategory?.length)
			params.set("house_sub", state.house.subcategory.join(","));

		const url = `${window.location.origin}${window.location.pathname}#${params.toString()}`;

		return url
	};

	return { setUrl };
}
