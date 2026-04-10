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

function FoodList({reduced} : {reduced?: boolean}) {
	const { state, dispatch } = useAppContext();

	const { data: food, loading, error } = useFood();
	const [showQuantity, setShowQuantity] = useState<boolean>(false);

	function handleChange(category: keyof ShoppingList, element: string) {
		dispatch({ type: "toggle_shoppinglist", payload: { category, element } });
	}

	const visibleFood = getVisibleCategories(food, state.people).map((cat) => {
		if (cat.category !== "miscellaneous") return cat;
		const extras: FoodItem[] = [
			...(state.baby ? [{ label: "Kindernahrung", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
			...(state.pet ? [{ label: "Haustierfutter", unit: "", perPersonPerDay: 0, decimals: 0 }] : []),
		];
		return extras.length > 0 ? { ...cat, items: [...cat.items, ...extras] } : cat;
	});

	const activeMerges = getActiveMerges(visibleFood, food);

	function getTotal(category: string, label: string, perPersonPerDay: number): number {
		return computeItemTotal(category, label, perPersonPerDay, state.people, state.days, food, activeMerges);
	}

	return (
		<>
			{reduced ? (
				<div className={styles.foodListAlt}>
					{!loading && !error && (
						<div className={styles.foodListAltWrapper}>
							{visibleFood.map(({ category, label, items, unit, totPerPersonPerDay }) => {
								const categoryTotal = items.reduce(
									(sum, item) => sum + getTotal(category, item.label, item.perPersonPerDay),
									0,
								);
								return (
								<div key={category} className={styles.foodSectionAlt}>
									<div key={category} className={styles.foodSectionAltHeader}>
										<h3>{label}</h3>
										{category !== "miscellaneous" && (
											<p>
												<strong>{formatTotal(categoryTotal, unit)}</strong>{" "}
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
												const total = getTotal(category, label, perPersonPerDay);
												const totalPacks = Math.ceil(
													total / Number(packSize),
												);
												return (
													<div key={label} className={styles.foodSectionAltItem}>
														<h4>{label}</h4>
														{category !== "miscellaneous" && (
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
							})}
						</div>
					)}
				</div>

			) : (
				<div className={styles.foodList}>
					<div className={styles.foodHeader}>
						<h2>Deine benötigten Vorräte. Welche davon hast du bereits?</h2>
						<p>
							Für deinen {state.people.length}-Personen-Haushalt, um {state.days} Tage zu
							überbrücken (Quellen:{" "}
							<a
								href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratskalkulator"
								target="_blank"
							>
								<u>BKK</u>
							</a>,{" "}
							<a
								href="https://www.dge.de/"
								target="_blank"
							>
								<u>DGE</u>
							</a>,{" "}
							<span>eigene Berechnungen*</span>
							)
						</p>
						<Switcher
							switcher={() => setShowQuantity(!showQuantity)}
							label1="Menge/Gewicht"
							label2="Packungseinheiten"
						/>
					</div>
					{!loading && !error && (
						<div className={styles.foodListWrapper}>
							{visibleFood.map(({ category, label, items, icon, unit, totPerPersonPerDay }, index) => {
								const categoryTotal = items.reduce(
									(sum, item) => sum + getTotal(category, item.label, item.perPersonPerDay),
									0,
								);
								return (
								<div key={category} className={styles.foodSection}>
									<Accordion
										label={label}
										sublabel1={category !== "miscellaneous" ? formatTotal(categoryTotal, unit) : undefined}
										sublabel2={category !== "miscellaneous" ? `ca. ${totPerPersonPerDay} ${unit} pro Person und Tag` : undefined}
										icon={icon}
										big={true}
										startOpen={index === 0}
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
													const total = getTotal(category, label, perPersonPerDay);
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
																	handleChange(category, label)
																}
															/>
															<span>
																<strong>{label}</strong>
																{category !== "miscellaneous" && (
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
							})}
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default FoodList;
