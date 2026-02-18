export type FoodItem = {
   label: string;
   unit: string;
   perPersonPerDay: number;
   decimals: number;
   packSize?: number;
   packLabelPlural?: string;
   packLabelSingular?: string;
};

export type FoodCategory = {
   label: string;
   unit: string;
   totPerPersonPerDay: number;
   items: FoodItem[];
};

export type FoodMap = Record<string, FoodCategory>;

export default async function fetchFood(): Promise<FoodMap> {
   const res = await fetch("/public/config.json");
   if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
   const data = await res.json();
   if (!data?.food) throw new Error("Invalid config structure");
   return data.food;
}
