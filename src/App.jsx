import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppleLogo,
  ArrowDown,
  ArrowUp,
  CalendarPlus,
  GoogleLogo,
  Check,
  CheckCircle,
  MapPin,
  NavigationArrow,
  PaperPlaneTilt,
  SpeakerHigh,
  SpeakerSlash,
  TelegramLogo,
  WhatsappLogo,
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
// Скрытый YouTube-плеер не играет на iOS: Safari требует, чтобы play() был
// вызван прямо в обработчике касания, и не воспроизводит медиа в невидимых
// элементах. Локальный файл эти оба ограничения снимает.
const MUSIC_FILE = `${import.meta.env.BASE_URL}music.mp3`;
const ENVELOPE_EXIT_MS = 1_300;
// Ответы уходят в Google Форму, привязанную к таблице. Секретов здесь нет:
// адрес формы публичный, подделать или сломать через него нечего.
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdUr9mQUOcpi5SCmbxYxfVb50mwYSuwM4f9RRC0n82rd3ufpw/formResponse";
const FORM_FIELD = {
  fullName: "entry.111740657",
  guestCount: "entry.1082734327",
  drinks: "entry.1609562271",
  guest: "entry.739561572",
};
// Настоящий файл вместо blob: iOS открывает такую ссылку системным окном
// «Добавить в календарь», а не показывает текст.
const ICS_URL = `${import.meta.env.BASE_URL}gleb-darya-wedding.ics`;
const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" +
  encodeURIComponent("Свадьба Глеба и Дарьи") +
  "&dates=20261010T100000Z/20261010T170000Z" +
  "&location=" +
  encodeURIComponent("Wine Time Restaurant, Алматы") +
  "&details=" +
  encodeURIComponent("Сбор гостей в 16:00. Церемония в 17:00.");

const schedule = [
  {
    time: "16:00",
    title: "Сбор гостей",
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
    text: "Горячие блюда, тёплые слова и тосты от самых близких.",
  },
  {
    time: "19:00",
    timeEnd: "до 23:00",
    title: "Развлечения и танцы",
    text: "А ещё торт, кальяны и свадебные конкурсы.",
  },
  {
    time: "23:00",
    title: "Окончание вечера",
    text: "Семейный очаг и прощание с гостями.",
  },
];

const contacts = [
  {
    name: "Дарья",
    telegram: "@daryalukasheva",
    whatsapp: "77077628263",
    phone: "+7 707 762 82 63",
  },
  {
    name: "Глеб",
    telegram: "@glebastashev",
    whatsapp: "995558184186",
    phone: "+995 558 184 186",
  },
];

