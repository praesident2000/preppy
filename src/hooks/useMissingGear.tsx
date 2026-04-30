import { useAppContext } from "../context/AppContext";
import { useGears } from "./useGear";
import { BabyIcon, PetIcon } from "../components/ui/Icon/Icon";

export function useMissingGear() {
	const { state } = useAppContext();
	const { data: gears } = useGears();

	const extraGears = [
		...(state.baby ? [{ id: "Baby tools", label: "Baby- und Kleinkindausstattung", subtitle: "Windeln, Fläschchen, Pflegeprodukte, Schnuller.", icon: <BabyIcon /> }] : []),
		...(state.pet ? [{ id: "Pet tools", label: "Tierausstattung", subtitle: "Hygienestreu, Transportbehälter.", icon: <PetIcon /> }] : []),
	];

	const totalGearsCount = gears.length + extraGears.length;
	const percentGears = totalGearsCount > 0 ? Math.floor((state.equipment.length / totalGearsCount) * 100) : 0;
	const missingGears = gears.filter(({ label }) => !state.equipment.includes(label));
	const missingExtraGears = extraGears.filter(({ id }) => !state.equipment.includes(id));

	return { missingGears, missingExtraGears, percentGears, totalGearsCount };
}
