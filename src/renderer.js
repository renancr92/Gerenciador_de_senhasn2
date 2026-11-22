// funcionalidades novo cadastro
const campoSenha = document.getElementById('senha');
const botaoMostrarSenha = document.getElementById('mostrarSenha');

botaoMostrarSenha.addEventListener('click', () => {

    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
    } else {
        campoSenha.type = 'password';
    }

});
const formulario = document.querySelector('.cadastro-form');
const botaoCancelar = document.querySelector('.cadastro-btn-cancelar');

botaoCancelar.addEventListener('click', () => {

    formulario.reset();

    campoSenha.type = 'password';

});
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
        observacoes
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
// fim novo cadastro