const alcoholOptions = [
  "Розовое вино",
  "Белое вино",
  "Prosecco",
  "Водка",
  "Виски",
  "Вишнёвая наливка",
  "Лимончелло",
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

function CalendarChoice({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="map-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-title"
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
        <p className="eyebrow">Напоминание</p>
        <h3 id="calendar-title">Куда сохранить дату?</h3>
        <div className="map-options">
          <a href={ICS_URL}>
            <AppleLogo size={20} weight="fill" />
            Календарь iPhone
          </a>
          <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer">
            <GoogleLogo size={20} weight="bold" />
            Google Календарь
          </a>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <header className="section-heading reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
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
        <ArrowUp size={18} weight="thin" aria-hidden="true" />
        <span>Коснитесь печати</span>
      </p>
    </div>
  );
}

/* Банкнота нарисована вектором: на мелком размере гравюрная сетка и розетки
   читаются чётче любого растрового рендера. */
function BillFace() {
  const leaves = Array.from({ length: 18 }, (_, index) => index * 20);
  const rays = Array.from({ length: 24 }, (_, index) => index * 15);

  return (
    <svg className="bill-art" viewBox="0 0 258 100" role="presentation">
      <defs>
        <linearGradient id="billPaper" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#e7efdc" />
          <stop offset="0.45" stopColor="#cfdcc0" />
          <stop offset="1" stopColor="#adc19b" />
        </linearGradient>
        <radialGradient id="billEdge" cx="0.5" cy="0.5" r="0.72">
          <stop offset="0.55" stopColor="#2f4d2c" stopOpacity="0" />
          <stop offset="1" stopColor="#2f4d2c" stopOpacity="0.22" />
        </radialGradient>
        <pattern
          id="billWeaveA"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0V4" stroke="#2f4d2c" strokeWidth="0.45" opacity="0.32" />
        </pattern>
        <pattern
          id="billWeaveB"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <path d="M0 0V4" stroke="#2f4d2c" strokeWidth="0.4" opacity="0.24" />
        </pattern>
        <radialGradient id="billVignette" cx="0.46" cy="0.36" r="0.72">
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#6f8c67" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="billSheen" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.38" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="258" height="100" fill="url(#billPaper)" />
      <rect width="258" height="100" fill="url(#billWeaveA)" />
      <rect width="258" height="100" fill="url(#billWeaveB)" />

      <rect width="258" height="100" fill="url(#billEdge)" />

      <g fill="none" stroke="#2b4728">
        <rect x="3" y="3" width="252" height="94" strokeWidth="1.4" opacity="0.9" />
        <rect x="6.5" y="6.5" width="245" height="87" strokeWidth="0.55" opacity="0.6" />
        <rect
          x="10"
          y="10"
          width="238"
          height="80"
          strokeWidth="0.5"
          strokeDasharray="1.6 1.6"
          opacity="0.5"
        />
      </g>

      {[
        [40, 50],
        [218, 50],
      ].map(([cx, cy]) => (
        <g key={cx} transform={`translate(${cx} ${cy})`}>
          <g fill="none" stroke="#2b4728" opacity="0.58">
            {rays.map((angle) => (
              <path key={angle} d="M0 -21V-15" strokeWidth="0.5" transform={`rotate(${angle})`} />
            ))}
            <circle r="21.5" strokeWidth="0.5" />
            <circle r="14.5" strokeWidth="0.5" />
            <circle r="12" strokeWidth="0.9" />
          </g>
          <circle r="12" fill="#eaf0e2" opacity="0.55" />
          <text
            y="4.4"
            textAnchor="middle"
            fill="#28421f"
            fontFamily="Cormorant Garamond, serif"
            fontSize="13"
            fontWeight="600"
          >
            123
          </text>
        </g>
      ))}

      <g transform="translate(129 50)">
        <ellipse rx="30" ry="37" fill="url(#billVignette)" />
        <g fill="none" stroke="#2b4728" opacity="0.7">
          <ellipse rx="30" ry="37" strokeWidth="1" />
          <ellipse rx="26.5" ry="33.5" strokeWidth="0.45" />
        </g>
        <g fill="none" stroke="#33512b" opacity="0.6">
          {leaves.map((angle) => (
            <ellipse
              key={angle}
              cy="-22"
              rx="2"
              ry="4.6"
              strokeWidth="0.55"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
        <text
          y="9"
          textAnchor="middle"
          fill="#25401d"
          fontFamily="Cormorant Garamond, serif"
          fontSize="26"
          fontWeight="600"
        >
          $
        </text>
      </g>

      <g fill="none" stroke="#2f4d2c" opacity="0.3" strokeWidth="0.4">
        <path d="M78 27C88 22 96 22 104 26" />
        <path d="M154 26C162 22 170 22 180 27" />
        <path d="M78 73C88 78 96 78 104 74" />
        <path d="M154 74C162 78 170 78 180 73" />
      </g>

      <rect width="258" height="100" fill="url(#billSheen)" />
    </svg>
  );
}

function GiftEnvelope() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`gift-reveal ${open ? "is-open" : ""}`}>
      <p className="gift-hint">Нажмите на конверт</p>
      <button
        className="gift-envelope"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Закрыть конверт" : "Открыть конверт"}
      >
        <span className="gift-envelope__liner" aria-hidden="true" />
        <span className="gift-envelope__bill" aria-hidden="true">
          <BillFace />
        </span>
        <span className="gift-envelope__side gift-envelope__side--left" aria-hidden="true" />
        <span className="gift-envelope__side gift-envelope__side--right" aria-hidden="true" />
        <span className="gift-envelope__pocket" aria-hidden="true" />
        <span className="gift-envelope__flap" aria-hidden="true" />
        <span className="gift-envelope__seal" aria-hidden="true">
          <span className="gift-envelope__monogram">
            Г<small>&amp;</small>Д
          </span>
        </span>
      </button>
      <p className="gift-punchline" aria-hidden={!open}>
        Лучше всего деньги :)
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

function AppContent({ musicOn, hasAudioFile, onToggleMusic, revealed }) {
  const countdown = useCountdown();
  const [mapOpen, setMapOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
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

  const submitRsvp = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const drinks = data.getAll("drinks");
    const fullName = data.get("fullName");
    const guestCount = data.get("guestCount");

    const body = new URLSearchParams();
    body.append(FORM_FIELD.fullName, fullName);
    body.append(FORM_FIELD.guestCount, guestCount);
    drinks.forEach((drink) => body.append(FORM_FIELD.drinks, drink));
    if (guest) body.append(FORM_FIELD.guest, guest);

    // no-cors: ответ Google отдаёт непрозрачным, прочитать его нельзя, но
    // запись проходит. keepalive держит запрос живым, пока открывается Telegram.
    fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      mode: "no-cors",
      body,
      keepalive: true,
    }).catch(() => {});

    const message = [
      "Ответ на приглашение Глеба и Дарьи",
      `Гость: ${fullName}`,
      `Количество гостей: ${guestCount}`,
      `Напитки: ${drinks.length ? drinks.join(", ") : "не указано"}`,
      guest ? `Персональная ссылка: ${guest}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted(true);
    // Окно открываем сразу в обработчике клика, иначе браузер сочтёт его
    // всплывающим и заблокирует.
    const telegramUrl = `https://t.me/daryalukasheva?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className={`invitation ${revealed ? "is-revealed" : ""}`}>
      {musicOn && !hasAudioFile ? (
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
        onClick={onToggleMusic}
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
        </div>
        <a className="scroll-link" href="#welcome" aria-label="Листать дальше">
          <ArrowDown size={24} weight="thin" />
        </a>
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
                В этот день рядом с нами будут только родные и самые близкие
                друзья. Если вам пришло это приглашение, значит ваше
                присутствие для нас особенно ценно!
              </p>
              <p>
                Этот вечер мы задумали камерным и ярким одновременно. Вас ждёт
                ужин за одним большим столом, живая музыка, танцы и
                развлечения. Мы подготовили всё для того, чтобы этот день
                запомнился вам на всю жизнь.
              </p>
            </div>
          </div>

          <p className="countdown-title reveal">До нашей встречи</p>

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

          <button
            className="primary-button button-sm section-cta reveal"
            type="button"
            onClick={() => setCalendarOpen(true)}
          >
            <CalendarPlus size={18} weight="light" />
            Добавить в календарь
          </button>
        </div>
      </section>

      <section className="schedule-section">
        <div className="content-narrow">
          <SectionHeading eyebrow="План дня" title="Как всё пройдёт" />
          <div className="timeline">
            {schedule.map((item, index) => (
              <article className="timeline-item reveal" key={item.time}>
                <div className="timeline-time">
                  {item.time}
                  {item.timeEnd ? <span>{item.timeEnd}</span> : null}
                </div>
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-copy">
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  {item.text ? <p>{item.text}</p> : null}
                </div>
              </article>
            ))}
          </div>
          <a className="secondary-button button-sm section-cta reveal" href="#rsvp">
            <PaperPlaneTilt size={18} weight="light" />
            Подтвердить присутствие
          </a>
        </div>
      </section>

      <section className="venue-section paper-section" id="venue">
        <div className="content-wide">
          <SectionHeading
            eyebrow="Место встречи"
            title="Wine Time Restaurant"
            intro="Вокруг мощные горы, на территории столетние сосны, занесённые в Красную книгу. Особняк с античными бюстами и колоннами, вдали от городского шума."
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
            <a className="secondary-button" href="#rsvp">
              <PaperPlaneTilt size={20} weight="light" />
              Ответить на приглашение
            </a>
          </div>
        </div>
      </section>

      <section
        className="gift-section"
        style={{ "--sculpture-image": `url(${sculptureSunset})` }}
      >
        <div className="gift-shade" aria-hidden="true" />
        <div className="gift-card reveal">
          <p className="eyebrow">Wishlist</p>
          <h2>Что дарить?</h2>
          <GiftEnvelope />
        </div>
      </section>

      <section className="dress-section paper-section" id="dress-code">
        <div className="content-wide">
          <SectionHeading
            eyebrow="Дресс-код"
            title="Элегантность в природных оттенках"
            intro="Точно попадать в палитру необязательно. Нам будет приятно, если вы придёте в элегантных нарядах натуральных оттенков."
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
            intro="Заполните анкету до 15 августа — так мы успеем всё подготовить."
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
                <span>
                  Что будете пить?
                  <small>(можно выбрать несколько)</small>
                </span>
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
              Отправить ответ молодожёнам
            </button>

            {submitted ? (
              <p className="success-message" role="status">
                <CheckCircle size={20} weight="fill" />
                Ответ записан. Осталось нажать отправку в Telegram, сообщение
                уже готово.
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
            {contacts.map((contact) => (
              <article className="contact-card" key={contact.telegram}>
                <p className="contact-name">{contact.name}</p>

                <a
                  className="contact-link"
                  href={`https://t.me/${contact.telegram.slice(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TelegramLogo size={19} weight="fill" aria-hidden="true" />
                  {contact.telegram}
                </a>

                <a
                  className="contact-link"
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
                  {contact.phone}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p className="footer-names">Глеб &amp; Дарья</p>
        <p>10 октября 2026 · Алматы</p>
        <a href="#top">Вернуться в начало</a>
      </footer>

      {mapOpen ? <MapChoice onClose={() => setMapOpen(false)} /> : null}
      {calendarOpen ? (
        <CalendarChoice onClose={() => setCalendarOpen(false)} />
      ) : null}
    </main>
  );
}

export function App() {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [hasAudioFile, setHasAudioFile] = useState(false);
  const audioRef = useRef(null);

  // Переключаем звук синхронно внутри клика: асинхронный вызов play() iOS уже
  // не считает пользовательским действием и глушит.
  const setMusic = (next) => {
    const audio = audioRef.current;
    const usable = audio && !audio.error && audio.readyState > 0;

    if (!usable) {
      setMusicOn(next);
      return;
    }

    if (next) {
      audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
      return;
    }

    audio.pause();
    setMusicOn(false);
  };

  useEffect(() => {
    if (opened) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened]);

  const openInvitation = () => {
    if (opening) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpening(true);
    setMusic(true);
    window.setTimeout(() => setOpened(true), ENVELOPE_EXIT_MS);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_FILE}
        loop
        preload="auto"
        onLoadedMetadata={() => setHasAudioFile(true)}
        onError={() => setHasAudioFile(false)}
      />
      <AppContent
        musicOn={musicOn}
        hasAudioFile={hasAudioFile}
        onToggleMusic={() => setMusic(!musicOn)}
        revealed={opening || opened}
      />
      {!opened ? <Envelope onOpen={openInvitation} opening={opening} /> : null}
    </>
  );
}
