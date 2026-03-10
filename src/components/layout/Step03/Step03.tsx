import styles from "./Step03.module.scss";
import Range from "../../ui/Range/Range";
import People from "../../ui/People/People";
import FoodList from "../../ui/FoodList/FoodList";

type StepProps = {
	currentStep: number;
	days: number;
	setDays: React.Dispatch<React.SetStateAction<number>>;
	people: string[];
	setPeople: React.Dispatch<React.SetStateAction<string[]>>;
};

function Step03({ currentStep, days, setDays, people, setPeople }: StepProps) {
	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Planen wir deine Vorräte. Wie lange möchtest du autark sein?</h2>
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
				<People people={people} setPeople={setPeople} />
				<FoodList people={people} days={days} />
			</div>
		</div>
	);
}

export default Step03;
