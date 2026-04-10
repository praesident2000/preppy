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
	HelpIcon,
	FoodIcon,
	GearsIcon,
	GuideIcon,
	ContactIcon,
	ErrorIcon,
	ArrowForwardIcon,
} from "../../ui/Icon/Icon";
import styles from "./Step05.module.scss";

function Step05() {
	const { state } = useAppContext();
	const { data: options, loading: optionsLoading, error: optionsError } = useOptions();
	const { data: themes, loading: themesLoading, error: themesError } = useThemes();
	const selectedTheme = themes.find(({ label }) => label === state.theme);

	const { data: food } = useFood();
	const { missingFoodList } = useMissingFood();
	const visibleFood = getVisibleCategories(food, state.people).map((cat) => {
		if (cat.category !== "miscellaneous") return cat;
		const extras = [
			...(state.baby ? [{ label: "Baby futter", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
			...(state.pet ? [{ label: "Tierfutter", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
		];
		return extras.length > 0 ? { ...cat, items: [...cat.items, ...extras] } : cat;
	});

	const totFood = visibleFood.reduce((sum, { items }) => sum + items.length, 0);
	const totList = visibleFood.reduce(
		(sum, { category }) => sum + (state.shoppingList[category]?.length ?? 0),
		0,
	);
	const percentFood = Math.floor((totList / totFood) * 100);
	const missingFoodNumber = totFood - totList;

	const houseResults = [...new Set(options
		.filter(({ category }) => category === state.house.category)
		.flatMap(({ subcategories }) =>
			subcategories
				.filter(({ label }) => state.house.subcategory?.includes(label))
				.flatMap(({ results }) => results[state.theme as keyof TypeResults] ?? []),
		))];

	const { missingGears, missingExtraGears, percentGears } = useMissingGear();

	return (
		<div className="step">
			<div className="stepHeader">
				<div className="stepHeaderTop">
					<h2>Übersicht und Auswertung</h2>
					<span>Schritt {state.step}/5</span>
				</div>
			</div>

			<div className="stepMain">
				<div className={styles.sections}>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<FoodIcon />
							<strong>Vorräte</strong>
							<span>
								<span className={styles.percentNumber}>
									{`${percentFood}%`}{" "}
								</span>
								<small>Vollständig</small>
							</span>
							<div className={styles.percent}>
								<span
									className={`${styles.percentInner} ${styles.blue}`}
									style={{ width: `${percentFood}%` }}
								></span>
							</div>
							{missingFoodNumber > 0 && (
								<div className={styles.missing}>
									<ErrorIcon />
									<span>
										{missingFoodNumber} Artikel{" "}
										{missingFoodNumber === 1 ? "fehlen" : "fehlt"}
									</span>
								</div>
							)}
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Einkaufsliste">
								<div>
									{missingFoodList.length > 0 && (
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
									)}
								</div>
							</Accordion>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<GearsIcon />
							<strong>Ausrüstung</strong>
							<span>
								<span className={styles.percentNumber}>
									{`${percentGears}%`}{" "}
								</span>
								<small>Vollständig</small>
							</span>
							<div className={styles.percent}>
								<span
									className={`${styles.percentInner} ${styles.orange}`}
									style={{ width: `${percentGears}%` }}
								></span>
							</div>
						</div>
						{(missingGears.length > 0 || missingExtraGears.length > 0) && (
							<div className={styles.sectionBottom}>
								<Accordion label="Was mir noch fehlt">
									<div>
										<ul className={styles.list}>
											{missingGears.map(({ label, icon }) => (
												<li key={label} className={styles.listItem}>
													<span dangerouslySetInnerHTML={{ __html: icon }}></span>
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
								</Accordion>
							</div>
						)}
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<HelpIcon />
							<strong>Tipps für deine Wohnsituation</strong>
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Tipps">
								<div>
									<ul className={styles.list}>
										{!optionsLoading && !optionsError && (
											houseResults.length === 0
												?	<div className={`${styles.missing} ${styles.alt}`}>
														<ErrorIcon />
														<span>Wohnsituation noch nicht angegeben - bitte Schritt 2 ausfüllen.</span>
													</div>
												: houseResults.map((result, index) => (
													<li key={index} className={styles.listItem}>{result}</li>
												))
										)}
									</ul>
								</div>
							</Accordion>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<GuideIcon />
							<strong>Stromausfall-Guide</strong>
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Guide">
								<div>
									<ul className={styles.list}>
										{!themesLoading && !themesError && (
											selectedTheme?.guides.map(({label, url}) => (
												<li key={label} className={`${styles.listItem} ${styles.alt}`}>
													<a href={url}>
														<ArrowForwardIcon />
														<span>{label}</span>
													</a>
												</li>
											))
										)}
									</ul>
								</div>
							</Accordion>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<ContactIcon />
							<strong>Wichtige Kontakte</strong>
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Kontakte">
								<div>
									<ul className={styles.list}>
										{!themesLoading && !themesError && (
											selectedTheme?.contacts.map((contact) => (
												<li key={contact} className={`${styles.listItem} ${styles.alt}`}>
													<span>{contact}</span>
												</li>
											))
										)}
									</ul>
								</div>
							</Accordion>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}

export default Step05;
