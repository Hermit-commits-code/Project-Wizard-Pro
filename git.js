const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function initGitRepo(targetDir) {
  const gitDir = path.join(targetDir, '.git');
  if (!fs.existsSync(gitDir)) {
    execSync('git init', { cwd: targetDir });
  }
}

module.exports = { initGitRepo };
