import { useAppContext } from "../../../context/AppContext";
import { useGears } from "../../../hooks/useGear";
import { BabyIcon, PetIcon } from "../../ui/Icon/Icon";
import styles from "./GearList.module.scss";

function GearList({ reduced }: { reduced?: boolean }) {
	const { state, dispatch } = useAppContext();
	const { data: gears, loading, error } = useGears();

	const handleChange = (id: string) => {
		dispatch({ type: "toggle_equipment", payload: id });
	};

	return (
		<>
			{reduced ? (
				<ul className={styles.optionsAlt}>
					{gears.map(({ label, subtitle }) => (
						<li key={label} className={styles.optionsAltItem}>
							<strong>{label}</strong>
							<span dangerouslySetInnerHTML={{ __html: subtitle }} />
						</li>
					))}
					{state.baby && (
						<li key="baby" className={styles.optionsAltItem}>
							<strong>Baby- und Kleinkindausstattung</strong>
							<span>Windeln, Fläschchen, Pflegeprodukte, Schnuller.</span>
						</li>
					)}
					{state.pet && (
						<li key="pet" className={styles.optionsAltItem}>
							<strong>Tierausstattung</strong>
							<span>Hygienestreu, Transportbehälter.</span>
						</li>
					)}
				</ul>
			) : (
				!loading &&
				!error && (
					<div className="stepMain">
						<div className={styles.options}>
							<span className={styles.optionsText}>
								Welche Ausrüstung hast du bereits?
							</span>
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
												<span dangerouslySetInnerHTML={{ __html: subtitle }} />
											</div>
											<span
												dangerouslySetInnerHTML={{ __html: icon }}
											></span>
										</div>
									</label>
								))}
								{state.baby && (
									<label
										key="Baby tools"
										className={styles.optionsItem}
									>
										<input
											type="checkbox"
											name="gear"
											value="Baby tools"
											checked={state.equipment.includes(
												"Baby tools",
											)}
											onChange={() => handleChange("Baby tools")}
										/>
										<div className={styles.optionsItemLabel}>
											<div>
												<strong>Baby- und Kleinkindausstattung</strong>
												<span>Windeln, Fläschchen, Pflegeprodukte, Schnuller.</span>
											</div>
											<span>
												<BabyIcon />
											</span>
										</div>
									</label>
								)}
								{state.pet && (
									<label
										key="Pet tools"
										className={styles.optionsItem}
									>
										<input
											type="checkbox"
											name="gear"
											value="Pet tools"
											checked={state.equipment.includes("Pet tools")}
											onChange={() => handleChange("Pet tools")}
										/>
										<div className={styles.optionsItemLabel}>
											<div>
												<strong>Tierausstattung</strong>
												<span>Hygienestreu, Transportbehälter.</span>
											</div>
											<span>
												<PetIcon />
											</span>
										</div>
									</label>
								)}
							</div>
						</div>
					</div>
				)
			)}
		</>
	);
}

export default GearList;
