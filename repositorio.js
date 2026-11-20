
const fs = require('fs/promises');
const path = require('path');

let arquivo;

function configurarRepositorio(caminhoDados) {
    arquivo = path.join(caminhoDados, 'senhas.json');
}

async function carregarSenhas() {
    try {
        const dados = await fs.readFile(arquivo, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        if (erro.code === 'ENOENT') {
            return [];
        }

        throw erro;
    }
}

async function salvarSenhas(senhas) {
    const dados = JSON.stringify(senhas, null, 2);

    await fs.writeFile(arquivo, dados, 'utf-8');
}

module.exports = {
    configurarRepositorio,
    carregarSenhas,
    salvarSenhas
};
