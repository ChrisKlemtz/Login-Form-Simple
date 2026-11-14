import LoginForm from "./LoginForm.jsx";
import NewsletterForm from "./NewsletterForm.jsx";
import ContactForm from "./ContactForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import QuoteWizardForm from "./QuoteWizardForm.jsx";
import CheckoutForm from "./CheckoutForm.jsx";
import AppointmentForm from "./AppointmentForm.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import ApplicationForm from "./ApplicationForm.jsx";
import SupportTicketForm from "./SupportTicketForm.jsx";
import OtpForm from "./OtpForm.jsx";
import EventForm from "./EventForm.jsx";
import CallbackForm from "./CallbackForm.jsx";
import SurveyForm from "./SurveyForm.jsx";
import ResetPasswordForm from "./ResetPasswordForm.jsx";
import SecureLoginForm from "./SecureLoginForm.jsx";
import DonationForm from "./DonationForm.jsx";
import AddressForm from "./AddressForm.jsx";
import SearchFilterForm from "./SearchFilterForm.jsx";
import CommentForm from "./CommentForm.jsx";
import ConsentForm from "./ConsentForm.jsx";
import ProfileSettingsForm from "./ProfileSettingsForm.jsx";
import HotelBookingForm from "./HotelBookingForm.jsx";
import DeleteAccountForm from "./DeleteAccountForm.jsx";
import AgeGateForm from "./AgeGateForm.jsx";
import VoucherForm from "./VoucherForm.jsx";
import LoanCalculatorForm from "./LoanCalculatorForm.jsx";
import ReturnForm from "./ReturnForm.jsx";
import GovForm from "./GovForm.jsx";
import SignatureForm from "./SignatureForm.jsx";

/**
 * Die Reihenfolge hier bestimmt die Reihenfolge in der Übersicht.
 * Neues Formular: Komponente anlegen, importieren, Eintrag ergänzen.
 * Alle Marken sind frei erfunden.
 */
