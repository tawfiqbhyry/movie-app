let lang = "en";

let search = document.getElementById("search-box");
let dropedown = document.querySelector(".fa-angle-down");
dropedown.addEventListener("click", () => {
  let dropdownbox = document.getElementById("myDropdown");
  dropdownbox.style.display = "flex";
  Object.keys(languages).forEach((key) => {
    let el = document.createElement("div");
    el.id = key;
    el.innerText = languages[key]["nativeName"];
    el.addEventListener("click", () => {
      lang = key;
    });
    dropdownbox.appendChild(el);
  });
});

window.onclick = function (event) {
  if (!event.target.matches(".fa-angle-down")) {
    var dropdowns = document.getElementById("myDropdown");
    dropdowns.style.display = "none";
  }
};

async function getMovies() {
  if (search.value.length > 0) {
    const result = await fetch(
      `https://api.themoviedb.org/3/search/movie?include_adult=false&api_key=bba11d71622d6918d8204cf85d7ef2e3&language=${lang}&query=${search.value}&page=1`
    );
    const data = await result.json();
    let movies = data.results;
    if (data.total_pages > 10) {
      data.total_pages = 10;
    } else {
      data.total_pages = data.total_pages;
    }
    for (let i = 1; i < data.total_pages - 1; i++) {
      const result = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&api_key=bba11d71622d6918d8204cf85d7ef2e3&language=${lang}&query=${
          search.value
        }&page=${i + 1}`
      );
      const data = await result.json();
      movies = movies.concat(data.results);
    }
    return movies;
  }
}

function showData(movies) {
  main = document.querySelector(".movies-con .movies");
  let searchHeader = document.querySelector(".main-container .header");
  main.innerHTML = "";
  if (movies) {
    movies.forEach((movie) => {
      console.log(movie);
      let el = document.createElement("div");
      el.classList.add("movie");
      let arrayData = movie.overview.split(" ");
      let text = "";
      arrayData.forEach((data) => {
        if (arrayData.indexOf(data) < 5) {
          text += `${data} `;
        }
      });
      text += "...";
      el.innerHTML = `
      <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="" width="100%">
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${text}</p>
        <p>Released in: ${movie.release_date}</p>
        <p>Rating: ${movie.vote_average}</p>
      </div>
      `;
      el.addEventListener("click", () => {
        titleEl = document.querySelector(".show-movie #title");
        imgEL = document.querySelector(".show-movie img");
        imgEL.style.width = "100%";
        descriptionEL = document.querySelector(".show-movie #description");
        ratingEL = document.querySelector(".show-movie #rating");
        releaseDateEL = document.querySelector(".show-movie #release-date");

        titleEl.innerText = movie.title;
        imgEL.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
        descriptionEL.innerText = `overview: ${movie.overview}`;
        ratingEL.innerText = `rating: ${movie.vote_average}`;
        releaseDateEL.innerText = `release date: ${movie.release_date}`;

        document
          .querySelector(".show-movie .header i")
          .addEventListener("click", () => {
            document.querySelector(".show-movie").style.display = "none";
            main.style.display = "flex";
            searchHeader.style.display = "flex";
          });
        document.querySelector(".show-movie").style.display = "flex";
        main.style.display = "none";
        searchHeader.style.display = "none";
      });
      main.appendChild(el);
    });
  }
}

search.addEventListener("input", async () => {
  const data = await getMovies();
  showData(data);
});

document.addEventListener("keydown", async (key) => {
  if (key.key == "Enter") {
    const data = await getMovies();
    showData(data);
  }
});
