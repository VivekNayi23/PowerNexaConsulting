const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));
document.getElementById('year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
function handleFormSubmit(event){
  event.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = 'Thank you! This demo form is ready for email integration.';
  event.target.reset();
  return false;
}
