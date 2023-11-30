
export function shareApp(medium: string) {
  const exportUrl = `${window.location.origin}/?utm_medium=${medium}`;

  if (navigator.share) {
    navigator.share({
      title: 'BBS Vanced (Stundenplan App)',
      text: 'Klicke auf diesen Link um die BBS Vanced Stundenplan App zu nutzen!',
      url: exportUrl
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(exportUrl);
    alert(
      'Der Link zur App wurde kopiert! Schicke ihn jemandem damit er die App auch nutzen kann.'
    );
  } else {
    prompt(
      'Kopiere diesen Link und schicke ihn jemandem damit er die App auch nutzen kann.',
      exportUrl
    );
  }
}
