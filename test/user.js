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
let server = require("../server");

//Recuperamos o UserSchema para realizarmos algumas 
//operações durante os testes
let User = require("../app/model/user");

//Agrupamos nossos testes do CRUD de user
describe("Crud user", function(){

  //Antes de executarmos os testes vamos adicionar 
  //um usuário ao banco
  before(function(done){
    let newUser = new User({
      name: "Fernanda", email: "fernanda@gmail.com", 
        birthDate: new Date(), gender: "Female"
    });
    newUser.save(function(error){
      done();
    })
  });

  //Após todos os testes serem executados, dropamos 
  //a base
  after(function(done){
    User.collection.drop();
    done();
  });

  //Antes de cada teste podemos alguma instrução
  beforeEach(function(done) {
    done();
  });

  //Após cada teste podemos executar alguma instrução
  afterEach(function(done){
    done();
  });


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

    it("it should not create a invalid user", function(done){
   
      //criamos o user sem o birthDate
      let user = {
        name: "Bedrick Prokop", email: "bedrickp@gmail.com", 
        gender: "Male"};
   
      //e fazemos a requisição
      chai.request(server)
      .post("/user")
      .send(user)
      .end(function(error, response) {
   
        //definimos o status como 500 pois esperamos um erro
        //do servidor
        response.should.have.status(500);
        response.body.should.be.a("object");
         
        //esperamos uma mensagem de erro no body
        response.body.should.have.property("message")
          .eql("User validation failed!");
   
        done();
      });
   
    });

  });

  describe("Retrieve user", function(){
    it("it should retrieve all users", function(done){
      chai.request(server)
      .get("/user")
      .end(function(error, response){

        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("message")
          .eql("Users retrieved");

        response.body.should.have.property("users");
        response.body.users.should.be.a("array");

        done();

      });
    });

    it("it should retrieve one user by id", function(done){
      let birthDate = new Date();
      let newUser = new User({
        name:"Margarette", email: "margarette@gmail.com", 
        birthDate: birthDate, gender: "Female"
      });
      newUser.save(function(error, user) {
        
        chai.request(server)
        .get("/user/" + user._id)
        .end(function(err, response) {

          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("message")
            .eql("User " + user._id + " retrieved");

          response.body.should.have.property("user");
          response.body.user.should.have.be.a("object");

          response.body.user.should.have.property("name")
            .eql("Margarette");
          response.body.user.should.have.property("email")
            .eql("margarette@gmail.com");
          response.body.user.should.have.property("gender")
            .eql("Female");

          done();

        });
      });

    });

    it("it shouldn't retrieve a user by incorrect id", function(done){
      chai.request(server)
      .get("/user/999")
      .end(function(error, response) {
        response.should.have.status(500);
        response.body.should.be.a("object");
        response.body.should.have.property("message")
          .eql("User not found");

        done();
      });
    });
  });

  describe("Update user", function(){
    it("it should update a user", function(done){

      let newUser = new User({
        name: "Fred", email: "FRED@gmail.com", 
        birthDate: new Date(), gender: "Male"
      });

      newUser.save(function(error, user) {
        user.name = "Frederico";
        user.email = "frederico@gmail.com";


        chai.request(server)
        .put("/user/" + user._id)
        .send(user)
        .end(function(err, response) {

          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("message")
            .eql("User " + user._id + " updated");

          response.body.should.have.property("user");
          response.body.user.should.have.property("name")
            .eql("Frederico");
          response.body.user.should.have.property("email")
            .eql("frederico@gmail.com");

          done();
        });

      });
    });
  });

  describe("Delete user", function(){
    it("it should delete a user by id", function(done){
      let newUser = new User({
        name: "Amanda", email: "amanda@hotmail.com", 
        birthDate: new Date(), gender: "Female"
      });

      newUser.save(function(error, user){

        chai.request(server)
        .delete("/user/" + user._id)
        .end(function(err, response){

          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("message")
            .eql("User " + user._id + " removed");

          done();
          
        });
      });
    });

  });

});