//definimos que nosso ambiente está no modo teste
process.env.NODE_ENV = "test";
 
//Fazemos o setup da variável chai e chai-http
let chai = require("chai");
let chaiHttp = require("chai-http");
 
//Adicionamos o plugin chaiHttp ao chai para podermos fazer 
//nossas requisições
chai.use(chaiHttp);
 
//Executamos a função should()
chai.should();
 
//Recuperamos nosso server que está na raiz, mas ainda não 
//implementado
let server = require('../server');
 
//Agrupamos nossos testes de criar usuários com describe()
describe("Create user", function(){
 
  //usamos a função it() para criar o teste
  it("it should create a user", function(done){
 
    //criamos o objeto user
    let user = {
      name: "Bedrick Prokop", email: "bedrickp@gmail.com", 
      birthDate: new Date(), gender: "Male"};
 
    //fazemos requisição ao server com o chai definindo o tipo
    //e o path e passando o objeto user como argumento
    chai.request(server)
    .post("/user")
    .send(user)
    .end(function(error, response) {
       
      //repare que é a sintaxe é bastante intuitiva
      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.property("message")
        .eql("User successfully added!");
 
      response.body.user.should.have.property("name");
      response.body.user.should.have.property("email");
      response.body.user.should.have.property("birthDate");
      response.body.user.should.have.property("gender");
       
      done();
 
    });
  });
});
