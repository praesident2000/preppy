import { useAppContext } from "../../../context/AppContext";
import Range from "../../ui/Range/Range";
import People from "../../ui/People/People";
import FoodList from "../../ui/FoodList/FoodList";

function Step03() {
	const { state } = useAppContext();

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Planen wir deine Vorräte. Wie lange möchtest du autark sein?</h2>
				<span>Schritt {state.step}/5</span>
			</div>
			<div className="stepMain">
				<Range />
				<People />
				<FoodList />
			</div>
		</div>
	);
}

export default Step03;
