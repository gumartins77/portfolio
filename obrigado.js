const params = new URLSearchParams(window.location.search);
const section = params.get("section");

if (section === "obrigado") {
  const tituloForm = document.getElementById("titulo-form");
  const inputSingle = document.querySelectorAll(".input-single");
  const btnEnviar = document.querySelector(".btn-enviar");
  tituloForm.innerHTML = "OBRIGADO <span>PELO CONTATO.</span>";
  inputSingle[0].innerHTML = "<p>Em breve entrarei em contato com você <i class='bi bi-emoji-smile'></i></p>";
  inputSingle[1].style.display = "none";
  inputSingle[2].style.display = "none";
  inputSingle[3].style.display = "none";
  btnEnviar.style.display = "none";
}
