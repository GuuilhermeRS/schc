import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Historico } from "./Historico";
import { TiposEnsino, TiposExtensao, TiposPesquisa } from "./TiposAtividade";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseConfig } from "./constantes";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

let atividades = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  }

  const db = getFirestore(app);
  const atividadesCollection = collection(db, "atividade");

  try {
    const q = query(atividadesCollection, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const atividade = { ...doc.data(), id: doc.id };
      atividades.push(atividade);
    });
  } catch (error) {
    alert("Erro ao carregar as atividades:", error);
  }

  const historico = new Historico(atividades);
  const atividadesPorCategoria = {
    extensao: TiposExtensao,
    pesquisa: TiposPesquisa,
    ensino: TiposEnsino,
  };

  const selectCategoria = document.getElementById("categoria");
  const selectTipoAtividade = document.getElementById("tipoAtividade");
  atualizarTiposAtividade(atividadesPorCategoria.extensao);

  // Atualizar os tipos de atividade baseado na categoria (Extensão, Pesquisa, Ensino)
  selectCategoria.addEventListener("change", () => {
    const categoriaSelecionada = selectCategoria.value;
    if (!categoriaSelecionada) return;
    const atividades = atividadesPorCategoria[categoriaSelecionada] || [];
    atualizarTiposAtividade(atividades);
  });

  function atualizarTiposAtividade(atividades) {
    selectTipoAtividade.innerHTML = "";
    selectTipoAtividade.disabled = atividades.length === 0;

    atividades.forEach((atividade) => {
      const opcao = document.createElement("option");
      opcao.value = atividade.tipo;
      opcao.text = atividade.tipo;
      selectTipoAtividade.appendChild(opcao);
    });
  }

  function obterTipoAtividade(categoria, tipo) {
    switch (categoria) {
      case "extensao":
        return TiposExtensao.find((t) => t.tipo === tipo);
      case "pesquisa":
        return TiposPesquisa.find((t) => t.tipo === tipo);
      case "ensino":
        return TiposEnsino.find((t) => t.tipo === tipo);
      default:
        alert("Tipo de atividade não encontrado");
    }
  }

  function onSubmit() {
    if (!db) {
      alert("Não foi possível estabelecer conexão com a base de dados");
      return;
    }

    const form = document.getElementById("formulario");
    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const tipoAtividade = document.getElementById("tipoAtividade").value;
    const horas = parseFloat(document.getElementById("horas").value);

    if (nome.trim() === "" || isNaN(horas)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const tipoAtv = obterTipoAtividade(categoria, tipoAtividade);
    const novaAtividade = {
      nome: nome,
      categoria: categoria,
      tipoAtividade: tipoAtv,
      horas: horas,
      horasAproveitadas: 0,
      userId: auth.currentUser.uid,
    };

    addDoc(atividadesCollection, novaAtividade)
      .then((docRef) => {
        historico.adicionarAtividade({ ...novaAtividade, id: docRef.id });
        atualizarAtividades();
        atualizarHoras();
        form.reset();
        atualizarTiposAtividade(atividadesPorCategoria.extensao);
      })
      .catch((err) => console.log("Erro ao adicionar atividade: ", err));
  }

  const salvarBtn = document.getElementById("salvarBtn");
  salvarBtn.addEventListener("click", onSubmit);

  function atualizarAtividades() {
    const tableBody = document
      .getElementById("tabelaAtividades")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    historico.atividades.forEach((a) => {
      const row = tableBody.insertRow();
      const nameCell = row.insertCell();
      const categoryCell = row.insertCell();
      const categoryTypeCell = row.insertCell();
      const hoursCell = row.insertCell();
      const hoursSpentCell = row.insertCell();
      const actionsCell = row.insertCell();

      nameCell.textContent = a.nome;
      categoryCell.textContent = a.categoria;
      categoryTypeCell.textContent = a.tipoAtividade.tipo;
      hoursCell.textContent = a.horas.toFixed(1) + " horas";
      hoursSpentCell.textContent = a.horasAproveitadas.toFixed(1) + " horas";

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-delete";
      btnDelete.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-3a1 1 0 00-1 1v3m4 0h-4"/></svg>'; // SVG delete icon
      btnDelete.onclick = () => removerAtividade(a.id);
      actionsCell.appendChild(btnDelete);
    });
  }

  function atualizarHoras() {
    document.getElementById("horasEnsino").textContent =
      historico.totalHorasEnsino.toFixed(1);
    document.getElementById("horasExtensao").textContent =
      historico.totalHorasExtensao.toFixed(1);
    document.getElementById("horasPesquisa").textContent =
      historico.totalHorasPesquisa.toFixed(1);
  }

  function removerAtividade(id) {
    const elementoRef = doc(db, "atividade", id);

    deleteDoc(elementoRef)
      .then(() => {
        historico.removerAtividade(id);
        atualizarAtividades();
        atualizarHoras();
      })
      .catch((error) => {
        alert("Erro ao deletar documento: ", error);
      });
  }

  atualizarAtividades();
  atualizarHoras();

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => window.location.href = "login.html")
      .catch((error) => {
        console.error("Erro durante o logout:", error);
        alert("Erro ao sair. Tente novamente.");
      });
  });
});
