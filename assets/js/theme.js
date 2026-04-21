// Theme toggle + simple scroll reveal
(function(){
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  function applyTheme(dark){
    const icon = toggle.querySelector('.theme-icon');
    const label = toggle.querySelector('.theme-label');
    body.classList.add('is-dark');
    if(dark){
      body.classList.add('is-dark');
      if(icon) icon.textContent = '☀️';
      if(label) label.textContent = 'Light';
    } else {
      body.classList.remove('is-dark');
      if(icon) icon.textContent = '🌙';
      if(label) label.textContent = 'Dark';
    }
  }

  // Force dark mode only (disable light mode)
  applyTheme(true);
  body.classList.add('is-dark');
  // hide toggle UI if present
  if(toggle){
    try{ toggle.style.display = 'none'; }catch(e){}
  }

  // Carousel + Lightbox for #showcase
  function initCarouselAndLightbox(){
    const carousel = document.getElementById('showcase-carousel');
    const galleryImgs = document.querySelectorAll('#showcase .gallery img');

    // If we still have legacy images, build a simple carousel container
    if(!carousel && galleryImgs.length){
      const wrap = document.createElement('div');
      wrap.id = 'showcase-carousel';
      wrap.className = 'carousel';
      const slides = document.createElement('div'); slides.className = 'slides';
      galleryImgs.forEach(img=>{
        const s = document.createElement('div'); s.className = 'slide';
        const nimg = img.cloneNode(true);
        s.appendChild(nimg);
        slides.appendChild(s);
      });
      wrap.appendChild(slides);
      const prev = document.createElement('button'); prev.className = 'carousel-arrow prev'; prev.setAttribute('aria-label','Previous'); prev.innerHTML='‹';
      const next = document.createElement('button'); next.className = 'carousel-arrow next'; next.setAttribute('aria-label','Next'); next.innerHTML='›';
      const dots = document.createElement('div'); dots.className = 'carousel-dots';
      wrap.appendChild(prev); wrap.appendChild(next); wrap.appendChild(dots);
      const parent = document.querySelector('#showcase .gallery').parentNode;
      parent.replaceChild(wrap, document.querySelector('#showcase .gallery'));
    }

    const c = document.getElementById('showcase-carousel');
    if(!c) return;

    const slides = c.querySelectorAll('.slide');
    const dotsWrap = c.querySelector('.carousel-dots');
    let idx = 0;

    // build dots
    slides.forEach((s,i)=>{
      const d = document.createElement('button'); d.className='dot'; d.setAttribute('aria-label','Go to slide '+(i+1));
      d.addEventListener('click', ()=>{ goTo(i, true); });
      dotsWrap.appendChild(d);
    });

    const update = ()=>{
      c.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active', i===idx));
      slides.forEach((s,i)=> s.style.transform = `translateX(${(i-idx)*100}%)`);
    };

    function goTo(i, openLightbox){
      idx = (i + slides.length) % slides.length;
      update();
      if(openLightbox) openLightboxAt(idx);
    }

    // arrows
    c.querySelector('.carousel-arrow.prev').addEventListener('click', ()=>goTo(idx-1));
    c.querySelector('.carousel-arrow.next').addEventListener('click', ()=>goTo(idx+1));

    // keyboard
    c.addEventListener('keydown', (e)=>{ if(e.key==='ArrowLeft') goTo(idx-1); if(e.key==='ArrowRight') goTo(idx+1); });

    update();

    // Lightbox element (single, reused)
    let lb = document.querySelector('.lightbox');
    if(!lb){
      lb = document.createElement('div'); lb.className='lightbox'; lb.setAttribute('aria-hidden','true');
      const inner = document.createElement('div'); inner.className='lightbox-inner';
      const close = document.createElement('button'); close.className='lightbox-close'; close.setAttribute('aria-label','Close'); close.textContent='✕';
      const img = document.createElement('img'); inner.appendChild(close); inner.appendChild(img); lb.appendChild(inner); document.body.appendChild(lb);
      // close handlers
      close.addEventListener('click', ()=>{ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); });
      lb.addEventListener('click', (ev)=>{ if(ev.target === lb) { lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); } });
    }

    function openLightboxAt(i){
      const s = slides[i];
      const im = s.querySelector('img');
      const lbimg = lb.querySelector('img');
      lbimg.src = im.dataset.large || im.src;
      lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
    }

    // clicking a slide opens lightbox
    slides.forEach((s, i)=>{ s.addEventListener('click', ()=> openLightboxAt(i)); });
  }
  initCarouselAndLightbox();

  // Simple scroll reveal using IntersectionObserver
  const reveals = document.querySelectorAll('.major, .features article, .spotlight, .statistics li');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>{r.classList.add('reveal'); io.observe(r);});
  } else {
    // fallback: just show
    reveals.forEach(r=>r.classList.add('in-view'));
  }
})();
