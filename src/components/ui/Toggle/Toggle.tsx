import type { Diet } from "../../../types/types";
import type { Action } from "../../../reducer";
import styles from "./Toggle.module.scss";

const options: { label: string; value: Diet }[] = [
	{ label: "mischkost", value: "omnivore" },
	{ label: "vegetarisch", value: "vegetarian" },
	{ label: "vegan", value: "vegan" },
];

function Toggle({
	person,
	index,
	people,
	dispatch,
}: {
	person: string;
	index: number;
	people: Diet[];
	dispatch: React.Dispatch<Action>;
}) {
	const handleOption = (type: Diet, index: number) => {
		dispatch({
			type: "set_people",
			payload: people.map((item, i) => (i === index ? type : item)),
		});
	};

	return (
		<div className={styles.toggle}>
			{options.map((option) => (
				<button
					key={option.value}
					className={`${styles.option} ${person === option.value ? styles.active : ""}`}
					onClick={() => handleOption(option.value, index)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

export default Toggle;
