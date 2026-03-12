import Range from "../../ui/Range/Range";
import People from "../../ui/People/People";
import FoodList from "../../ui/FoodList/FoodList";
import type { Step03Props } from "../../../types/types";

function Step03({
	currentStep,
	days,
	setDays,
	people,
	setPeople,
	shoppingList,
	setShoppingList,
}: Step03Props) {
	return (
		<div className="step">
			<div className="stepHeader">
				<h2>
					Planen wir deine Vorräte. Wie lange möchtest du autark sein?
				</h2>
				<span>Schritt {currentStep}/5</span>
			</div>
			<div className="stepMain">
				<Range
					days={days}
					setDays={setDays}
					defaultValue={days}
					min={3}
					max={14}
					step={1}
				/>
				<People 
					people={people} 
					setPeople={setPeople} 
				/>
				<FoodList
					people={people}
					days={days}
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
				/>
			</div>
		</div>
	);
}

export default Step03;
