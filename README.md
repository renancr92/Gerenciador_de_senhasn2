# SenhaForte — Gerenciador de Senhas

## Sobre o projeto

O SenhaForte é um aplicativo desktop desenvolvido com Electron, HTML, CSS e JavaScript.

O objetivo do projeto é permitir que o usuário organize seus acessos em um único lugar, podendo cadastrar, visualizar, pesquisar, editar e excluir registros de senhas.

O aplicativo utiliza armazenamento local em formato JSON e possui uma interface com diferentes telas para facilitar sua utilização.

## Tecnologias utilizadas

O SenhaForte foi desenvolvido utilizando as seguintes tecnologias:

- **Electron:** responsável pela criação do aplicativo desktop.
- **HTML5:** utilizado na estrutura das telas.
- **CSS3:** utilizado na aparência e organização da interface.
- **JavaScript:** responsável pelas funcionalidades e interações.
- **Node.js:** utilizado para trabalhar com arquivos e armazenamento.
- **JSON:** formato utilizado para armazenar os registros de senhas.

## Funcionalidades

O SenhaForte possui as seguintes funcionalidades:

- Cadastro de senhas com informações do site, usuário e categoria.
- Listagem dos registros armazenados.
- Pesquisa de senhas por site ou usuário.
- Opção para mostrar e ocultar as senhas.
- Edição dos registros cadastrados.
- Exclusão de senhas com confirmação nativa do Electron.
- Navegação entre as telas do aplicativo.
- Armazenamento local dos dados em arquivo JSON.
- Menu nativo com atalho Ctrl + N para abrir o cadastro.

## Como instalar e executar

Para executar o SenhaForte, é necessário ter o Node.js e o npm instalados no computador.

1. Baixe ou clone o repositório do projeto.
2. Abra a pasta do projeto no VS Code.
3. Abra o terminal na pasta principal.
4. Instale as dependências executando:

   `npm install`

5. Inicie o aplicativo executando:

   `npm start`

Após esses passos, o Electron abrirá a janela principal do SenhaForte.

## Armazenamento dos dados

O SenhaForte utiliza armazenamento local em um arquivo JSON para guardar os registros cadastrados.

O caminho de armazenamento é definido pelo Electron por meio de `app.getPath('userData')`, permitindo que os dados fiquem separados dos arquivos do projeto.

A leitura e a gravação dos registros são realizadas no arquivo `repositorio.js`, utilizando o módulo `fs/promises` do Node.js.

Caso o arquivo `senhas.json` ainda não exista, o aplicativo inicia com uma lista vazia, permitindo que o usuário realize seus primeiros cadastros.

**Observação:** nesta versão acadêmica, as senhas são armazenadas em JSON sem criptografia. Por isso, devem ser utilizados apenas dados fictícios para testes.

## Estrutura do projeto

O SenhaForte está organizado da seguinte forma:

- `main.js`: cria a janela do Electron, configura o menu nativo e gerencia a comunicação IPC.
- `preload.js`: disponibiliza funções para a interface utilizando o contextBridge.
- `repositorio.js`: realiza a leitura e a gravação dos registros no arquivo JSON.
- `package.json`: contém as configurações e dependências do projeto.
- `README.md`: apresenta a documentação do aplicativo.
- `src/index.html`: contém a tela principal do SenhaForte.
- `src/style.css`: define a aparência das telas.
- `src/renderer.js`: controla as interações e funcionalidades da interface.
- `src/telas/novo-cadastro.html`: apresenta o formulário para cadastrar e editar senhas.
- `src/telas/minhas-senhas.html`: apresenta a listagem, pesquisa e ações sobre os registros.
- `src/telas/gerar-senha.html`: contém a interface de geração de senhas.

Essa organização permite separar a interface, a lógica do aplicativo e o armazenamento dos dados.
