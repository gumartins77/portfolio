let btnAbrirMenu = document.getElementById("btn-abrir-menu");
let menuMobile = document.getElementById("menu-mobile");
let overlayMenu = document.getElementById("overlay-menu");
let header = document.querySelector("#header");

btnAbrirMenu.addEventListener("click", () => {
  menuMobile.classList.add("abrir-menu");
});

menuMobile.addEventListener("click", () => {
  menuMobile.classList.remove("abrir-menu");
});

overlayMenu.addEventListener("click", () => {
  menuMobile.classList.remove("abrir-menu");
});

window.addEventListener("scroll", () => {
    header.classList.toggle("rolagem", window.scrollY > 0)
});
