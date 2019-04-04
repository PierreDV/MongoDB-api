import moment from 'moment';
import uuidv4 from 'uuid/v4';
import crypto from 'crypto-random-string'
import db from '../db';
import Helper from './Helper';

const User = {
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing.'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({'message': 'Please enter a valid email address.'});
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createUserQuery = `INSERT INTO
      users(id, email, password, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5)
      returning *`;

    const userValues = [
      uuidv4(),
      req.body.email,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const user = await db.query(createUserQuery, userValues);

      const createVerifyTokenQuery = `INSERT INTO
      verification_tokens(id, token, user_id, created_at)
      VALUES($1, $2, $3, $4)
      returning *`;

      const verifyTokenValues = [
        uuidv4(),
        crypto(14),
        user.rows[0].id,
        moment(new Date())
      ];

      const verifyToken = await db.query(createVerifyTokenQuery, verifyTokenValues);

      Helper.sendVerificationEmail(user.rows[0].email, verifyToken.rows[0].token)
      return res.status(201).send({
        message: 'Please verify your email'
      });
      // We do not want to send a token at signup anymore, we will 
      // instead create a verification token and send it to user via email.

      // const token = Helper.generateToken(rows[0].id);
      // return res.status(201).send({ 
      //   token,
      //   isAdmin: rows[0].admin 
      // });
    } catch(error) {
      if(error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that email already exists.'});
      }
      return res.status(400).send(error);
    }
  },
  async login(req, res) {
    if(!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing.'});
    }
    if(!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({'message': 'Please enter a valid email address.'});
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if(!rows[0]) {
        return res.status(400).send({'message': 'The credentials provided are invalid.'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({'message': 'The password you provided does not match the account.'})
      }
      if(!rows[0].confirmed) {
        return res.status(400).send({'message': 'You need to confirm your email'});
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(200).send({ 
        token,
        isAdmin: rows[0].admin  
      });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  async verify(req, res) {
    const { token } = req.body
    const queryText = `SELECT * FROM verification_tokens
      WHERE token = '${token}'`;
    try {
      const verifyToken = await db.query(queryText);
      if(!verifyToken.rows[0]) {
        return res.status(400).send({'message': 'There is no user associated with given token'});
      }
      const updateQuery = `UPDATE users
        SET confirmed = true
        WHERE id = '${verifyToken.rows[0].user_id}'
        returning *`;
      const confirmedUser = await db.query(updateQuery);
      const authToken = Helper.generateToken(confirmedUser.rows[0].id);
      return res.status(200).send({ 
        token: authToken,
        isAdmin: confirmedUser.rows[0].admin 
      });
    } catch(error) {
      console.log(error)
      return res.status(400).send(error);
    }
    
  }
}

export default User;