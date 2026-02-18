export type TypeGear = {
   id: string;
   label: string;
};

export default async function fetchGears(): Promise<TypeGear[]> {
   const res = await fetch("/public/config.json");
   if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
   const data = await res.json();
   if (!data?.gears) throw new Error("Invalid config structure");
   return data.gears;
}
