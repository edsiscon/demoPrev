const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/SUA_URL_AQUI/exec";

const step1 = document.getElementById("step1");
const stepCards = document.getElementById("stepCards");
const stepPathA = document.getElementById("stepPathA");
const stepPathB = document.getElementById("stepPathB");

const btnToCards = document.getElementById("btnToCards");
const cardA = document.getElementById("cardA");
const cardB = document.getElementById("cardB");
const btnBackToCardsList = document.querySelectorAll(".btnBackToCards");

const quizForm = document.getElementById("quizForm");
const resultScreen = document.getElementById("resultScreen");

let selectedPath = "";

// Ir do Cadastro para os Cards
btnToCards.addEventListener("click", () => {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const idade = document.getElementById("idade").value;

  if (!nome || !email || !idade) {
    alert("Por favor, preencha todos os campos cadastrais antes de continuar.");
    return;
  }

  step1.classList.remove("active");
  stepCards.classList.add("active");
});

// Seleção dos Cards
cardA.addEventListener("click", () => {
  selectedPath = "A (Investimento no Escuro)";
  stepCards.classList.remove("active");
  stepPathA.classList.add("active");
});

cardB.addEventListener("click", () => {
  selectedPath = "B (Investimento Consciente)";
  stepCards.classList.remove("active");
  stepPathB.classList.add("active");
});

// Voltar para a tela de Cards
btnBackToCardsList.forEach(btn => {
  btn.addEventListener("click", () => {
    stepPathA.classList.remove("active");
    stepPathB.classList.add("active");
    stepCards.classList.add("active");
  });
});

// Envio e Processamento do Formulário
quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);
  const nome = formData.get("nome");
  const email = formData.get("email");
  const idade = formData.get("idade");

  let totalScore = 0;

  if (selectedPath.startsWith("A")) {
    totalScore += parseInt(formData.get("a1") || "0", 10);
    totalScore += parseInt(formData.get("a2") || "0", 10);
    totalScore += parseInt(formData.get("a3") || "0", 10);
  } else {
    totalScore += parseInt(formData.get("b1") || "0", 10);
    totalScore += parseInt(formData.get("b2") || "0", 10);
    totalScore += parseInt(formData.get("b3") || "0", 10);
  }

  // Avaliação do Perfil com base no caminho e score
  let perfil = "";
  if (selectedPath.startsWith("A")) {
    if (totalScore === 30) perfil = "Reativo Inteligente (Evitou os riscos por intuição)";
    else if (totalScore >= 10) perfil = "Reativo Vulnerável (Pode tomar decisões precipitadas em momentos de crise)";
    else perfil = "Alto Risco Financeiro (Decisões por impulso sem reserva de emergência)";
  } else {
    if (totalScore === 30) perfil = "Especialista em Previdência (Aproveitamento total dos benefícios tributários)";
    else if (totalScore >= 10) perfil = "Investidor Consciente em Desenvolvimento";
    else perfil = "Iniciante Consciente (Necessita aprofundar em PGBL/VGBL e Tabela Regressiva)";
  }

  // Exibição do Resultado no site
  stepPathA.classList.remove("active");
  stepPathB.classList.remove("active");
  resultScreen.classList.remove("hidden");

  document.getElementById("resNome").innerText = nome;
  document.getElementById("resCaminho").innerText = selectedPath;
  document.getElementById("resPontos").innerText = totalScore;
  document.getElementById("resPerfil").innerText = perfil;

  const statusMsg = document.getElementById("statusEnvio");
  statusMsg.innerText = "Registrando dados na planilha...";

  const payload = {
    nome: nome,
    email: email,
    idade: idade,
    caminho: selectedPath,
    pontuacao: totalScore,
    perfil: perfil,
    dataEnvio: new Date().toLocaleString("pt-BR")
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    statusMsg.innerText = "Dados enviados para a planilha com sucesso!";
  } catch (err) {
    console.error(err);
    statusMsg.innerText = "Sua pontuação foi calculada acima (erro de rede ao salvar na planilha).";
  }
});