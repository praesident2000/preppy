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
	items: FoodItem[];
};

export default async function fetchFood(): Promise<TypeFood[]> {
	const res = await fetch("/public/config.json");
	// const res = await fetch("https://www.diakonie-katastrophenhilfe.de/fileadmin/Mediapool/testdateien/preppy-test/config.json");
	if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
	const data = await res.json();
	if (!data?.food) throw new Error("Invalid config structure");
	return data.food;
}
