import * as Yup from 'yup';
import Git from "nodegit";
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    repo: Yup.string().required(),
    branch: Yup.string().min(2),
    folder: Yup.string(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { repo, branch, folder } = req.body;

  if (folder.split(':').length > 1) {
    req.Folders = folder.split(':');
  }

  try {
    req.Path = path.join(returnHomeDir(), 'tmp', req.userId + '_' + repo.split('/').pop().split('.')[0]);

    if (fs.existsSync(req.Path)) {
      rimraf.sync(req.Path);
    }

    await Git.Clone(repo, req.Path, {
      checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
      checkoutBranch: branch
    }).catch(function(err) { 
      return res.status(500).json({ message: 'Error during clone of the repository: ' + err })
    });

    return next();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

function returnHomeDir() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}