# WienerLinienMonitor

Echtzeit-Abfahrtsmonitor für ein Fire-Tablet im Kiosk-Modus (Fully Kiosk Browser PLUS).
Kein Server: eine HTML-Seite, eine Einstellungsdatei, ausgeliefert über GitHub Pages.

Adresse: https://tax-web.github.io/WienerLinienMonitor/

## Dateien

| Datei | Inhalt | Ändern? |
|---|---|---|
| `config.js` | alle Einstellungen: Haltestellen, Zeilen, Zeitfenster, Wetter | ja, hier wird angepasst |
| `index.html` | Anzeige und Programmlogik | nur bei neuen Funktionen |
| `fully-settings.json` | Einstellungen für Fully Kiosk zum Importieren | bei Bedarf |

## Kästen

| Kasten | Quelle | Steig |
|---|---|---|
| Am Spiegeln, Richtung Atzgersdorf, mit Anschluss an die S-Bahn | Wiener Linien | RBL 1648 |
| Atzgersdorf, S-Bahn | ÖBB Scotty-Liveticker (inoffiziell) | evaId 001192304 |
| Franz-Asenbauer-Gasse, Linie 60 Richtung Westbahnhof | Wiener Linien | RBL 1630 |
| Eberstorferweg, 58B Richtung Hietzing | Wiener Linien | RBL 3786 |

Kopfzeile: Uhr, Wetter (Open-Meteo, Symbol und °C), Status. Passen nicht alle Kästen auf den
Bildschirm, lässt sich die Seite scrollen, die Kopfzeile bleibt stehen.

## Einstellungen ändern

1. `config.js` im Repo öffnen (auf GitHub: Datei anklicken, Stift-Symbol).
2. Wert ändern, unten "Commit changes".
3. Nach einigen Minuten liefert GitHub Pages die neue Fassung aus. Am Tablet neu laden.

Ist `config.js` fehlerhaft (fehlender Beistrich, fehlendes Anführungszeichen), zeigt die Anzeige
"config.js fehlt oder enthält einen Fehler" statt der Abfahrten.

Haltestellennummern (RBL) der Wiener Linien: https://till.mabe.at/rbl/ - Haltestelle suchen,
Richtung wählen, die Zahl bei "RBL/StopId" übernehmen. Jeder Steig hat eine eigene Nummer, sie legt
die Richtung fest.

### Allgemeine Einstellungen

| Eintrag | Bedeutung | Aktuell |
|---|---|---|
| `refreshSeconds` | Abrufintervall in Sekunden | 30 |
| `hideBelowMinutes` | Abfahrten unter so vielen Minuten ausblenden | 1 |
| `quietHours` | Nachtruhe ohne Abrufe, `"SS:MM"` | 00:00 bis 05:30 |
| `staleMinutes` | Hinweis, wenn der letzte Abruf so lange her ist | 10 |
| `frozenMinutes` | Hinweis, wenn sich ein Kasten so lange nicht ändert | 45 |
| `weather` | Standort und Intervall fürs Wetter, `null` schaltet ab | Atzgersdorf, 10 min |
| `showRbl` | RBL je Zeile einblenden, nur zum Einrichten | false |
| `restBase` | Ausweichquelle der ÖBB, nicht ändern | |

### Einträge eines Kastens

| Eintrag | Bedeutung | Beispiel |
|---|---|---|
| `id` | interner Name, einmalig | `"spiegeln"` |
| `title` | Überschrift | `"Am Spiegeln"` |
| `tag` | kleiner Text daneben | `"Richtung Atzgersdorf"` |
| `source` | `"wl"` Wiener Linien, `"scotty"` ÖBB | `"wl"` |
| `stopIds` | RBL, eine oder mehrere (Wiener Linien) | `["1648"]` |
| `stop` | Haltestellenname statt RBL, fragt beide Richtungen ab | `"Am Spiegeln"` |
| `maxRows` | Anzahl Zeilen | `3` |
| `combine` | Abfahrten derselben Linie je Zeile | `2` |
| `rowsPerLine` | höchstens so viele Zeilen je Linie | `1` |
| `line` | Filter Liniennummer, `^` und `$` = genau diese | `"^58B$"` |
| `towards` | Filter Fahrtziel, `\|` = oder | `"atzgersdorf\|alterlaa"` |
| `hideBelowMinutes` | eigener Ausblendwert für diesen Kasten | `5` |
| `trafficInfo` | Störungsmeldungen einblenden | `true` |
| `planMark` | `false` = Fahrten ohne Echtzeit nicht als "Soll" kennzeichnen | `false` |

ÖBB-Kasten zusätzlich:

| Eintrag | Bedeutung |
|---|---|
| `stopId` | Bahnhofsnummer (evaId), leer = Suche über `query` |
| `query` | Bahnhofsname |
| `skip` | ausgeblendete Verkehrsmittel, z. B. Busse |
| `products` | Vorfilter der ÖBB, `"0000110000000000"` = S-Bahn und Regionalzüge |
| `fetchJourneys` | Rohdatenmenge vor dem Filtern |
| `outbound` | Ziele stadtauswärts (grüne Liniennummer), alle anderen blau |

### Anschluss Bus an S-Bahn (`connect`)

Markiert grün den spätesten Bus, mit dem der früheste Zug Richtung Süden erreicht wird, und
diesen Zug im S-Bahn-Kasten.

| Eintrag | Bedeutung | Aktuell |
|---|---|---|
| `panel` | id des S-Bahn-Kastens | `"atzgersdorf"` |
| `towards` | Zugziele, leer = `outbound` des S-Bahn-Kastens | leer |
| `walkMinutes` | Fußweg zur Bushaltestelle | 5 |
| `rideStopIds` | Ankunftshaltestellen, Fahrzeit wird live gemessen | 1734 (60A), 3754 (56A) |
| `rideMinutes` | geschätzte Fahrzeit, wenn die Messung nicht greift | 58B 5, 60A 3, 56A 3, sonst 4 |
| `transferMinutes` | Umstieg Bus zum Bahnsteig | 3 |
| `showFrom`, `showUntil` | Zeitfenster der Markierung | 00:00 bis 07:30 |

## Fully Kiosk

Startseite: https://tax-web.github.io/WienerLinienMonitor/

Advanced Web Settings, "Remove X-Frame, CSP and CORS protection":

```
https://www.wienerlinien.at/*
https://fahrplan.oebb.at/*
https://v6.oebb.transport.rest/*
https://api.open-meteo.com/*
```

Die Ausnahme verarbeitet keine POST-Anfragen, deshalb laufen alle Abrufe per GET.
`fully-settings.json` enthält diese und weitere Einstellungen zum Import.
