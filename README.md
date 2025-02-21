# Sistema de Controle de Horas Complementares

Este projeto é um trabalho da disciplina de Desenvolvimento Web do curso de Engenharia da Computação da UEMG Divinópolis.
Ele tem como objetivo gerenciar o controle de horas complementares dos alunos do curso seguindo as regras presentes no [PPC](https://uemg.br/component/phocadownload/category/2526-unidade-divinopolis?download=13440:ppc-eng-computacao-bacharelado-divinopolis-2019).

O projeto foi desenvolvido utilizando HTML, CSS, Javascript com integração ao Firebase.

O projeto pode ser acessado no seguinte endereço: [SCHC](https://guilherme-dev.com/login.html)

## Instalação
Para realizar a instalação deste projeto é necessário ter o Node instalado em sua máquina.

1.  **Clone o repositório:**

  ```bash
  git clone https://github.com/GuuilhermeRS/schc
  ```

2.  **Acesse o diretório do projeto:**

  ```bash
  cd schc
  ```

3.  **Instale as dependências:**

  ```bash
  npm install
  ```

  Este comando instalará as dependências do projeto, incluindo o Firebase e o Webpack.

4.  **Configure o Firebase:**
  *   Crie um projeto no Firebase Console ([https://console.firebase.google.com/](https://console.firebase.google.com/)).
  *   Adicione um aplicativo web ao seu projeto Firebase.
  *   Copie as configurações do Firebase (chave da API, ID do projeto, etc.).
  *   Acesse o arquivo `constantes.js` dentro da pasta `script` e preencha as configurações do Firebase

5.  **Compile os arquivos:**

    ```bash
    npm run build
    ```
    Este comando irá compilar os arquivos JavaScript usando o Webpack e gerar os arquivos bundle na pasta `dist/`.

## Uso

Abra o arquivo `index.html` no seu navegador para acessar o sistema.