tailwind.config = {
  theme: { extend: { fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'sans-serif'] } } }
};
document.documentElement.classList.add('js');

const TOOLS = [
  ['cleaner', 'Cleaner', 'Clear temporary files, caches and leftovers from apps and Windows.'],
  ['files', 'Files Analyzer', 'See which folders and files use the most space, and remove them.'],
  ['registry', 'Registry Fixer', 'Remove invalid entries left behind by uninstalled software.'],
  ['shortcuts', 'Shortcuts Fixer', 'Find shortcuts that point to missing files and delete them.'],
  ['Uninstall', 'Uninstall Manager', 'Remove programs you no longer use from one list.'],
  ['Startup', 'Startup Manager', 'Turn off apps that slow down boot so Windows starts sooner.'],
  ['Duplicate', 'Duplicate Finder', 'Find identical files and keep only the copy you want.'],
  ['Tracks', 'Tracks Eraser', 'Wipe browsing and usage traces apps keep on your PC.']
];

addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero headline
  const h1 = document.querySelector('[data-intro]');
  if (h1) h1.innerHTML = h1.textContent.trim().split(/\s+/).map((w, i) => `<span class="iw"><span style="--i:${i}">${w}</span></span>`).join(' ');

  // Tool cards
  const row = document.querySelector('[data-cards]');
  row.innerHTML = TOOLS.map(([icon, name, text], i) => `
    <article style="--i:${i}" class="rc flex h-[26rem] w-[17.5rem] shrink-0 flex-col card rounded-[28px] p-7 sm:w-[19rem]">
      <div><h3 class="text-2xl font-bold tracking-tight">${name}</h3><p class="mt-3 text-[15px] leading-relaxed text-white/60">${text}</p></div>
      <div class="flex flex-1 items-center justify-center pb-3 pt-4"><img src="assets/Icons/${icon}.png" alt="" class="h-40 w-40 object-contain"></div>
    </article>`).join('');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    row.classList.add('in'); o.disconnect();
    setTimeout(() => row.querySelectorAll('.rc').forEach(c => c.classList.remove('rc')), 2400);
  }, { threshold: 0.25 }).observe(row);
  const step = () => row.firstElementChild.offsetWidth + 20;
  document.querySelector('[data-prev]').onclick = () => row.scrollBy({ left: -step() * 2, behavior: 'smooth' });
  document.querySelector('[data-next]').onclick = () => row.scrollBy({ left: step() * 2, behavior: 'smooth' });

  // Statement words
  const p = document.querySelector('[data-words]');
  p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ');
  const words = [...p.children];

  const stage = document.querySelector('[data-stage]');
  const wordsStage = document.querySelector('[data-words-stage]');
  const progress = el => {
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  };

  function tick() {
    if (reduce) return;
    stage.style.setProperty('--p', progress(stage).toFixed(4));
    const wp = progress(wordsStage) * 1.15;
    words.forEach((w, i) => w.classList.toggle('on', wp > i / words.length));
  }
  if (reduce) words.forEach(w => w.classList.add('on'));
  addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true });
  addEventListener('resize', tick);
  tick();

  // Reveal + count-up
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(c => {
      const to = +c.dataset.count; if (reduce) return;
      const t0 = performance.now();
      (function f(t) { const k = Math.min(1, (t - t0) / 1400); c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
    });
    io.unobserve(e.target);
  }), { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});
