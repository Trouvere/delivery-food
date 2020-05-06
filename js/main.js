const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//Day 1

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");

const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("delivery-food");

function toogleModalAuth() {
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
      toogleModalAuth();
    }
    buttonAuth.removeEventListener("click", toogleModalAuth);
    closeAuth.removeEventListener("click", toogleModalAuth);
    logInForm.removeEventListener("submit", logIn);
    checkAuth();
  }

  buttonAuth.addEventListener("click", toogleModalAuth);
  closeAuth.addEventListener("click", toogleModalAuth);
  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    nonAautorized();
  }
}

checkAuth();
