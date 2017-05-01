let express = require("express");
let app = express();
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
 
//configuramos o banco de acordo com ambiente setado
let dbConfig = require("./app/dbconfig")[app.settings.env];
//definimos a porta na qual a aplicação irá executar
let serverPort = process.env.PORT || 3000;
 
//recuperamos nosso arquivo de rotas
let user = require("./app/route/user");
 
//http://stackoverflow.com/a/41837255
//bluebird foi adicionado devido ao erro "DeprecationWarning:
//Mongoose: mpromise (mongoose's default promise library)"
mongoose.Promise = require('bluebird');

//conectamos ao banco de dados
mongoose.connect(dbConfig.connectionString);
mongoose.connection.on("error", console.error.bind(console, 
  "connection error:"));
 
//configuramos a aplicação para fazer a conversão para json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
//exibimos um response para a rota raiz
app.get("/", function(request, response){
 response.json({message: "This is the root of application"});
});
 
//definimos a rota para a criação do usuário passando como 
//parametro do post o método save que será criado no arquivo 
//de rotas
app.route("/user")
 .post(user.save);
 
//fazemos com que a aplicação execute na porta definida acima
app.listen(serverPort);
 
//exportamos app para ser visível nos testes
module.exports = app;
 
//Apenas para log
console.log("Environment: " + app.settings.env);
console.log("Listen on: http://localhost:" + serverPort);
console.log("Database: " + dbConfig.connectionString);
