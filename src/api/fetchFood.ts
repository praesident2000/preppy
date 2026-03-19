export type FoodItem = {
	label: string;
	unit: string;
	perPersonPerDay: number;
	decimals: number;
	packSize?: number;
	packLabelPlural?: string;
	packLabelSingular?: string;
};

export type TypeFood = {
	category: string;
	icon: string;
	label: string;
	totPerPersonPerDay: number;
	unit: string;
	items: FoodItem[];
};

import fetchConfig from "./fetchConfig";

export default async function fetchFood(): Promise<TypeFood[]> {
	const data = await fetchConfig();
	if (!data?.food) throw new Error("Invalid config structure");
	return data.food;
}
