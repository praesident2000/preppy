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

export default async function fetchOptions(): Promise<TypeOption[]> {
   const res = await fetch("/public/config.json");
   // const res = await fetch("https://www.diakonie-katastrophenhilfe.de/fileadmin/Mediapool/testdateien/preppy-test/config.json");
   if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
   const data = await res.json();
   if (!data?.options) throw new Error("Invalid config structure");
   return data.options;
}
