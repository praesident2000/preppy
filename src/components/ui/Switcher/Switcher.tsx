import styles from "../Switcher/Switcher.module.scss";

interface SwitcherProps {
	switcher: () => void;
	label1: string;
	label2: string;
}

function Switcher({ switcher, label1, label2 }: SwitcherProps) {
	return (
		<label className={styles.switcher}>
			<input type="checkbox" onClick={switcher} />
			<span>{label1}</span>
			<span>{label2}</span>
		</label>
	);
}

export default Switcher;
