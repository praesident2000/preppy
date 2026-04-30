import { useAppContext } from "../../../context/AppContext";
import { useGears } from "../../../hooks/useGear";
import { BabyIcon, PetIcon, EquipmentIconSvg, InformedIconSvg, EmergencyIconSvg } from "../../ui/Icon/Icon";
import styles from "./GearList.module.scss";
import type { TypeGear } from "../../../api/fetchGears";
import Accordion from "../Accordion/Accordion";

const CATEGORIES: { key: TypeGear["category"]; label: string; description: string; icon: string }[] = [
	{
		key: "grundausstattung",
		label: "Die Grundausstattung",
		description: "Das hast du vielleicht schon zu Hause.",
		icon: EquipmentIconSvg,
	},
	{
		key: "informiert",
		label: "Informiert bleiben",
		description: "Damit du weißt, was draußen passiert.",
		icon: InformedIconSvg,
	},
	{
		key: "ernstfall",
		label: "Für den Ernstfall",
		description: "Damit du auf alles vorbereitet bist.",
		icon: EmergencyIconSvg,
	},
];

function GearList({ reduced }: { reduced?: boolean }) {
	const { state, dispatch } = useAppContext();
	const { data: gears, loading, error } = useGears();

	const handleChange = (id: string) => {
		dispatch({ type: "toggle_equipment", payload: id });
	};

	const getGearsByCategory = (cat: TypeGear["category"]) =>
		gears.filter((g) => g.category === cat);

	return (
		<>
			{reduced ? (
				<div className={styles.categoriesWrapper}>
					{CATEGORIES.map(({ key, label, description }) => {
						const items = getGearsByCategory(key as TypeGear["category"]);
						const showBaby = key === "grundausstattung" && state.baby;
						const showPet = key === "grundausstattung" && state.pet;
						if (!items.length && !showBaby && !showPet) return null;
						return (
							<div key={key} className={styles.categorySection}>
								<div className={styles.categoryHeader}>
									<strong>{label}</strong>
									<span>{description}</span>
								</div>
								<ul className={styles.optionsAlt}>
									{items.map(({ label: itemLabel, subtitle }) => (
										<li key={itemLabel} className={styles.optionsAltItem}>
											<strong>{itemLabel}</strong>
											<span dangerouslySetInnerHTML={{ __html: subtitle }} />
										</li>
									))}
									{showBaby && (
										<li key="baby" className={styles.optionsAltItem}>
											<strong>Baby- und Kleinkindausstattung</strong>
											<span>Windeln, Fläschchen, Pflegeprodukte, Schnuller.</span>
										</li>
									)}
									{showPet && (
										<li key="pet" className={styles.optionsAltItem}>
											<strong>Tierausstattung</strong>
											<span>Hygienestreu, Transportbehälter.</span>
										</li>
									)}
								</ul>
							</div>
						);
					})}
				</div>
			) : (
				!loading &&
				!error && (
					<div className="stepMain">
						<div className={styles.options}>
							<span className={styles.optionsText}>
								Welche Ausrüstung hast du bereits?
							</span>
							<div className="progressChart">
								{(() => {
									const total = gears.length + (state.baby ? 1 : 0) + (state.pet ? 1 : 0);
									const checked = state.equipment.length;
									const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
									const r = 28;
									const circ = 2 * Math.PI * r;
									const offset = circ * (1 - pct / 100);
									return (
										<>
											<div className="progressChartRing">
												<svg width="100" height="100" viewBox="0 0 72 72">
													<circle cx="36" cy="36" r={r} className="progressChartTrack" />
													<circle
														cx="36" cy="36" r={r}
														className="progressChartFill"
														strokeDasharray={circ}
														strokeDashoffset={offset}
														transform="rotate(-90 36 36)"
													/>
												</svg>
												<div className="progressChartPct">
													<span>{pct}%</span>
												</div>
											</div>
											<div className="progressChartText">
												<strong>{checked} von {total} erledigt</strong>
												<span>Hake ab, was du hast — den Rest bekommst du später als Einkaufsliste.</span>
											</div>
										</>
									);
								})()}
							</div>

							<div className={styles.optionsMain}>
								{CATEGORIES.map(({ key, label, description, icon }) => {
									const items = getGearsByCategory(key as TypeGear["category"]);
									const showBaby = key === "grundausstattung" && state.baby;
									const showPet = key === "grundausstattung" && state.pet;
									if (!items.length && !showBaby && !showPet) return null;
									return (
										<Accordion
											label={label}
											sublabel2={description}
											icon={icon}
											big={true}
										>
											<div className={styles.optionsWrapper}>
												{items.map(({ label: itemLabel, subtitle, icon }) => (
													<label key={itemLabel} className={styles.optionsItem}>
														<input
															type="checkbox"
															name="gear"
															value={itemLabel}
															checked={state.equipment.includes(itemLabel)}
															onChange={() => handleChange(itemLabel)}
														/>
														<div className={styles.optionsItemLabel}>
															<div>
																<strong>{itemLabel}</strong>
																<span dangerouslySetInnerHTML={{ __html: subtitle }} />
															</div>
															<span dangerouslySetInnerHTML={{ __html: icon }} />
														</div>
													</label>
												))}
												{showBaby && (
													<label key="Baby tools" className={styles.optionsItem}>
														<input
															type="checkbox"
															name="gear"
															value="Baby tools"
															checked={state.equipment.includes("Baby tools")}
															onChange={() => handleChange("Baby tools")}
														/>
														<div className={styles.optionsItemLabel}>
															<div>
																<strong>Baby- und Kleinkindausstattung</strong>
																<span>Windeln, Fläschchen, Pflegeprodukte, Schnuller.</span>
															</div>
															<span><BabyIcon /></span>
														</div>
													</label>
												)}
												{showPet && (
													<label key="Pet tools" className={styles.optionsItem}>
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
															<span><PetIcon /></span>
														</div>
													</label>
												)}
											</div>
										</Accordion>
									);
								})}
							</div>

						</div>
					</div>
				)
			)}
		</>
	);
}

export default GearList;
