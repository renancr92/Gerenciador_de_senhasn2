
async function carregarSenhas() {

    // 1.1 - Localiza a tabela e verifica se estamos na tela Minhas Senhas.
    const corpoTabela = document.getElementById("corpo-tabela-senhas");
    /* =====================================================
       1. TELA MINHAS SENHAS
       Responsável por listar, pesquisar, visualizar,
       editar e excluir as senhas cadastradas.
       ===================================================== */
    if (!corpoTabela) {
        return;
    }

    // 1.2 - Faz o botão Adicionar Senha abrir o formulário de novo cadastro.
    const botaoAdicionar = document.getElementById("adicionar-senha");

    if (botaoAdicionar) {
        botaoAdicionar.addEventListener("click", () => {
            window.location.href = "novo-cadastro.html";
        });
    }

    // 1.3 - Pesquisa os registros pelo nome do site ou pelo usuário.
    const campoBusca = document.getElementById("buscar-senhas");

    if (campoBusca) {
        campoBusca.addEventListener("input", () => {

            const textoDigitado = campoBusca.value.toLowerCase().trim();

            const linhas = Array.from(corpoTabela.querySelectorAll("tr"));

            const encontradas = linhas.filter((linha) => {
                const colunas = linha.querySelectorAll("td");

                if (colunas.length !== 4) {
                    return true;
                }

                const site = colunas[0].textContent.toLowerCase();
                const usuario = colunas[1].textContent.toLowerCase();

                return site.includes(textoDigitado) ||
                    usuario.includes(textoDigitado);
            });

            linhas.forEach((linha) => {
                linha.hidden = true;
            });

            encontradas.forEach((linha) => {
                linha.hidden = false;
            });

        });
    }

    // 1.4 - Carrega os registros salvos no JSON e prepara a tabela para exibi-los.
    try {
        const senhas = await window.api.carregarSenhas();

        corpoTabela.replaceChildren();

        // 1.5 - Mostra uma mensagem quando não existem senhas cadastradas.
        if (senhas.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 4;
            celula.textContent = "Nenhuma senha cadastrada ainda.";

            linha.appendChild(celula);
            corpoTabela.appendChild(linha);
            return;
        }

        // 1.6 - Percorre as senhas cadastradas e cria uma linha para cada registro.
        senhas.forEach((registro, indiceRegistro) => {
            const linha = document.createElement("tr");

            const valores = [
                registro.nomeServico,
                registro.usuario,
                "••••••••",
                "—"
            ];


            valores.forEach((valor, indice) => {
                const celula = document.createElement("td");

                // 1.7 - Permite mostrar ou ocultar a senha de cada registro.
                if (indice === 2) {
                    const textoSenha = document.createElement("span");
                    textoSenha.textContent = "••••••••";

                    const botaoMostrar = document.createElement("button");
                    botaoMostrar.type = "button";
                    botaoMostrar.textContent = "Mostrar";
                    botaoMostrar.className = "botao-mostrar-tabela";

                    botaoMostrar.addEventListener("click", () => {
                        if (botaoMostrar.textContent === "Mostrar") {
                            textoSenha.textContent = registro.senha;
                            botaoMostrar.textContent = "Ocultar";
                        } else {
                            textoSenha.textContent = "••••••••";
                            botaoMostrar.textContent = "Mostrar";
                        }
                    });

                    celula.appendChild(textoSenha);
                    celula.appendChild(botaoMostrar);


                } else if (indice === 3) {

                    // 1.8 - Cria o botão Editar e abre o formulário do registro selecionado.
                    const botaoEditar = document.createElement("button");

                    botaoEditar.type = "button";
                    botaoEditar.textContent = "Editar";
                    botaoEditar.className = "botao-editar-tabela";


                    botaoEditar.addEventListener("click", () => {
                        window.location.href = "novo-cadastro.html?editar=" + indiceRegistro;
                    });




                    celula.appendChild(botaoEditar);

                    // 1.9 - Cria o botão Excluir e solicita confirmação antes de apagar o registro.
                    const botaoExcluir = document.createElement("button");

                    botaoExcluir.type = "button";
                    botaoExcluir.textContent = "Excluir";
                    botaoExcluir.className = "botao-excluir-tabela";


                    botaoExcluir.addEventListener("click", async () => {
                        try {
                            const excluiu = await window.api.excluirSenha(indiceRegistro);

                            if (excluiu) {
                                window.location.reload();
                            }

                        } catch (erro) {
                            console.error("Erro ao excluir registro:", erro);
                            alert("Não foi possível excluir o registro.");
                        }
                    });


                    celula.appendChild(botaoExcluir);


                } else {
                    celula.textContent = valor;
                }


                linha.appendChild(celula);
            });


            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        // 1.10 - Registra possíveis erros durante o carregamento das senhas.
        console.error("Erro ao carregar as senhas:", erro);
    }
}
document.addEventListener("DOMContentLoaded", carregarSenhas);
/* =====================================================
   1. TELA MINHAS SENHAS FIM
   ===================================================== */

// funcionalidades novo cadastro

/* =====================================================
   2. DASHBOARD - VISÃO GERAL
   Responsável por atualizar os indicadores da
   página principal do SenhaForte.
   ===================================================== */

async function atualizarDashboard() {

    // 2.1 - Localiza os indicadores de total de senhas, senhas fortes e última atualização.
    const metricTotal = document.getElementById('metric-total');
    const metricFortes = document.getElementById('metric-fortes');
    const metricAtualizacao = document.getElementById('metric-atualizacao');

    // 2.2 - Verifica se os indicadores existem antes de atualizar o Dashboard.
    if (!metricTotal && !metricFortes && !metricAtualizacao) {
        return;
    }

    // 2.3 - Carrega as senhas salvas e calcula os indicadores do Dashboard.
    try {
        const senhas = await window.api.carregarSenhas();

        const registros = Array.isArray(senhas) ? senhas : [];

        const total = registros.length;

        const fortes = registros.filter(registro =>
            registro.senha && registro.senha.length >= 12
        ).length;

        // 2.4 - Atualiza os cartões com o total de senhas e a quantidade de senhas fortes.
        if (metricTotal) {
            metricTotal.textContent = total;
        }

        if (metricFortes) {
            metricFortes.textContent = fortes;
        }

        // 2.5 - Busca a data mais recente e atualiza o cartão de última atualização.
        if (metricAtualizacao) {
            const ultimaAtualizacao = registros
                .filter(registro => registro.dataAtualizacao)
                .sort((a, b) =>
                    new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao)
                )[0];

            if (ultimaAtualizacao) {
                metricAtualizacao.textContent =
                    new Date(ultimaAtualizacao.dataAtualizacao)
                        .toLocaleDateString('pt-BR');
            } else {
                metricAtualizacao.textContent = 'Sem registros';
            }
        }

    } catch (erro) {

        // 2.6 - Registra possíveis erros durante a atualização do Dashboard.
        console.error('Erro ao atualizar dashboard:', erro);
    }
}


/* =====================================================
   3. NOVO CADASTRO E EDIÇÃO DE SENHAS
   Responsável por preencher o formulário, cadastrar,
   editar e salvar os registros de senhas.
   ===================================================== */

const campoSenha = document.getElementById('senha');
const botaoMostrarSenha = document.getElementById('mostrarSenha');

// 3.1 - Localiza o formulário e identifica se é um novo cadastro ou uma edição.
const formulario = document.querySelector('.cadastro-form');

const parametros = new URLSearchParams(window.location.search);
const indiceEdicaoTexto = parametros.get("editar");
const indiceEdicao = indiceEdicaoTexto === null
    ? null
    : Number(indiceEdicaoTexto);

const botaoCancelar = document.querySelector('.cadastro-btn-cancelar');

// 3.2 - Carrega os dados do registro selecionado e preenche o formulário para edição.
if (formulario && indiceEdicao !== null) {
    async function preencherFormularioEdicao() {
        try {
            const senhas = await window.api.carregarSenhas();

            if (!Number.isInteger(indiceEdicao) ||
                indiceEdicao < 0 ||
                indiceEdicao >= senhas.length) {
                alert("Registro não encontrado.");
                return;
            }

            const registro = senhas[indiceEdicao];

            document.getElementById("nomeServico").value = registro.nomeServico ?? "";
            document.getElementById("categoria").value = registro.categoria ?? "pessoal";
            document.getElementById("usuario").value = registro.usuario ?? "";
            campoSenha.value = registro.senha ?? "";
            document.getElementById("observacoes").value = registro.observacoes ?? "";

            formulario.querySelector(".cadastro-btn-salvar").textContent = "Salvar alterações";

        } catch (erro) {
            console.error("Erro ao carregar registro para edição:", erro);
            alert("Não foi possível carregar o cadastro.");
        }
    }

    preencherFormularioEdicao();
}

// 3.3 - Permite mostrar ou ocultar a senha digitada no formulário.
if (botaoMostrarSenha && campoSenha) {

    botaoMostrarSenha.addEventListener('click', () => {

        if (campoSenha.type === 'password') {
            campoSenha.type = 'text';
        } else {
            campoSenha.type = 'password';
        }

    });

}

// 3.4 - Faz o botão Cancelar voltar para Minhas Senhas sem salvar alterações.
if (botaoCancelar && formulario) {
    botaoCancelar.addEventListener("click", () => {
        window.location.href = "minhas-senhas.html";
    });
}


// 3.5 - Controla o envio do formulário para cadastrar ou atualizar uma senha.
if (formulario && campoSenha) {

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nomeServico = document.getElementById('nomeServico').value.trim();
        const categoria = document.getElementById('categoria').value;
        const usuario = document.getElementById('usuario').value.trim();
        const senha = campoSenha.value.trim();
        const observacoes = document.getElementById('observacoes').value.trim();

        // 3.6 - Verifica se os campos obrigatórios foram preenchidos antes de salvar.
        if (!nomeServico || !usuario || !senha) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        // 3.7 - Organiza os dados preenchidos em um objeto para salvar no JSON.
        const novoCadastro = {
            nomeServico,
            categoria,
            usuario,
            senha,
            observacoes,
            dataAtualizacao: new Date().toISOString()
        };

        try {

            const senhas = await window.api.carregarSenhas();

            // 3.8 - Verifica se deve atualizar um registro existente ou cadastrar uma nova senha.
            if (indiceEdicao !== null) {
                if (
                    !Number.isInteger(indiceEdicao) ||
                    indiceEdicao < 0 ||
                    indiceEdicao >= senhas.length
                ) {
                    alert("Registro não encontrado para edição.");
                    return;
                }

                senhas[indiceEdicao] = {
                    ...senhas[indiceEdicao],
                    ...novoCadastro
                };

            } else {
                senhas.push(novoCadastro);
            }


            // 3.9 - Salva a lista atualizada de senhas no arquivo JSON.
            await window.api.salvarSenhas(senhas);

            // 3.10 - Mostra a mensagem de sucesso e retorna à listagem após uma edição.
            if (indiceEdicao !== null) {
                alert("Cadastro atualizado com sucesso!");
                window.location.href = "minhas-senhas.html";
                return;
            }

            alert("Cadastro salvo com sucesso!");

            formulario.reset();
            campoSenha.type = "password";


        } catch (erro) {

            // 3.11 - Registra erros e avisa o usuário caso não seja possível salvar.
            console.error(erro);
            alert('Erro ao salvar o cadastro.');
        }
    });

}

