import { useAppContext } from "../context/AppContext";
import { useFood } from "./useFood";
import { useGears } from "./useGear";
import { useThemes } from "./useThemes";
import { useOptions } from "./useOptions";
import { useMissingFood } from "./useMissingFood";
import { useMissingGear } from "./useMissingGear";
import {
  getVisibleCategories,
  getActiveMerges,
  computeItemTotal,
} from "../utils/dietFilter";
import type { PdfData } from "../utils/generatePDF";
import type { TypeResults } from "../api/fetchOptions";

export function usePdfData() {
  const { state } = useAppContext();
  const { data: food } = useFood();
  const { data: gears } = useGears();
  const { data: themes } = useThemes();
  const { data: options } = useOptions();
  const { missingFoodList } = useMissingFood();
  const { missingGears, missingExtraGears } = useMissingGear();

  function getPdfData(): PdfData {
    // Tips, guides, contacts from selected themes
    const selectedThemeData = themes.filter((t) =>
      state.themes.includes(t.label),
    );

    const tips: PdfData["tips"] = {};
    for (const theme of selectedThemeData) {
      tips[theme.label] = {
        title: theme.title,
        sections: theme.tips.map((t) => ({ label: t.label, items: t.list })),
      };
    }

    // Food need: missing items with a computed total
    const foodNeed = missingFoodList.map((item) => {
      let packInfo: string | undefined;
      if (item.totalPacks > 0 && item.packSize && item.packLabelPlural && item.packLabelSingular) {
        const packSizeFormatted = Number(item.packSize).toLocaleString("de-DE");
        packInfo = `${item.totalPacks} ${item.packLabelPlural} (${packSizeFormatted}${item.unit}/${item.packLabelSingular})`;
      }
      return { label: item.label, amount: item.total ?? "", packInfo };
    });

    // Food have: items checked as already owned, with computed totals
    const visibleFood = getVisibleCategories(food, state.people);
    const activeMerges = getActiveMerges(visibleFood, food);
    const foodHave = visibleFood.flatMap(({ category, items }) => {
      if (category === "miscellaneous") return [];
      return items
        .filter((item) => state.shoppingList[category]?.includes(item.label))
        .map((item) => {
          const totalNum = computeItemTotal(
            category,
            item.label,
            item.perPersonPerDay,
            state.people,
            state.days,
            food,
            activeMerges,
          );
          let packInfo: string | undefined;
          if (item.packSize && item.packLabelPlural && item.packLabelSingular) {
            const totalPacks = Math.ceil(totalNum / Number(item.packSize));
            const packSizeFormatted = Number(item.packSize).toLocaleString("de-DE");
            packInfo = `${totalPacks} ${item.packLabelPlural} (${packSizeFormatted}${item.unit}/${item.packLabelSingular})`;
          }
          return {
            label: item.label,
            amount: `${totalNum.toLocaleString("de-DE")} ${item.unit}`,
            packInfo,
          };
        });
    });

    // Gear
    const gearNeed = [
      ...missingGears.map((g) => g.label),
      ...missingExtraGears.map((g) => g.label),
    ];
    const gearHave = [
      ...gears
        .filter((g) => state.equipment.includes(g.label))
        .map((g) => g.label),
      ...(state.baby && state.equipment.includes("Baby tools")
        ? ["Baby- und Kleinkindausstattung"]
        : []),
      ...(state.pet && state.equipment.includes("Pet tools")
        ? ["Tierausstattung"]
        : []),
    ];

    // Housing tips: collect results for each selected subcategory × theme
    const housingTips: string[] = [];
    const matchedOption = options.find(
      (o) => o.category === state.house.category,
    );
    if (matchedOption) {
      for (const sub of matchedOption.subcategories) {
        if (!state.house.subcategory?.includes(sub.label)) continue;
        for (const themeKey of state.themes) {
          const results = sub.results[themeKey as keyof TypeResults];
          if (results) housingTips.push(...results);
        }
      }
    }

    return {
      persons: state.people.length,
      days: state.days,
      selected_themes: state.themes,
      tips,
      food: { need: foodNeed, have: foodHave },
      gear: { need: gearNeed, have: gearHave },
      housing_tips: [...new Set(housingTips)],
      guides: [
        ...new Map(
          selectedThemeData.flatMap((t) => t.guides).map((g) => [g.label, g]),
        ).values(),
      ],
      contacts: [...new Set(selectedThemeData.flatMap((t) => t.contacts))],
    };
  }

  return { getPdfData };
}
