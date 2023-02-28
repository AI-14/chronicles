export const timeDiff = (timestamp: number) => {
  const minutes = 60 * 1000;
  const hours = minutes * 60;
  const days = hours * 24;
  const months = days * 30;

  const currentTime = Date.now();
  const elapsedTime = currentTime - timestamp;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (elapsedTime < minutes) {
    return rtf.format(-Math.floor(elapsedTime / 1000), "seconds");
  } else if (elapsedTime < hours) {
    return rtf.format(-Math.floor(elapsedTime / minutes), "minutes");
  } else if (elapsedTime < days) {
    return rtf.format(-Math.floor(elapsedTime / hours), "hours");
  } else if (elapsedTime < months) {
    return rtf.format(-Math.floor(elapsedTime / days), "days");
  } else {
    return rtf.format(-Math.floor(elapsedTime / months), "years");
  }
};
