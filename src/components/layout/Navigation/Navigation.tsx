import { useAppContext } from "../../../context/AppContext";
import { useSetUrl } from "../../../hooks/useSetUrl";
import {
	ArrowForwardIcon,
	ArrowBackIcon,
	LinkIcon,
	DownloadIcon,
	PdfIcon,
} from "../../ui/Icon/Icon";
import styles from "./Navigation.module.scss";

function Navigation({
	summaryRef,
	appRef,
}: {
	summaryRef: React.RefObject<HTMLDivElement>;
	appRef: React.RefObject<HTMLDivElement>;
}) {
	const { state, dispatch } = useAppContext();

	const scrollToApp = () => {
		window.scrollTo({ top: appRef.current?.offsetTop ? appRef.current?.offsetTop- 150 : 0, behavior: "smooth" });
	};

	const { setUrl } = useSetUrl({
		currentStep: state.step,
		theme: state.theme,
		house: state.house,
		days: state.days,
		people: state.people,
		shoppingList: state.shoppingList,
		equipment: state.equipment,
	});

	const printSummary = () => {
		const element = summaryRef.current;
		if (!element) return;

		const printWindow = window.open("", "_blank", "width=900,height=700");
		if (!printWindow) return;

		const styles = Array.from(
			document.querySelectorAll("link[rel='stylesheet'], style"),
		)
			.map((node) => node.outerHTML)
			.join("");

		printWindow.document.write(`
			<html>
				<head>
					<title>Preppy Summary</title>
					${styles}
					<style>
						@page { margin: 15mm; }
						body { margin: 0; padding: 0; }
					</style>
				</head>
				<body>${element.outerHTML}</body>
			</html>
		`);

		printWindow.document.close();

		printWindow.onload = () => {
			printWindow.focus();
			printWindow.print();
			printWindow.close();
		};
	};

	return (
		<div className={styles.nav}>
			<div className={styles.navTop}>
				{state.step !== 5 && (
					<button
						className={`${styles.navButton} ${styles.color}`}
						onClick={() => { dispatch({ type: "step_increment" }); requestAnimationFrame(scrollToApp); }}
					>
						<span>weiter</span>
						<ArrowForwardIcon />
					</button>
				)}
				{state.step === 5 && (
					<div className={styles.navTopWrapper}>
						<div className={styles.navTopInner}>
							<PdfIcon />
							<p>
								<strong>Dein persönlicher Ratgeber</strong>
								<span>
									Lade dir deine individuelle Check- und
									Einkaufslistesowie Notfallpläne als PDF herunter.
								</span>
							</p>
						</div>
						<button
							className={`${styles.navButton} ${styles.color} ${styles.big}`}
							onClick={printSummary}
						>
							<span>Pdf herunterladen</span>
							<DownloadIcon />
						</button>
					</div>
				)}
			</div>

			{state.step !== 1 && (
				<div className={styles.navBottom}>
					<button
						className={styles.navButton}
						onClick={() => { dispatch({ type: "step_decrement" }); requestAnimationFrame(scrollToApp); }}
					>
						<ArrowBackIcon />
						<span>zurück</span>
					</button>
					<button className={styles.navButton} onClick={setUrl}>
						<LinkIcon />
						<span>Link Speichern</span>
					</button>
				</div>
			)}
		</div>
	);
}

export default Navigation;
