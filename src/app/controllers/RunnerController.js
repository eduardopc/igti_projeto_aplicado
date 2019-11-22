import cmd from 'node-cmd';
import path from 'path';

class RunnerController {
  async store(req, res) {
    if (req.Folders != undefined) {
      req.Folders.forEach(function(item) {
        req.Path = path.join(req.Path, item)
      })
    };

    const { command } = req.body;

    cmd.get(
      `
       cd ${req.Path}
       ${command}
      `, 
      function(err, data, stderr) {
        if (!err) {
          return res.json({ output: data })
        } else {
          return res.status(500).json({ message: 'Error during execution: ' + err })
        }
      }
    )
  }
}

export default new RunnerController();