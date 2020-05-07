"use strict";

//Day 1
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");

const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
// D2
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

// const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("delivery-food");

function toggleModal() {
  modal.classList.toggle("is-open");
}
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function autorized() {
  console.log("autorized");

  function logOut(event) {
    event.preventDefault();
    login = null;
    localStorage.removeItem("delivery-food");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}

function nonAautorized() {
  console.log("nonAautorized");

  function logIn(event) {
    event.preventDefault();
    console.log("logIn");
    login = loginInput.value;

    if (!login) {
      alert("Требуется ввести логин");
    } else {
      localStorage.setItem("delivery-food", login);
      logInForm.reset();
      toggleModalAuth();
    }
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    logInForm.removeEventListener("submit", logIn);
    checkAuth();
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    nonAautorized();
  }
}

function createCardRestaurants() {
  const card = `
<a  class="card card-restaurant">
<img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
<div class="card-text">
  <div class="card-heading">
    <h3 class="card-title">Тануки</h3>
    <span class="card-tag tag">60 мин</span>
  </div>
  <!-- /.card-heading -->
  <div class="card-info">
    <div class="rating">
      4.5
    </div>
    <div class="price">От 1 200 ₽</div>
    <div class="category">Суши, роллы</div>
  </div>  <!-- /.card-info -->
</div> <!-- /.card-text -->
</a>
<!-- /.card -->`;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
}

function createCardGood() {
  const card = document.createElement("div");
  card.className = "card";
  // Лучше так а не через  "card.innerHTML = "" (отсутствует сериализация в строку)
  card.insertAdjacentHTML(
    "beforeend",
    `

				                            		<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Классика</h3>
							</div>
							<!-- /.card-heading -->
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
									грибы.
								</div>
							</div>
							<!-- /.card-info -->
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">510 ₽</strong>
							</div>
						</div>
						<!-- /.card-text -->
					`
  );
  // console.log(card);
  cardsMenu.insertAdjacentElement("afterbegin", card);
}

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest(".cards-restaurants");
  // console.log(restaurant);
  if (restaurant) {
    if (!login) {
      toggleModalAuth();
    }
    cardsMenu.textContent = "";
    containerPromo.classList.add("hide");
    restaurants.classList.add("hide");
    menu.classList.remove("hide");

    createCardGood();
    createCardGood();
    createCardGood();
  }
}

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener("click", openGoods);

logo.addEventListener("click", function () {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
});

checkAuth();

createCardRestaurants();
createCardRestaurants();
createCardRestaurants();
