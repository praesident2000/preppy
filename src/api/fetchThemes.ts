export type TypeThemes = {
   label: string;
   title: string;
   subtitle: string;
   icon: string;
};

import fetchConfig from "./fetchConfig";

export default async function fetchThemes(): Promise<TypeThemes[]> {
   const data = await fetchConfig();
   if (!data?.themes) throw new Error("Invalid config structure");
   return data.themes;
}
