import styles from "./Label.module.scss";

type LabelColor = "red" | "orange" | "yellow" | "green";

function ProgressLabel({ value }: { value: number }) {
	const getLabel = (value: number): { label: string; color: LabelColor } => {
		if (value === 100) return { label: "Perfekt", color: "green" };
		if (value >= 75) return { label: "Sehr gut", color: "green" };
		if (value >= 50) return { label: "Gut", color: "yellow" };
		if (value >= 25) return { label: "Ok", color: "orange" };
		return { label: "Schlecht", color: "red" };
	};

	const { label, color } = getLabel(value);

	return <span className={`${styles.label} ${styles[color]}`}>{label}</span>;
}

export default ProgressLabel;
