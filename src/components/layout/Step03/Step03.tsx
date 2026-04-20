import { useAppContext } from "../../../context/AppContext";
import Range from "../../ui/Range/Range";
import FoodList from "../../ui/FoodList/FoodList";

function Step03() {
	const { state } = useAppContext();

	return (
		<div className="step">
			<div className="stepHeader">
				<div className="stepHeaderTop">
					<h2>
						Planen wir deine Vorräte. Wie lange möchtest du autark sein?
					</h2>
					<span>Schritt {state.step}/5</span>
				</div>
				<div className="stepHeaderBottom">
					<p>
						Auch, wenn wir Deutschen im Schnitt zu dick sind: eine
						vorübergehende Krise ist selten ein guter Zeitpunkt für eine
						Diät. Wenn man ein paar Tage zu Hause bleiben muss und
						vielleicht auf sich allein gestellt ist, dann drückt ein
						leerer Vorratsschrank zusätzlich auf die Stimmung.
						<br />
						<br />
						Eine gute Größenordnung, um mit der Vorratshaltung zu
						beginnen, sind 3 Tage. Das{" "}
						<a href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat" target="_blank">BKK</a>{" "}
						empfiehlt, Vorräte für 10 Tage zu Hause aufzubewahren.
					</p>
				</div>
			</div>
			<div className="stepMain">
				<Range />
				<FoodList />
			</div>
		</div>
	);
}

export default Step03;
