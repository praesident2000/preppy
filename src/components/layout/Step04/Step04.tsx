import { useAppContext } from "../../../context/AppContext";
import { useGears } from "../../../hooks/useGear";
import styles from "./Step04.module.scss";

function Step04() {
	const { state, dispatch } = useAppContext();
	const { data: gears, loading, error } = useGears();

	const handleChange = (id: string) => {
		dispatch({ type: "toggle_equipment", payload: id });
	};

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Beim Szenario Stromausfall solltest du folgende Ausrüstung bereit halten.</h2>
				<span>Schritt {state.step}/5</span>
			</div>
			{!loading && !error && (
				<div className="stepMain">
					<div className={styles.options}>
						<span className={styles.optionsText}>Welche Ausrüstung hast du bereits?</span>
						<div className={styles.optionsWrapper}>
							{gears.map(({ label, subtitle, icon }) => (
								<label key={label} className={styles.optionsItem}>
									<input
										type="checkbox"
										name="gear"
										value={label}
										checked={state.equipment.includes(label)}
										onChange={() => handleChange(label)}
									/>
									<div className={styles.optionsItemLabel}>
										<div>
											<strong>{label}</strong>
											<span>{subtitle}</span>
										</div>
										<span
											dangerouslySetInnerHTML={{ __html: icon }}
										></span>
									</div>
								</label>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Step04;
