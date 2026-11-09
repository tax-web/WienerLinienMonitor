/* ============================================================================
   WienerLinienMonitor - EINSTELLUNGEN

   Diese Datei enthält alle Einstellungen der Abfahrtsanzeige. Die Anzeige
   selbst (index.html) muss für Anpassungen nicht geöffnet werden.

   Aufbau: Die Anzeige besteht aus Kästen ("panels"). Ein Kasten zeigt eine
   Haltestelle in einer Richtung. Im Hochformat stehen die Kästen unter-
   einander, im Querformat nebeneinander. Die Reihenfolge in der Liste unten
   ist die Reihenfolge am Bildschirm. Passen nicht alle auf den Bildschirm,
   lässt sich die Seite nach unten scrollen.

   HALTESTELLENNUMMER FINDEN (Wiener Linien)
   Jeder Steig hat eine eigene Nummer, die RBL. Sie legt zugleich die
   Richtung fest. Nachschlagen unter https://till.mabe.at/rbl/ : Haltestelle
   suchen, Richtung wählen, die Zahl bei "RBL/StopId" übernehmen.

   BAHNHOFSNUMMER FINDEN (ÖBB)
   Die Bahn verwendet eine eigene Nummer, die evaId. Ist sie unbekannt,
   bei "query" den Bahnhofsnamen eintragen und "stopId" leer lassen.

   SCHREIBWEISE
   - Texte stehen zwischen geraden Anführungszeichen: "Am Spiegeln"
   - Zahlen ohne Anführungszeichen: maxRows: 3
   - Zwischen zwei Einträgen steht ein Beistrich.
   - Fehlt ein Beistrich oder eine Klammer, zeigt die Anzeige einen Hinweis
     "config.js fehlt oder enthält einen Fehler" statt der Abfahrten.
   - Alles hinter // ist Kommentar und wird ignoriert.

   Nach einer Änderung: Datei im Repo speichern. GitHub Pages liefert die
   neue Fassung nach einigen Minuten aus, dann am Tablet neu laden.
   ============================================================================ */

const CONFIG = {

  // ---- Allgemein -----------------------------------------------------------

  // Abrufintervall in Sekunden. 30 ist ein guter Wert, darunter werden die
  // Datenquellen unnötig belastet.
  refreshSeconds: 30,

  // Abfahrten, die früher als in so vielen Minuten kommen, werden
  // ausgeblendet. Einzelne Kästen können einen eigenen Wert setzen.
  hideBelowMinutes: 1,

  // Nachtruhe: in diesem Zeitfenster werden keine Daten geholt.
  // Uhrzeiten als "SS:MM". Zum Abschalten beide auf dieselbe Uhrzeit setzen.
  quietHours: { from: "00:00", to: "05:30" },

  // Überwachung, in Minuten.
  // staleMinutes : so lange darf der letzte erfolgreiche Abruf her sein,
  //                danach erscheint ein gelber Hinweis im Kasten
  // frozenMinutes: so lange darf sich der Inhalt eines Kastens nicht ändern,
  //                danach erscheint "Tafel unverändert seit ..."
  staleMinutes: 10,
  frozenMinutes: 45,

  // Wetter in der Kopfzeile (Open-Meteo, kostenlos, ohne Schlüssel).
  // lat/lon: Standort. everyMinutes: Abrufintervall.
  // Zum Abschalten: weather: null
  weather: { lat: 48.1473, lon: 16.2888, everyMinutes: 10 },

  // Nur zum Einrichten: true blendet in jeder Zeile die RBL des Steigs ein.
  showRbl: false,

  // Ausweichquelle für die Bahn, falls die Hauptquelle ausfällt.
  // Nicht ändern.
  restBase: "https://v6.oebb.transport.rest",


  // ---- Kästen --------------------------------------------------------------
  // Reihenfolge hier = Reihenfolge am Bildschirm.
  // Alle möglichen Einträge sind am Ende dieser Datei beschrieben.

  panels: [

    // Bus Am Spiegeln, Richtung Atzgersdorf, mit Anschluss an die S-Bahn
    { id: "spiegeln", title: "Am Spiegeln", tag: "Richtung Atzgersdorf",
      source: "wl", stopIds: ["1648"],
      maxRows: 3, combine: 2, rowsPerLine: 1,
      trafficInfo: true,
      connect: {
        panel: "atzgersdorf",          // Kasten mit den Zügen
        towards: "",                   // leer = "outbound" des S-Bahn-Kastens
        walkMinutes: 5,                // Fußweg zur Bushaltestelle
        rideStopIds: ["1734", "3754"], // Ankunftshaltestellen in Atzgersdorf
                                       // 1734 = 60A, 3754 = 56A
        rideMinutes: { "58B": 5, "60A": 3, "56A": 3, other: 4 },
        transferMinutes: 3,            // Umstieg Bus zum Bahnsteig
        showFrom: "00:00",             // Markierung nur in diesem Zeitfenster
        showUntil: "07:30"
      } },

    // S-Bahn Atzgersdorf (ÖBB)
    { id: "atzgersdorf", title: "Atzgersdorf", tag: "S-Bahn",
      source: "scotty", stopId: "001192304", query: "Atzgersdorf (Wien)",
      skip: "^(bus|tram|u\\d)", products: "0000110000000000",
      fetchJourneys: 40, maxRows: 6,
      outbound: "mödling|modling|baden|liesing|wr[. ]*neustadt|perchtoldsdorf|leobersdorf" },

    // Straßenbahn 60 Franz-Asenbauer-Gasse, Richtung Westbahnhof
    { id: "asenbauer", title: "Franz-Asenbauer-Gasse", tag: "Richtung Westbahnhof",
      source: "wl", stopIds: ["1630"], maxRows: 2, combine: 2 },

    // Bus 58B Eberstorferweg, Richtung Hietzing
    { id: "eberstorferweg", title: "Eberstorferweg", tag: "58B Richtung Hietzing",
      source: "wl", stopIds: ["3786"], line: "^58B$", maxRows: 1, combine: 2 }

    // Weitere Kästen hier anhängen. Vorher hinter die schließende
    // geschweifte Klammer des letzten Kastens einen Beistrich setzen.
  ]
};


