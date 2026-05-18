import { useAppContext } from "../../../context/AppContext";
import Toggle from "../Toggle/Toggle";
import {
	PersonIcon,
	PersonPlusIcon,
	TrashIcon,
	PetIconBig,
	BabyIconBig,
} from "../../ui/Icon/Icon";
import styles from "./People.module.scss";

function People() {
	const { state, dispatch } = useAppContext();

	const addPerson = () => {
		dispatch({ type: "set_people", payload: [...state.people, "omnivore"] });
	};

	const removePerson = (index: number) => {
		dispatch({
			type: "set_people",
			payload: state.people.filter((_: string, i: number) => index !== i),
		});
	};

	return (
		<div className={styles.people}>
			<div className={styles.peopleHeader}>
				<h2>Wie viele Personen leben in deinem Haushalt?</h2>
			</div>
			<ul className={styles.peopleList}>
				{state.people.map((person: string, index: number) => {
					return (
						<li key={index} className={styles.peopleItem}>
							<div className={styles.peopleItemHeader}>
								<div>
									<PersonIcon />
									<strong>{`Person ${index + 1}`}</strong>
								</div>
								{state.people.length > 1 && (
									<button
										className={styles.peopleRemove}
										onClick={() => removePerson(index)}
									>
										<TrashIcon />
									</button>
								)}
							</div>
							<div className={styles.peopleItemOptions}>
								<Toggle
									person={person}
									people={state.people}
									index={index}
									dispatch={dispatch}
								/>
							</div>
						</li>
					);
				})}
			</ul>
			<button className={styles.peopleMore} onClick={addPerson}>
				<PersonPlusIcon />
				<span>Person hinzufügen</span>
			</button>

			<div className={styles.peopleCheckboxes}>
				<div className={styles.peopleHeader}>
					<h2>Weitere Bewohner:innen</h2>
				</div>
				<div className={styles.peopleCheckboxesInner}>
					<label className={styles.peopleCheckbox}>
						<BabyIconBig />
						<input
							type="checkbox"
							name="baby"
							checked={state.baby}
							onChange={() => dispatch({ type: "toggle_baby" })}
						/>
						<div className={styles.peopleCheckboxLabel}>
							<span>Babies oder Kleinkinder</span>
						</div>
					</label>

					<label className={styles.peopleCheckbox}>
						<PetIconBig />
						<input
							type="checkbox"
							name="pet"
							checked={state.pet}
							onChange={() => dispatch({ type: "toggle_pet" })}
						/>
						<div className={styles.peopleCheckboxLabel}>
							<span>Haustiere</span>
						</div>
					</label>
				</div>
			</div>
		</div>
	);
}

export default People;
