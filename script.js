document.addEventListener('DOMContentLoaded', function(){
  // year in footer
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Base Swiggy & Zomato links
  var SWIGGY_BASE = 'https://www.swiggy.com/direct/brand/536412?source=swiggy-direct&subSource=generic';
  var ZOMATO_BASE = 'https://link.zomato.com/xqzv/rshare?id=95007053305635b0';

  // Attach URLs with tracking to each product card (if any on the page)
  document.querySelectorAll('.card').forEach(function(card){
    var name = card.getAttribute('data-product-name') || '';
    var encoded = encodeURIComponent(name.trim());

    var swiggyUrl = SWIGGY_BASE +
      '&utm_source=website&utm_medium=menu_card&utm_campaign=swiggy_redirect&utm_content=' +
      encoded;

    var zomatoUrl = ZOMATO_BASE +
      '&utm_source=website&utm_medium=menu_card&utm_campaign=zomato_redirect&utm_content=' +
      encoded;

    card.querySelectorAll('.swiggy-link').forEach(function(a){
      a.href = swiggyUrl;
    });
    card.querySelectorAll('.zomato-link').forEach(function(a){
      a.href = zomatoUrl;
    });
  });

  // Order section big buttons with tracking (home & about)
  ['order-swiggy', 'about-swiggy'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) {
      el.href = SWIGGY_BASE +
        '&utm_source=website&utm_medium=order_section&utm_campaign=swiggy_redirect';
    }
  });
  ['order-zomato', 'about-zomato'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) {
      el.href = ZOMATO_BASE +
        '&utm_source=website&utm_medium=order_section&utm_campaign=zomato_redirect';
    }
  });

  // MENU SEARCH + FILTERS (only on pages that have them)
  var searchInput = document.getElementById('menu-search');
  var filterButtons = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('.card[data-category]');

  function applyFilters(){
    if (!cards.length) return;

    var term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var activeFilter = 'all';
    filterButtons.forEach(function(btn){
      if (btn.classList.contains('active')) {
        activeFilter = btn.getAttribute('data-filter') || 'all';
      }
    });

    cards.forEach(function(card){
      var cat = (card.getAttribute('data-category') || '').toLowerCase();
      var name = (card.getAttribute('data-product-name') || '').toLowerCase();
      var textMatch = !term || name.indexOf(term) !== -1;
      var categoryMatch = (activeFilter === 'all') || (cat === activeFilter);
      card.style.display = (textMatch && categoryMatch) ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (filterButtons.length) {
    filterButtons.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterButtons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilters();
      });
    });
  }

  applyFilters();
});
// CourierBanner: simple slider with autoplay
(function(){
  const slider = document.getElementById('cb-slider');
  const slides = slider ? slider.querySelectorAll('.cb-slide') : [];
  const prev = document.getElementById('cb-prev');
  const next = document.getElementById('cb-next');
  const dotsWrap = document.getElementById('cb-dots');
  if(!slider || slides.length === 0) return;

  let current = 0;
  const total = slides.length;
  let autoTimer = null;
  const AUTOPLAY_MS = 4500;

  // create dots
  for(let i=0;i<total;i++){
    const btn = document.createElement('button');
    btn.dataset.index = i;
    if(i===0) btn.classList.add('active');
    btn.addEventListener('click', (e)=>{
      goTo(Number(e.target.dataset.index));
      resetAuto();
    });
    dotsWrap.appendChild(btn);
  }

  function update(){
    slider.style.transform = `translateX(-${current * 100}%)`;
    // dots
    const dots = dotsWrap.querySelectorAll('button');
    dots.forEach((d, idx)=> d.classList.toggle('active', idx===current));
  }

  function goTo(i){
    current = (i + total) % total;
    update();
  }
  function nextSlide(){ goTo(current + 1); }
  function prevSlide(){ goTo(current - 1); }

  if(next) next.addEventListener('click', ()=>{ nextSlide(); resetAuto(); });
  if(prev) prev.addEventListener('click', ()=>{ prevSlide(); resetAuto(); });

  function startAuto(){
    autoTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }
  function stopAuto(){ if(autoTimer) clearInterval(autoTimer); autoTimer = null; }
  function resetAuto(){ stopAuto(); startAuto(); }

  // pause on hover
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // init
  update();
  startAuto();
})();

