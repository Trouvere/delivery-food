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
const getData = async function (url) {
  const responce = await fetch(url);

  if (!responce.ok) {
    throw new Error(
      `Ошибка по адресу ${url}, статус ошибки ${responce.status}`
    );
  } else {
    return await responce.json();
  }
};
// getData("./db/partners.json");

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

function createCardRestaurants({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery,
}) {
  const card = `
<a  class="card card-restaurant" data-products="${products}">
<img src=${image} alt="image" class="card-image"/>
<div class="card-text">
  <div class="card-heading">
    <h3 class="card-title">${name}</h3>
    <span class="card-tag tag">${timeOfDelivery}</span>
  </div>
  <!-- /.card-heading -->
  <div class="card-info">
    <div class="rating">
     ${stars}
    </div>
    <div class="price">${price} ₽</div>
    <div class="category">${kitchen}</div>
  </div>  <!-- /.card-info -->
</div> <!-- /.card-text -->
</a>
<!-- /.card -->`;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
}

function createCardGood(goods) {
  console.log(goods);
  const { id, name, description, price, image } = goods;

  const card = document.createElement("div");
  card.className = "card";
  // Лучше так а не через  "card.innerHTML = "" (отсутствует сериализация в строку)
  card.insertAdjacentHTML(
    "beforeend",
    `

				                            		<img src=${image} alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<!-- /.card-heading -->
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<!-- /.card-info -->
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
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
  const restaurant = target.closest(".card-restaurant");
  console.log(restaurant);
  if (restaurant) {
    if (!login) {
      toggleModalAuth();
    } else {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
      // createCardGood();
    }
  }
}

new Swiper(".swiper-container", {
  loop: true,
  autoplay: { dalay: 3000 },
  sliderPerViev: 1,
  sliderPerColumn: 1,
});

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurants);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  checkAuth();
}

init();
