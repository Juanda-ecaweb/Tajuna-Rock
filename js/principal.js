(function () {
  const data = typeof FESTIVAL_DATA !== "undefined" ? FESTIVAL_DATA : null;
  if (!data) {
    return;
  }

  const navItems = [
    ["index.html", "Inicio"],
    ["festival.html", "Festival"],
    ["archivo.html", "Archivo"],
    ["bandas.html", "Bandas"],
    ["publico.html", "Publico"],
    ["prensa.html", "Prensa"],
    ["comerciantes.html", "Comerciantes"],
    ["patrocinadores.html", "Patrocinadores"],
    ["contacto.html", "Contacto"]
  ];

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path && path.length ? path : "index.html";
  }

  function renderHeader() {
    const host = document.querySelector("[data-site-header]");
    if (!host) {
      return;
    }

    const links = navItems
      .map(([href, label]) => {
        const active = currentPage() === href ? " class=\"active\" aria-current=\"page\"" : "";
        return `<li><a href="${href}"${active}>${label}</a></li>`;
      })
      .join("");

    host.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="index.html">${data.nombre}</a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu</button>
          <nav id="main-nav" class="main-nav" aria-label="Navegacion principal">
            <ul>${links}</ul>
          </nav>
        </div>
      </header>
    `;

    const toggle = host.querySelector(".nav-toggle");
    const nav = host.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }
  }

  function renderFooter() {
    const host = document.querySelector("[data-site-footer]");
    if (!host) {
      return;
    }

    const year = new Date().getFullYear();
    const pie = data.media && data.media.identidad && data.media.identidad.pie ? data.media.identidad.pie : {};
    host.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-logos" aria-label="Organización y colaboradores principales">
            <figure class="footer-logo-card" data-media-slot>
              <figcaption>${pie.asociacion && pie.asociacion.etiqueta ? pie.asociacion.etiqueta : "Organiza"}</figcaption>
              <img data-footer-asociacion alt="" />
            </figure>
            <figure class="footer-logo-card" data-media-slot>
              <figcaption>${pie.ayuntamiento && pie.ayuntamiento.etiqueta ? pie.ayuntamiento.etiqueta : "Patrocina y colabora"}</figcaption>
              <img data-footer-ayuntamiento alt="" />
            </figure>
            <figure class="footer-logo-card" data-media-slot>
              <figcaption>${pie.redSky && pie.redSky.etiqueta ? pie.redSky.etiqueta : "Producción"}</figcaption>
              <img data-footer-redsky alt="" />
            </figure>
          </div>
          <p><strong>${data.nombre}</strong> | ${data.fecha} | ${data.lugar}</p>
          <p class="footer-lema">Música, comercio y cultura. Todo en un mismo escenario.</p>
          <p>Entrada ${data.entrada}. información sujeta a actualizacion oficial.</p>
          <p><a href="privacidad.html">Politica de privacidad</a></p>
          <p>&copy; ${year} Tajuña Rock. Sitio publico informativo.</p>
        </div>
      </footer>
    `;
  }

  function bindCoreData() {
    document.querySelectorAll("[data-festival-nombre]").forEach((el) => {
      el.textContent = data.nombre;
    });
    document.querySelectorAll("[data-festival-edicion]").forEach((el) => {
      el.textContent = data.edicion;
    });
    document.querySelectorAll("[data-festival-fecha]").forEach((el) => {
      el.textContent = data.fecha;
    });
    document.querySelectorAll("[data-festival-lugar]").forEach((el) => {
      el.textContent = data.lugar;
    });
    document.querySelectorAll("[data-festival-entrada]").forEach((el) => {
      el.textContent = data.entrada;
    });
  }

  function renderBandCards() {
    const host = document.querySelector("[data-bandas-grid]");
    if (!host) {
      return;
    }

    host.innerHTML = data.bandas
      .map((banda) => {
        const bandClass = banda.nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const imagen = banda.imagen
          ? `<img src="${banda.imagen}" alt="Logo de ${banda.nombre}" class="band-image band-image-img band-${bandClass}" loading="lazy" />`
          : `<div class="band-image" role="img" aria-label="Imagen pendiente de ${banda.nombre}">PENDIENTE: imagen oficial</div>`;

        const descripcion = banda.descripcion ? banda.descripcion : "PENDIENTE";
        const horario = banda.horario ? banda.horario : "PENDIENTE";

        const links = banda.enlaces || {};
        const linkOrder = ["instagram", "facebook", "youtube", "spotify", "bandcamp", "web"];
        const linkLabels = {
          instagram: "Instagram",
          facebook: "Facebook",
          youtube: "YouTube",
          spotify: "Spotify",
          bandcamp: "Bandcamp",
          web: "Web"
        };

        const platformIcon = {
          instagram:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
          facebook:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8h2.7l.5-3h-3.2V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.7v8h2.8z"/></svg>',
          youtube:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12c0 2.2-.3 4-1 4.7-.8.8-2 .8-4.2 1-1.9.1-3 .1-4.8.1s-2.9 0-4.8-.1c-2.2-.2-3.4-.2-4.2-1C2.3 16 2 14.2 2 12s.3-4 1-4.7c.8-.8 2-.8 4.2-1 1.9-.1 3-.1 4.8-.1s2.9 0 4.8.1c2.2.2 3.4.2 4.2 1 .7.7 1 2.5 1 4.7z"/><path fill="#05060b" d="m10 9 6 3-6 3z"/></svg>',
          spotify:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7 10.2c3.8-1 7.8-.7 10.7 1" stroke="#05060b" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M7.8 13c3-.8 6-.5 8.4.8" stroke="#05060b" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M8.6 15.6c2.3-.6 4.6-.4 6.5.6" stroke="#05060b" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
          web:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
          bandcamp:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 16.5 9 7.5H22l-7 9H2z"/></svg>'
        };

        const linkButtons = linkOrder
          .filter((key) => links[key])
          .map(
            (key) =>
              `<a class="band-link-btn is-${key}" href="${links[key]}" target="_blank" rel="noopener"><span class="band-link-icon">${platformIcon[key] || platformIcon.web}</span><span class="band-link-text">${linkLabels[key]}</span></a>`
          )
          .join("");

        const historyBlock = banda.historia
          ? `
            <details class="band-history">
              <summary>Historia ampliada</summary>
              <p>${banda.historia}</p>
            </details>
          `
          : "";

        const linksBlock = linkButtons
          ? `<div class="band-links" aria-label="Enlaces oficiales de ${banda.nombre}">${linkButtons}</div>`
          : "<p><span class=\"tag\">Enlaces oficiales: PENDIENTE</span></p>";

        return `
          <article class="card">
            ${imagen}
            <h3>${banda.nombre}</h3>
            <p><strong>Descripción:</strong> ${descripcion}</p>
            <p><strong>Horario:</strong> ${horario}</p>
            ${linksBlock}
            ${historyBlock}
          </article>
        `;
      })
      .join("");
  }

  function renderPosterSection() {
    const host = document.querySelector("[data-cartel-oficial]");
    if (!host) {
      return;
    }

    const poster = data.media && data.media.cartelOficial ? data.media.cartelOficial : null;
    if (!poster || !poster.ruta) {
      host.innerHTML = `
        <div class="pending-box">
          PENDIENTE: no hay cartel oficial disponible en el proyecto. Añade el archivo en imagenes/cartel/ y actualiza js/datos.js.
        </div>
      `;
      return;
    }

    const alt = poster.alt || "Cartel oficial";
    host.innerHTML = `
      <figure class="poster-stage">
        <img class="poster-image" src="${poster.ruta}" alt="${alt}" loading="eager" />
        <figcaption class="poster-caption">Cartel oficial publicado</figcaption>
      </figure>
    `;

    const image = host.querySelector(".poster-image");
    if (image) {
      image.addEventListener("error", function () {
        host.innerHTML = `
          <div class="pending-box">
            PENDIENTE: no se encontró ${poster.ruta}. Copia el cartel oficial en esa ruta o actualiza js/datos.js.
          </div>
        `;
      });
    }
  }

  function posterLabelFromPath(path) {
    if (!path) {
      return "Edición no indicada";
    }

    const name = path.split("/").pop() || "";
    const editionMatch = name.match(/(?:_|^)(\d+)_edicion/i);
    if (editionMatch && editionMatch[1]) {
      return editionMatch[1] + "ª edición";
    }

    return name;
  }

  let posterLightboxRef = null;
  let posterLightboxItems = [];
  let posterLightboxIndex = 0;

  function ensurePosterLightbox() {
    if (posterLightboxRef) {
      return posterLightboxRef;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "poster-lightbox";
    wrapper.setAttribute("hidden", "hidden");
    wrapper.innerHTML = `
      <div class="poster-lightbox-backdrop" data-lightbox-close></div>
      <div class="poster-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Visor de carteles">
        <button class="poster-lightbox-close" type="button" aria-label="Cerrar" data-lightbox-close>x</button>
        <button class="poster-lightbox-nav prev" type="button" aria-label="Anterior" data-lightbox-prev>&lsaquo;</button>
        <figure class="poster-lightbox-stage">
          <img class="poster-lightbox-image" alt="" />
          <figcaption class="poster-lightbox-caption"></figcaption>
        </figure>
        <button class="poster-lightbox-nav next" type="button" aria-label="Siguiente" data-lightbox-next>&rsaquo;</button>
      </div>
    `;

    document.body.appendChild(wrapper);
    posterLightboxRef = wrapper;

    wrapper.querySelectorAll("[data-lightbox-close]").forEach((node) => {
      node.addEventListener("click", closePosterLightbox);
    });

    const prevButton = wrapper.querySelector("[data-lightbox-prev]");
    if (prevButton) {
      prevButton.addEventListener("click", function () {
        stepPosterLightbox(-1);
      });
    }

    const nextButton = wrapper.querySelector("[data-lightbox-next]");
    if (nextButton) {
      nextButton.addEventListener("click", function () {
        stepPosterLightbox(1);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (!posterLightboxRef || posterLightboxRef.hasAttribute("hidden")) {
        return;
      }

      if (event.key === "Escape") {
        closePosterLightbox();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepPosterLightbox(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepPosterLightbox(1);
      }
    });

    return posterLightboxRef;
  }

  function updatePosterLightbox() {
    if (!posterLightboxRef || !posterLightboxItems.length) {
      return;
    }

    const item = posterLightboxItems[posterLightboxIndex];
    if (!item) {
      return;
    }

    const image = posterLightboxRef.querySelector(".poster-lightbox-image");
    const caption = posterLightboxRef.querySelector(".poster-lightbox-caption");
    if (image) {
      image.setAttribute("src", item.ruta);
      image.setAttribute("alt", item.alt || item.label || "Cartel");
    }
    if (caption) {
      caption.textContent = `${item.label || "Cartel"} (${posterLightboxIndex + 1}/${posterLightboxItems.length})`;
    }
  }

  function openPosterLightbox(index) {
    const lb = ensurePosterLightbox();
    if (!posterLightboxItems.length) {
      return;
    }

    posterLightboxIndex = index;
    if (posterLightboxIndex < 0) {
      posterLightboxIndex = posterLightboxItems.length - 1;
    }
    if (posterLightboxIndex >= posterLightboxItems.length) {
      posterLightboxIndex = 0;
    }

    updatePosterLightbox();
    lb.removeAttribute("hidden");
    document.body.classList.add("lightbox-open");
  }

  function closePosterLightbox() {
    if (!posterLightboxRef) {
      return;
    }

    posterLightboxRef.setAttribute("hidden", "hidden");
    document.body.classList.remove("lightbox-open");
  }

  function stepPosterLightbox(step) {
    if (!posterLightboxItems.length) {
      return;
    }
    posterLightboxIndex = (posterLightboxIndex + step + posterLightboxItems.length) % posterLightboxItems.length;
    updatePosterLightbox();
  }

  function renderPosterGallery() {
    const host = document.querySelector("[data-carteles-galeria]");
    if (!host) {
      return;
    }

    const posters = data.media && data.media.cartelesHistoricos ? data.media.cartelesHistoricos : [];
    if (!posters.length) {
      host.innerHTML = "<div class=\"pending-box\">PENDIENTE: sin carteles históricos publicados.</div>";
      return;
    }

    const officialRoute = data.media && data.media.cartelOficial ? data.media.cartelOficial.ruta : null;
    const items = posters.filter((item) => item && item.ruta && item.ruta !== officialRoute);

    if (!items.length) {
      host.innerHTML = "<div class=\"pending-box\">PENDIENTE: sin carteles históricos publicados.</div>";
      return;
    }

    posterLightboxItems = items.map((item) => ({
      ruta: item.ruta,
      alt: item.alt,
      label: posterLabelFromPath(item.ruta)
    }));

    host.innerHTML = items
      .map((item, index) => {
        const label = posterLabelFromPath(item.ruta);
        const alt = item.alt || "Cartel histórico de Tajuña Rock";
        return `
          <figure class="poster-card" data-poster-card>
            <a class="poster-link" href="${item.ruta}" data-poster-open="${index}" aria-label="Abrir ${label}">
              <img class="poster-thumb" src="${item.ruta}" alt="${alt}" loading="lazy" />
            </a>
            <figcaption class="poster-thumb-caption">${label}</figcaption>
          </figure>
        `;
      })
      .join("");

    host.querySelectorAll(".poster-thumb").forEach((image) => {
      image.addEventListener("error", function () {
        const card = image.closest("[data-poster-card]");
        if (card) {
          card.classList.add("media-missing");
        }
        image.setAttribute("hidden", "hidden");
      });
    });

    host.querySelectorAll("[data-poster-open]").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const value = link.getAttribute("data-poster-open");
        const index = value ? parseInt(value, 10) : 0;
        openPosterLightbox(Number.isNaN(index) ? 0 : index);
      });
    });
  }

  function renderDocumentLists() {
    document.querySelectorAll("[data-doc-section]").forEach((container) => {
      const key = container.getAttribute("data-doc-section");
      const items = (data.documentos && data.documentos[key]) || [];
      if (!items.length) {
        container.innerHTML = "<div class=\"pending-box\">PENDIENTE: sin documentos publicados en esta categoria.</div>";
        return;
      }

      const list = items
        .map((doc) => `<li><a href="${doc.ruta}">${doc.titulo}</a></li>`)
        .join("");
      container.innerHTML = `<ul class="document-list">${list}</ul>`;
    });
  }

  function renderSimpleList(selector, list, emptyText) {
    const host = document.querySelector(selector);
    if (!host) {
      return;
    }
    if (!list || !list.length) {
      host.innerHTML = `<div class="pending-box">${emptyText}</div>`;
      return;
    }
    host.innerHTML = `<ul class="document-list">${list
      .map((item) => `<li><a href="${item.ruta}">${item.titulo}</a></li>`)
      .join("")}</ul>`;
  }

  function renderStructuredData() {
    const script = document.querySelector("[data-event-jsonld]");
    if (!script) {
      return;
    }

    const payload = {
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: data.nombre,
      startDate: "2026-08-29",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: data.lugar,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Morata de Tajuña",
          addressRegion: "Madrid",
          addressCountry: "ES"
        }
      },
      isAccessibleForFree: true,
      performer: data.bandas.map((b) => ({ "@type": "MusicGroup", name: b.nombre }))
    };

    script.textContent = JSON.stringify(payload);
  }

  function fillBandText() {
    const host = document.querySelector("[data-bandas-inline]");
    if (!host) {
      return;
    }
    host.textContent = data.bandas.map((b) => b.nombre).join(" | ");
  }

  function renderHistoryBrief() {
    const host = document.querySelector("[data-historia-breve]");
    if (!host) {
      return;
    }

    const text = data.historia && data.historia.versionBreve ? data.historia.versionBreve : null;
    if (!text) {
      host.innerHTML = '<p class="pending-box">PENDIENTE: sin texto breve publicado.</p>';
      return;
    }

    host.innerHTML = `<p>${text}</p>`;
  }

  function renderFestivalHistory() {
    const host = document.querySelector("[data-historia-festival]");
    if (!host) {
      return;
    }

    const sections = data.historia && data.historia.secciones ? data.historia.secciones : [];
    if (!sections.length) {
      host.innerHTML = '<div class="pending-box">PENDIENTE: historia del festival no publicada.</div>';
      return;
    }

    host.innerHTML = sections
      .map((section) => {
        const title = section && section.titulo ? section.titulo : "Historia";
        const paragraphs = section && section.parrafos ? section.parrafos : [];
        const body = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
        return `
          <article class="history-item">
            <h3>${title}</h3>
            ${body}
          </article>
        `;
      })
      .join("");
  }

  function renderArchivePage() {
    const timelineHost = document.querySelector("[data-archivo-timeline]");
    const introHost = document.querySelector("[data-archivo-intro]");
    const closeHost = document.querySelector("[data-archivo-cierre]");
    const archive = data.archivoHistorico || null;

    if (introHost && archive && archive.intro) {
      introHost.textContent = archive.intro;
    }

    if (closeHost) {
      closeHost.innerHTML = archive && archive.cierre ? `<p>${archive.cierre}</p>` : "<p>PENDIENTE</p>";
    }

    if (!timelineHost) {
      return;
    }

    const editionsRaw = archive && archive.ediciones ? archive.ediciones : [];
    const editions = [...editionsRaw].sort((a, b) => {
      const getSortYear = (value) => {
        if (!value) {
          return 0;
        }
        const matches = String(value).match(/\d{4}/g);
        if (!matches || !matches.length) {
          return 0;
        }
        return Math.max(...matches.map((year) => parseInt(year, 10)));
      };

      return getSortYear(b.ano) - getSortYear(a.ano);
    });
    if (!editions.length) {
      timelineHost.innerHTML = '<div class="pending-box">PENDIENTE: sin archivo histórico publicado.</div>';
      return;
    }

    timelineHost.innerHTML = editions
      .map((edition) => {
        const image = edition.imagen
          ? `<img class="timeline-image" src="${edition.imagen}" alt="Cartel de ${edition.titulo}" loading="lazy" />`
          : '<div class="timeline-image timeline-image-missing" role="img" aria-label="Imagen pendiente">Imagen pendiente</div>';

        const linksSource = [];
        if (edition.imagen) {
          linksSource.push({ etiqueta: "Ver cartel", url: edition.imagen });
        }
        (edition.enlaces || []).forEach((link) => {
          linksSource.push(link);
        });

        const links = linksSource
          .map((link) => {
            if (link.url) {
              const isExternal = /^https?:\/\//i.test(link.url);
              const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
              return `<a class="timeline-link" href="${link.url}"${target}>${link.etiqueta}</a>`;
            }
            return `<span class="timeline-link is-pending" title="${link.nota || "Pendiente"}">${link.etiqueta}</span>`;
          })
          .join("");

        return `
          <article class="timeline-card">
            <div class="timeline-header">
              <p class="timeline-year">${edition.ano || "Sin año"}</p>
              <h3>${edition.titulo || "Edición"}</h3>
            </div>
            <div class="timeline-media">${image}</div>
            <p><strong>Bandas principales:</strong> ${edition.bandas || "Pendiente"}</p>
            <p>${edition.resumen || "Pendiente"}</p>
            <div class="timeline-links" aria-label="Enlaces de ${edition.titulo || "edición"}">${links}</div>
          </article>
        `;
      })
      .join("");
  }

  function renderContactInfo() {
    const emailNodes = document.querySelectorAll("[data-contact-email]");
    emailNodes.forEach((el) => {
      if (data.contacto && data.contacto.emailPublico) {
        el.innerHTML = `<a href="mailto:${data.contacto.emailPublico}">${data.contacto.emailPublico}</a>`;
      } else {
        el.textContent = "PENDIENTE";
      }
    });

    const phoneNodes = document.querySelectorAll("[data-contact-phone]");
    phoneNodes.forEach((el) => {
      el.textContent = data.contacto && data.contacto.telefonoPublico ? data.contacto.telefonoPublico : "PENDIENTE";
    });

    const socialNodes = document.querySelectorAll("[data-contact-social]");
    socialNodes.forEach((el) => {
      const items = [];
      if (data.redes && data.redes.instagram) {
        items.push(`<li><a href="${data.redes.instagram}" target="_blank" rel="noopener">Instagram oficial</a></li>`);
      }
      if (data.redes && data.redes.facebook) {
        items.push(`<li><a href="${data.redes.facebook}" target="_blank" rel="noopener">Facebook oficial</a></li>`);
      }

      el.innerHTML = items.length
        ? `<ul class="document-list">${items.join("")}</ul>`
        : "<div class=\"pending-box\">PENDIENTE: redes no publicadas.</div>";
    });
  }

  function setPressButton(selector, url, fallbackText) {
    const node = document.querySelector(selector);
    if (!node) {
      return;
    }

    if (!url) {
      node.classList.add("is-disabled");
      node.setAttribute("aria-disabled", "true");
      node.setAttribute("tabindex", "-1");
      if (fallbackText) {
        node.textContent = fallbackText;
      }
      node.removeAttribute("href");
      return;
    }

    node.classList.remove("is-disabled");
    node.removeAttribute("aria-disabled");
    node.removeAttribute("tabindex");
    node.setAttribute("href", url);
  }

  function renderPressResources() {
    const press = data.prensa || {};

    setPressButton("[data-press-nota]", press.notaPrensaPdf, "Descargar nota de prensa");
    setPressButton("[data-press-cartel]", press.cartelDescargable, "Descargar cartel oficial");
    setPressButton("[data-press-kit]", press.kitPrensa, "Acceder al kit de prensa");

    const kitNote = document.querySelector("[data-press-kit-note]");
    if (kitNote) {
      kitNote.textContent = press.kitPrensa
        ? "Kit de prensa en modo solo lectura."
        : "PENDIENTE: añade el enlace de Google Drive en modo solo lectura.";
    }

    const contact = press.contacto || {};
    const nameNode = document.querySelector("[data-press-contacto-nombre]");
    if (nameNode) {
      nameNode.textContent = contact.nombre || "PENDIENTE";
    }

    const emailNode = document.querySelector("[data-press-contacto-email]");
    if (emailNode) {
      if (contact.email) {
        emailNode.textContent = contact.email;
        emailNode.setAttribute("href", `mailto:${contact.email}`);
      } else {
        emailNode.textContent = "PENDIENTE";
        emailNode.removeAttribute("href");
      }
    }

    const phoneNode = document.querySelector("[data-press-contacto-telefono]");
    if (phoneNode) {
      const phoneLine = phoneNode.closest("p");
      if (contact.telefono) {
        const digits = contact.telefono.replace(/\s+/g, "");
        phoneNode.textContent = contact.telefono;
        phoneNode.setAttribute("href", `tel:${digits}`);
        if (phoneLine) {
          phoneLine.removeAttribute("hidden");
        }
      } else {
        phoneNode.textContent = "";
        phoneNode.removeAttribute("href");
        if (phoneLine) {
          phoneLine.setAttribute("hidden", "hidden");
        }
      }
    }
  }

  function renderAlternatePoster() {
    const press = data.prensa || {};
    const altPoster = press.cartelAlternativo || null;

    const imageNode = document.querySelector("[data-cartel-mundos-imagen]");
    if (imageNode) {
      if (altPoster && altPoster.imagen) {
        imageNode.setAttribute("src", altPoster.imagen);
        imageNode.setAttribute("alt", altPoster.alt || "Cartel alternativo");
      } else {
        imageNode.setAttribute("hidden", "hidden");
      }
    }

    const textHost = document.querySelector("[data-cartel-mundos-texto]");
    if (!textHost) {
      return;
    }

    if (!altPoster) {
      textHost.innerHTML = '<div class="pending-box">PENDIENTE: contenido del cartel alternativo no publicado.</div>';
      return;
    }

    const title = altPoster.titulo || "Cartel alternativo";
    const paragraphs = Array.isArray(altPoster.parrafos) ? altPoster.parrafos : [];
    const body = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
    const summary = altPoster.resumenCorto ? `<p class="alt-poster-summary">${altPoster.resumenCorto}</p>` : "";
    const quote = altPoster.lema ? `<p class="alt-poster-quote">${altPoster.lema}</p>` : "";

    textHost.innerHTML = `
      <h3>${title}</h3>
      ${body}
      ${summary}
      ${quote}
    `;
  }

  function setupMailtoForms() {
    const forms = document.querySelectorAll("[data-mailto-form]");
    if (!forms.length) {
      return;
    }

    const targetEmail = "tajunarock@gmail.com";
    const subjectByType = {
      contacto: "Consulta web publica - Tajuña Rock",
      prensa: "Solicitud de prensa/acreditacion - Tajuña Rock",
      grupos: "Propuesta de banda - Tajuña Rock",
      comerciantes: "Solicitud de puesto externo - Tajuña Rock"
    };

    forms.forEach((form) => {
      const formType = form.getAttribute("data-form-type") || "contacto";
      const feedback = form.querySelector("[data-form-feedback]");
      const subjectInput = form.querySelector("[data-form-subject]");
      const submitButton = form.querySelector("button[type='submit']");
      const defaultButtonText = submitButton ? submitButton.textContent : "Enviar";

      if (subjectInput) {
        subjectInput.value = subjectByType[formType] || subjectByType.contacto;
      }

      if (!targetEmail) {
        form.classList.add("is-disabled");
        if (submitButton) {
          submitButton.disabled = true;
        }
        if (feedback) {
          feedback.textContent = "PENDIENTE: no hay correo publico configurado para enviar formularios.";
        }
        return;
      }

      form.removeAttribute("action");
      form.setAttribute("method", "post");

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Enviando...";
        }

        if (feedback) {
          feedback.textContent = "Enviando el formulario desde la web...";
        }

        const payload = Object.fromEntries(new FormData(form).entries());
        const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`;

        fetch(endpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            _subject: subjectInput ? subjectInput.value : subjectByType[formType] || subjectByType.contacto,
            _captcha: "false",
            _template: "table",
            ...payload
          })
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("No se pudo enviar");
            }
            if (feedback) {
              feedback.textContent = "Formulario enviado correctamente. Gracias por contactar.";
            }
            form.reset();
            if (subjectInput) {
              subjectInput.value = subjectByType[formType] || subjectByType.contacto;
            }
          })
          .catch(() => {
            if (feedback) {
              feedback.textContent = "No se ha podido enviar el formulario. Prueba de nuevo en unos instantes o contacta por correo electrónico.";
            }
          })
          .finally(() => {
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = defaultButtonText;
            }
          });
      });
    });
  }

  function renderZonaTajunaRock() {
    const host = document.querySelector("[data-zona-tajuna-rock]");
    if (!host) {
      return;
    }

    if (!data.zonaTajunaRock || !data.zonaTajunaRock.length) {
      host.innerHTML = "<div class=\"pending-box\">PENDIENTE</div>";
      return;
    }

    host.innerHTML = `<ul>${data.zonaTajunaRock.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  function setMediaImage(selector, source) {
    document.querySelectorAll(selector).forEach((image) => {
      const fallback = image.closest("[data-media-slot]");
      if (!source || !source.ruta) {
        if (fallback) {
          fallback.classList.add("media-missing");
        }
        return;
      }

      image.setAttribute("src", source.ruta);
      image.setAttribute("alt", source.alt || "Imagen oficial");
      image.addEventListener("error", function () {
        if (fallback) {
          fallback.classList.add("media-missing");
        }
        image.setAttribute("hidden", "hidden");
      });
    });
  }

  function renderIdentityMedia() {
    const identidad = data.media && data.media.identidad ? data.media.identidad : null;
    setMediaImage("[data-media-main-logo]", identidad ? identidad.logoPrincipal : null);
    setMediaImage("[data-media-logo-mascot]", identidad ? identidad.logoConMascota : null);
    setMediaImage("[data-media-mascot]", identidad ? identidad.mascota : null);
    const pie = identidad && identidad.pie ? identidad.pie : null;
    setMediaImage("[data-footer-asociacion]", pie ? pie.asociacion : null);
    setMediaImage("[data-footer-ayuntamiento]", pie ? pie.ayuntamiento : null);
    setMediaImage("[data-footer-redsky]", pie ? pie.redSky : null);
  }

  renderHeader();
  renderFooter();
  bindCoreData();
  renderBandCards();
  renderPosterSection();
  renderPosterGallery();
  renderDocumentLists();
  renderSimpleList("[data-prensa-fotos]", data.prensa.fotosOficiales, "PENDIENTE: no hay fotografias oficiales publicadas.");
  renderSimpleList("[data-prensa-logos]", data.prensa.logos, "PENDIENTE: no hay logos publicos disponibles.");
  fillBandText();
  renderHistoryBrief();
  renderFestivalHistory();
  renderArchivePage();
  renderContactInfo();
  renderPressResources();
  renderAlternatePoster();
  setupMailtoForms();
  renderZonaTajunaRock();
  renderIdentityMedia();
  renderStructuredData();
})();

