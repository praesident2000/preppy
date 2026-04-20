import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useSetUrl } from "../../../hooks/useSetUrl";
import {
	ArrowForwardIcon,
	ArrowBackIcon,
	LinkIcon,
	DownloadIcon,
	PdfIcon,
	CopyIcon,
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
		window.scrollTo({
			top: appRef.current?.offsetTop ? appRef.current?.offsetTop - 150 : 0,
			behavior: "instant",
		});
	};

	const { setUrl } = useSetUrl(state);
	const [popupOpen, setPopupOpen] = useState(false);
	const [generatedUrl, setGeneratedUrl] = useState("");

	const handleOpenPopup = async () => {
		const url = await setUrl();
		setGeneratedUrl(url);
		setPopupOpen(true);
	};

	const handleCopyUrl = async () => {
		try {
			await navigator.clipboard.writeText(generatedUrl);
			setPopupOpen(false);
		} catch {
			// fallback for browsers without clipboard API
		}
	};

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
						onClick={() => {
							dispatch({ type: "step_increment" });
							requestAnimationFrame(scrollToApp);
						}}
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
				<>
					<div className={styles.navBottom}>
						<button
							className={styles.navButton}
							onClick={() => {
								dispatch({ type: "step_decrement" });
								requestAnimationFrame(scrollToApp);
							}}
						>
							<ArrowBackIcon />
							<span>zurück</span>
						</button>
						<button
							className={styles.navButton}
							onClick={handleOpenPopup}
						>
							<LinkIcon />
							<span>Link Speichern</span>
						</button>
					</div>

					<div
						className={`${styles.popup} ${popupOpen ? styles.active : ""}`}
						onClick={() => setPopupOpen(false)}
					>
						<div
							className={styles.popupInner}
							onClick={(e) => e.stopPropagation()}
						>
							<textarea
								className={styles.popupText}
								readOnly
								value={generatedUrl}
							/>
							<button
								className={`${styles.navButton} ${styles.color}`}
								onClick={handleCopyUrl}
							>
								<CopyIcon />
								<span>Link Kopieren</span>
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default Navigation;
