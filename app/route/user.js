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

function findAll(request, response) {
	User.find(function(error, users) {
		if (error) {
			response.status(500);
			response.json({message: "Users not found"});
		} else {
			response.json({message: "Users retrieved", users});
		}
	});
};

function findById(request, response){
	let id = request.params.id;
	User.findOne({_id: id}, function(error, user) {
		if (error) {
			response.status(500);
			response.json({message: "User not found"})
		} else {
			response.json({message: "User " + id + " retrieved", user});
		}
	});
}

function update(request, response) {
	let id = request.params.id;
	User.findOne({_id: id}, function(error, user){
		user.name = request.body.name;
		user.email = request.body.email;
		user.birthDate = request.body.birthDate;
		user.gender = request.body.gender;

		user.save(function(err) {
			if (err) {
				response.status(500);
				response.json({message: "User update failed"});
			} else {
				response.json({message: "User " + id + " updated", user});
			}
		});
	});
}

function remove(request, response) {
	let id = request.params.id;
	User.findOne({_id: id}, function(error, user) {
		user.remove(function(err) {

			if (err) {
				response.status(500);
				response.json({message: "Error removing user " + id});
			} else {
				response.json({message: "User " + id + " removed"});
			}

		});
	});
}

module.exports = {save, findAll, findById, update, remove};