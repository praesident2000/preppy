import { jsPDF } from "jspdf";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PdfData = {
  persons: number;
  days: number;
  selected_themes: string[];
  tips: Record<string, { title: string; sections: { label: string; items: string[] }[] }>;
  food: {
    need: { label: string; amount: string; packInfo?: string }[];
    have: { label: string; amount: string; packInfo?: string }[];
  };
  gear: { need: string[]; have: string[] };
  housing_tips: string[];
  guides: { label: string; url: string }[];
  contacts: string[];
};

// ─── Brand Colors ─────────────────────────────────────────────────────────────

const CYAN = [0, 159, 227] as const;
const MAGENTA = [186, 0, 80] as const;
const DARK = [26, 26, 26] as const;
const GRAY = [112, 112, 112] as const;
const GRAY_LIGHT = [204, 206, 208] as const;
const GRAY_BG = [242, 244, 246] as const;
const WHITE = [255, 255, 255] as const;
const RED = [217, 83, 52] as const;
const GREEN = [6, 140, 92] as const;

// ─── Page Constants (A4 mm) ───────────────────────────────────────────────────

const PW = 210;
const PH = 297;
const ML = 20;
const MR = 20;
const MT = 16;
const MB = 16;
const CW = PW - ML - MR;
const Y_START = MT + 8;
const Y_MAX = PH - MB - 8;

// ─── Color Helpers ────────────────────────────────────────────────────────────

type RGB = readonly [number, number, number];

function setFill(doc: jsPDF, c: RGB) { doc.setFillColor(c[0], c[1], c[2]); }
function setDraw(doc: jsPDF, c: RGB) { doc.setDrawColor(c[0], c[1], c[2]); }
function setColor(doc: jsPDF, c: RGB) { doc.setTextColor(c[0], c[1], c[2]); }

// ─── Helpers ──────────────────────────────────────────────────────────────────

let pageCount = 0;

function newPage(doc: jsPDF, isFirst: boolean) {
  if (pageCount > 0) doc.addPage();
  pageCount++;

  if (isFirst) {
    setFill(doc, CYAN);
    doc.rect(0, 0, PW, 6, "F");
    setFill(doc, MAGENTA);
    doc.rect(0, 6, PW, 1.5, "F");
  } else {
    setDraw(doc, CYAN);
    doc.setLineWidth(0.8);
    doc.line(15, 10, PW - 15, 10);
    doc.setFontSize(7);
    setColor(doc, GRAY);
    doc.setFont("helvetica", "normal");
    doc.text("Dein persönlicher Krisenvorsorge-Guide", 15, 8);
    doc.text("Diakonie Katastrophenhilfe", PW - 15, 8, { align: "right" });
  }

  setDraw(doc, GRAY_LIGHT);
  doc.setLineWidth(0.3);
  doc.line(15, PH - 12, PW - 15, PH - 12);
  doc.setFontSize(7);
  setColor(doc, GRAY);
  doc.setFont("helvetica", "normal");
  doc.text("diakonie-katastrophenhilfe.de", 15, PH - 8);
  doc.text("Seite " + pageCount, PW - 15, PH - 8, { align: "right" });
}

function checkY(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > Y_MAX) {
    newPage(doc, false);
    return Y_START;
  }
  return y;
}

function drawHR(doc: jsPDF, y: number): number {
  setDraw(doc, GRAY_LIGHT);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  return y + 3;
}

function drawCheckbox(doc: jsPDF, x: number, y: number, checked: boolean) {
  const s = 3.5;
  setDraw(doc, GRAY_LIGHT);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y - 2.8, s, s, 0.6, 0.6, "S");

  if (checked) {
    setDraw(doc, GREEN);
    doc.setLineWidth(0.8);
    const cx = x + 0.5, cy = y - 0.8;
    doc.line(cx, cy, cx + 1, cy + 1);
    doc.line(cx + 1, cy + 1, cx + 2.5, cy - 1.5);
  }
}

