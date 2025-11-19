document.addEventListener('DOMContentLoaded', function(){
  // year in footer
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Base Swiggy & Zomato links
  var SWIGGY_BASE = 'https://www.swiggy.com/direct/brand/536412?source=swiggy-direct&subSource=generic';
  var ZOMATO_BASE = 'https://link.zomato.com/xqzv/rshare?id=95007053305635b0';

  // Attach URLs with tracking to each product card
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

  // Order section big buttons with tracking
  var orderSwiggy = document.getElementById('order-swiggy');
  var orderZomato = document.getElementById('order-zomato');

  if (orderSwiggy) {
    orderSwiggy.href = SWIGGY_BASE +
      '&utm_source=website&utm_medium=order_section&utm_campaign=swiggy_redirect';
  }

  if (orderZomato) {
    orderZomato.href = ZOMATO_BASE +
      '&utm_source=website&utm_medium=order_section&utm_campaign=zomato_redirect';
  }
});
