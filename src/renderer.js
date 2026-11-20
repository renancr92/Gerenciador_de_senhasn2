
async function testarComunicacao() {
    const resposta = await window.electronAPI.enviarMensagem('Olá, Main!');

    alert(resposta);
}

testarComunicacao();