/* =====================================================
   3. GERADOR DE SENHAS
   Responsável por preencher o formulário, cadastrar,
   editar e salvar os registros de senhas.
   ===================================================== */

const inputTamanho = document.getElementById('tamanho');
const valorTamanho = document.getElementById('valorTamanho');
const campoSenhaGerada = document.getElementById('senhaGerada');
const botaoGerarSenha = document.getElementById('btnGerar');
const botaoCopiarSenha = document.getElementById('btnCopiar');
const barraForca = document.getElementById('barraForca');
const textoForca = document.getElementById('textoForca');

if (inputTamanho && campoSenhaGerada && botaoGerarSenha) {

    function atualizarForcaSenha(senha) {
        if (!barraForca || !textoForca) return;

        let pontos = 0;

        if (senha.length >= 8) pontos += 1;
        if (senha.length >= 12) pontos += 1;
        if (/[A-Z]/.test(senha)) pontos += 1;
        if (/[a-z]/.test(senha)) pontos += 1;
        if (/[0-9]/.test(senha)) pontos += 1;
        if (/[^A-Za-z0-9]/.test(senha)) pontos += 1;

        if (senha.length < 6 || pontos <= 2) {
            barraForca.style.width = '25%';
            barraForca.style.backgroundColor = '#ef4444';
            textoForca.textContent = 'Fraca';
            textoForca.style.color = '#ef4444';
        } else if (pontos <= 4) {
            barraForca.style.width = '60%';
            barraForca.style.backgroundColor = '#f59e0b';
            textoForca.textContent = 'Média';
            textoForca.style.color = '#d97706';
        } else if (pontos === 5) {
            barraForca.style.width = '85%';
            barraForca.style.backgroundColor = '#10b981';
            textoForca.textContent = 'Forte';
            textoForca.style.color = '#059669';
        } else {
            barraForca.style.width = '100%';
            barraForca.style.backgroundColor = '#5b46f6';
            textoForca.textContent = 'Muito forte';
            textoForca.style.color = '#5b46f6';
        }
    }

    function gerarSenha() {
        const tamanho = Math.min(16, Math.max(4, Number(inputTamanho.value)));

        let caracteres = '';
        if (document.getElementById('maiusculas')?.checked) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (document.getElementById('minusculas')?.checked) caracteres += 'abcdefghijklmnopqrstuvwxyz';
        if (document.getElementById('numeros')?.checked) caracteres += '0123456789';
        if (document.getElementById('simbolos')?.checked) caracteres += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!caracteres) {
            alert('Selecione pelo menos uma opção de caractere.');
            return;
        }

        let senha = '';
        for (let i = 0; i < tamanho; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            senha += caracteres[indice];
        }

        campoSenhaGerada.value = senha;
        atualizarForcaSenha(senha);
    }

    inputTamanho.addEventListener('input', () => {
        if (valorTamanho) {
            valorTamanho.textContent = inputTamanho.value;
        }
        gerarSenha();
    });

    ['maiusculas', 'minusculas', 'numeros', 'simbolos'].forEach((id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', gerarSenha);
        }
    });

    botaoGerarSenha.addEventListener('click', gerarSenha);

    if (botaoCopiarSenha) {
        botaoCopiarSenha.addEventListener('click', () => {
            if (!campoSenhaGerada.value) return;
            navigator.clipboard.writeText(campoSenhaGerada.value);
            alert('Senha copiada para a área de transferência!');
        });
    }

    gerarSenha();
}

// Inicialização: executa a atualização dos indicadores ao carregar a página.
atualizarDashboard();

