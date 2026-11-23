async function carregarSenhas(){
    try{
        const senhas = await window.api.carregarSenhas();

        console.log("Carregar Senhas:", senhas);
    }catch(erro){
        console.error("Erro ao carregar as Senhas:", erro);
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