export const forms = [
  {
    slug: "login-einfach",
    component: LoginForm,
    title: "Einfacher Login",
    brand: "Ohne Marke",
    type: "Login-Formular (Basis)",
    useCase: "Anmeldung mit Benutzername und Passwort",
    design: "Schlicht, zentrierte Karte, Standard-Tailwind",
    swatch: "bg-gray-200 text-gray-800",
    tags: ["Login", "Kein Schutz", "Basis"],
    description:
      "Das ursprüngliche Formular dieser Sammlung und bewusst das einfachste: zwei Felder, ein Button, eine Rückmeldung. Es dient als Vergleichspunkt für alle folgenden Beispiele.",
    features: [
      "Zwei kontrollierte Eingabefelder mit React-State",
      "Prüfung gegen eine feste Liste von Demo-Zugängen",
      "Rückmeldung bei Erfolg und Fehler",
    ],
    security: [
      "Kein Spam- oder Brute-Force-Schutz",
      "Keine Validierung der Eingaben",
      "Zugangsdaten stehen im Quelltext, das ist nur für eine Demo vertretbar",
    ],
    tryIt: "Benutzername „admin“ mit Passwort „password“ funktioniert, alles andere wird abgelehnt.",
    production:
      "Die Prüfung gehört auf den Server: Passwörter gehasht speichern, Fehlversuche begrenzen, Sitzung per sicherem Cookie. Im Browser lässt sich ein Login nicht absichern.",
  },
  {
    slug: "newsletter-honeypot",
    component: NewsletterForm,
    title: "Newsletter mit Honeypot",
    brand: "Röstwerk Kaffee",
    type: "Newsletter-Anmeldung",
    useCase: "E-Mail-Adressen für einen Newsletter sammeln",
    design: "Warm und redaktionell, Serifenschrift, Unterstrich-Felder",
    swatch: "bg-[#f3ead9] text-amber-950",
    tags: ["Newsletter", "Honeypot", "Double-Opt-in"],
    description:
      "Eine kurze Anmeldung mit möglichst wenig Hürden. Der Spam-Schutz ist für Menschen unsichtbar: ein verstecktes Feld, das nur Bots ausfüllen.",
    features: [
      "E-Mail-Prüfung und Pflicht-Einwilligung",
      "Optionaler Vorname für die persönliche Ansprache",
      "Erfolgsmeldung im Double-Opt-in-Stil",
    ],
    security: [
      "Honeypot-Feld: unsichtbar, nicht per Tab erreichbar, für Screenreader ausgeblendet",
      "Bots erhalten dieselbe Erfolgsmeldung und merken nicht, dass sie erkannt wurden",
      "Double-Opt-in verhindert, dass fremde Adressen eingetragen werden",
    ],
    tryIt: "Setze den Haken „Demo: als Bot absenden“. Die Erfolgsmeldung zeigt dann, dass der Eintrag verworfen würde.",
    production:
      "Der Honeypot-Wert muss auf dem Server geprüft werden. Die Bestätigungs-Mail verschickt der Newsletter-Dienst, die Einwilligung wird mit Zeitpunkt protokolliert.",
  },
  {
    slug: "kontakt-zeitfalle",
    component: ContactForm,
    title: "Kontakt mit Zeitfalle",
    brand: "Nordlicht Steuerberatung",
    type: "Kontaktformular",
    useCase: "Allgemeine Anfragen an ein Unternehmen",
    design: "Seriös und ruhig, klassische Karte, Blau auf Grau",
    swatch: "bg-sky-800 text-white",
    tags: ["Kontakt", "Zeitfalle", "Honeypot", "Link-Limit"],
    description:
      "Das klassische Kontaktformular mit Fehlermeldungen direkt am Feld. Drei unauffällige Schutzmechanismen arbeiten zusammen, ohne dass jemand ein Rätsel lösen muss.",
    features: [
      "Validierung pro Feld mit eigener Fehlermeldung",
      "Themenauswahl und Zeichenzähler für die Nachricht",
      "Pflicht-Zustimmung zur Datenverarbeitung",
    ],
    security: [
      "Zeitfalle: Absenden in unter 4 Sekunden nach dem Öffnen wird abgelehnt",
      "Honeypot-Feld als zweite Stufe",
      "Höchstens 2 Links pro Nachricht, typischer Werbespam fällt damit durch",
      "Längenbegrenzung auf 1000 Zeichen",
    ],
    tryIt: "Lade die Seite neu, fülle sofort per Autofill aus und sende ab: Die Zeitfalle greift. Oder füge drei Links in die Nachricht ein.",
    production:
      "Zeitstempel serverseitig signieren, sonst lässt er sich fälschen. Für den Versand reicht ein Formular-Dienst oder eine Serverless-Funktion.",
  },
  {
    slug: "registrierung-passwort",
    component: RegisterForm,
    title: "Registrierung mit Passwort-Check",
    brand: "Orbit",
    type: "Registrierungsformular",
    useCase: "Neues Benutzerkonto für eine Web-App anlegen",
    design: "Dunkel, Verlauf in Indigo, halbtransparente Karte",
    swatch: "bg-gradient-to-br from-slate-950 to-indigo-900 text-white",
    tags: ["Registrierung", "Passwortstärke", "Dark Mode"],
    description:
      "Eine Registrierung, die beim Tippen zeigt, wie stark das Passwort ist und welche Anforderungen noch fehlen. So gibt es beim Absenden keine Überraschungen.",
    features: [
      "Stärke-Anzeige in fünf Stufen",
      "Checkliste der Anforderungen mit Live-Status",
      "Passwort anzeigen und verbergen",
      "Abgleich mit der Wiederholung",
    ],
    security: [
      "Mindestlänge von 12 Zeichen plus gemischte Zeichentypen",
      "Sperrliste für häufige Passwörter",
      "autocomplete=\"new-password\", damit Passwort-Manager ein sicheres Passwort vorschlagen",
    ],
    tryIt: "Tippe „Passwort123!“: Trotz Sonderzeichen scheitert es an der Sperrliste.",
    production:
      "Regeln auf dem Server wiederholen und gegen eine Liste geleakter Passwörter prüfen. E-Mail-Adresse per Bestätigungslink verifizieren.",
  },
  {
    slug: "angebot-mehrstufig",
    component: QuoteWizardForm,
    title: "Mehrstufige Angebotsanfrage",
    brand: "Sonnenwerk Solar",
    type: "Mehrstufiges Formular (Wizard)",
    useCase: "Qualifizierte Anfragen mit vielen Angaben",
    design: "Freundlich, Gelb-Grün-Verlauf, runde Formen",
    swatch: "bg-gradient-to-b from-yellow-200 to-emerald-300 text-emerald-950",
    tags: ["Anfrage", "Wizard", "Schritt-Validierung"],
    description:
      "Viele Fragen, aufgeteilt in vier kleine Schritte. Das senkt die Abbruchquote, weil jeder Schritt überschaubar bleibt und der Fortschritt sichtbar ist.",
    features: [
      "Fortschrittsanzeige mit vier Schritten",
      "Auswahlkarten, Schieberegler und Schalter",
      "Zusammenfassung vor dem Absenden",
      "Grobe Schätzung der Anlagengröße aus den Angaben",
    ],
    security: [
      "Validierung pro Schritt: weiter geht es erst mit gültigen Angaben",
      "Wertebereiche für Zahlen, fünfstellige Postleitzahl",
      "Mehrere Schritte bremsen einfache Bots zusätzlich aus",
    ],
    tryIt: "Klicke im ersten Schritt direkt auf „Weiter“ oder gib 5 m² Dachfläche ein.",
    production:
      "Zwischenstand speichern, damit bei einem Abbruch nichts verloren geht. Anfragen landen am besten direkt im CRM.",
  },
  {
    slug: "checkout-kartenzahlung",
    component: CheckoutForm,
    title: "Checkout mit Kartenprüfung",
    brand: "Fjord Outdoor",
    type: "Zahlungsformular",
    useCase: "Kartenzahlung im Onlineshop",
    design: "Kartenvorschau, die sich beim Tippen füllt",
    swatch: "bg-gradient-to-br from-teal-800 to-slate-900 text-white",
    tags: ["Zahlung", "Luhn-Prüfung", "Eingabemasken"],
    description:
      "Ein Zahlungsformular mit Live-Vorschau der Karte. Eingabemasken formatieren Nummer und Ablaufdatum automatisch, Tippfehler fallen sofort auf.",
    features: [
      "Kartennummer in Vierergruppen, Ablaufdatum mit automatischem Schrägstrich",
      "Erkennung des Kartentyps anhand der ersten Ziffern",
      "Passende autocomplete-Werte für Browser und Passwort-Manager",
    ],
    security: [
      "Luhn-Prüfsumme erkennt vertippte Kartennummern",
      "Ablaufdatum wird gegen das heutige Datum geprüft",
      "Prüfziffer wird verdeckt eingegeben",
      "Deutlicher Hinweis, dass es sich um eine Demo handelt",
    ],
    tryIt: "Die Testnummer 4242 4242 4242 4242 ist gültig. Ändere eine Ziffer und die Prüfsumme schlägt fehl.",
    production:
      "Kartendaten nie selbst verarbeiten. Die Felder eines Zahlungsanbieters einbinden, dann berühren die Daten den eigenen Server nicht.",
  },
  {
    slug: "terminbuchung",
    component: AppointmentForm,
    title: "Terminbuchung",
    brand: "Praxis am Stadtpark",
    type: "Buchungsformular",
    useCase: "Termine für Praxis, Salon oder Beratung",
    design: "Ruhig und klar, Türkis, große Auswahlflächen",
    swatch: "bg-teal-100 text-teal-950",
    tags: ["Buchung", "Zeitfenster", "Tastaturbedienbar"],
    description:
      "Tag und Uhrzeit werden angeklickt statt eingetippt. Belegte Zeiten sind sichtbar, aber gesperrt, sodass niemand einen vergebenen Termin wählen kann.",
    features: [
      "Die nächsten acht Werktage werden automatisch berechnet",
      "Zeitfenster mit belegten und freien Zeiten",
      "Zusammenfassung des gebuchten Termins",
    ],
    security: [
      "Nur vorgegebene Werte wählbar, keine freie Datumseingabe",
      "Belegte Zeiten sind technisch deaktiviert, nicht nur ausgegraut",
      "Telefonnummer wird auf ein plausibles Format geprüft",
    ],
    tryIt: "Wechsle den Tag: Die belegten Zeiten ändern sich, eine getroffene Auswahl wird zurückgesetzt.",
    production:
      "Freie Zeiten kommen aus dem Kalendersystem. Beim Absenden erneut prüfen, ob der Termin noch frei ist, sonst entstehen Doppelbuchungen.",
  },
  {
    slug: "feedback-sterne",
    component: FeedbackForm,
    title: "Feedback mit Sternen",
    brand: "Bringbar",
    type: "Bewertungsformular",
    useCase: "Schnelles Feedback nach einer Bestellung",
    design: "Verspielt, Gelb und Pink, leicht gedrehte Karte",
    swatch: "bg-yellow-300 text-slate-900",
    tags: ["Feedback", "Sterne", "Zeichenlimit"],
    description:
      "Ein Formular, das in zehn Sekunden erledigt ist: Sterne anklicken, Stichworte wählen, fertig. Der Freitext ist freiwillig.",
    features: [
      "Sternebewertung mit Vorschau beim Überfahren",
      "Stichworte zum Anklicken statt Tippen",
      "Zeichenzähler, der kurz vor dem Limit die Farbe wechselt",
    ],
    security: [
      "Sterne sind echte Radio-Buttons und damit per Tastatur und Screenreader bedienbar",
      "Freitext auf 280 Zeichen begrenzt",
      "E-Mail ist optional und wird nur geprüft, wenn sie angegeben ist",
    ],
    tryIt: "Sende ohne Sterne ab oder bediene die Bewertung nur mit Tab und Pfeiltasten.",
    production:
      "Bewertung an die Bestellung koppeln, zum Beispiel über einen einmaligen Link in der Mail. So kann jede Bestellung nur einmal bewertet werden.",
  },
  {
    slug: "bewerbung-upload",
    component: ApplicationForm,
    title: "Bewerbung mit Datei-Upload",
    brand: "Studio Kaleido",
    type: "Bewerbungsformular",
    useCase: "Bewerbungen mit Anhang entgegennehmen",
    design: "Plakativ, große Versalien, Schwarz mit Orange",
    swatch: "bg-black text-[#ff7a3d]",
    tags: ["Bewerbung", "Upload", "Dateiprüfung"],
    description:
      "Bewerbung mit Lebenslauf als PDF. Die Datei lässt sich per Klick auswählen oder in das Feld ziehen und wird sofort geprüft.",
    features: [
      "Drag-and-drop mit sichtbarer Rückmeldung",
      "Anzeige von Dateiname und Größe, Datei wieder entfernbar",
      "Stellenauswahl und optionaler Portfolio-Link",
    ],
    security: [
      "Nur PDF erlaubt, geprüft über Dateityp und Endung",
      "Größenlimit von 5 MB",
      "Portfolio-Link muss eine vollständige http- oder https-Adresse sein",
    ],
    tryIt: "Ziehe ein Bild statt einer PDF in das Feld: Die Datei wird abgelehnt.",
    production:
      "Dateityp auf dem Server anhand des Inhalts prüfen, Uploads auf Schadsoftware scannen und außerhalb des Web-Verzeichnisses speichern.",
  },
  {
    slug: "support-ticket-captcha",
    component: SupportTicketForm,
    title: "Support-Ticket mit Rechen-Captcha",
    brand: "Kernel Hosting",
    type: "Support-Formular",
    useCase: "Störungen und Anfragen strukturiert melden",
    design: "Terminal-Optik, Grün auf Schwarz, Festbreitenschrift",
    swatch: "bg-black text-green-400",
    tags: ["Support", "Rechen-Captcha", "Formatprüfung"],
    description:
      "Ein Ticket-Formular für ein technisches Publikum. Statt eines externen Captcha-Dienstes sichert eine einfache Rechenaufgabe das Absenden ab.",
    features: [
      "Kundennummer mit festem Format",
      "Kategorie und Priorität für die Zuordnung",
      "Ticketnummer als Bestätigung",
    ],
    security: [
      "Rechen-Captcha ohne Drittanbieter und ohne Cookies",
      "Nach einer falschen Antwort wird eine neue Aufgabe erzeugt",
      "Kundennummer muss dem Muster KD-12345 entsprechen",
      "Mindestlänge für die Beschreibung verhindert leere Tickets",
    ],
    tryIt: "Beantworte die Rechenaufgabe falsch: Die Aufgabe wechselt.",
    production:
      "Eine Rechenaufgabe hält nur einfache Bots auf. Bei viel Spam die Aufgabe serverseitig erzeugen oder einen datenschutzfreundlichen Captcha-Dienst nutzen.",
  },
  {
    slug: "zwei-faktor-code",
    component: OtpForm,
    title: "Zwei-Faktor-Code",
    brand: "Bank Nordkap",
    type: "Bestätigungsformular (2FA)",
    useCase: "Zweiter Schritt bei der Anmeldung",
    design: "Bankentypisch, Dunkelblau und Gold, kantig",
    swatch: "bg-[#0b1f3a] text-[#e0be6e]",
    tags: ["2FA", "Versuchslimit", "Code-Eingabe"],
    description:
      "Sechs einzelne Felder für einen Einmalcode. Der Cursor springt automatisch weiter, ein kopierter Code lässt sich in einem Zug einfügen.",
    features: [
      "Automatischer Sprung zum nächsten Feld, Rücktaste springt zurück",
      "Einfügen eines kompletten Codes",
      "Countdown bis zur erneuten Anforderung",
    ],
    security: [
      "Sperre nach 3 Fehlversuchen",
      "Neuer Code erst nach 30 Sekunden anforderbar",
      "autocomplete=\"one-time-code\" für den Vorschlag aus der SMS",
      "Nur Ziffern werden angenommen",
    ],
    tryIt: "Der Demo-Code lautet 246810. Gib dreimal einen falschen Code ein, um die Sperre zu sehen.",
    production:
      "Code auf dem Server erzeugen, nach wenigen Minuten verfallen lassen und Fehlversuche pro Konto zählen.",
  },
  {
    slug: "event-anmeldung",
    component: EventForm,
    title: "Event-Anmeldung für Gruppen",
    brand: "Frontend Fest",
    type: "Anmeldeformular mit Preisberechnung",
    useCase: "Tickets für eine oder mehrere Personen buchen",
    design: "Plakat-Stil, Orange, dicke Rahmen, riesige Schrift",
    swatch: "bg-[#ff5a1f] text-black",
    tags: ["Event", "Dynamische Felder", "Preisrechner"],
    description:
      "Eine Anmeldung, bei der sich Personen hinzufügen und entfernen lassen. Der Gesamtpreis rechnet bei jeder Änderung mit.",
    features: [
      "Bis zu fünf Teilnehmende, einzeln entfernbar",
      "Drei Ticketarten mit Live-Gesamtpreis",
      "Rabattcode mit sofortiger Rückmeldung",
    ],
    security: [
      "Obergrenze von 5 Personen pro Buchung",
      "Jede E-Mail-Adresse darf nur einmal vorkommen",
      "Ungültige Rabattcodes blockieren das Absenden",
    ],
    tryIt: "Der Rabattcode COLLECTION10 gibt 10 % Nachlass. Trage zweimal dieselbe E-Mail-Adresse ein.",
    production:
      "Preise und Rabatte immer auf dem Server berechnen. Ein Preis aus dem Browser lässt sich beliebig verändern.",
  },
  {
    slug: "rueckruf-ratenlimit",
    component: CallbackForm,
    title: "Rückruf mit Sendesperre",
    brand: "Dachdecker Brandt",
    type: "Mini-Formular",
    useCase: "Rückrufbitte für Handwerk und lokale Betriebe",
    design: "Neo-Brutalismus, harte Schatten, Gelb und Schwarz",
    swatch: "bg-[#fde047] text-black",
    tags: ["Rückruf", "Sendesperre", "Minimal"],
    description:
      "Das kürzeste Formular der Sammlung: Name, Telefonnummer, Wunschzeit. Nach dem Absenden ist eine Minute Pause, damit niemand mehrfach hintereinander sendet.",
    features: [
      "Nur drei Felder, auf dem Handy mit einer Hand bedienbar",
      "Countdown bis zur nächsten möglichen Anfrage",
      "Sperre bleibt nach dem Neuladen der Seite bestehen",
    ],
    security: [
      "Sendesperre von 60 Sekunden, gespeichert im Browser",
      "Button ist während der Sperre deaktiviert",
      "Telefonnummer wird auf ein plausibles Format geprüft",
    ],
    tryIt: "Sende einmal ab und lade die Seite neu: Der Countdown läuft weiter.",
    production:
      "Die Sperre im Browser stoppt Doppelklicks, aber keine Angreifer. Eine echte Begrenzung zählt Anfragen pro IP-Adresse auf dem Server.",
  },
  {
    slug: "umfrage-dialog",
    component: SurveyForm,
    title: "Umfrage im Dialog-Stil",
    brand: "Stadtrad",
    type: "Umfrage, eine Frage pro Ansicht",
    useCase: "Kundenbefragung und Weiterempfehlungswert",
    design: "Vollflächig, Violett-Verlauf, sehr große Schrift",
    swatch: "bg-gradient-to-br from-violet-700 to-fuchsia-600 text-white",
    tags: ["Umfrage", "Eine Frage pro Ansicht", "Tastatur"],
    description:
      "Statt einer langen Liste erscheint immer nur eine Frage. Das wirkt wie ein Gespräch und funktioniert besonders gut auf dem Handy.",
    features: [
      "Auswahl, Skala von 0 bis 10 und Freitext",
      "Weiter mit Klick oder Enter, Zurück jederzeit möglich",
      "Fortschrittsbalken am oberen Rand",
    ],
    security: [
      "Pflichtfragen lassen sich nicht überspringen",
      "Freitext auf 200 Zeichen begrenzt",
      "E-Mail ist freiwillig und wird nur bei Angabe geprüft",
    ],
    tryIt: "Beantworte alles nur mit der Tastatur: Tab, Enter und die Pfeiltasten reichen.",
    production:
      "Antworten nach jeder Frage speichern, damit auch abgebrochene Umfragen auswertbar sind.",
  },
  {
    slug: "passwort-reset-slider",
    component: ResetPasswordForm,
    title: "Passwort-Reset mit Schiebe-Captcha",
    brand: "Lumen Cloud",
    type: "Passwort zurücksetzen",
    useCase: "Zugang wiederherstellen",
    design: "Glas-Effekt über farbigen Lichtflecken",
    swatch: "bg-gradient-to-br from-cyan-500 via-slate-800 to-fuchsia-600 text-white",
    tags: ["Passwort-Reset", "Schiebe-Captcha", "Neutrale Antwort"],
    description:
      "Ein Feld und ein Schieberegler. Wer den Link anfordern will, zieht den Regler nach rechts. Die Antwort verrät nicht, ob es zu der Adresse ein Konto gibt.",
    features: [
      "Schieberegler als Bestätigung, springt beim Loslassen zurück",
      "Regler ist ein echtes Bedienelement und per Tastatur nutzbar",
      "Neutrale Erfolgsmeldung",
    ],
    security: [
      "Schiebe-Captcha: Ein Sprung ans Ende in unter 250 ms wird abgelehnt",
      "Neutrale Antwort verhindert, dass sich gültige Konten erraten lassen",
      "Hinweis auf die begrenzte Gültigkeit des Links",
    ],
    tryIt: "Klicke direkt ans rechte Ende des Reglers statt zu ziehen: Das wird als zu schnell abgelehnt.",
    production:
      "Anfragen pro Adresse und IP begrenzen. Der Link enthält ein zufälliges Einmal-Token, das nach 30 Minuten verfällt.",
  },
  {
    slug: "login-brute-force-bremse",
    component: SecureLoginForm,
    title: "Login mit Brute-Force-Bremse",
    brand: "Tresor",
    type: "Login-Formular (abgesichert)",
    useCase: "Anmeldung bei einem sensiblen Dienst",
    design: "Dunkel und reduziert, Smaragdgrün als einziger Akzent",
    swatch: "bg-slate-950 text-emerald-400",
    tags: ["Login", "Wartezeit", "Feststelltaste"],
    description:
      "Das Gegenstück zum einfachen Login am Anfang der Sammlung. Jeder Fehlversuch verlängert die Wartezeit, sodass massenhaftes Durchprobieren von Passwörtern nicht mehr funktioniert.",
    features: [
      "Passwort anzeigen und verbergen",
      "Warnung bei aktiver Feststelltaste",
      "Option, auf dem Gerät angemeldet zu bleiben",
    ],
    security: [
      "Wartezeit verdoppelt sich ab dem 2. Fehlversuch: 2, 4, 8 bis höchstens 60 Sekunden",
      "Einheitliche Fehlermeldung verrät nicht, ob die E-Mail-Adresse existiert",
      "Passwortfeld wird nach einem Fehlversuch geleert",
      "Passende autocomplete-Werte für Passwort-Manager",
    ],
    tryIt: "Melde dich dreimal falsch an und beobachte die Wartezeit. Der Demo-Zugang steht unter dem Formular.",
    production:
      "Fehlversuche pro Konto und pro IP auf dem Server zählen. Zusätzlich einen zweiten Faktor anbieten, siehe das Formular „Zwei-Faktor-Code“.",
  },
  {
    slug: "spende-lastschrift",
    component: DonationForm,
    title: "Spende mit IBAN-Prüfung",
    brand: "Waldfreunde e. V.",
    type: "Spendenformular",
    useCase: "Einmalige und regelmäßige Spenden per Lastschrift",
    design: "Weich und natürlich, Waldgrün auf Cremeweiß, große Rundungen",
    swatch: "bg-green-800 text-[#f1f5e4]",
    tags: ["Spende", "IBAN-Prüfsumme", "Bedingte Felder"],
    description:
      "Betrag antippen, IBAN eingeben, fertig. Die Anschrift wird nur abgefragt, wenn jemand eine Spendenquittung möchte.",
    features: [
      "Feste Beträge und eigener Betrag",
      "Umschalten zwischen einmalig und monatlich",
      "Anzeige, was der Betrag bewirkt",
      "Adressfelder erscheinen nur bei Bedarf",
    ],
    security: [
      "IBAN-Prüfsumme (Modulo 97) erkennt Zahlendreher",
      "Betrag auf 5 bis 5.000 Euro begrenzt",
      "Es werden nur Daten abgefragt, die für die gewählte Option nötig sind",
    ],
    tryIt: "Die Beispiel-IBAN DE89 3704 0044 0532 0130 00 ist gültig. Vertausche zwei Ziffern und sie wird abgelehnt.",
    production:
      "Für Lastschriften ist ein SEPA-Mandat mit Datum und Mandatsreferenz nötig. Kontodaten verschlüsselt speichern.",
  },
  {
    slug: "lieferadresse",
    component: AddressForm,
    title: "Liefer- und Rechnungsadresse",
    brand: "Paketwerk",
    type: "Adressformular",
    useCase: "Adresseingabe im Bestellprozess",
    design: "Sachlich und hell, Violett als Akzent, enges Raster",
    swatch: "bg-violet-600 text-white",
    tags: ["Adresse", "Autofill", "PLZ-Vorschlag"],
    description:
      "Ein Adressformular, das dem Browser die Arbeit überlässt: Mit den richtigen Auszeichnungen füllt Autofill alle Felder mit einem Klick.",
    features: [
      "Ort wird aus der Postleitzahl vorgeschlagen",
      "Abweichende Rechnungsadresse zum Ausklappen",
      "Getrennte autocomplete-Bereiche für Lieferung und Rechnung",
    ],
    security: [
      "Warnung, wenn die Hausnummer fehlt",
      "Postleitzahl wird passend zum Land geprüft: 5 Ziffern für Deutschland, 4 für Österreich und die Schweiz",
      "Ein selbst eingetragener Ort wird vom Vorschlag nicht überschrieben",
    ],
    tryIt: "Tippe die Postleitzahl 20095 oder 80331 ein. Lass danach die Hausnummer weg.",
    production:
      "Adressen über einen Prüfdienst validieren, das senkt die Zahl der Rückläufer deutlich.",
  },
  {
    slug: "suchfilter-live",
    component: SearchFilterForm,
    title: "Suchfilter mit Live-Ergebnissen",
    brand: "Wohnraum",
    type: "Such- und Filterformular",
    useCase: "Angebote durchsuchen und eingrenzen",
    design: "Zweispaltig, warmes Beige mit Orange",
    swatch: "bg-orange-600 text-white",
    tags: ["Suche", "Filter", "Ohne Absenden"],
    description:
      "Ein Formular ohne Absende-Button. Jede Änderung wirkt sofort auf die Ergebnisliste, die Trefferzahl wird laufend angesagt.",
    features: [
      "Textsuche, Preisregler, Zimmerzahl und Ausstattung kombinierbar",
      "Sortierung der Ergebnisse",
      "Eigener Hinweis, wenn nichts gefunden wird",
      "Zurücksetzen mit einem Klick",
    ],
    security: [
      "Suchtext wird nur als Text verglichen, nie als Muster oder Code ausgeführt",
      "Eingabelänge auf 60 Zeichen begrenzt",
      "Trefferzahl ist für Screenreader als Statusmeldung ausgezeichnet",
    ],
    tryIt: "Suche nach „Altona“ oder setze alle vier Ausstattungsfilter, bis nichts mehr übrig bleibt.",
    production:
      "Filter in die URL schreiben, damit sich Suchen teilen lassen. Suchanfragen auf dem Server immer als Parameter übergeben, nie in eine Datenbankabfrage einbauen.",
  },
  {
    slug: "kommentar-vorschau",
    component: CommentForm,
    title: "Kommentar mit sicherer Vorschau",
    brand: "Tintenfass Magazin",
    type: "Kommentarformular",
    useCase: "Öffentliche Kommentare unter Artikeln",
    design: "Lesefreundlich, Serifenschrift, Weinrot",
    swatch: "bg-[#fdfcf8] text-rose-900",
    tags: ["Kommentar", "XSS-Schutz", "Vorschau"],
    description:
      "Hier landet fremder Text öffentlich auf der Seite. Deshalb geht es vor allem darum, dass Eingaben nie als Code ausgeführt werden.",
    features: [
      "Live-Vorschau beim Schreiben",
      "Einfache Formatierung mit Sternchen für fett und kursiv",
      "Neuer Kommentar erscheint sofort in der Liste",
    ],
    security: [
      "Eingaben werden als Text ausgegeben, HTML und Skripte bleiben wirkungslos",
      "Sperrliste für typische Spam-Begriffe",
      "Höchstens ein Link pro Kommentar",
      "Doppelte Kommentare werden abgelehnt",
    ],
    tryIt: "Schreibe <script>alert(1)</script> in den Kommentar: Es erscheint als harmloser Text.",
    production:
      "Kommentare auf dem Server erneut filtern und neue Verfasser erst nach Freigabe anzeigen.",
  },
  {
    slug: "cookie-einwilligung",
    component: ConsentForm,
    title: "Cookie-Einwilligung",
    brand: "Hofladen Online",
    type: "Einwilligungsformular",
    useCase: "Zustimmung zu Cookies und Tracking einholen",
    design: "Dialog über einer unscharfen Seite, Schwarz-Weiß",
    swatch: "bg-slate-300 text-slate-900",
    tags: ["Einwilligung", "DSGVO", "Schalter"],
    description:
      "Ein Einwilligungsdialog ohne Tricks. Ablehnen ist genauso leicht wie Zustimmen, und nichts ist vorausgewählt.",
    features: [
      "Schalter pro Kategorie mit Erklärung",
      "Drei gleichwertige Buttons",
      "Bestätigung mit Zeitpunkt der Entscheidung",
      "Auswahl lässt sich jederzeit ändern",
    ],
    security: [
      "Keine vorausgewählten Kategorien außer den technisch notwendigen",
      "Ablehnen und Akzeptieren sind optisch gleich gestaltet",
      "Notwendige Cookies sind gesperrt und als solche erklärt",
      "Zeitpunkt der Einwilligung wird festgehalten",
    ],
    tryIt: "Vergleiche die drei Buttons: Keiner ist hervorgehoben.",
    production:
      "Skripte erst nach der Zustimmung laden und die Einwilligung nachweisbar speichern. Die rechtliche Bewertung gehört in fachkundige Hände.",
  },
  {
    slug: "profil-einstellungen",
    component: ProfileSettingsForm,
    title: "Profil-Einstellungen mit Entwurf",
    brand: "Pilot",
    type: "Einstellungsformular",
    useCase: "Bestehende Daten in einer Web-App bearbeiten",
    design: "App-Oberfläche, Karte mit fester Fußleiste, Blau",
    swatch: "bg-blue-600 text-white",
    tags: ["Einstellungen", "Entwurf sichern", "Bildvorschau"],
    description:
      "Anders als die meisten Formulare startet dieses mit vorhandenen Daten. Es erkennt, ob etwas geändert wurde, und schützt vor versehentlichem Verlust.",
    features: [
      "Speichern ist nur aktiv, wenn sich etwas geändert hat",
      "Entwurf wird automatisch gesichert und beim nächsten Besuch wiederhergestellt",
      "Profilbild mit Vorschau",
      "Änderungen mit einem Klick verwerfen",
    ],
    security: [
      "Warnung des Browsers beim Verlassen mit ungespeicherten Änderungen",
      "Profilbild nur als PNG, JPG oder WebP und höchstens 2 MB",
      "Längenbegrenzung für alle Textfelder",
    ],
    tryIt: "Ändere den Namen und lade die Seite neu, ohne zu speichern: Der Entwurf ist noch da.",
    production:
      "Beim Speichern prüfen, ob die Daten inzwischen an anderer Stelle geändert wurden. Hochgeladene Bilder auf dem Server neu kodieren.",
  },
  {
    slug: "hotelbuchung-zeitraum",
    component: HotelBookingForm,
    title: "Hotelbuchung mit Zeitraum",
    brand: "Hotel Seeblick",
    type: "Buchungsformular mit Datumsbereich",
    useCase: "Übernachtungen für mehrere Gäste buchen",
    design: "Edel, Dunkelgrün und Gold, Serifenschrift",
    swatch: "bg-[#0b1f1a] text-[#c8b27a]",
    tags: ["Buchung", "Datumsbereich", "Preisrechner"],
    description:
      "An- und Abreise hängen voneinander ab: Die Abreise zieht automatisch nach, und der Preis rechnet aus Nächten, Zimmer und Gästen.",
    features: [
      "Zwei verknüpfte Datumsfelder",
      "Zähler für Erwachsene und Kinder",
      "Zimmerwahl mit Preis pro Nacht",
      "Gesamtpreis in Echtzeit",
    ],
    security: [
      "Anreise nicht in der Vergangenheit, Abreise immer nach der Anreise",
      "Höchstens 14 Nächte online buchbar",
      "Gästezahl wird gegen die Belegung des Zimmers geprüft",
    ],
    tryIt: "Wähle 4 Erwachsene im Zimmer „Classic“ oder setze die Anreise hinter die Abreise.",
    production:
      "Verfügbarkeit und Preis beim Absenden auf dem Server neu berechnen, sonst drohen Doppelbuchungen und veraltete Preise.",
  },
  {
    slug: "konto-loeschen",
    component: DeleteAccountForm,
    title: "Konto löschen mit Sicherheitsabfrage",
    brand: "Notizwerk",
    type: "Bestätigungsformular für kritische Aktionen",
    useCase: "Unwiderrufliche Aktionen absichern",
    design: "Nüchtern, roter Rahmen als Warnsignal",
    swatch: "bg-red-600 text-white",
    tags: ["Kritische Aktion", "Tipp-Bestätigung", "Schonfrist"],
    description:
      "Hier soll das Formular bewusst bremsen. Mehrere kleine Hürden stellen sicher, dass niemand sein Konto aus Versehen löscht.",
    features: [
      "Folgen müssen einzeln bestätigt werden",
      "Bestätigungswort muss abgetippt werden",
      "Countdown mit der Möglichkeit abzubrechen",
    ],
    security: [
      "Button bleibt gesperrt, bis alle Bedingungen erfüllt sind",
      "Erneute Passworteingabe schützt bei einem unbeaufsichtigten Gerät",
      "8 Sekunden Schonfrist vor der Ausführung",
      "Der Fokus liegt während der Schonfrist auf „Abbrechen“",
    ],
    tryIt: "Das Demo-Passwort lautet „notizwerk“. Brich die Löschung während des Countdowns ab.",
    production:
      "Konten zunächst nur deaktivieren und nach einer Frist von einigen Tagen endgültig löschen. Die Löschung per E-Mail bestätigen.",
  },
  {
    slug: "altersabfrage",
    component: AgeGateForm,
    title: "Altersabfrage",
    brand: "Weingut Rebenhof",
    type: "Zugangsformular",
    useCase: "Zugang zu Angeboten ab 18 Jahren",
    design: "Weinrot und Gold, zentriert, Serifenschrift",
    swatch: "bg-[#3b0d1a] text-[#d9a441]",
    tags: ["Altersprüfung", "Datumsprüfung", "Datensparsam"],
    description:
      "Drei Felder für Tag, Monat und Jahr statt eines Kalenders. Bei einem Geburtsdatum ist Tippen deutlich schneller als Blättern.",
    features: [
      "Cursor springt automatisch ins nächste Feld",
      "Altersberechnung auf den Tag genau",
      "Eigene Ansicht für Zutritt und für Ablehnung",
    ],
    security: [
      "Unmögliche Daten wie der 31. Februar werden erkannt",
      "Daten in der Zukunft werden abgelehnt",
      "Das Geburtsdatum wird nach der Prüfung verworfen, nur das Ergebnis bleibt",
    ],
    tryIt: "Gib den 31.02.1990 ein oder ein Datum, mit dem du morgen 18 wirst.",
    production:
      "Eine Selbstauskunft ist keine echte Altersprüfung. Für den Verkauf ist je nach Ware ein Ident-Verfahren oder eine Prüfung bei der Zustellung nötig.",
  },
  {
    slug: "gutschein-einloesen",
    component: VoucherForm,
    title: "Gutschein mit Prüfziffer",
    brand: "Buchladen Seitenreich",
    type: "Code-Eingabe",
    useCase: "Gutscheine und Aktionscodes einlösen",
    design: "Festlich, Verlauf von Rosa zu Gelb, gestricheltes Codefeld",
    swatch: "bg-gradient-to-br from-rose-400 to-amber-200 text-rose-950",
    tags: ["Gutschein", "Prüfziffer", "Versuchslimit"],
    description:
      "Ein einziges Feld, das beim Abtippen hilft: Großschreibung und Bindestriche kommen von selbst, Tippfehler erkennt das Formular ohne Serveranfrage.",
    features: [
      "Automatische Formatierung in Viererblöcken",
      "Zeichensatz ohne verwechselbare Zeichen wie 0 und O",
      "Unterscheidung zwischen Tippfehler, unbekannt und bereits eingelöst",
    ],
    security: [
      "Prüfziffer im Code erkennt Tippfehler sofort",
      "Sperre nach 5 Fehlversuchen gegen Durchprobieren",
      "Ein Code lässt sich nur einmal einlösen",
    ],
    tryIt: "Der Demo-Code steht unter dem Formular. Ändere ein Zeichen oder löse ihn zweimal ein.",
    production:
      "Codes zufällig und lang genug erzeugen, Versuche pro Konto auf dem Server zählen und das Einlösen als einen unteilbaren Schritt speichern.",
  },
  {
    slug: "kreditrechner",
    component: LoanCalculatorForm,
    title: "Kreditrechner",
    brand: "Zinsklar",
    type: "Rechner-Formular",
    useCase: "Interessenten eine Zahl geben, bevor sie Daten eingeben",
    design: "Zweigeteilt, Eingabe links, Ergebnis rechts auf Blau",
    swatch: "bg-sky-700 text-white",
    tags: ["Rechner", "Schieberegler", "Lead-Formular"],
    description:
      "Erst rechnen, dann fragen. Das Ergebnis steht sofort da, die E-Mail-Adresse wird erst am Ende und freiwillig abgefragt.",
    features: [
      "Regler und Zahlenfeld sind miteinander verbunden",
      "Monatsrate nach der Annuitätenformel",
      "Balken zeigt das Verhältnis von Kreditbetrag und Zinsen",
      "Zinssatz hängt vom Verwendungszweck ab",
    ],
    security: [
      "Freie Eingaben werden auf den erlaubten Bereich und die Schrittweite gebracht",
      "Nur Ziffern im Betragsfeld",
      "Deutlicher Hinweis, dass es eine Beispielrechnung ist",
    ],
    tryIt: "Tippe 999999 in das Betragsfeld und verlasse es: Der Wert springt auf das Maximum.",
    production:
      "Für echte Kreditangebote gelten Pflichtangaben wie der effektive Jahreszins und ein repräsentatives Beispiel.",
  },
  {
    slug: "retoure-anmelden",
    component: ReturnForm,
    title: "Retoure mit Bestellsuche",
    brand: "Laufwerk",
    type: "Zweistufiges Service-Formular",
    useCase: "Rücksendungen ohne Kundenkonto anmelden",
    design: "Sportlich, Neongrün auf Schwarz",
    swatch: "bg-lime-400 text-zinc-900",
    tags: ["Retoure", "Bestellsuche", "Abhängige Felder"],
    description:
      "Erst wird die Bestellung gesucht, dann erscheint das eigentliche Formular mit den bestellten Artikeln. Ein Kundenkonto ist nicht nötig.",
    features: [
      "Bestellsuche mit Nummer und Postleitzahl",
      "Artikel einzeln auswählbar, Grund pro Artikel",
      "Erstattungsbetrag rechnet mit",
      "Rücksendecode als Bestätigung",
    ],
    security: [
      "Zwei Angaben nötig: Die Bestellnummer allein reicht nicht",
      "Einheitliche Meldung verrät nicht, ob eine Bestellnummer existiert",
      "Für jeden gewählten Artikel ist ein Grund Pflicht",
    ],
    tryIt: "Die Demo-Bestellung steht unter dem Suchformular. Wähle einen Artikel, aber keinen Grund.",
    production:
      "Suchversuche pro IP begrenzen, sonst lassen sich Bestellnummern durchprobieren. Rückgabefristen auf dem Server prüfen.",
  },
  {
    slug: "antrag-barrierefrei",
    component: GovForm,
    title: "Barrierefreier Behördenantrag",
    brand: "Stadt Musterhausen",
    type: "Antragsformular",
    useCase: "Online-Anträge für alle Bürgerinnen und Bürger",
    design: "Bewusst schlicht, hoher Kontrast, gelber Fokusrahmen",
    swatch: "bg-white text-blue-900 border-b border-slate-200",
    tags: ["Antrag", "Barrierefrei", "Fehlerübersicht"],
    description:
      "Dieses Formular zeigt, wie Fehlerbehandlung für alle funktioniert: mit Tastatur, Screenreader und starker Vergrößerung.",
    features: [
      "Fehlerübersicht am Anfang mit Sprunglinks zu den Feldern",
      "Fokus springt nach dem Absenden zur Übersicht",
      "Hinweise und Fehler sind mit dem Feld verknüpft",
      "Große Schrift und große Klickflächen",
    ],
    security: [
      "Fehler werden mit Text und Rahmen angezeigt, nie nur über Farbe",
      "Jede Fehlermeldung sagt, wie die Eingabe aussehen muss",
      "Kennzeichen wird gegen das amtliche Format geprüft",
      "Deutlich sichtbarer Fokus auf jedem Element",
    ],
    tryIt: "Sende das leere Formular ab und klicke in der Übersicht auf einen Fehler.",
    production:
      "Mit echten Hilfsmitteln testen. Öffentliche Stellen sind zur Barrierefreiheit verpflichtet, für viele Unternehmen gilt das inzwischen ebenfalls.",
  },
  {
    slug: "unterschrift",
    component: SignatureForm,
    title: "Protokoll mit Unterschrift",
    brand: "Umzugshelden",
    type: "Formular mit Unterschriftenfeld",
    useCase: "Übergaben und Aufträge vor Ort quittieren",
    design: "Klemmbrett-Optik, Papierfarben, Tintenblau",
    swatch: "bg-amber-100 text-blue-900",
    tags: ["Unterschrift", "Zeichenfläche", "Tablet"],
    description:
      "Unterschreiben mit Finger, Stift oder Maus direkt im Browser. Gedacht für Tablets, auf denen Kundinnen und Kunden vor Ort quittieren.",
    features: [
      "Zeichenfläche für Maus, Touch und Stift",
      "Unterschrift lässt sich löschen und wiederholen",
      "Unterschrift wird als Bild übernommen",
      "Datum wird automatisch eingetragen",
    ],
    security: [
      "Ein einzelner Punkt oder Strich reicht nicht als Unterschrift",
      "Alle Punkte des Protokolls müssen bestätigt sein",
      "Alternative ohne Zeichnen für Menschen, die das Feld nicht bedienen können",
    ],
    tryIt: "Setze nur einen Punkt und sende ab. Unterschreibe danach richtig.",
    production:
      "Eine gezeichnete Unterschrift ist eine einfache elektronische Signatur. Für Verträge mit Formvorschrift ist ein qualifiziertes Signaturverfahren nötig.",
  },
];
