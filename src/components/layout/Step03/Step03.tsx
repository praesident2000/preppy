import Range from "../../ui/Range/Range";
import FoodList from "../../ui/FoodList/FoodList";
import StepHeader from "../../ui/StepHeader/StepHeader";

function Step03() {
	return (
		<div className="step">
			<StepHeader
				title="Planen wir deine Vorräte. Wie lange möchtest du autark sein?"
				text={
					<div className="stepHeaderBottom">
						<div className="text">
							<p>
								Eine gute Größenordnung, um mit der Vorratshaltung zu
								beginnen, sind 3 Tage. Das{" "}
								<a
									href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat"
									target="_blank"
								>
									BKK
								</a>{" "}
								(Bundesamt für Bevölkerungsschutz und Katastrophenhilfe) empfiehlt, Vorräte für 10 Tage zu Hause aufzubewahren.
							</p>
						</div>
					</div>
				}
			/>
			<div className="stepMain">
				<Range />
				<FoodList />
			</div>
		</div>
	);
}

export default Step03;
