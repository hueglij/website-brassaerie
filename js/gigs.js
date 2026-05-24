// Fetches data/gigs.json and renders upcoming gigs into #gig-list

const gigList = document.getElementById('gig-list');

fetch('data/gigs.json')
  .then(res => res.json())
  .then(renderGigs)
  .catch(() => {
    gigList.innerHTML = '<li class="gig-desc">Keine Auftritte gefunden.</li>';
  });

function renderGigs(gigs) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = gigs.filter(g => g.date >= today);

  if (upcoming.length === 0) {
    gigList.innerHTML = '<li class="gig-desc">Keine kommenden Auftritte.</li>';
    return;
  }

  gigList.innerHTML = upcoming.map(buildGigItem).join('');
}

function buildGigItem(gig) {
  const dateLabel = formatDate(gig.date);

  // Ticket button — only rendered when ticketed AND ticketUrl is present
  if (gig.ticketed && !gig.ticketUrl) {
    console.warn(`Gig "${gig.id}" ist ticketpflichtig, aber ticketUrl fehlt.`);
  }
  const ticketBtn = (gig.ticketed && gig.ticketUrl)
    ? `<a href="${gig.ticketUrl}" target="_blank" rel="noopener noreferrer"
          class="text-xs text-red-600 font-bold hover:underline">Tickets →</a>`
    : '';

  const description = gig.description
    ? `<p class="gig-desc">${gig.description}</p>`
    : '';

  return `
    <li class="border-b border-gray-200 pb-4">
      <p class="gig-date">${dateLabel}</p>
      <p class="gig-name">${gig.eventName}</p>
      <p class="gig-venue">${gig.venue}, ${gig.city}</p>
      ${description}
      ${ticketBtn}
    </li>`;
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
