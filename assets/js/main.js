$(document).ready(function() {

  // Menu interactions
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

  // Search
  var searchParams = new URLSearchParams(window.location.search);
  var search = searchParams.get('terms');

  if (search) {
    $('.search-terms').text(search);
    searchPosts();
  }

  // Lazy loading interactions
  $('.load-more').on('click', function(e) {
    e.preventDefault();
    activateLoading();
    searchPosts();
  });
});

$(window).on('load', function() {
  $('body').removeClass('loading');
});

function activateLoading() {
  $('body').addClass('loading');
};

function deactivateLoading() {
  $('body').removeClass('loading');
};

function searchPosts() {
  var $postsList = $('.posts-list');

  var searchUrl = BASE_URL + 'search.json';

  var currentPage = $postsList.data('page');
  var category = $postsList.data('category');
  var searchParams = new URLSearchParams(window.location.search);
  var search = searchParams.get('terms');

  var postsPerPage = 9;
  var postsOffset = $('.post-wrapper').length;
  var filteredPosts = [];

  $.ajax({
    type: "GET",
    dataType: 'json',
    url: searchUrl
  }).fail(function(data) {
    console.log("Error retrieving posts");
    deactivateLoading();
  }).done(function(data) {
    $postsList.data('page', parseInt(currentPage) + 1)

    if (category) {
      filteredPosts = filterByCategory(data, category);
    }

    if (search) {
      filteredPosts = filterBySearch(data);
      $('.result-count strong').text(filteredPosts.length);
    }

    if (!search && !category) {
      filteredPosts = data;
    }

    var postsToShow = filteredPosts.slice(postsOffset, postsOffset + postsPerPage);

    if (postsToShow.length < postsPerPage) {
      $('.search-load-more').remove();
    }

    $.each(postsToShow, appendPost);

    deactivateLoading();
  });
};

function filterByCategory(posts, category) {
  console.log(posts, category);

  return $.grep(posts, function(post) {
    return post.category_slug === category;
  });
}

function filterBySearch(posts) {
  var searchParams = new URLSearchParams(window.location.search);
  var search = searchParams.get('terms');

  return $.grep(posts, function (post) {
    return JSON.stringify(post).toLowerCase().indexOf(search.toLowerCase()) > -1;
  });
}

function appendPost(index, post) {
  var $postsList = $('.posts-list');

  var postElement = $(`
    <div class="col-sm-12 col-lg-4 col-md-6 post-wrapper">
      <div class="post post-small">
        <a href="${post.url}" class="post-image">
          <img src="${post.featured_image}" alt="">
        </a>
        <div class="post-content">
          <div class="post-header">
            <span class="date">${post.date}</span>
            <span class="separator"></span>
            <a href="${post.category_url}" class="category">${post.category_name}</a>
          </div>
          <h2 class="post-title"><a href="${post.url}">${post.title}</a>
          </h2>
          <p class="post-excerpt">${post.excerpt}</p>
        </div>
      </div>
    </div>
  `);

  $postsList.append(postElement);
}
