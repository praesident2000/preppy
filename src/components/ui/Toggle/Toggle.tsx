import styles from "./Toggle.module.scss";

const options = [
	{ label: "mischkost", value: "omnivore" },
	{ label: "vegetarisch", value: "vegetarian" },
	{ label: "vegan", value: "vegan" },
];

function Toggle({
	person,
	index,
	setPeople,
}: {
	person: string;
	index: number;
	setPeople: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	const handleOption = (type: string, index: number) => {
		setPeople((prev: string[]) =>
			prev.map((item, i) => (i === index ? type : item)),
		);
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
