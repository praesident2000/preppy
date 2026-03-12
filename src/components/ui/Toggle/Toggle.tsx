import type { Action } from "../../../reducer";
import styles from "./Toggle.module.scss";

const options = [
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
	people: string[];
	dispatch: React.Dispatch<Action>;
}) {
	const handleOption = (type: string, index: number) => {
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
