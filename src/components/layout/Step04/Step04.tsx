import { useAppContext } from "../../../context/AppContext";
import GearList from "../../ui/GearList/GearList";

function Step04() {
	const { state } = useAppContext();

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>
					Beim Szenario Stromausfall solltest du folgende Ausrüstung bereit
					halten.
				</h2>
				<span>Schritt {state.step}/5</span>
			</div>
			<GearList />
		</div>
	);
}

export default Step04;
