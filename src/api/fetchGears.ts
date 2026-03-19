export type TypeGear = {
   label: string;
   subtitle: string;
   icon: string;
};

import fetchConfig from "./fetchConfig";

export default async function fetchGears(): Promise<TypeGear[]> {
   const data = await fetchConfig();
   if (!data?.gears) throw new Error("Invalid config structure");
   return data.gears;
}
