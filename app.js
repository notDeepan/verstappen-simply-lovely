const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const menu = $('#menu-panel');
const film = $('#film-dialog');
const player = $('#film-player');
const ambient = $('[data-ambient]');
const motionButton = $('.ambient-toggle');
const heroVideo = $('#hero-video');
const motionControls = $$('[data-motion-toggle]');
let heroVisible = true;
let motionPaused = reduced.matches;
let ambientVisible = false;
let studio;
let studioLoading;
let returnFocus;

function syncAmbient() {
  const allowed = !motionPaused && !document.hidden && !document.querySelector('dialog[open]');
  for (const [video, visible] of [[ambient, ambientVisible], [heroVideo, heroVisible]]) {
    if (allowed && visible) video.play().catch(error => {
      if (video === heroVideo && error.name !== 'AbortError' && heroVisible && !motionPaused) {
        $('.hero-motion-toggle').setAttribute('aria-label', 'Play background video');
        $('.hero-motion-toggle span').textContent = '▷';
      }
    });
    else video.pause();
  }
  motionControls.forEach(button => button.setAttribute('aria-pressed', String(motionPaused)));
  motionButton.textContent = motionPaused ? 'Play motion ▷' : 'Pause motion Ⅱ';
  $('.hero-motion-toggle').setAttribute('aria-label', motionPaused ? 'Play background video' : 'Pause background video');
  $('.hero-motion-toggle span').textContent = motionPaused ? '▷' : 'Ⅱ';
  $('.marquee > div').style.animationPlayState = motionPaused ? 'paused' : 'running';
}
// Reflect real playback events; a loaded poster never counts as video playback.
for (const video of [heroVideo, ambient]) {
  video.muted = true;
  video.addEventListener('playing', () => video.dataset.playback = 'playing');
  video.addEventListener('pause', () => video.dataset.playback = 'paused');
}
function openDialog(dialog) {
  returnFocus = document.activeElement;
  dialog.showModal();
  document.body.classList.add('modal-open');
  syncAmbient();
}
$$('dialog').forEach(dialog => {
  $('[data-close]', dialog)?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (dialog === film) player.pause();
    if (dialog.id === 'studio-dialog') studio?.pause();
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
    syncAmbient();
    returnFocus?.focus({ preventScroll: true });
  });
});
$('.menu-toggle').addEventListener('click', () => {
  openDialog(menu);
  $('.menu-toggle').setAttribute('aria-expanded', 'true');
});
$$('a[href^="#"]', menu).forEach(link => link.addEventListener('click', () => menu.close()));
$('#open-credits').addEventListener('click', () => openDialog($('#credits-dialog')));
$$('[data-film]').forEach(button => button.addEventListener('click', () => {
  const isHero = button.dataset.film === 'hero';
  player.src = isHero ? 'media/hero.mp4' : 'media/dutchman.mp4';
  player.poster = isHero ? 'media/hero-poster.jpg' : 'media/dutchman-poster.jpg';
  $('#film-title').textContent = isHero ? 'A GLIMPSE INSIDE THE DRIVE' : 'THE INSTINCT / ALWAYS ON';
  openDialog(film);
  player.play().catch(() => {});
}));
new IntersectionObserver(entries => { ambientVisible = entries[0].isIntersecting; syncAmbient(); }, { threshold: .1 }).observe(ambient);
new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; syncAmbient(); }, { threshold: .05 }).observe(heroVideo);
motionControls.forEach(button => button.addEventListener('click', () => {
  const blockedHero = button.classList.contains('hero-motion-toggle') && heroVideo.paused && !motionPaused;
  motionPaused = blockedHero ? false : !motionPaused;
  syncAmbient();
}));
reduced.addEventListener('change', () => { motionPaused = reduced.matches; syncAmbient(); });
document.addEventListener('visibilitychange', () => { syncAmbient(); if (document.hidden) player.pause(); });
syncAmbient();

