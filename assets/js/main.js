const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 1279;
const limit = 12;
let offset = 0;

function convertPokemonToLi(pokemon) {
  let soma = 0;
  for (let key in pokemon.baseStats) {
    soma += pokemon.baseStats[key];
  }

  let gender = "";

  if (pokemon.gender.genderless) {
    gender = "genderless";
  } else {
    gender = `<i class="fa fa-mars" style="font-size:24px;color:#1e90ff"></i>${pokemon.gender.male}
    <i class="fa fa-venus" style="font-size:24px;color:#ff1493"></i>${pokemon.gender.female}`;
  }

  const li = document.createElement("li");
  li.classList.add("pokemon", pokemon.type);
  li.setAttribute("dataset", pokemon.number);
  li.innerHTML = `
        <div class="wallpaper ${pokemon.type}">
          <div>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
          </div>

          <div class="detail">
            <ol class="types">
              ${pokemon.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
            </ol>

            <img src="${pokemon.photo}" alt="${pokemon.name}">
          </div>
        </div>
        `;
  li.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.classList.add("modalContainer", `poke${pokemon.number}`, `visible`);
    modal.innerHTML = `
          <div class="modal pokemonDetail">
          <div class="pokeSpecie ${pokemon.type}">
          <button class="closeModal">X</button>
          <div class="pokemon">
            <div class="identification">
            <span class="number">#${pokemon.number}</span>
              <span class="name">${pokemon.name}</span>
            </div>
            <div class="detail">
              <ol class="types">
              ${pokemon.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
              </ol>
              <div class="pokeContainer">
                <img src="${pokemon.photo2}" alt="${pokemon.name}" />
              </div>
            </div>
          </div>
          <div class="menu">
            <ul>
              <li class="active" data-target="aboutTable">
                <a href="#">About</a>
              </li>
              <li data-target="baseStatsTable">
                <a href="#">Base Stats</a>
              </li>
            </ul>
          </div>
          <div id="aboutTable" class="section">
            <table>
              <tr>
                <td>Habitat</td>
                <td>${pokemon.habitat}</td>
              </tr>
              <tr>
                <td>Height</td>
                <td>${pokemon.height}</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>${pokemon.weight}</td>
              </tr>
              <tr>
                <td>Abilities</td>
                <td>${pokemon.abilities.slice().join(", ")}</td>
              </tr>
              <th>Breeding</th>
              <tr>
                <td>Gender</td>
                <td>
                  ${gender}
                </td>
              </tr>
              <tr>
                <td>Egg Groups</td>
                <td>${pokemon.eggGroups.slice().join(", ")}</td>
              </tr>
              <tr>
                <td>Egg Cycle</td>
                <td>${pokemon.eggCycle} steps</td>
              </tr>
            </table>
          </div>
          <div id="baseStatsTable" class="section">
            <table>
              <tr>
                <td>HP</td>
                <td>${pokemon.baseStats.hp}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.hp
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Attack</td>
                <td>${pokemon.baseStats.attack}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.attack
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Defense</td>
                <td>${pokemon.baseStats.defense}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.defense
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Sp. Atk</td>
                <td>${pokemon.baseStats.specialAttack}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.specialAttack
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Sp. Def</td>
                <td>${pokemon.baseStats.specialDefense}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.specialDefense
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>${pokemon.baseStats.speed}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.speed
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td>${soma}</td>
                <td>
                  <progress max="600" value="${soma}"></progress>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
          `;
    pokemonList.appendChild(modal);
    const closeButton = modal.querySelector(".closeModal");

    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    function toggleActive(e) {
      const opt = document.querySelectorAll(".menu li");
      
      opt.forEach((link) => {
        e.preventDefault();
        link.classList.remove("active");
      });
      e.currentTarget.classList.add("active");

      const target = e.currentTarget.dataset.target;
      const sections = document.querySelectorAll(".section");

      sections.forEach((section) => {
        if (section.id === target) {
          section.style.display = "block";
        } else {
          section.style.display = "none";
        }
      });
    }

    const opt = document.querySelectorAll(".menu li");
    opt.forEach((link) => {
      link.addEventListener("click", toggleActive);
    });
  });
  return li;
}

loadMoreButton.classList.add("loader")

function loadPokemonItems(offset, limit, loading = true) {
  setTimeout(() => {
    pokeApi
    .getPokemons(offset, limit)
    .then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi);
      newHtml.forEach(LiElement =>{
        pokemonList.appendChild(LiElement)
      })
    })
    .catch((error) => {
      const sectionContent = document.querySelector(".content");
      const p = document.createElement("p");
      p.innerText =
        "Parece que estamos com um problema, verifique sua internet e tente recarregar a página, caso o erro persista, entre em contato pelo Linkedin";
      sectionContent.appendChild(p);
    });
  }, 2000);
}

setTimeout(() => loadMoreButton.classList.remove("loader"), 2500);

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener("click", () => {
  loadMoreButton.classList.add("loader")
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    setTimeout(() => loadMoreButton.classList.remove("loader"), 3000);
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit)
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit);
    setTimeout(() => loadMoreButton.classList.remove("loader"), 3000);
  }
});
