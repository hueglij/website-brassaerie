// Mobile tap: toggle portrait on columns that have one
if (window.matchMedia('(hover: none)').matches) {
  document.querySelectorAll('.member-col.has-portrait').forEach(col => {
    col.addEventListener('click', () => col.classList.toggle('is-open'));
  });
}
