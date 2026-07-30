export function titleCaseGuest(value) {
  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toLocaleUpperCase("ru-RU")}${part.slice(1)}`)
    .join(" ");
}

export function guestDisplayName(search = "") {
  const params = new URLSearchParams(search);
  const guest = params.get("guest");
  if (!guest) return "";
  return titleCaseGuest(decodeURIComponent(guest));
}
