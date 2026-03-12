import { useAppContext } from "../../../context/AppContext";
import { useGears } from "../../../hooks/useGear";
import { useOptions } from "../../../hooks/useOptions";
import { useFood } from "../../../hooks/useFood";
import Accordion from "../../ui/Accordion/Accordion";
import Label from "../../ui/Label/Label";
import {
	HelpIcon,
	FoodIcon,
	GearsIcon,
	GuideIcon,
	ContactIcon,
	ErrorIcon,
} from "../../ui/Icon/Icon";
import styles from "./Step05.module.scss";

function Step05() {
	const { state } = useAppContext();
	const { data: options, loading, error } = useOptions();

	const { data: food } = useFood();
	const totFood = food.reduce((sum, { items }) => sum + items.length, 0);
	const totList = Object.values(state.shoppingList).reduce(
		(sum, arr) => sum + arr.length,
		0,
	);
	const percentFood = Math.floor((totList / totFood) * 100);
	const missingFoodNumber = totFood - totList;

	const missingFoodList = food.flatMap(({ category, items }) =>
		items.filter((item) => !state.shoppingList[category]?.includes(item.label)),
	);

	const { data: gears } = useGears();
	const percentGears = Math.floor((state.equipment.length / gears.length) * 100);
	const missingGears = gears.filter(({ label }) => !state.equipment.includes(label));

	return (
		<div className="step">
			<div className="stepHeader">
				<strong>Übersicht und Auswertung</strong>
				<span>Schritt {state.step}/5</span>
			</div>

			<div className="stepMain">
				<div className={styles.sections}>
					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<HelpIcon />
							<strong>Tipps für deine Wohnsituation</strong>
						</div>
						{!state.house.subcategory && (
							<div className={`${styles.missing} ${styles.alt}`}>
								<ErrorIcon />
								<span>
									Wohnsituation noch nicht angegeben - bitte Schritt 2
									ausfüllen.
								</span>
							</div>
						)}
						<ul className={styles.list}>
							{!loading &&
								!error &&
								options
									.filter(
										({ category }) => category === state.house.category,
									)
									.flatMap(({ subcategories }) =>
										subcategories
											.filter(({ label }) =>
												state.house.subcategory?.includes(label),
											)
											.flatMap(({ results }) => results),
									)
									.map((result, index) => (
										<li key={index} className={styles.listItem}>
											{result}
										</li>
									))}
						</ul>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<Label value={percentFood} />
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
											{missingFoodList.map(({ label }) => {
												return (
													<li
														key={label}
														className={styles.listItem}
													>
														<span>{label}</span>
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
							<Label value={percentGears} />
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
						{missingGears.length > 0 && (
							<div className={styles.sectionBottom}>
								<Accordion label="Was mir noch fehlt">
									<div>
										<ul className={styles.list}>
											{missingGears.map(({ label, icon }) => {
												return (
													<li
														key={label}
														className={styles.listItem}
													>
														<span
															dangerouslySetInnerHTML={{
																__html: icon,
															}}
														></span>
														<span>{label}</span>
													</li>
												);
											})}
										</ul>
									</div>
								</Accordion>
							</div>
						)}
					</div>
				</div>

				<div className={styles.links}>
					<a href="" target="_blank" className={styles.linksItem}>
						<GuideIcon />
						<span>Stromausfall-Guide</span>
					</a>
					<a href="" target="_blank" className={styles.linksItem}>
						<ContactIcon />
						<span>Wichtige Kontakte</span>
					</a>
				</div>
			</div>
		</div>
	);
}

export default Step05;
