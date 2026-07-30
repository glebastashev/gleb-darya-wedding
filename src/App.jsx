import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  CalendarPlus,
  Check,
  CheckCircle,
  Copy,
  Gift,
  MapPin,
  MusicNotes,
  NavigationArrow,
  PaperPlaneTilt,
  SpeakerHigh,
  SpeakerSlash,
  Sparkle,
  Wine,
  X,
} from "@phosphor-icons/react";
import { guestDisplayName } from "./guest.js";
import envelopeCover from "./assets/envelope-cover.jpg";
import envelopeCoverDesktop from "./assets/envelope-cover-desktop.jpg";
import gardenHero from "./assets/heritage-garden-hero.jpg";
import sculptureSunset from "./assets/sculpture-sunset.jpg";
import couplePhoto from "./assets/couple-gleb-darya.jpeg";
import venueInterior from "./assets/wine-time-interior-collage.jpeg";
import venueGrounds from "./assets/wine-time-grounds-collage.jpeg";
import dressCodeReference from "./assets/dress-code-reference.jpeg";

const EVENT_DATE = new Date("2026-10-10T16:00:00+06:00");
const TWO_GIS_URL = "https://2gis.kz/almaty/geo/70000001102829936";
const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/hJ2YmmWSiUGt2dnw6?g_st=it";
const YOUTUBE_TRACK_ID = "izGwDsrQ1eQ";
const MUSIC_START_SECONDS = 48;

const schedule = [
  {
    time: "16:00",
    title: "Сбор гостей и welcome",
    text: "Встречаемся, обнимаемся и поднимаем первый бокал.",
  },
  {
    time: "17:00",
    title: "Церемония",
    text: "Скажем друг другу самое главное в кругу близких.",
  },
  {
    time: "18:00",
    title: "Праздничный ужин",
    text: "Тёплые слова, любимые люди и длинный красивый стол.",
  },
  {
    time: "20:30",
    title: "Первый танец",
    text: "Тот самый момент, ради которого мы включим музыку громче.",
  },
  {
    time: "21:00",
    title: "Торт",
    text: "Сладкая часть вечера и ещё один повод собраться вместе.",
  },
  {
    time: "22:00",
    title: "Танцы",
    text: "Удобная обувь приветствуется. Вечер продолжится на танцполе.",
  },
];

const alcoholOptions = [
  "Красное вино",
  "Белое вино",
  "Игристое",
  "Виски",
  "Водка",
  "Коньяк",
  "Не пью",
];

const palette = [
  ["Шоколадный", "#412715"],
  ["Кофейный", "#79502e"],
  ["Оливковый", "#5f6040"],
  ["Бежевый", "#c4a886"],
  ["Кремовый", "#eadbc6"],
  ["Нежно-голубой", "#aebfce"],
];

function useCountdown() {
  const calculate = () => {
    const difference = Math.max(0, EVENT_DATE.getTime() - Date.now());
    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor((difference / 3_600_000) % 24),
      minutes: Math.floor((difference / 60_000) % 60),
      seconds: Math.floor((difference / 1_000) % 60),
    };
  };

  const [countdown, setCountdown] = useState(calculate);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(calculate()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return countdown;
}

function downloadCalendarEvent() {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gleb and Darya//Wedding Invitation//RU",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:gleb-darya-wedding-20261010@invite",
    "DTSTAMP:20260730T120000Z",
    "DTSTART:20261010T100000Z",
    "DTEND:20261010T170000Z",
    "SUMMARY:Свадьба Глеба и Дарьи",
    "LOCATION:Wine Time Restaurant, Алматы",
    "DESCRIPTION:Сбор гостей в 16:00. Церемония в 17:00.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "gleb-darya-wedding.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <header className="section-heading reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
      <Sparkle className="flourish" size={17} weight="light" aria-hidden="true" />
    </header>
  );
}

function Envelope({ onOpen, opening }) {
  return (
    <div
      className={`envelope-screen ${opening ? "is-opening" : ""}`}
      style={{
        "--envelope-cover": `url(${envelopeCover})`,
        "--envelope-cover-desktop": `url(${envelopeCoverDesktop})`,
      }}
    >
      <div className="envelope-image" aria-hidden="true" />
      <div className="envelope-flap" aria-hidden="true" />
      <button
        className="seal-button"
        type="button"
        onClick={onOpen}
        aria-label="Открыть приглашение"
        disabled={opening}
      >
        <span className="seal-monogram">
          <span>Г</span>
          <small>&amp;</small>
          <span>Д</span>
        </span>
      </button>
      <p className="open-hint">
        <span>Коснитесь печати</span>
        <ArrowDown size={18} weight="thin" aria-hidden="true" />
      </p>
    </div>
  );
}

