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
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

let login = localStorage.getItem("delivery-food");
const cart = [];

const loadCart = function () {
  if (localStorage.getItem(login)) {
    JSON.parse(localStorage.getItem(login)).forEach(function (item) {
      cart.push(item);
    });
  }
};

const saveCart = function () {
  localStorage.setItem(login, JSON.stringify(cart));
};

// const buttonClearCart = document.querySelector(".button clear-cart");
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

function toggleModal() {
  modal.classList.toggle("is-open");
}
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function autorized() {
  console.log("!!!Autorized");

  function logOut(event) {
    event.preventDefault();
    login = null;
    cart.length = 0;
    localStorage.removeItem("delivery-food");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = "";

    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
  loadCart();
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
  // console.log(goods);
  const { id, name, description, price, image } = goods;

  const card = document.createElement("div");
  card.className = "card";
  // card.id = id;
  // Лучше так а не через  "card.innerHTML = "" (отсутствует сериализация в строку)
  card.insertAdjacentHTML(
    "beforeend",
    `                		<img src=${image} alt="image" class="card-image"/>
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
								<button class="button button-primary button-add-cart" id = "${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
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
  // console.log(restaurant);
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

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest(".button-add-cart");
  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }

    // console.log(cart);
  }
  saveCart();
}

function renderCart() {
  modalBody.textContent = "";
  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
              <div class="food-row">
    <span class="food-name">${title}</span>
    <strong class="food-price">${cost}</strong>
    <div class="food-counter">
      <button class="counter-button counter-minus" data-id=${id}>-</button>
      <span class="counter">${count}</span>
      <button class="counter-button counter-plus" data-id=${id}>+</button>
    </div>
  </div>
  <!-- /.foods-row -->`;
    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);
  modalPrice.textContent = totalPrice + "₽";
}

function changeCount(event) {
  const target = event.target;
  console.log(target.dataset.id);

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }

    if (target.classList.contains("counter-plus")) {
      food.count++;
    }
    console.log(food);
    renderCart();
  }
  saveCart();
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurants);
  });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    renderCart();
  });
  modalBody.addEventListener("click", changeCount);

  cardsMenu.addEventListener("click", addToCart);

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
