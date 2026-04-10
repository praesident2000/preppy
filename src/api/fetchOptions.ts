export type TypeResults = {
   stromausfall: string[];
   hitze: string[];
   starkregen_hochwasser: string[];
   sturm_tornado: string[];
};
export type TypeSubcategories = {
   label: string;
   results: TypeResults;
};

export type TypeOption = {
   category: string;
   icon: string;
   text: string;
   subcategories: TypeSubcategories[]
};

import fetchConfig from "./fetchConfig";

export default async function fetchOptions(): Promise<TypeOption[]> {
   const data = await fetchConfig();
   if (!data?.options) throw new Error("Invalid config structure");
   return data.options;
}
