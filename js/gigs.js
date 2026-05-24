// Fetches data/gigs.json and renders upcoming gigs as flip cards into #gig-cards

const gigCards = document.getElementById('gig-cards');

fetch('data/gigs.json')
  .then(res => res.json())
  .then(renderGigs)
  .catch(() => {
    gigCards.innerHTML = '<p class="gig-desc col-span-full">Keine Auftritte gefunden.</p>';
  });

function renderGigs(gigs) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = gigs.filter(g => g.date >= today).slice(0, 5);

  if (upcoming.length === 0) {
    gigCards.innerHTML = '<p class="gig-desc col-span-full">Keine kommenden Auftritte.</p>';
    return;
  }

  gigCards.innerHTML = upcoming.map(buildCard).join('');

  // Toggle flip on click — works for both mouse and touch
  gigCards.querySelectorAll('.card-container').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  });
}

function buildCard(gig) {
  const dateLabel = formatDate(gig.date);

  if (gig.ticketed && !gig.ticketUrl) {
    console.warn(`Gig "${gig.id}": ticketed=true aber ticketUrl fehlt.`);
  }

  const description = gig.description
    ? `<p class="gig-desc mt-1">${gig.description}</p>`
    : '';

  const ticketLink = (gig.ticketed && gig.ticketUrl)
    ? `<a href="${gig.ticketUrl}" target="_blank" rel="noopener noreferrer"
          class="text-red-500 font-bold text-sm hover:underline"
          onclick="event.stopPropagation()">Tickets →</a>`
    : '';

  const organizerLink = gig.organizerUrl
    ? `<a href="${gig.organizerUrl}" target="_blank" rel="noopener noreferrer"
          class="text-white underline text-sm hover:text-red-400"
          onclick="event.stopPropagation()">Veranstalter →</a>`
    : '';

  return `
    <div class="card-container" role="button" aria-label="${gig.eventName} — zum Umdrehen klicken" tabindex="0">
      <div class="card-inner">

        <!-- Front: gig info -->
        <div class="card-front">
          <div>
            <p class="gig-date">${dateLabel} · ${gig.time} Uhr</p>
            <p class="gig-name mt-1">${gig.eventName}</p>
            <p class="gig-venue mt-1">${gig.venue}, ${gig.city}</p>
            ${description}
          </div>
          <div class="flex items-center justify-between mt-2">
            ${ticketLink}
            <span class="text-xs text-gray-300 ml-auto">umdrehen</span>
          </div>
        </div>

        <!-- Back: organizer / links -->
        <div class="card-back">
          <div>
            <p class="gig-name">${gig.eventName}</p>
            <p class="gig-venue mt-1 opacity-70">${gig.city}</p>
          </div>
          <div class="flex flex-col gap-2">
            ${organizerLink}
            ${ticketLink}
          </div>
          <p class="gig-hint">schliessen</p>
        </div>

      </div>
    </div>`;
}

function formatDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('de-CH', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
