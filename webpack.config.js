const path = require('path');

module.exports = {
  entry: {
    main: './script/index.js',
    TiposAtividade: './script/TiposAtividade.js',
    Historico: './script/Historico.js',
    login: './script/login.js',
    constantes: './script/constantes.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
};