// Accessible year navigation. Without JS every chapter remains readable.
const tabs = $$('[role="tab"]');
const moments = $$('.moment');
let activeMoment = 0;
function selectMoment(index, focus = false) {
  activeMoment = (index + tabs.length) % tabs.length;
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === activeMoment)); tab.tabIndex = i === activeMoment ? 0 : -1; });
  moments.forEach((panel, i) => { panel.hidden = i !== activeMoment; panel.classList.toggle('active', i === activeMoment); });
  $('#moment-count').textContent = `0${activeMoment + 1} / 04 — ${$('small', tabs[activeMoment]).textContent}`;
  if (focus) tabs[activeMoment].focus();
  if (window.gsap && !reduced.matches) gsap.fromTo($('.moment-content', moments[activeMoment]), {opacity: .2, y: 15}, {opacity: 1, y: 0, duration: .5, ease: 'power2.out', overwrite: true});
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectMoment(i));
  tab.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    selectMoment(e.key === 'Home' ? 0 : e.key === 'End' ? 3 : activeMoment + (e.key === 'ArrowRight' ? 1 : -1), true);
  });
});
$('#moment-next').addEventListener('click', () => selectMoment(activeMoment + 1));
$('#moment-prev').addEventListener('click', () => selectMoment(activeMoment - 1));
selectMoment(0);

const gallery = $$('.gallery-item');
let visiblePhotos = [...gallery];
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + visiblePhotos.length) % visiblePhotos.length;
  const item = visiblePhotos[currentPhoto];
  $('#lightbox-image').src = item.dataset.image;
  $('#lightbox-image').alt = $('img', item).alt;
  $('#lightbox-caption').textContent = item.dataset.caption;
}
gallery.forEach(item => item.addEventListener('click', () => { showPhoto(visiblePhotos.indexOf(item)); openDialog($('#lightbox')); }));
$('#photo-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
$('#photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
$('#lightbox').addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(currentPhoto + (e.key === 'ArrowRight' ? 1 : -1)); } });
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filter;
  $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  gallery.forEach(item => item.hidden = value !== 'all' && item.dataset.category !== value);
  visiblePhotos = gallery.filter(item => !item.hidden);
  $('.gallery').classList.toggle('is-filtered', value !== 'all');
  window.ScrollTrigger?.refresh();
}));

// The detailed branded model is mounted only on explicit visitor interaction.
// Closing the dialog removes its iframe to release network/GPU work.
function selectHelmetView(reference) {
  $('#helmet-interactive').setAttribute('aria-pressed', String(!reference));
  $('#helmet-reference').setAttribute('aria-pressed', String(reference));
  studio?.setReference(reference);
}
$('#open-studio').addEventListener('click', async () => {
  openDialog($('#studio-dialog'));
  try {
    studioLoading ??= import('./helmet.js').then(({ createHelmetStudio }) => createHelmetStudio($('#studio-view')));
    studio = await studioLoading;
    if ($('#studio-dialog').open) studio.resume();
  } catch (error) {
    console.error('Helmet viewer unavailable:', error);
    $('#studio-status').textContent = 'The viewer is unavailable. The reference image and original model link remain available.';
    studioLoading = undefined;
  }
});
$('#helmet-interactive').addEventListener('click', () => selectHelmetView(false));
$('#helmet-reference').addEventListener('click', () => selectHelmetView(true));
$('#reset-helmet').addEventListener('click', () => { selectHelmetView(false); studio?.reset(); });

// Progressive motion: content starts visible and remains readable if GSAP fails.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero h1 > span', { y: 50, opacity: 0, duration: 1.2, stagger: .12, ease: 'power3.out' });
    gsap.from('.hero-kicker, .hero-description', { opacity: 0, y: 14, duration: .9, stagger: .12, delay: .35, ease: 'power2.out' });
    gsap.to('.hero-video', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.reveal').forEach(el => gsap.from(el, { y: 32, opacity: .15, duration: .9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } }));
    gsap.fromTo('.helmet-beauty', { y: 35, rotate: -4 }, { y: -20, rotate: 2, ease: 'none', scrollTrigger: { trigger: '.helmet-stage', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.to('.instinct video', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.instinct', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
}
window.addEventListener('pagehide', () => studio?.pause());
