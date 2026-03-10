// hooks/useUrlParams.ts
import { useEffect } from "react";
import type { House } from "../types/types";

type Setters = {
	setCurrentStep: (v: number) => void;
	setTheme: (v: string) => void;
	setDays: (v: number) => void;
	setPeople: (v: string[]) => void;
	setEquipment: (v: string[]) => void;
	setHouse: (v: House) => void;
};

export function useUrlParams(setters: Setters) {
	useEffect(() => {
		const params = new URL(window.location.href).searchParams;

		const step = params.get("schritt");
		if (step) setters.setCurrentStep(Number(step));

		const theme = params.get("thema");
		if (theme) setters.setTheme(theme);

		const days = params.get("tage");
		if (days) setters.setDays(Number(days));

		const people = params.get("personen");
		if (people) setters.setPeople(people.split(","));

		const equipment = params.get("ausruestung");
		if (equipment) setters.setEquipment(equipment.split(","));

		const category = params.get("haus");
		const subcategory = params.get("haus_sub");
		if (category || subcategory) {
			setters.setHouse({
				category: category ?? undefined,
				subcategory: subcategory ? subcategory.split(",") : undefined,
			});
		}
	}, []);
}
