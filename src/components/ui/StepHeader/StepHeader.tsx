import { useAppContext } from "../../../context/AppContext";

interface HeaderProps {
	title: string;
	text?: React.ReactNode;
}

const StepHeader = ({ title, text }: HeaderProps) => {
	const { state } = useAppContext();

	return (
		<div className="stepHeader">
			<div className="stepHeaderTop">
				<div>
					{Array.from({ length: 5 }, (_, i) => {
						const step = i + 1;
						return (
							<span
								key={step}
								className={[
									state.step === step ? "current" : "",
									state.step > step ? "active" : "",
								]
									.filter(Boolean)
									.join(" ")}
							/>
						);
					})}
				</div>
				<strong>Schritt {state.step}/5</strong>
			</div>
			<div className="stepHeaderBottom">
				<h2>{title}</h2>
				{text && text}
			</div>
		</div>
	);
};

export default StepHeader;