/* ============================================================================
   ALLE EINTRÄGE EINES KASTENS

   Pflicht
   id          interner Name, einmalig, erscheint nicht am Bildschirm
   title       große Überschrift
   source      "wl" = Wiener Linien, "scotty" = ÖBB

   Darstellung
   tag         kleiner Text neben der Überschrift, z. B. die Richtung
   maxRows     Anzahl der Zeilen im Kasten
   combine     mehrere Abfahrten derselben Linie in eine Zeile, z. B. 2.
               combine 2 und maxRows 2 = zwei Zeilen mit je zwei Abfahrten
   rowsPerLine höchstens so viele Zeilen je Linie. 1 = jede Linie genau eine
               Zeile, damit eine häufige Linie keine seltene verdrängt
   hideBelowMinutes  eigener Wert für diesen Kasten statt des allgemeinen
   planMark    false = Fahrten ohne Echtzeit nicht mit "Soll" kennzeichnen

   Wiener Linien (source "wl")
   stopIds     eine oder mehrere RBL, z. B. ["1648"] oder ["1648", "1649"]
   stop        Haltestellenname statt RBL, z. B. "Am Spiegeln". Fragt alle
               Steige ab, also beide Richtungen, braucht meist "towards"
   trafficInfo true = Störungsmeldungen der Linien dieses Kastens einblenden

   Filter (beide Quellen)
   line        Liniennummer, z. B. "^58B$". ^ und $ bedeuten "genau diese",
               damit "^60$" nicht auch den 60A erfasst
   towards     Fahrtziel, z. B. "atzgersdorf|alterlaa". | heißt "oder",
               Groß- und Kleinschreibung ist egal

   ÖBB (source "scotty")
   stopId      Bahnhofsnummer (evaId). Leer = Suche über "query"
   query       Bahnhofsname, wie ihn die ÖBB schreibt
   skip        was ausgeblendet wird, z. B. "^(bus|tram|u\\d)"
   products    Vorfilter der ÖBB. "0000110000000000" = S-Bahn und Regional-
               züge. Besser nicht ändern
   fetchJourneys  Rohdatenmenge vor dem Filtern
   outbound    Ziele stadtauswärts, sie bekommen eine grüne Liniennummer.
               Alle anderen gelten als stadteinwärts (blau)
   inbound     Gegenstück zu outbound, falls lieber die Stadtziele gelistet
               werden. Nur eines von beiden verwenden

   Anschluss (connect, nur bei Bus-Kästen)
   Markiert den spätesten Bus, mit dem der früheste Zug Richtung Süden
   erreicht wird, und diesen Zug im S-Bahn-Kasten (grüner Balken).
   panel            id des S-Bahn-Kastens
   towards          Ziele der gewünschten Zugrichtung. Leer = "outbound"
                    des S-Bahn-Kastens
   walkMinutes      Fußweg zur Bushaltestelle. Frühere Busse werden nicht
                    markiert, aber weiter angezeigt
   rideStopIds      RBL der Ankunftshaltestellen. Die Fahrzeit wird dann
                    laufend aus Echtzeitdaten gemessen
   rideMinutes      geschätzte Fahrzeit, wenn die Messung nicht greift.
                    Eine Zahl für alle Linien oder je Linie:
                    { "58B": 5, "60A": 3, other: 4 }
   transferMinutes  Umsteigezeit vom Bus zum Bahnsteig
   showFrom, showUntil  Zeitfenster der Markierung als "SS:MM"
   ============================================================================ */
