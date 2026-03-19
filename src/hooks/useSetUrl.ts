import type { House, ShoppingList } from "../types/types";

type State = {
	currentStep: number;
	theme: string;
	house: House;
	days: number;
	people: string[];
	shoppingList: ShoppingList;
	equipment: string[];
};

const PARAM_CONFIG_SET = [
	{ key: "step", serialize: (v: number) => v.toString() },
	{ key: "theme", serialize: (v: string) => v },
	{ key: "days", serialize: (v: number) => v.toString() },
	{ key: "people", serialize: (v: string[]) => v.join(",") },
	{ key: "equipment", serialize: (v: string[]) => v.join(",") },
] as const;

export function useSetUrl(state: State) {
	const setUrl = async () => {
		const params = new URLSearchParams();

		const STATE = {
			step: state.currentStep,
			theme: state.theme,
			days: state.days,
			people: state.people,
			shoppinglist: state.shoppingList,
			equipment: state.equipment,
		};

		PARAM_CONFIG_SET.forEach(({ key, serialize }) => {
			const value = STATE[key];
			if (value) params.set(key, (serialize as (v: any) => string)(value));
		});

		// then "shoppinglist" separately
		if (Object.keys(state.shoppingList).length) {
			params.set('shoppinglist', JSON.stringify(state.shoppingList))
		}

		// then "house" separately
		if (state.house.category) params.set("house", state.house.category);
		if (state.house.subcategory?.length)
			params.set("house_sub", state.house.subcategory.join(","));

		const url = `${window.location.origin}${window.location.pathname}#${params.toString()}`;

		try {
			await navigator.clipboard.writeText(url);
			alert("Link kopiert!");
		} catch {
			alert("Link konnte nicht kopiert werden.");
		}
	};

	return { setUrl };
}
