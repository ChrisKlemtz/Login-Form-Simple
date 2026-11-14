# COLLECTION-Forms

Eine Sammlung von 30 Formularen in React. Jedes Formular hat eine eigene Seite: links das Formular, rechts die Beschreibung, was es kann, wofür es gedacht ist und wie es gegen Spam und Missbrauch geschützt ist.

Die Sammlung läuft komplett im Browser. Es gibt kein Backend, das Absenden wird simuliert und es werden keine Daten übertragen. Alle Marken und Firmen sind frei erfunden.

## Die Formulare

| Nr. | Formular | Einsatz | Schutz und Besonderheit |
| --- | --- | --- | --- |
| 01 | Einfacher Login | Anmeldung | Basisbeispiel ohne Schutz |
| 02 | Newsletter mit Honeypot | Newsletter | Honeypot, Double-Opt-in |
| 03 | Kontakt mit Zeitfalle | Kontaktanfrage | Zeitfalle, Honeypot, Link-Limit |
| 04 | Registrierung mit Passwort-Check | Konto anlegen | Passwortstärke, Sperrliste |
| 05 | Mehrstufige Angebotsanfrage | Angebotsanfrage | Wizard, Validierung pro Schritt |
| 06 | Checkout mit Kartenprüfung | Zahlung | Luhn-Prüfsumme, Eingabemasken |
| 07 | Terminbuchung | Buchung | Nur freie Zeitfenster wählbar |
| 08 | Feedback mit Sternen | Bewertung | Zeichenlimit, zugängliche Sterne |
| 09 | Bewerbung mit Datei-Upload | Bewerbung | Dateityp- und Größenprüfung |
| 10 | Support-Ticket mit Rechen-Captcha | Support | Rechen-Captcha, Formatprüfung |
| 11 | Zwei-Faktor-Code | 2FA | Versuchslimit, Wartezeit |
| 12 | Event-Anmeldung für Gruppen | Ticketbuchung | Dynamische Felder, Preisrechner |
| 13 | Rückruf mit Sendesperre | Rückrufbitte | Sendesperre per localStorage |
| 14 | Umfrage im Dialog-Stil | Umfrage | Eine Frage pro Ansicht |
| 15 | Passwort-Reset mit Schiebe-Captcha | Zugang wiederherstellen | Schiebe-Captcha, neutrale Antwort |
| 16 | Login mit Brute-Force-Bremse | Anmeldung | Wachsende Wartezeit, einheitliche Fehlermeldung |
| 17 | Spende mit IBAN-Prüfung | Spende per Lastschrift | IBAN-Prüfsumme, bedingte Felder |
| 18 | Liefer- und Rechnungsadresse | Bestellprozess | Autofill, PLZ-Vorschlag |
| 19 | Suchfilter mit Live-Ergebnissen | Suche | Kein Absenden, Live-Trefferzahl |
| 20 | Kommentar mit sicherer Vorschau | Kommentare | Schutz vor eingeschleustem Code, Sperrliste |
| 21 | Cookie-Einwilligung | Einwilligung | Nichts vorausgewählt, gleichwertige Buttons |
| 22 | Profil-Einstellungen mit Entwurf | Daten bearbeiten | Entwurf sichern, Warnung beim Verlassen |
| 23 | Hotelbuchung mit Zeitraum | Übernachtung | Verknüpfte Datumsfelder, Belegungsprüfung |
| 24 | Konto löschen mit Sicherheitsabfrage | Kritische Aktion | Tipp-Bestätigung, Schonfrist |
| 25 | Altersabfrage | Zugang ab 18 | Datumsprüfung, datensparsam |
| 26 | Gutschein mit Prüfziffer | Code einlösen | Prüfziffer, Versuchslimit |
| 27 | Kreditrechner | Rechner | Verbundene Regler, Wertebereich |
| 28 | Retoure mit Bestellsuche | Rücksendung | Zweistufig, neutrale Suchmeldung |
| 29 | Barrierefreier Behördenantrag | Antrag | Fehlerübersicht, Fokusführung |
| 30 | Protokoll mit Unterschrift | Quittierung vor Ort | Zeichenfläche, Alternative ohne Zeichnen |

## Installation

```bash
git clone https://github.com/ChrisKlemtz/COLLECTION-Forms.git
cd COLLECTION-Forms
npm install
npm run dev
```

Die Anwendung ist danach unter http://localhost:5173 erreichbar.

## Technik

- **React 18** mit **Vite**
- **Tailwind CSS** für das Styling
- **ESLint** für die Code-Qualität (`npm run lint`)
- Hash-Routing ohne zusätzliche Bibliothek, dadurch auf jedem statischen Hosting lauffähig

## Aufbau

```
src/
  App.jsx                 Routing über den URL-Hash (#/slug)
  components/
    Gallery.jsx           Übersicht aller Formulare
    FormPage.jsx          Seite mit Formular und Beschreibung
    Honeypot.jsx          Verstecktes Feld gegen Bots
  forms/
    registry.js           Liste aller Formulare mit Beschreibungstexten
    *.jsx                 Ein Formular pro Datei
  lib/form.js             Simuliertes Absenden und Validierungshelfer
```

### Ein Formular hinzufügen

1. Neue Komponente in `src/forms/` anlegen. Das äußerste Element braucht die Klasse `flex-1`, damit es die Fläche füllt.
2. In `src/forms/registry.js` importieren und einen Eintrag mit Titel, Beschreibung und Sicherheitsmerkmalen ergänzen.

## Hinweis zur Sicherheit

Alle Schutzmechanismen sind hier im Browser umgesetzt, um sie zu zeigen. Im echten Einsatz muss jede Prüfung auf dem Server wiederholt werden, weil sich Code im Browser umgehen lässt. Auf jeder Formularseite steht unter „Für den echten Einsatz“, was dafür nötig ist.

## Lizenz

Dieses Projekt ist unter keiner Lizenz.

## Autor

Christoph Klemtz
