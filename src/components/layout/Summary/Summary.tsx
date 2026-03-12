import { useAppContext } from "../../../context/AppContext";
import styles from "./Summary.module.scss";

function Summary({
	summaryRef,
}: {
	summaryRef: React.RefObject<HTMLDivElement>;
}) {
	const { state } = useAppContext();

	return (
		<div className={styles.summary} ref={summaryRef}>
			<h2>Dein Preppy</h2>
			<ul>
				<li>
					Szenario: <strong>{state.house.category}</strong>
				</li>
				<li>
					Wohnsituation:{" "}
					<strong>{state.house.category} - {state.house.subcategory?.join(', ')}</strong>
				</li>
				<li>
					Tage:{" "}
					<strong>{state.days}</strong>
				</li>
				<li>
					Personen:{" "}
					<strong>{state.people.length}</strong>
				</li>
				<li>
					Ausrüstung:{" "}
					<strong>{state.equipment.join(', ')}</strong>
				</li>
			</ul>
		</div>
	);
}

export default Summary;
