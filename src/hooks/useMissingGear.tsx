import { useAppContext } from "../context/AppContext";
import { useGears } from "./useGear";
import { BabyIcon, PetIcon } from "../components/ui/Icon/Icon";

export function useMissingGear() {
	const { state } = useAppContext();
	const { data: gears } = useGears();

	const extraGears = [
		...(state.baby ? [{ label: "Baby tools", subtitle: "Windeln, Fläschchen, Babynahrung", icon: <BabyIcon /> }] : []),
		...(state.pet ? [{ label: "Pet tools", subtitle: "Futter, Napf, Leine", icon: <PetIcon /> }] : []),
	];

	const totalGearsCount = gears.length + extraGears.length;
	const percentGears = totalGearsCount > 0 ? Math.floor((state.equipment.length / totalGearsCount) * 100) : 0;
	const missingGears = gears.filter(({ label }) => !state.equipment.includes(label));
	const missingExtraGears = extraGears.filter(({ label }) => !state.equipment.includes(label));

	return { missingGears, missingExtraGears, percentGears, totalGearsCount };
}