function MapChoice({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="map-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="icon-button modal-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={20} weight="light" />
        </button>
        <p className="eyebrow">Маршрут</p>
        <h3 id="map-title">Где открыть карту?</h3>
        <div className="map-options">
          <a href={TWO_GIS_URL} target="_blank" rel="noreferrer">
            <NavigationArrow size={20} weight="light" />
            Открыть в 2GIS
          </a>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer">
            <MapPin size={20} weight="light" />
            Открыть в Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

function AppContent({ musicOn, setMusicOn }) {
  const countdown = useCountdown();
  const [mapOpen, setMapOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const guest = useMemo(
    () => guestDisplayName(window.location.search),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const copyContact = async (value) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1_600);
  };

  const submitRsvp = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const drinks = data.getAll("drinks");
    const message = [
      "Ответ на приглашение Глеба и Дарьи",
      `Гость: ${data.get("fullName")}`,
      `Количество гостей: ${data.get("guestCount")}`,
      `Напитки: ${drinks.length ? drinks.join(", ") : "не указано"}`,
      guest ? `Персональная ссылка: ${guest}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted(true);
    const telegramUrl = `https://t.me/daryalukasheva?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="invitation">
      {musicOn ? (
        <iframe
          className="music-frame"
          title="Careless Whisper, George Michael"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_TRACK_ID}?autoplay=1&start=${MUSIC_START_SECONDS}&controls=0&loop=1&playlist=${YOUTUBE_TRACK_ID}`}
          allow="autoplay"
        />
      ) : null}

      <button
        className="floating-music"
        type="button"
        onClick={() => setMusicOn((current) => !current)}
        aria-label={musicOn ? "Выключить музыку" : "Включить музыку"}
      >
        {musicOn ? (
          <SpeakerHigh size={21} weight="light" />
        ) : (
          <SpeakerSlash size={21} weight="light" />
        )}
      </button>

      <section
        className="hero"
        style={{ "--hero-image": `url(${gardenHero})` }}
        id="top"
      >
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          {guest ? <p className="guest-line">Приглашение для {guest}</p> : null}
          <p className="hero-kicker">Мы женимся</p>
          <h1>
            Глеб <span>&amp;</span> Дарья
          </h1>
          <div className="hero-date">
            <span>10</span>
            <i>октября</i>
            <span>2026</span>
          </div>
          <p className="hero-place">Алматы · Wine Time Restaurant</p>
          <a className="scroll-link" href="#welcome" aria-label="Листать дальше">
            <ArrowDown size={24} weight="thin" />
          </a>
        </div>
      </section>

      <section className="welcome-section paper-section" id="welcome">
        <div className="paper-noise" aria-hidden="true" />
        <div className="content-narrow">
          <SectionHeading eyebrow="Дорогие гости" title="Будьте рядом с нами" />
          <div className="welcome-grid reveal">
            <figure className="portrait-frame">
              <img
                src={couplePhoto}
                alt="Глеб и Дарья"
                width="720"
                height="1280"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="welcome-copy">
              <p>
                Мы будем счастливы провести этот день рядом с вами. Собираемся
                в Алматы, чтобы сказать друг другу главное, обнять любимых
                людей и устроить вечер, который захочется вспоминать.
              </p>
              <p>
                Ждём вас 10 октября в Wine Time Restaurant. Сбор гостей
                начинается в 16:00, церемония в 17:00.
              </p>
              <span className="signature">Глеб и Дарья</span>
            </div>
          </div>

          <div className="countdown reveal" aria-label="До свадьбы осталось">
            {[
              ["дней", countdown.days],
              ["часов", countdown.hours],
              ["минут", countdown.minutes],
              ["секунд", countdown.seconds],
            ].map(([label, value]) => (
              <div className="countdown-item" key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <button className="primary-button reveal" type="button" onClick={downloadCalendarEvent}>
            <CalendarPlus size={20} weight="light" />
            Добавить в календарь
          </button>
        </div>
      </section>

      <section className="schedule-section">
        <div className="content-narrow">
          <SectionHeading
            eyebrow="План дня"
            title="Как всё пройдёт"
            intro="Начинаем в четыре и оставляем вечер свободным для любви, тостов и танцев."
          />
          <div className="timeline">
            {schedule.map((item, index) => (
              <article className="timeline-item reveal" key={item.time}>
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-copy">
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="venue-section paper-section" id="venue">
        <div className="content-wide">
          <SectionHeading
            eyebrow="Место встречи"
            title="Wine Time Restaurant"
            intro="Алматы. Тёплый сад, классическая архитектура и ужин среди сосен."
          />
          <div className="venue-gallery reveal">
            <img
              src={venueGrounds}
              alt="Территория и архитектура Wine Time Restaurant"
              width="1138"
              height="1280"
              loading="lazy"
              decoding="async"
            />
            <img
              src={venueInterior}
              alt="Интерьер и сад Wine Time Restaurant"
              width="1024"
              height="1280"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="venue-actions reveal">
            <button className="primary-button" type="button" onClick={() => setMapOpen(true)}>
              <MapPin size={20} weight="light" />
              Построить маршрут
            </button>
            <button className="secondary-button" type="button" onClick={downloadCalendarEvent}>
              <CalendarPlus size={20} weight="light" />
              Сохранить дату
            </button>
          </div>
        </div>
      </section>

      <section
        className="gift-section"
        style={{ "--sculpture-image": `url(${sculptureSunset})` }}
      >
        <div className="gift-shade" aria-hidden="true" />
        <div className="gift-card reveal">
          <Gift size={27} weight="light" />
          <p className="eyebrow">Подарки</p>
          <h2>Лучший подарок поместится в конверт</h2>
          <p>
            Мы будем рады денежному подарку, который поможет исполнить наши
            общие планы.
          </p>
        </div>
      </section>

      <section className="dress-section paper-section" id="dress-code">
        <div className="content-wide">
          <SectionHeading
            eyebrow="Дресс-код"
            title="Элегантность в природных оттенках"
            intro="Поддержите палитру вечера: шоколадный, кофейный, оливковый, бежевый, кремовый и нежно-голубой."
          />
          <div className="palette reveal" aria-label="Цветовая палитра">
            {palette.map(([name, color]) => (
              <div className="palette-item" key={name}>
                <span style={{ backgroundColor: color }} aria-hidden="true" />
                <small>{name}</small>
              </div>
            ))}
          </div>
          <figure className="dress-reference reveal">
            <img
              src={dressCodeReference}
              alt="Примеры образов и тканей для свадебного дресс-кода"
              width="1024"
              height="1536"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="content-narrow">
          <SectionHeading
            eyebrow="Ваш ответ"
            title="Мы вас очень ждём"
            intro="Заполните анкету до 15 августа. Отказы временно не принимаются."
          />
          <form className="rsvp-form reveal" onSubmit={submitRsvp}>
            <label>
              <span>Имя и фамилия</span>
              <input
                type="text"
                name="fullName"
                placeholder="Например, Анна Иванова"
                defaultValue={guest}
                required
              />
            </label>

            <label>
              <span>Количество гостей</span>
              <select name="guestCount" defaultValue="1" required>
                {[1, 2, 3, 4, 5].map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend>
                <Wine size={20} weight="light" />
                Что будете пить?
              </legend>
              <div className="drink-grid">
                {alcoholOptions.map((drink) => (
                  <label className="check-option" key={drink}>
                    <input type="checkbox" name="drinks" value={drink} />
                    <span className="custom-check">
                      <Check size={14} weight="bold" />
                    </span>
                    {drink}
                  </label>
                ))}
              </div>
            </fieldset>

            <button className="primary-button submit-button" type="submit">
              <PaperPlaneTilt size={20} weight="light" />
              Отправить ответ Дарье
            </button>

            {submitted ? (
              <p className="success-message" role="status">
                <CheckCircle size={20} weight="fill" />
                Анкета собрана. Осталось отправить сообщение в Telegram.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="contact-section paper-section">
        <div className="content-narrow">
          <SectionHeading
            eyebrow="Есть вопрос?"
            title="Напишите нам"
            intro="Поможем с маршрутом, одеждой и любыми деталями вечера."
          />
          <div className="contact-grid reveal">
            <article className="contact-card">
              <p>Дарья</p>
              <a href="https://t.me/daryalukasheva" target="_blank" rel="noreferrer">
                @daryalukasheva
              </a>
              <a href="https://wa.me/77077628263" target="_blank" rel="noreferrer">
                +7 707 762 82 63
              </a>
              <button type="button" onClick={() => copyContact("@daryalukasheva")}>
                {copied === "@daryalukasheva" ? (
                  <CheckCircle size={18} weight="fill" />
                ) : (
                  <Copy size={18} weight="light" />
                )}
                Скопировать Telegram
              </button>
            </article>

            <article className="contact-card">
              <p>Глеб</p>
              <a href="https://t.me/glebastashev" target="_blank" rel="noreferrer">
                @glebastashev
              </a>
              <a href="https://wa.me/995558184186" target="_blank" rel="noreferrer">
                +995 558 184 186
              </a>
              <button type="button" onClick={() => copyContact("@glebastashev")}>
                {copied === "@glebastashev" ? (
                  <CheckCircle size={18} weight="fill" />
                ) : (
                  <Copy size={18} weight="light" />
                )}
                Скопировать Telegram
              </button>
            </article>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <MusicNotes size={24} weight="light" />
        <p className="footer-names">Глеб &amp; Дарья</p>
        <p>10 октября 2026 · Алматы</p>
        <a href="#top">Вернуться в начало</a>
      </footer>

      {mapOpen ? <MapChoice onClose={() => setMapOpen(false)} /> : null}
    </main>
  );
}

export function App() {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const openInvitation = () => {
    if (opening) return;
    setOpening(true);
    setMusicOn(true);
    window.setTimeout(() => {
      setOpened(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 1_650);
  };

  return (
    <>
      <AppContent musicOn={musicOn} setMusicOn={setMusicOn} />
      {!opened ? <Envelope onOpen={openInvitation} opening={opening} /> : null}
    </>
  );
}
