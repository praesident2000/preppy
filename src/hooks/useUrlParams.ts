import { useEffect } from "react";
import type { Dispatch } from "react";
import type { Action } from "../reducer";

export function useUrlParams(dispatch: Dispatch<Action>) {
	useEffect(() => {
		const hash = window.location.hash.slice(1);
		const params = new URLSearchParams(hash);

		const step = params.get("step");
		if (step) dispatch({ type: "set_step", payload: Number(step) });

		const theme = params.get("theme");
		if (theme) dispatch({ type: "set_theme", payload: theme });

		const days = params.get("days");
		const parsedDays = Number(days);
		if (days && parsedDays >= 3 && parsedDays <= 14)
			dispatch({ type: "set_days", payload: Number(days) });

		const people = params.get("people");
		const VALID_DIETS = ["omnivore", "vegetarian", "vegan"];
		if (people) {
			const parsedPeople = people
				.split(",")
				.filter((p) => VALID_DIETS.includes(p));
			if (parsedPeople.length > 0)
				dispatch({ type: "set_people", payload: parsedPeople });
		}

		const shoppingList = params.get("shoppinglist");
		if (shoppingList)
			try {
				dispatch({
					type: "set_shoppinglist",
					payload: JSON.parse(shoppingList),
				});
			} catch {
				console.warn("Invalid shoppinglist param, ignoring.");
			}

		const equipment = params.get("equipment");
		if (equipment)
			dispatch({
				type: "set_equipment",
				payload: equipment.split(","),
			});

		const category = params.get("house");
		const subcategory = params.get("house_sub");
		if (category || subcategory) {
			dispatch({
				type: "set_house",
				payload: {
					category: category ?? undefined,
					subcategory: subcategory ? subcategory.split(",") : undefined,
				},
			});
		}
	}, []);
}
