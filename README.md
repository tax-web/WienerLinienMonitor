# WienerLinienMonitor

Echtzeit-Abfahrtsmonitor für ein Fire-Tablet im Kiosk-Modus (Fully Kiosk Browser PLUS).
Eine einzige HTML-Datei, kein Server.

| Kasten | Quelle | Steig |
|---|---|---|
| Am Spiegeln, Richtung Atzgersdorf | Wiener Linien OGD | RBL 1648 |
| Atzgersdorf, S-Bahn | ÖBB Scotty-Liveticker (inoffiziell) | evaId 001192304 |
| Franz-Asenbauer-Gasse, Richtung Westbahnhof | Wiener Linien OGD | RBL 1630 |

Einstellungen stehen kommentiert im Block `CONFIG` am Anfang des Skripts.
Haltestellennummern (RBL) nachschlagen: https://till.mabe.at/rbl/

## Fully Kiosk

Advanced Web Settings, "Remove X-Frame, CSP and CORS protection":

```
https://www.wienerlinien.at/*
https://fahrplan.oebb.at/*
https://v6.oebb.transport.rest/*
```

Die Ausnahme verarbeitet keine POST-Anfragen, deshalb laufen alle Abrufe per GET.

## Bereitstellung

Die Seite heisst `index.html`, damit sie mit GitHub Pages direkt unter der Repo-Adresse laeuft.
In Fully Kiosk dann als Startseite die Pages-URL eintragen statt einer lokalen Datei.
