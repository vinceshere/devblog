$(document).ready(function() {
  $('.open-menu').click(function(e) {
    e.preventDefault();

    $('body').addClass('menu-open');
  });

  $('.close-menu, .background-menu').click(function (e) {
    e.preventDefault();

    $('body').removeClass('menu-open');
  });

  $('.open-search').click(function (e) {
    e.preventDefault();

    $('body').toggleClass('search-open');
  });
});
