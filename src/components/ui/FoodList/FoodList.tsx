import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useFood } from "../../../hooks/useFood";
import Accordion from "../Accordion/Accordion";
import Switcher from "../Switcher/Switcher";
import styles from "../FoodList/FoodList.module.scss";
import type { ShoppingList } from "../../../types/types";
import type { FoodItem } from "../../../api/fetchFood";
import {
	getActiveMerges,
	computeItemTotal,
	formatTotal,
	getVisibleCategories,
} from "../../../utils/dietFilter";

function FoodList({ reduced }: { reduced?: boolean }) {
	const { state, dispatch } = useAppContext();

	const { data: food, loading, error } = useFood();
	const [showQuantity, setShowQuantity] = useState<boolean>(false);

	function handleChange(category: keyof ShoppingList, element: string) {
		dispatch({ type: "toggle_shoppinglist", payload: { category, element } });
	}

	const visibleFood = getVisibleCategories(food, state.people).map((cat) => {
		if (cat.category !== "miscellaneous") return cat;
		const extras: FoodItem[] = [
			...(state.baby
				? [
						{
							label: "Baby- und Kleinkindnahrung (z. B. Milchpulver + zusätzliches Wasser, Fertignahrung, Snacks)",
							unit: "",
							perPersonPerDay: 0,
							decimals: 0,
						},
					]
				: []),
			...(state.pet
				? [
						{
							label: "Haustierfutter",
							unit: "",
							perPersonPerDay: 0,
							decimals: 0,
						},
					]
				: []),
		];
		return extras.length > 0
			? { ...cat, items: [...cat.items, ...extras] }
			: cat;
	});

	const activeMerges = getActiveMerges(visibleFood, food);

	function getTotal(
		category: string,
		label: string,
		perPersonPerDay: number,
	): number {
		return computeItemTotal(
			category,
			label,
			perPersonPerDay,
			state.people,
			state.days,
			food,
			activeMerges,
		);
	}

	return (
		<>
			{reduced ? (
				<div className={styles.foodListAlt}>
					{!loading && !error && (
						<div className={styles.foodListAltWrapper}>
							{visibleFood.map(
								({
									category,
									label,
									items,
									unit,
									totPerPersonPerDay,
								}) => {
									const categoryTotal = items.reduce(
										(sum, item) =>
											sum +
											getTotal(
												category,
												item.label,
												item.perPersonPerDay,
											),
										0,
									);
									return (
										<div
											key={category}
											className={styles.foodSectionAlt}
										>
											<div
												key={category}
												className={styles.foodSectionAltHeader}
											>
												<h3>{label}</h3>
												{category !== "miscellaneous" && (
													<p>
														<strong>
															{formatTotal(categoryTotal, unit)}
														</strong>{" "}
														<small>{`(ca. ${totPerPersonPerDay} ${unit} pro Person und Tag)`}</small>
													</p>
												)}
											</div>
											<div className={styles.foodSectionAltWrapper}>
												{items.map(
													({
														label,
														unit,
														perPersonPerDay,
														packSize,
														packLabelPlural,
														packLabelSingular,
													}) => {
														const total = getTotal(
															category,
															label,
															perPersonPerDay,
														);
														const totalPacks = Math.ceil(
															total / Number(packSize),
														);
														return (
															<div
																key={label}
																className={
																	styles.foodSectionAltItem
																}
															>
																<h4>{label}</h4>
																{category !==
																	"miscellaneous" && (
																	<p>
																		<strong>{`${total.toLocaleString("de-DE")} ${unit}`}</strong>
																		<small> oder </small>
																		<strong>{`${totalPacks} ${totalPacks > 1 ? packLabelPlural : packLabelSingular}`}</strong>{" "}
																		<small>{`(${packSize}${unit}/${packLabelSingular})`}</small>
																	</p>
																)}
															</div>
														);
													},
												)}
											</div>
										</div>
									);
								},
							)}
						</div>
					)}
				</div>
			) : (
				<div className={styles.foodList}>
					<div className={styles.foodHeader}>
						<div className={styles.foodHeaderTop}>
							<h2>
								Deine benötigten Vorräte. Welche davon hast du bereits?
							</h2>
							<Accordion label="Warum diese Lebensmittel und Mengen?">
								<div className="text">
									<p>
										Die genannten Lebensmittel sind Vorschläge, um die
										einzelnen Kategorien abwechslungsreich zu
										gestalten. Du solltest natürlich Lebensmittel
										wählen, die du gerne isst. Es müssen nicht nur
										Konserven sein: Was und wieviel würdest du ohnehin
										einkaufen? Wie lange sind diese Produkte haltbar?{" "}
										<br />
										<br />
										Überlege auch, was du immer im Kühlschrank und
										Tiefkühler hast, das du z. B. bei einem
										Stromausfall sofort zubereiten könntest. Überlege
										dir auch, ob und wie oft du warme Speisen
										zubereiten kannst. Je nach dem solltest du auch
										darauf achten, dass deine Vorräte kalt verzehrt
										werden können. <br />
										<br />
										Die angegebenen Mengen sind praxisnahe
										Empfehlungen basierend auf Angaben des{" "}
										<a
											href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratskalkulator"
											target="_blank"
										>
											BBK
										</a>{" "}
										(Bundesamt für Bevölkerungsschutz und Katastrophenhilfe), der{" "}
										<a href="https://www.dge.de/" target="_blank">
											DGE
										</a>{" "}
										(Deutsche Gesellschaft für Ernährung) und eigenen Überlegungen. Für eine
										alltagstaugliche Einkaufsliste haben wir diese
										Mengen in übliche Packungsgrößen umgerechnet. Du
										kannst wählen, ob du lieber die Grammangabe oder
										die Packungen anzeigen lassen möchtest.
									</p>
								</div>
							</Accordion>
							<p className={styles.foodHeaderBottom}>
								Für deinen <strong>{state.people.length}-Personen-Haushalt</strong>, um <strong>{state.days} Tage</strong> zu überbrücken.
							</p>
						</div>

						<Switcher
							switcher={() => setShowQuantity(!showQuantity)}
							label1="Menge/Gewicht"
							label2="Packungseinheiten"
						/>

						<div className="progressChart">
							{(() => {
								const total = visibleFood.reduce(
									(sum, cat) => sum + cat.items.length,
									0,
								);
								const checked = visibleFood.reduce(
									(sum, cat) =>
										sum +
										(state.shoppingList[
											cat.category as keyof ShoppingList
										]?.length ?? 0),
									0,
								);
								const pct =
									total > 0 ? Math.round((checked / total) * 100) : 0;
								const r = 28;
								const circ = 2 * Math.PI * r;
								const offset = circ * (1 - pct / 100);
								return (
									<>
										<div className="progressChartRing">
											<svg
												width="100"
												height="100"
												viewBox="0 0 72 72"
											>
												<circle
													cx="36"
													cy="36"
													r={r}
													className="progressChartTrack"
												/>
												<circle
													cx="36"
													cy="36"
													r={r}
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
											<strong>
												{checked} von {total} erledigt
											</strong>
											<span>
												Hake ab, was du hast — den Rest bekommst du
												später als Einkaufsliste.
											</span>
										</div>
									</>
								);
							})()}
						</div>
					</div>
					{!loading && !error && (
						<div className={styles.foodListWrapper}>
							{visibleFood.map(
								(
									{
										category,
										label,
										items,
										icon,
										unit,
										totPerPersonPerDay,
									},
									index,
								) => {
									const categoryTotal = items.reduce(
										(sum, item) =>
											sum +
											getTotal(
												category,
												item.label,
												item.perPersonPerDay,
											),
										0,
									);
									return (
										<div
											key={category}
											className={styles.foodSection}
										>
											<Accordion
												label={label}
												sublabel1={
													category !== "miscellaneous"
														? formatTotal(categoryTotal, unit)
														: undefined
												}
												sublabel2={
													category !== "miscellaneous"
														? `ca. ${totPerPersonPerDay} ${unit} pro Person und Tag`
														: undefined
												}
												icon={icon}
												big={true}
												startOpen={index === 0}
												colorOpen={true}
											>
												<div className={styles.checkboxes}>
													{items.map(
														({
															label,
															unit,
															perPersonPerDay,
															packSize,
															packLabelPlural,
															packLabelSingular,
														}) => {
															const total = getTotal(
																category,
																label,
																perPersonPerDay,
															);
															const totalPacks = Math.ceil(
																total / Number(packSize),
															);

															return (
																<label
																	className={styles.checkbox}
																	key={label}
																>
																	<input
																		type="checkbox"
																		name={`foodCategory-${category}`}
																		value={label}
																		checked={state.shoppingList[
																			category
																		].includes(label)}
																		onChange={() =>
																			handleChange(
																				category,
																				label,
																			)
																		}
																	/>
																	<span>
																		<strong>{label}</strong>
																		{category !==
																			"miscellaneous" && (
																			<small>
																				{showQuantity
																					? `(${packSize}${unit}/${packLabelSingular}) ${totalPacks} ${totalPacks > 1 ? packLabelPlural : packLabelSingular}`
																					: `${total.toLocaleString("de-DE")} ${unit}`}
																			</small>
																		)}
																	</span>
																</label>
															);
														},
													)}
												</div>
											</Accordion>
										</div>
									);
								},
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default FoodList;
