
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isStandalonePWA() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

function iosSettingsImportCheck() {
  if (localStorage.getItem("iosPwaMessageShown") === "true") {
    return
  }

  if (isIOS() && isStandalonePWA()) {
    alert("Du hast die Stundenplan App zum Homescreen geaddet. Wenn deine Einstellungen fehlen: App in Safari öffnen > Einstellungen > ganz oben rechts > Einstellungen teilen > Link hier in den Einstellungen unter 'Aus Link laden' wieder einfügen")
    localStorage.setItem("iosPwaMessageShown", "true")
  }
}

function installPrompt() {
  if (isStandalonePWA()) return
  alert("Füge diese App zum Startbildschirm hinzu")

}

export function runPWAChecks() {
  iosSettingsImportCheck()
  // installPrompt()
}
