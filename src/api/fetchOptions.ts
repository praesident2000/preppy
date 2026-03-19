export type TypeSubcategories = {
   label: string;
   results: string[];
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
