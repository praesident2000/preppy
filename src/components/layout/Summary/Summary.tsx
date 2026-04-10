import { useAppContext } from "../../../context/AppContext";
import { useMissingFood } from "../../../hooks/useMissingFood";
import { useMissingGear } from "../../../hooks/useMissingGear";
import { useThemes } from "../../../hooks/useThemes";
import FoodList from "../../ui/FoodList/FoodList";
import GearList from "../../ui/GearList/GearList";
import { Logo } from "../../ui/Icon/Icon";
import styles from "./Summary.module.scss";

function Summary({
	summaryRef,
}: {
	summaryRef: React.RefObject<HTMLDivElement>;
}) {
	const { state } = useAppContext();
	const { missingFoodList } = useMissingFood();
	const { missingGears, missingExtraGears } = useMissingGear();
	
	const { data: themes } = useThemes();
	const selectedTheme = themes.find(({ label }) => label === state.theme);


	return (
		<div className={styles.summary} ref={summaryRef}>

			{/* General */}
			<div className={styles.summarySection}>
				<Logo />
				<h1 className={styles.summaryTitle}>Dein Preppy</h1>
				<ul className={styles.summaryList}>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>Worauf möchtest du vorbereitet sein? </span>
						<strong>{selectedTheme?.title}</strong>
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>Wie ist deine Wohnsituation? </span>
						{state.house.category && 
							<strong>{state.house.category} ({state.house.subcategory?.join(', ')})</strong>
						}
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>Wie viele Personen? </span>
						<strong>
							{state.people.length} ({state.people.map(diet =>
								diet === "omnivore" ? "Mishkost" :
								diet === "vegan" ? "Vegan" :
								"Vegetarisch"
							).join(", ")})
						</strong>
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>Kleinkind/-er? </span>
						<strong>{state.baby ? 'Ja' : 'Nein'}</strong>
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>Haustier/-e? </span>
						<strong>{state.pet ? 'Ja' : 'Nein'}</strong>
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>Wie lange möchtest du autark sein? </span>
						<strong>{state.days} Tage</strong>
					</li>
				</ul>
			</div>

			{/* Food */}
			<div className={styles.summarySection}>
				<div className={styles.summaryCols}>
					<div>
						<h2>Deine benötigten Vorräte</h2>
						<FoodList reduced={true} />
					</div>
					<div>
						<h2>Einkaufsliste</h2>
						{missingFoodList.length > 0 ? (
							<ul className={styles.summaryList}>
								{missingFoodList.map(({ label, total }) => {
									return (
										<li key={label} className={styles.summaryListItem}
										>
											<span>{label} </span>
											{total && <strong>{total}</strong>}
										</li>
									);
								})}
							</ul>
						) : (
							<span>Du hast schon alles vorbereitet.</span>
						)}
					</div>
				</div>
			</div>

			{/* Gears */}
			<div className={styles.summarySection}>
				<div className={styles.summaryCols}>
					<div>
						<h2>Ausrüstung beim Szenario{" "}
							<span>{selectedTheme?.title}</span>{" "}
						</h2>
						<GearList reduced={true} />
					</div>
					<div>
						<h2>Welche Ausrüstung noch fehlt</h2>
						{missingGears.length > 0 || missingExtraGears.length > 0 ? (
							<ul className={styles.summaryList}>
								{missingGears.map(({ label }) => {
									return (
										<li key={label} className={styles.summaryListItem}
										>
											<span>{label} </span>
										</li>
									);
								})}
								{missingExtraGears.map(({ label }) => (
									<li key={label} className={styles.summaryListItem}>
										<span>{label}</span>
									</li>
								))}
							</ul>
						) : (
							<span>Du hast schon alles vorbereitet.</span>
						)}
					</div>
				</div>
			</div>

			{/* Contact */}
			<div className={styles.summarySection}>
				<h2 className={styles.summaryTitle}>Wichtige Kontakte</h2>
				<ul className={styles.summaryList}>
					{selectedTheme?.contacts.map((contact) => (
						<li key={contact} className={`${styles.summaryListItem} ${styles.alt}`}>
							<span>{contact}</span>
						</li>
					))}
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>___________________________________________________</span>
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>___________________________________________________</span>
					</li>
					<li className={`${styles.summaryListItem} ${styles.alt}`}>
						<span>___________________________________________________</span>
					</li>
				</ul>
			</div>

		</div>
	);
}

export default Summary;
