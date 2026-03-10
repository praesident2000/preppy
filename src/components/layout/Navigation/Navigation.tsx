import styles from "./Navigation.module.scss";
import { ArrowForwardIcon, ArrowBackIcon, LinkIcon, DownloadIcon, PdfIcon } from '../../ui/Icon/Icon'

type NavigationProps = {
	currentStep: number;
	onPrev: () => void;
	onNext: () => void;
	setUrl: () => void;
	summaryRef: React.RefObject<HTMLElement>;
};

function Navigation({
	currentStep,
	onPrev,
	onNext,
	setUrl,
	summaryRef,
}: NavigationProps) {
	const handleUrl = () => {
		setUrl();
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
				{currentStep !== 5 && (
					<button
						className={`${styles.navButton} ${styles.color}`}
						onClick={onNext}
					>
						<span>Weiter</span>
						<ArrowForwardIcon />
					</button>
				)}
				{currentStep === 5 && (
					<div className={styles.navTopWrapper}>
						<div className={styles.navTopInner}>
							<PdfIcon />
							<p>
								<strong>Dein persönlicher Ratgeber</strong>
								<span>
									Lade dir deine individuelle Check- und Einkaufsliste
									sowie Notfallpläne als PDF herunter.
								</span>
							</p>
						</div>
						<button
							className={`${styles.navButton} ${styles.color} ${styles.big}`}
							onClick={printSummary}
						>
							<span>Download Pdf</span>
							<DownloadIcon />
						</button>
					</div>
				)}
			</div>

			{currentStep !== 1 && (
				<div className={styles.navBottom}>
					<button className={styles.navButton} onClick={onPrev}>
						<ArrowBackIcon />
						<span>Zurück</span>
					</button>
					<button className={styles.navButton} onClick={handleUrl}>
						<LinkIcon />
						<span>Link Speichern</span>
					</button>
				</div>
			)}
		</div>
	);
}

export default Navigation;
