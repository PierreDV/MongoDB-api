import bcrypt from 'bcrypt';

const Helper = {
	hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	}
};

export default Helper;