function drawChecklistRow(
  doc: jsPDF,
  y: number,
  text: string,
  opts: { checked?: boolean; missing?: boolean; amount?: string; packInfo?: string } = {},
): number {
  const hasPackInfo = !!opts.packInfo;
  y = checkY(doc, y, hasPackInfo ? 12 : 7);
  drawCheckbox(doc, ML, y, opts.checked ?? false);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setColor(doc, opts.missing ? RED : DARK);
  doc.text(text, ML + 6, y);

  if (opts.amount) {
    doc.setFont("helvetica", "bold");
    setColor(doc, opts.missing ? RED : GREEN);
    doc.text(opts.amount, PW - MR, y, { align: "right" });
  }

  if (hasPackInfo) {
    const y2 = y + 4;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    setColor(doc, opts.missing ? RED : GREEN);
    doc.text(opts.packInfo!, PW - MR, y2, { align: "right" });
    const lineY = y2 + 2.5;
    setDraw(doc, GRAY_LIGHT);
    doc.setLineWidth(0.15);
    doc.line(ML, lineY, PW - MR, lineY);
    return lineY + 4.5;
  }

  const lineY = y + 2.5;
  setDraw(doc, GRAY_LIGHT);
  doc.setLineWidth(0.15);
  doc.line(ML, lineY, PW - MR, lineY);

  return lineY + 4.5;
}

function drawWrapped(doc: jsPDF, x: number, y: number, text: string, maxW: number, lh = 4): number {
  const lines = doc.splitTextToSize(text, maxW) as string[];
  for (const line of lines) {
    y = checkY(doc, y, lh);
    doc.text(line, x, y);
    y += lh;
  }
  return y;
}

// ─── Section Builders ─────────────────────────────────────────────────────────

function buildCover(doc: jsPDF, data: PdfData, y: number): number {
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Dein persönlicher", ML, y);
  y += 9;
  doc.text("Krisenvorsorge-Guide", ML, y);
  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const sub = "Hier siehst du eine Zusammenfassung mit Tipps basierend auf deinen Einstellungen. Die Empfehlungen basieren auf den Erfahrungen der Diakonie Katastrophenhilfe.";
  y = drawWrapped(doc, ML, y, sub, CW, 5);
  y += 5;

  const themes = data.selected_themes
    .filter((k) => data.tips[k])
    .map((k) => data.tips[k].title)
    .join(", ");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  const p1 = data.persons + " Person(en)";
  doc.text(p1, ML, y);
  const w1 = doc.getTextWidth(p1);
  doc.setFont("helvetica", "normal");
  const p2 = " · ";
  doc.text(p2, ML + w1, y);
  const w2 = doc.getTextWidth(p2);
  doc.setFont("helvetica", "bold");
  const p3 = data.days + " Tage ";
  doc.text(p3, ML + w1 + w2, y);
  const w3 = doc.getTextWidth(p3);
  doc.setFont("helvetica", "normal");
  const p4 = " autark · Szenarien: ";
  doc.text(p4, ML + w1 + w2 + w3, y);
  const w4 = doc.getTextWidth(p4);
  doc.setFont("helvetica", "bold");
  doc.text(themes, ML + w1 + w2 + w3 + w4, y);
  y += 6;

  return y;
}

