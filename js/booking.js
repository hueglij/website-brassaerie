document.addEventListener('DOMContentLoaded', () => {

  // ── Modal ────────────────────────────────────────────────────
  const modal    = document.getElementById('booking-modal');
  const backdrop = document.getElementById('booking-backdrop');
  const trigger  = document.getElementById('booking-trigger');
  const closeBtn = document.getElementById('booking-close');

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click',  e => { e.preventDefault(); openModal(); });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── Form conditional logic ───────────────────────────────────
  const eventTypeInputs = document.querySelectorAll('input[name="eventType"]');
  const ticketingSection = document.getElementById('ticketing-section');
  const ticketedInputs   = document.querySelectorAll('input[name="ticketed"]');
  const ticketUrlSection = document.getElementById('ticket-url-section');
  const ticketUrlInput   = document.getElementById('ticketUrl');

  document.getElementById('eventDate').min = new Date().toISOString().split('T')[0];

  function updateTicketingVisibility() {
    const isPublic = document.querySelector('input[name="eventType"]:checked')?.value === 'public';
    ticketingSection.classList.toggle('hidden', !isPublic);
    ticketedInputs.forEach(input => { input.required = isPublic; });
    if (!isPublic) {
      ticketUrlSection.classList.add('hidden');
      ticketUrlInput.required = false;
    }
  }

  function updateTicketUrlVisibility() {
    const isTicketed = document.querySelector('input[name="ticketed"]:checked')?.value === 'yes';
    ticketUrlSection.classList.toggle('hidden', !isTicketed);
    ticketUrlInput.required = isTicketed;
  }

  eventTypeInputs.forEach(input => input.addEventListener('change', updateTicketingVisibility));
  ticketedInputs.forEach(input  => input.addEventListener('change', updateTicketUrlVisibility));
});
