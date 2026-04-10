import { useAppContext } from "../../../context/AppContext";
import GearList from "../../ui/GearList/GearList";

function Step04() {
	const { state } = useAppContext();

	return (
		<div className="step">
			<div className="stepHeader">
				<div className="stepHeaderTop">
					<h2>Die folgende Ausrüstung solltest du immer bereit halten.</h2>
					<span>Schritt {state.step}/5</span>
				</div>
			</div>
			<GearList />
		</div>
	);
}

export default Step04;
