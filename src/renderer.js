
async function carregarSenhas() {
    const corpoTabela = document.getElementById("corpo-tabela-senhas");

    if (!corpoTabela) {
        return;
    }
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

    try {
        const senhas = await window.api.carregarSenhas();

        corpoTabela.replaceChildren();

        if (senhas.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 4;
            celula.textContent = "Nenhuma senha cadastrada ainda.";

            linha.appendChild(celula);
            corpoTabela.appendChild(linha);
            return;
        }

        senhas.forEach((registro) => {
            const linha = document.createElement("tr");

            const valores = [
                registro.nomeServico,
                registro.usuario,
                "••••••••",
                "—"
            ];

            
valores.forEach((valor, indice) => {
    const celula = document.createElement("td");

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
    } else {
        celula.textContent = valor;
    }

    linha.appendChild(celula);
});


            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar as senhas:", erro);
    }
}
document.addEventListener("DOMContentLoaded", carregarSenhas);
// funcionalidades novo cadastro
const campoSenha = document.getElementById('senha');
const botaoMostrarSenha = document.getElementById('mostrarSenha');

// FUNCIONALIDADES DO DASHBOARD

async function atualizarDashboard() {
    const metricTotal = document.getElementById('metric-total');
    const metricFortes = document.getElementById('metric-fortes');
    const metricAtualizacao = document.getElementById('metric-atualizacao');

    if (!metricTotal && !metricFortes && !metricAtualizacao) {
        return;
    }

    try {
        const senhas = await window.api.carregarSenhas();

        const registros = Array.isArray(senhas) ? senhas : [];

        const total = registros.length;

        const fortes = registros.filter(registro =>
            registro.senha && registro.senha.length >= 12
        ).length;

        if (metricTotal) {
            metricTotal.textContent = total;
        }

        if (metricFortes) {
            metricFortes.textContent = fortes;
        }

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
        console.error('Erro ao atualizar dashboard:', erro);
    }
}

// FUNCIONALIDADES DO NOVO CADASTRO


const formulario = document.querySelector('.cadastro-form');
const botaoCancelar = document.querySelector('.cadastro-btn-cancelar');

if (botaoMostrarSenha && campoSenha) {

    botaoMostrarSenha.addEventListener('click', () => {

        if (campoSenha.type === 'password') {
            campoSenha.type = 'text';
        } else {
            campoSenha.type = 'password';
        }

    });

}

if (botaoCancelar && formulario && campoSenha) {

    botaoCancelar.addEventListener('click', () => {

        formulario.reset();

        campoSenha.type = 'password';

    });

}

if (formulario && campoSenha) {

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nomeServico = document.getElementById('nomeServico').value.trim();
        const categoria = document.getElementById('categoria').value;
        const usuario = document.getElementById('usuario').value.trim();
        const senha = campoSenha.value.trim();
        const observacoes = document.getElementById('observacoes').value.trim();

        if (!nomeServico || !usuario || !senha) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

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

            senhas.push(novoCadastro);

            await window.api.salvarSenhas(senhas);

            alert('Cadastro salvo com sucesso!');

            formulario.reset();
            campoSenha.type = 'password';

        } catch (erro) {
            console.error(erro);
            alert('Erro ao salvar o cadastro.');
        }
    });

}

// ATUALIZAR DASHBOARD AO ABRIR A PÁGINA

atualizarDashboard();

