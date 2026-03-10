import type { House } from "../types/types";

type State = {
	currentStep: number;
	theme: string;
	days: number;
	people: string[];
	equipment: string[];
	house: House;
};

const PARAM_CONFIG_SET = [
	{ key: "schritt", serialize: (v: number) => v.toString() },
	{ key: "thema", serialize: (v: string) => v },
	{ key: "tage", serialize: (v: number) => v.toString() },
	{ key: "personen", serialize: (v: string[]) => v.join(",") },
	{ key: "ausruestung", serialize: (v: string[]) => v.join(",") },
] as const;

export function useSetUrl(state: State) {
	const setUrl = async () => {
		const url = new URL(window.location.href);
		url.search = "";

		const STATE = {
			schritt: state.currentStep,
			thema: state.theme,
			tage: state.days,
			personen: state.people,
			ausruestung: state.equipment,
		};

		PARAM_CONFIG_SET.forEach(({ key, serialize }) => {
			const value = STATE[key];
			if (value)
				url.searchParams.set(key, (serialize as (v: any) => string)(value));
		});

		// handle house separately
		if (state.house.category)
			url.searchParams.set("haus", state.house.category);
		if (state.house.subcategory?.length)
			url.searchParams.set("haus_sub", state.house.subcategory.join(","));

		try {
			await navigator.clipboard.writeText(url.toString());
		} catch (err) {
			console.error("Failed to copy: ", err);
		}

		alert("Link kopiert!");
	};

	return { setUrl };
}
