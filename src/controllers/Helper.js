import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
dotenv.config();

const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
    process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  },
  sendVerificationEmail(email, token) {
    const href = `${process.env.FRONT_END_HOST}/confirmation?token=${token}`
    const msg = {
      to: email,
      from: 'test@example.com',
      subject: 'SmplBlg email verification',
      html: `Please visit the following <a href="${href}">link</a> to verify your email.`
    };
    sgMail.send(msg);
  }
};

export default Helper;