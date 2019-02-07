const userSchema = {
  email: { type: String, unique: true, lowercase: true },
  password: String,
};

class User {
	constructor(email, password) {
		this.email = email;
		this.password = password;
	}
};

module.exports = User;
