import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { guestDisplayName, titleCaseGuest } from "../src/guest.js";

test("formats a guest slug for a personal invitation", () => {
  assert.equal(titleCaseGuest("anna-ivanova"), "Anna Ivanova");
  assert.equal(titleCaseGuest("дарья_лукашева"), "Дарья Лукашева");
});

test("reads guest from the invitation query string", () => {
  assert.equal(guestDisplayName("?guest=gleb-astasev"), "Gleb Astasev");
  assert.equal(guestDisplayName(""), "");
});

test("keeps the required wedding details in the invitation", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  for (const requiredText of [
    "10 октября 2026",
    "Wine Time Restaurant",
    "Сбор гостей и welcome",
    "Церемония",
    "Не пью",
    "15 августа",
    "daryalukasheva",
  ]) {
    assert.match(source, new RegExp(requiredText));
  }
});
