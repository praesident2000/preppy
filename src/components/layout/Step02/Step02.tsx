import { useAppContext } from "../../../context/AppContext";
import { useOptions } from "../../../hooks/useOptions";
import styles from "./Step02.module.scss";

function Step02() {
	const { state, dispatch } = useAppContext();
	const { data: options, loading, error } = useOptions();

	const handleMainInput = (category: string) => {
		dispatch({
			type: "set_house",
			payload: {
				category,
				subcategory: undefined,
			},
		});
	};

	const handleSubInput = (label: string) => {
		dispatch({
			type: "set_house",
			payload: {
				...state.house,
				subcategory: state.house.subcategory?.includes(label)
					? state.house.subcategory.filter((item) => item !== label)
					: [...(state.house.subcategory ?? []), label],
			},
		});
	};

	return (
		<div className="step">
			<div className="stepHeader">
				<strong>Wie ist deine Wohnsituation?</strong>
				<span>Schritt {state.step}/5</span>
			</div>
			{!loading && !error && (
				<div className="stepMain">
					<div className={styles.radios}>
						{options.map(({ category, icon, subcategories }) => {
							const isActive = state.house.category === category;

							return (
								<label
									className={`${styles.radiosItem} ${isActive ? styles.active : ""}`}
									key={category}
								>
									<input
										className={styles.radioMain}
										type="radio"
										name="housingCategory"
										value={category}
										checked={state.house.category === category}
										onChange={() => handleMainInput(category)}
									/>
									<div className={styles.radioButton}>
										<span
											dangerouslySetInnerHTML={{
												__html: icon,
											}}
										></span>
										<span>{category}</span>
									</div>

									{isActive && subcategories?.length > 0 && (
										<div
											className={styles.radioSub}
											role="group"
											aria-label={`${category} details`}
										>
											{subcategories.map(({ label }) => (
												<label
													className={styles.radioSubItem}
													key={label}
												>
													<input
														type="checkbox"
														name={`housingSubcategory-${category}`}
														value={label}
														checked={
															state.house.subcategory?.includes(
																label,
															) ?? false
														}
														onChange={() => handleSubInput(label)}
													/>
													<span>{label}</span>
												</label>
											))}
										</div>
									)}
								</label>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

export default Step02;
