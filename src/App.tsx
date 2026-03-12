import { useRef, useState } from "react";
import type { House, ShoppingList } from "./types/types";
import { useUrlParams } from "./hooks/useUrlParams";
import { useSetUrl } from "./hooks/useSetUrl";
import Step01 from "./components/layout/Step01/Step01";
import Step02 from "./components/layout/Step02/Step02";
import Step03 from "./components/layout/Step03/Step03";
import Step04 from "./components/layout/Step04/Step04";
import Step05 from "./components/layout/Step05/Step05";
import Navigation from "./components/layout/Navigation/Navigation";
// import Summary from "./components/layout/Summary/Summary";
import styles from "./App.module.scss";

function App() {
	// Navigation
	const [currentStep, setCurrentStep] = useState<number>(1);
	const onPrev = () => setCurrentStep((s) => s - 1);
	const onNext = () => setCurrentStep((s) => s + 1);

	// Step 1
	const [theme, setTheme] = useState<string>("");

	// Step 2
	const [house, setHouse] = useState<House>({});

	// Step 3
	const [days, setDays] = useState<number>(10);
	const [people, setPeople] = useState<string[]>(["omnivore"]);
	const [shoppingList, setShoppingList] = useState<ShoppingList>({
		drinks: [],
		grains: [],
		veggies: [],
		fruit: [],
		dairy: [],
		meat: [],
		fats: [],
	});

	// Step 4
	const [equipment, setEquipment] = useState<string[]>([]);

	// Step 5
	const { setUrl } = useSetUrl({
		currentStep,
		theme,
		house,
		days,
		people,
		shoppingList,
		equipment,
	});

	// Summary
	const summaryRef = useRef<HTMLDivElement>(null!);

	// On first render: Check URL Params
	useUrlParams({
		setCurrentStep,
		setTheme,
		setHouse,
		setDays,
		setPeople,
		setShoppingList,
		setEquipment,
	});

	return (
		<div className={styles.app}>
			<div className={styles.wrapper}>
				{currentStep === 1 && (
					<Step01
						currentStep={currentStep}
						theme={theme}
						setTheme={setTheme}
					/>
				)}
				{currentStep === 2 && (
					<Step02
						currentStep={currentStep}
						house={house}
						setHouse={setHouse}
					/>
				)}
				{currentStep === 3 && (
					<Step03
						currentStep={currentStep}
						days={days}
						setDays={setDays}
						people={people}
						setPeople={setPeople}
						shoppingList={shoppingList}
						setShoppingList={setShoppingList}
					/>
				)}
				{currentStep === 4 && (
					<Step04
						currentStep={currentStep}
						equipment={equipment}
						setEquipment={setEquipment}
					/>
				)}
				{currentStep === 5 && (
					<Step05
						currentStep={currentStep}
						house={house}
						equipment={equipment}
						shoppingList={shoppingList}
					/>
				)}
				<Navigation
					currentStep={currentStep}
					onPrev={onPrev}
					onNext={onNext}
					setUrl={setUrl}
					summaryRef={summaryRef}
				/>
				{/* <Summary
					summaryRef={summaryRef}
					house={house.length > 0 ? house.join(",") : null}
					days={days}
				/> */}
			</div>
		</div>
	);
}

export default App;
