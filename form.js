const form = document.getElementById("form");
const campos = document.querySelectorAll(".input");
const spans = document.querySelectorAll(".span-required");
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/;

form.addEventListener("submit", (event) => {
    let isValid = true;

    // Realiza a validação de todos os campos
    if (campos[0].value.length < 3) {
        setError(0);
        isValid = false;
    } else {
        removeError(0);
    }

    if (!emailRegex.test(campos[1].value)) {
        setError(1);
        isValid = false;
    } else {
        removeError(1);
    }

    if (!phoneRegex.test(campos[2].value)) {
        setError(2);
        isValid = false;
    } else {
        removeError(2);
    }

    if (campos[3].value.length < 3) {
        setError(3);
        isValid = false;
    } else {
        removeError(3);
    }
  
    // Se algum campo for inválido, impede o envio do formulário
    if (!isValid) {
        event.preventDefault();
    }
});

function formValidade() {
  nameValidade();
  emailValidade();
  phoneValidade();
  messageValidade();
}

function setError(index) {
  campos[index].style.borderBottom = "2px solid #E63636";
  spans[index].style.visibility = "visible";
}

function removeError(index) {
  campos[index].style.borderBottom = "2px solid #CCC";
  spans[index].style.visibility = "hidden";
}

function nameValidade() {
  if (campos[0].value.length < 3) {
    setError(0);
  } else {
    removeError(0);
  }
}

function emailValidade() {
  if (!emailRegex.test(campos[1].value)) {
    setError(1);
  } else {
    removeError(1);
  }
}

function phoneValidade() {
  if (!phoneRegex.test(campos[2].value)) {
    setError(2);
  } else {
    removeError(2);
  }
}

function messageValidade() {
  if (campos[3].value.length < 3) {
    setError(3);
  } else {
    removeError(3);
  }
}
