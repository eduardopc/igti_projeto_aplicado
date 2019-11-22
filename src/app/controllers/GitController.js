import * as Yup from 'yup';
import Git from "nodegit";
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

class GitController {
  async store(req, res) {
    const schema = Yup.object().shape({
      repo: Yup.string().required(),
      branch: Yup.string().min(2)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { repo, branch } = req.body;
    const homeDir = path.join(returnHomeDir(), 'tmp', req.userId + '_' + repo.split('/').pop());

    if (fs.existsSync(homeDir)) {
      rimraf.sync(homeDir);
    }

    await Git.Clone(repo, homeDir, {
      checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
      checkoutBranch: branch
    })
    .then(() => {
      return res.status(200).json({ message: 'Repository was cloned succesfully.' });
    })
  }
}

function returnHomeDir() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

export default new GitController();