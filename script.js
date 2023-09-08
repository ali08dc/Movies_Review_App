const API_KEY = "api_key=a5d431f3967c1235166cbb88b5563a2d";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const prev0 = document.getElementById("prev0");
const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastURL = "";
var totalPages = 100;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];
var selectedGenre = [];

setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      selectedCategory();
    });
    tagsEl.append(t);
  });
}

function selectedCategory() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("clicked");
  });
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const hilighted = document.getElementById(id);
      hilighted.classList.add("clicked");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (selectedGenre.length == 0) {
    clearBtn.classList.remove("clicked");
    setGenre();
    getMovies(API_URL);
  } else if (clearBtn) {
    clearBtn.classList.add("clicked");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "clicked");
    clear.id = "clear";
    clear.innerText = "Clear X";
    clear.addEventListener("click", (e) => {
      console.log(e);
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.append(clear);
  }
}

getMovies(API_URL);
function getMovies(url) {
  lastURL = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length != 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;
        prev0.innerText = currentPage - 1;
        next1.innerText = currentPage + 1;
        next2.innerText = currentPage + 2;

        if (currentPage <= 1) {
          prev.classList.add("disabled");
          prev0.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev0.classList.remove("disabled");
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }
        tagsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="no_result"> No Result Found</h1>`;
      }
    });
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <img src="${
          poster_path ? IMG_URL + poster_path : "No-Image.png"
        }" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}"> ${vote_average}</span>
        </div>

        <div class="overview">
        <h3>Overview</h3>
        <p>${overview}</p>
        <button class="knowMore" id="${id}" >Know More</botton>
        </div>
    </div>`;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      openNav(movie);
    });
  });
}


const overlayContent = document.getElementById("overlay-content");
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY).then((res) =>
    res.json().then((videoData) => {
      if (videoData) {
        console.log(videoData);
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          var details = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video;
            if (site == "YouTube") {
              details.push(
                `<iframe width="750" height="500" src="https://www.youtube.com/embed/${key}" title="${name}" class = "embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
              );
              dots.push(`<span class="dot">${idx + 1}</span>`);
            }
          });
          var content = `
          <h1 class="no_result"> ${movie.original_title}</h1>
          <br/>
          ${details.join("")}
          <br/>
          `;

          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no_result"> No Result Found</h1>`;
        }
      }
    })
  );
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  overlayContent.innerText = "";
}

var activeSlide = 1;
var totalSlides = 0;
function showVideos() {
  let embedClasses = document.querySelectorAll(".embed");
  totalSlides = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.add("hide");
      embedTag.classList.remove("show");
    }
  });
}

const leftArrow = document.getElementById("left-arrow");
leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalSlides - 1;
  }
  showVideos();
});

const rightArrow = document.getElementById("right-arrow");
rightArrow.addEventListener("click", () => {
  if (activeSlide < totalSlides - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
});

function getColor(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

document.querySelector(".header button").addEventListener("click", function () {
  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();

  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();

  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

prev.addEventListener("click", function () {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});
prev0.addEventListener("click", function () {
  if (currentPage > 1) {
    pageCall(currentPage - 1);
  }
});
next1.addEventListener("click", function () {
  if (nextPage <= totalPages) {
    pageCall(currentPage + 1);
  }
});
next2.addEventListener("click", function () {
  if (nextPage <= totalPages) {
    pageCall(currentPage + 2);
  }
});
next.addEventListener("click", function () {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  let urlSplit = lastURL.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastURL + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}
