import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useFood } from "../../../hooks/useFood";
import Accordion from "../Accordion/Accordion";
import Switcher from "../Switcher/Switcher";
import styles from "../FoodList/FoodList.module.scss";
import type { ShoppingList } from "../../../types/types";
import {
	getActiveMerges,
	computeItemTotal,
	formatTotal,
	getVisibleCategories,
} from "../../../utils/dietFilter";

function FoodList() {
	const { state, dispatch } = useAppContext();

	const { data: food, loading, error } = useFood();
	const [showQuantity, setShowQuantity] = useState<boolean>(false);

	function handleChange(category: keyof ShoppingList, element: string) {
		dispatch({ type: "toggle_shoppinglist", payload: { category, element } });
	}

	const visibleFood = getVisibleCategories(food, state.people);

	const activeMerges = getActiveMerges(visibleFood, food);

	function getTotal(category: string, label: string, perPersonPerDay: number): number {
		return computeItemTotal(category, label, perPersonPerDay, state.people, state.days, food, activeMerges);
	}

	return (
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
					{visibleFood.map(({ category, label, items, icon, unit, totPerPersonPerDay }) => {
						const categoryTotal = items.reduce(
							(sum, item) => sum + getTotal(category, item.label, item.perPersonPerDay),
							0,
						);
						return (
						<div key={category} className={styles.foodSection}>
							<Accordion
								label={label}
								sublabel1={formatTotal(categoryTotal, unit)}
								sublabel2={`ca. ${totPerPersonPerDay} ${unit} pro Person und Tag`}
								icon={icon}
								big={true}
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
														<small>
															{showQuantity
																? `(${packSize}${unit}/${packLabelSingular}) ${totalPacks} ${totalPacks > 1 ? packLabelPlural : packLabelSingular}`
																: `${total.toLocaleString("de-DE")} ${unit}`}
														</small>
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
	);
}

export default FoodList;