function buildTips(doc: jsPDF, data: PdfData, y: number): number {
  y += 10;
  y = checkY(doc, y, 10);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Wichtige Verhaltenstipps", ML, y);
  y += 4;
  y = drawHR(doc, y);
  y += 5;

  for (const key of data.selected_themes) {
    if (!data.tips[key]) continue;
    const theme = data.tips[key];

    y = checkY(doc, y, 12);
    y += 2;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    setColor(doc, CYAN);
    doc.text(theme.title, ML, y);
    y += 7;

    for (const sec of theme.sections) {
      y = checkY(doc, y, 10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      setColor(doc, DARK);
      y = drawWrapped(doc, ML, y, sec.label, CW, 4.5);
      y += 1;

      for (const item of sec.items) {
        y = checkY(doc, y, 8);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        setColor(doc, DARK);
        doc.text("•", ML + 1, y);
        y = drawWrapped(doc, ML + 5, y, item, CW - 5, 4);
        y += 0.5;
      }

      y += 3;
    }

    y += 2;
  }

  return y;
}

function buildHousing(doc: jsPDF, data: PdfData, y: number): number {
  if (!data.housing_tips.length) return y;

  y += 10;
  y = checkY(doc, y, 12);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Tipps für deine Wohnsituation", ML, y);
  y += 4;
  y = drawHR(doc, y);
  y += 5;

  for (const tip of data.housing_tips) {
    y = checkY(doc, y, 8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setColor(doc, DARK);
    doc.text("•", ML + 1, y);
    y = drawWrapped(doc, ML + 5, y, tip, CW - 5, 4);
    y += 1;
  }

  return y;
}

function buildGuides(doc: jsPDF, data: PdfData, y: number): number {
  if (!data.guides.length) return y;

  y += 10;
  y = checkY(doc, y, 12);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Guide", ML, y);
  y += 4;
  y = drawHR(doc, y);
  y += 5;

  for (const g of data.guides) {
    y = checkY(doc, y, 10);
    doc.setFontSize(9);
    setColor(doc, DARK);
    doc.setFont("helvetica", "normal");
    doc.text("•", ML + 1, y);
    doc.setFont("helvetica", "bold");
    doc.text(g.label, ML + 5, y);
    y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setColor(doc, CYAN);
    doc.text(g.url, ML + 5, y);
    y += 5;
  }

  return y;
}

function buildContacts(doc: jsPDF, data: PdfData, y: number): number {
  y += 10;
  y = checkY(doc, y, 12);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Wichtige Kontakte", ML, y);
  y += 4;
  y = drawHR(doc, y);
  y += 5;

  for (const c of data.contacts) {
    y = checkY(doc, y, 8);
    setFill(doc, GRAY_BG);
    doc.rect(ML, y - 5, CW, 7, "F");

    doc.setFontSize(9);
    setColor(doc, DARK);
    if (c.includes(":")) {
      const idx = c.indexOf(":");
      doc.setFont("helvetica", "bold");
      doc.text(c.slice(0, idx).trim(), ML + 3, y);
      doc.setFont("helvetica", "normal");
      doc.text(c.slice(idx + 1).trim(), ML + 85, y);
    } else {
      doc.setFont("helvetica", "bold");
      doc.text(c, ML + 3, y);
    }
    y += 8;
  }

  y += 8;
  y = checkY(doc, y, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setColor(doc, CYAN);
  doc.text("Freunde, Verwandte, Nachbarschaft", ML, y);
  y += 8;

  for (let i = 0; i < 3; i++) {
    setDraw(doc, GRAY_LIGHT);
    doc.setLineWidth(0.3);
    doc.line(ML, y, PW - MR, y);
    y += 8;
  }

  return y;
}

function buildCTA(doc: jsPDF, y: number): number {
  y += 2;
  const boxH = 40;
  y = checkY(doc, y, boxH + 4);

  setFill(doc, MAGENTA);
  doc.roundedRect(ML, y, CW, boxH, 4, 4, "F");

  let ty = y + 9;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, WHITE);
  doc.text("Gut vorbereitet bleibt, wer dranbleibt.", PW / 2, ty, { align: "center" });
  ty += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const txt = "Ob neue Mitbewohner:innen, ein Umzug oder verbrauchte Vorräte – passe deinen Plan regelmäßig an. Auf der Website kannst du jederzeit Personen hinzufügen, weitere Szenarien auswählen oder deine Vorräte neu berechnen.";
  const lines = doc.splitTextToSize(txt, CW - 16) as string[];
  for (const l of lines) {
    doc.text(l, PW / 2, ty, { align: "center" });
    ty += 4;
  }
  ty += 1;
  doc.setFont("helvetica", "bold");
  const linkText = "diakonie-katastrophenhilfe.de/preppy";
  const linkUrl = "https://diakonie-katastrophenhilfe.de/preppy";
  const linkX = PW / 2 - doc.getTextWidth(linkText) / 2;
  doc.text(linkText, PW / 2, ty, { align: "center" });
  doc.link(linkX, ty - 3.5, doc.getTextWidth(linkText), 5, { url: linkUrl });

  return y + boxH + 4;
}

function buildTeil2Header(doc: jsPDF, data: PdfData, y: number): number {
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Deine Vorräte & Ausrüstung", ML, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  setColor(doc, DARK);
  const intro = `Basierend auf deinem Plan: ${data.persons} Person(en), ${data.days} Tage autark. Hake ab, was du schon hast – den Rest nimmst du mit zum Einkaufen. Die komplette Liste kannst du außerdem direkt bei Vorräten und Ausrüstung aufbewahren. So hast du immer alles im Blick.`;
  y = drawWrapped(doc, ML, y, intro, CW, 5);
  return y + 6;
}

function buildFood(doc: jsPDF, data: PdfData, y: number): number {
  y += 2;
  y = checkY(doc, y, 12);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Vorräte", ML, y);
  y += 4;
  y = drawHR(doc, y);
  y += 5;

  if (data.food.need.length > 0) {
    y = checkY(doc, y, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(doc, RED);
    doc.text("Was noch fehlt", ML, y);
    y += 8;

    for (const item of data.food.need) {
      y = drawChecklistRow(doc, y, item.label, { checked: false, missing: true, amount: item.amount, packInfo: item.packInfo });
    }
  }

  y += 6;

  if (data.food.have.length > 0) {
    y = checkY(doc, y, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(doc, GREEN);
    doc.text("Was du schon hast", ML, y);
    y += 8;

    for (const item of data.food.have) {
      y = drawChecklistRow(doc, y, item.label, { checked: true, missing: false, amount: item.amount, packInfo: item.packInfo });
    }
  }

  return y;
}

function buildGear(doc: jsPDF, data: PdfData, y: number): number {
  y += 2;
  y = checkY(doc, y, 12);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(doc, DARK);
  doc.text("Ausrüstung", ML, y);
  y += 4;
  y = drawHR(doc, y);
  y += 5;

  if (data.gear.need.length > 0) {
    y = checkY(doc, y, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(doc, RED);
    doc.text("Was noch fehlt", ML, y);
    y += 8;

    for (const item of data.gear.need) {
      y = drawChecklistRow(doc, y, item, { checked: false, missing: true });
    }
  }

  y += 6;

  if (data.gear.have.length > 0) {
    y = checkY(doc, y, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(doc, GREEN);
    doc.text("Was du schon hast", ML, y);
    y += 8;

    for (const item of data.gear.have) {
      y = drawChecklistRow(doc, y, item, { checked: true, missing: false });
    }
  }

  return y;
}

function buildFooter(doc: jsPDF, y: number): number {
  y += 4;
  y = checkY(doc, y, 12);
  y = drawHR(doc, y);
  y += 1;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  setColor(doc, GRAY);
  const ftParts = [
    "Die Empfehlungen basieren auf den Erfahrungen der Diakonie Katastrophenhilfe. Sie erheben keinen Anspruch auf Vollständigkeit.",
  ];
  for (const part of ftParts) {
    const lines = doc.splitTextToSize(part, CW) as string[];
    for (const l of lines) {
      doc.text(l, PW / 2, y, { align: "center" });
      y += 3;
    }
  }
  const ftLinkFull = "Weitere Informationen: diakonie-katastrophenhilfe.de";
  const ftLinkUrl = "https://diakonie-katastrophenhilfe.de";
  const ftLinkDomain = "diakonie-katastrophenhilfe.de";
  doc.text(ftLinkFull, PW / 2, y, { align: "center" });
  const ftFullW = doc.getTextWidth(ftLinkFull);
  const ftPrefixW = doc.getTextWidth("Weitere Informationen: ");
  const ftLinkX = PW / 2 - ftFullW / 2 + ftPrefixW;
  doc.link(ftLinkX, y - 2.5, doc.getTextWidth(ftLinkDomain), 3.5, { url: ftLinkUrl });
  y += 3;
  return y;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function generatePrepPDF(data: PdfData) {
  pageCount = 0;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.setProperties({
    title: "Dein persönlicher Krisenvorsorge-Guide",
    author: "Diakonie Katastrophenhilfe",
    subject: "Krisenvorsorge-Auswertung",
  });

  // Teil 1
  newPage(doc, true);
  let y = Y_START;
  y = buildCover(doc, data, y);
  y = buildTips(doc, data, y);
  y = buildHousing(doc, data, y);
  y = buildGuides(doc, data, y);
  y = buildContacts(doc, data, y);
  buildCTA(doc, y);

  // Teil 2
  newPage(doc, false);
  y = Y_START;
  y = buildTeil2Header(doc, data, y);
  y = buildFood(doc, data, y);

  newPage(doc, false);
  y = Y_START;
  y = buildGear(doc, data, y);
  buildFooter(doc, y);

  doc.save("krisenvorsorge-guide.pdf");
}
