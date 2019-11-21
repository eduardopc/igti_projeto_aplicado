import * as Yup from 'yup';
import Git from "nodegit";
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

class GitController {
  async store(req, res) {
    const schema = Yup.object().shape({
      repo: Yup.string().required(),
      cloneBranch: Yup.boolean().required(),
      pullBranch: Yup.object().shape({
        value: Yup.boolean().required(),
        branch: Yup.string().when('value', (valor, field) => {
          return valor ? field.required() : field;
        }),
      })
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { repo, cloneBranch, pullBranch } = req.body;
    const homeDir = path.join(returnHomeDir(), 'tmp', repo.split('/').pop());

    if (fs.existsSync(homeDir) || cloneBranch) {
      rimraf.sync(homeDir);
    }

    if (!pullBranch.value) {
      await Git.Clone(repo, homeDir)
      .then(() => {
        return res.json({ message: 'Repository was cloned succesfully.' });
      })
    } else {
      
    }

    return res.json('test');
  }
}

function returnHomeDir() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

export default new GitController();