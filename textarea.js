const textarea = document.querySelector("#mensagem-form");
const label = document.querySelector('label[for="mensagem-form"]');

textarea.addEventListener("input", function () {
  this.style.height = "36px";
  this.style.height = this.scrollHeight + "px";

  if (this.value.trim() === "" && document.activeElement !== this) {
    label.style.transitionDuration = ".2s";
    label.style.transform = `translateY(0)`;
    label.style.fontSize = `17px`;
    label.style.color = `#FFF`;
    label.style.bottom = `12px`;
  } else {
    label.style.transitionDuration = "0s";
    label.style.transform = `translateY(calc(0% - ${textarea.offsetHeight}px))`;
    label.style.fontSize = `12px`;
    label.style.color = `#CCC`;
    label.style.bottom = `0px`;
  }
});

textarea.addEventListener("change", function () {
  if (this.value.trim() === "" && document.activeElement !== this) {
    this.style.height = "36px";
    label.style.transform = "";
  }
});

// Verificar quando o textarea perde o foco
textarea.addEventListener("blur", function () {
  if (this.value.trim() === "") {
    this.style.height = "36px";
    label.style.transitionDuration = ".2s";
    label.style.transform = "";
    label.style.fontSize = `17px`;
    label.style.color = `#FFF`;
    label.style.bottom = `12px`;
  }
});

textarea.addEventListener("focus", function () {
  if (this.value.trim() === "") {
    label.style.fontSize = `12px`;
    label.style.color = `#CCC`;
    label.style.bottom = `0px`;
  }
});
