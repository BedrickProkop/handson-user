//importamos nosso modelo
let User = require("../model/user");
 
//criamos a função para salvar a entidade user e retornamos uma 
//reposta apropriada
function save(request, response) {
 
  var newUser = new User(request.body);
  newUser.save(function(error, user) {
    if(error) {
    
      response.status(500);
      response.json({message: "User validation failed!"});
    
    } else {
      response.json({message: "User successfully added!", user})
    }
  });
 
};
module.exports = {save};