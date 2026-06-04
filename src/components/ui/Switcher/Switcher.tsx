import styles from "../Switcher/Switcher.module.scss";

interface SwitcherProps {
	switcher: () => void;
	checked: boolean;
	label1: string;
	label2: string;
}

function Switcher({ switcher, checked, label1, label2 }: SwitcherProps) {
	return (
		<label className={styles.switcher}>
			<input type="checkbox" checked={checked} onChange={switcher} />
			<span>{label1}</span>
			<span>{label2}</span>
		</label>
	);
}

export default Switcher;
