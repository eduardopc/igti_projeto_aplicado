import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../schemas/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res){
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });
  
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      const { email, password } = req.body;

      let user = await User.findOne({ email });

      if(!user){
          user = await User.create({ email, password });
      } else {
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      }

      const { id } = user;

      return res.json({
        user: {
          id,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    }
}

export default new SessionController();