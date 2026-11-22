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
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nomeServico = document.getElementById('nomeServico').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const senha = campoSenha.value.trim();

    if (!nomeServico || !usuario || !senha) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    alert('Dados validados com sucesso!');
});
