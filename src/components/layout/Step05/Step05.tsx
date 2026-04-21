import { useAppContext } from "../../../context/AppContext";
import { useOptions } from "../../../hooks/useOptions";
import type { TypeResults } from "../../../api/fetchOptions";
import { useThemes } from "../../../hooks/useThemes";
import { useFood } from "../../../hooks/useFood";
import { useMissingFood } from "../../../hooks/useMissingFood";
import { useMissingGear } from "../../../hooks/useMissingGear";
import { getVisibleCategories } from "../../../utils/dietFilter";

import Accordion from "../../ui/Accordion/Accordion";
import {
	HelpIconSvg,
	GearsIconSvg,
	GuideIconSvg,
	contactIconSvg,
	ErrorIcon,
	ArrowForwardIcon,
	IdeaIconSvg,
	FoodIconSvg,
	PersonIcon,
} from "../../ui/Icon/Icon";
import styles from "./Step05.module.scss";
import StepHeader from "../../ui/StepHeader/StepHeader";

function Step05() {
	const { state } = useAppContext();
	const {
		data: options,
		loading: optionsLoading,
		error: optionsError,
	} = useOptions();
	const {
		data: themes,
		loading: themesLoading,
		error: themesError,
	} = useThemes();
	const selectedThemes = themes.filter(({ label }) =>
		state.themes.includes(label),
	);

	const { data: food } = useFood();
	const { missingFoodList } = useMissingFood();
	const visibleFood = getVisibleCategories(food, state.people).map((cat) => {
		if (cat.category !== "miscellaneous") return cat;
		const extras = [
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

	const totFood = visibleFood.reduce(
		(sum, { items }) => sum + items.length,
		0,
	);
	const totList = visibleFood.reduce(
		(sum, { category }) => sum + (state.shoppingList[category]?.length ?? 0),
		0,
	);
	const percentFood = Math.floor((totList / totFood) * 100);

	const houseResults = [
		...new Set(
			options
				.filter(({ category }) => category === state.house.category)
				.flatMap(({ subcategories }) =>
					subcategories
						.filter(({ label }) =>
							state.house.subcategory?.includes(label),
						)
						.flatMap(({ results }) =>
							state.themes.flatMap(
								(theme) => results[theme as keyof TypeResults] ?? [],
							),
						),
				),
		),
	];

	const { missingGears, missingExtraGears, percentGears, totalGearsCount } = useMissingGear();

	return (
		<div className="step">
			<StepHeader
				title="Übersicht und Auswertung"
				text={
					<div className="stepHeaderBottom">
						<div className="text">
							<p>
								Hier siehst du eine Zusammenfassung mit Tipps basierend
								auf deinen Einstellungen. Am Ende dieser Seite kannst du
								dir ein PDF mit deinen persönlichen Vorsorge-Hinweisen
								herunterladen. Du kannst dich außerdem von uns in
								regelmäßigen Abständen daran erinnern lassen, deine
								Notfallvorbereitung zu überprüfen und aufzufrischen.
								Dafür benötigen wir deine Emailadresse.
								<br />
								<br />
								Du kannst außerdem den Link zu dieser Seite samt deinen
								persönlichen Voreinstellungen speichern, ihn jederzeit
								wieder aufrufen und die Einstellungen verändern. Oder
								ihn mit Freunden und Bekannten teilen.
							</p>
						</div>
					</div>
				}
			/>
			<div className="stepMain">
				<div className={styles.sections}>
				
					{/* RESULT */}
					<div className={styles.result}>
						<h2>Dein Vorsoge-Status</h2>
						<div className="progress big">
							{(() => {
								const pct = Math.round((percentFood + percentGears) / 2);
								const r = 28;
								const circ = 2 * Math.PI * r;
								const offset = circ * (1 - pct / 100);
								return (
									<>
										<div className="progressRing">
											<svg width="140" height="140" viewBox="0 0 72 72">
												<circle cx="36" cy="36" r={r} className="progressTrack" />
												<circle
													cx="36" cy="36" r={r}
													className="progressFill"
													strokeDasharray={circ}
													strokeDashoffset={offset}
													transform="rotate(-90 36 36)"
												/>
											</svg>
											<div className="progressPct">
												<span>{pct}%</span>
												<small>Vorbereitet</small>
											</div>
										</div>
										<div className="progressText">
											<strong>
												{pct === 0 ? 'Hauptsache anfangen.' :
												pct <= 30 ? 'Der Anfang ist gemacht.' :
												pct <= 50 ? 'Erste Vorkehrungen sind getroffen.' :
												pct <= 75 ? 'Es fehlt nicht mehr viel.' :
												pct < 100 ? 'Fast perfekt vorbereitet.' :
												'Perfekt vorbereitet.'}
											</strong>
										</div>
									</>
								);
							})()}
						</div>
						<div className={styles.resultText}>
							<PersonIcon />
							<div>
								<small>Dein Plan</small>
								<span>{state.people.length} {state.people.length > 1 ? 'Personen' : 'Person'} · {state.days} Tage autark · {state.people.length*state.days} Personentage Vorrat</span>
							</div>
						</div>
					</div>

					{/* HELP */}
					<Accordion
						label="Wichtige Verhaltenstipps"
						sublabel2={`${selectedThemes.length} ${selectedThemes.length > 1 ? 'Szenarien' : 'Szenario'}`}
						icon={HelpIconSvg}
						big={true}
					>
						<div className={styles.sectionBottomSub}>
							{!themesLoading &&
								!themesError &&
								selectedThemes.flatMap((t) =>
									t.tips.map(({ label, list }) => (
										<div key={`${t.label}-${label}`}>
											<strong>{label}</strong>
											<ul className={styles.list}>
												{list.map((item) => (
													<li
														key={item}
														className={`${styles.listItem} ${styles.alt}`}
													>
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>
									)),
								)}
						</div>
					</Accordion>

					{/* FOOD */}
					<Accordion
						label="Vorräte"
						sublabel2={`${totList}/${totFood} Produkte `}
						icon={FoodIconSvg}
						big={true}
						percent={percentFood}
					>
						<div className={styles.sectionBottomSub}>
							{missingFoodList.length > 0 ? (
								<div>
									<strong>Einkaufsliste</strong>
									<ul className={styles.list}>
										{missingFoodList.map(({ label, total }) => {
											return (
												<li
													key={label}
													className={`${styles.listItem} ${styles.alt}`}
												>
													<span>{label}</span>
													{total && <strong>{total}</strong>}
												</li>
											);
										})}
									</ul>
								</div>
							) : (
								<div><strong>Du hast alles vorbereitet!</strong></div>
							)}
						</div>
					</Accordion>

					{/* GEARS */}
					<Accordion
						label="Ausrüstung"
						sublabel2={`${totalGearsCount - missingGears.length - missingExtraGears.length}/${totalGearsCount} Artikel`}
						icon={GearsIconSvg}
						big={true}
						percent={percentGears}
					>
						<div className={styles.sectionBottomSub}>
							{missingGears.length > 0 || missingExtraGears.length > 0 ? (
								<div>
									<strong>Was mir noch fehlt</strong>
									<ul className={styles.list}>
										{missingGears.map(({ label, icon }) => (
											<li key={label} className={styles.listItem}>
												<span
													dangerouslySetInnerHTML={{
														__html: icon,
													}}
												></span>
												<span>{label}</span>
											</li>
										))}
										{missingExtraGears.map(({ label, icon }) => (
											<li key={label} className={styles.listItem}>
												<span>{icon}</span>
												<span>{label}</span>
											</li>
										))}
									</ul>
								</div>
							) : (
								<div><strong>Du hast alles vorbereitet!</strong></div>
							)}
						</div>
					</Accordion>

					{/* HOUSE */}
					<Accordion
						label="Wohnsituations-Tipps"
						sublabel2={`${houseResults.length} ${houseResults.length > 1 ? 'Tipps' : 'Tipp'}`}
						icon={IdeaIconSvg}
						big={true}
					>
						<div>
							<ul className={styles.list}>
								{!optionsLoading &&
									!optionsError &&
									(houseResults.length === 0 ? (
										<div
											className={`${styles.missing} ${styles.alt}`}
										>
											<ErrorIcon />
											<span>
												Wohnsituation noch nicht angegeben -
												bitte Schritt 2 ausfüllen.
											</span>
										</div>
									) : (
										houseResults.map((result, index) => (
											<li
												key={index}
												className={styles.listItem}
											>
												{result}
											</li>
										))
									))}
							</ul>
						</div>
					</Accordion>

					{/* GUIDES */}
					<Accordion
						label="Guide"
						sublabel2={`${[...new Set(selectedThemes.flatMap((t) => t.guides))].length} ${[...new Set(selectedThemes.flatMap((t) => t.guides))].length > 1 ? 'Links' : 'Link'}`}
						icon={GuideIconSvg}
						big={true}
					>
						<div>
							<ul className={styles.list}>
								{!themesLoading &&
									!themesError &&
									selectedThemes.flatMap((t) =>
										t.guides.map(({ label, url }) => (
											<li
												key={`${t.label}-${label}`}
												className={`${styles.listItem} ${styles.alt}`}
											>
												<a href={url} target="_blank">
													<ArrowForwardIcon />
													<span>{label}</span>
												</a>
											</li>
										)),
									)}
							</ul>
						</div>
					</Accordion>

					{/* CONTACTS */}
					<Accordion
						label="Wichtige Kontakte"
						sublabel2={`${[...new Set(selectedThemes.flatMap((t) => t.contacts))].length} ${[...new Set(selectedThemes.flatMap((t) => t.contacts))].length > 1 ? 'Nummern' : 'Nummer'}`}
						icon={contactIconSvg}
						big={true}
					>
						<div>
							<ul className={styles.list}>
								{!themesLoading &&
									!themesError &&
									[
										...new Set(
											selectedThemes.flatMap((t) => t.contacts),
										),
									].map((contact) => (
										<li
											key={contact}
											className={`${styles.listItem} ${styles.alt}`}
										>
											<span>{contact}</span>
										</li>
									))}
							</ul>
						</div>
					</Accordion>

				</div>
			</div>
		</div>
	);
}

export default Step05;
