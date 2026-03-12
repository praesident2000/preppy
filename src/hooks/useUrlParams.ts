// hooks/useUrlParams.ts
import { useEffect } from "react";
import type { House, ShoppingList } from "../types/types";

type Setters = {
	setCurrentStep: (v: number) => void;
	setTheme: (v: string) => void;
	setHouse: (v: House) => void;
	setDays: (v: number) => void;
	setPeople: (v: string[]) => void;
	setShoppingList: (v: ShoppingList) => void;
	setEquipment: (v: string[]) => void;
};

export function useUrlParams(setters: Setters) {
	useEffect(() => {
		const hash = window.location.hash.slice(1);
		const params = new URLSearchParams(hash);

		const step = params.get("step");
		if (step) setters.setCurrentStep(Number(step));

		const theme = params.get("theme");
		if (theme) setters.setTheme(theme);

		const days = params.get("days");
		if (days) setters.setDays(Number(days));

		const people = params.get("people");
		if (people) setters.setPeople(people.split(","));

		const shoppingList = params.get("shoppinglist");
		if (shoppingList) setters.setShoppingList(JSON.parse(shoppingList));

		const equipment = params.get("equipment");
		if (equipment) setters.setEquipment(equipment.split(","));

		const category = params.get("house");
		const subcategory = params.get("house_sub");
		if (category || subcategory) {
			setters.setHouse({
				category: category ?? undefined,
				subcategory: subcategory ? subcategory.split(",") : undefined,
			});
		}
	}, []);
}
