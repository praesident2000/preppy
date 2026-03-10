export type TypeThemes = {
   label: string;
   title: string;
   subtitle: string;
   icon: string;
};

export default async function fetchThemes(): Promise<TypeThemes[]> {
   const res = await fetch("/public/config.json");
   // const res = await fetch("https://www.diakonie-katastrophenhilfe.de/fileadmin/Mediapool/testdateien/preppy-test/config.json");
   if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
   const data = await res.json();
   if (!data?.themes) throw new Error("Invalid config structure");
   return data.themes;
}
