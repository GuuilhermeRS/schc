import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseConfig } from "./constantes";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authForm = document.getElementById("authForm");
const cadastroDiv = document.getElementById("cadastro");
const cadastroInput = {
  name: cadastroDiv.querySelector('input[name="name"]'),
  email: cadastroDiv.querySelector('input[name="email"]'),
  password: cadastroDiv.querySelector('input[name="password"]'),
  confirmPassword: cadastroDiv.querySelector('input[name="confirmPassword"]'),
};

const loginDiv = document.getElementById("login");
const loginInput = {
  email: loginDiv.querySelector('input[name="email"]'),
  password: loginDiv.querySelector('input[name="password"]'),
};

let modoCadastro = false;

authForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!modoCadastro) {
    const email = loginInput.email.value;
    const password = loginInput.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = "index.html";
      })
      .catch((error) => alert(error.message));

    return;
  }

  const name = cadastroInput.name.value;
  const email = cadastroInput.email.value;
  const password = cadastroInput.password.value;
  const confirmPassword = cadastroInput.confirmPassword.value;

  if (password !== confirmPassword) {
    alert("As senhas estão diferentes");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert("Usuário cadastrado com sucesso!");
      authForm.reset();
      toggleFormMode();
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert("Erro ao cadastrar: " + errorMessage);
    });
});

const loginLink = document.getElementById("loginLink");
const cadastroLink = document.getElementById("cadastroLink");
const submitBtn = authForm.querySelector('button[type="submit"]');

renderMode();

function renderMode() {
  if (modoCadastro) {
    cadastroDiv.style.display = "block";
    cadastroLink.style.display = "none";
    loginDiv.style.display = "none";
    loginLink.style.display = "block";

    submitBtn.textContent = "Cadastrar";

    return;
  }

  cadastroDiv.style.display = "none";
  cadastroLink.style.display = "block";
  loginDiv.style.display = "block";
  loginLink.style.display = "none";

  submitBtn.textContent = "Entrar";
}

function toggleFormMode() {
  modoCadastro = !modoCadastro;
  renderMode();
}

loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleFormMode();
});

cadastroLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleFormMode();
});
