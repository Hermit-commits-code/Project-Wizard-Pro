const fs = require('fs');
const path = require('path');

function renderTemplate(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || '');
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateProject({ projectName, stack, configs, outDir }) {
  const templatePath = path.join(__dirname, 'templates', `${stack}.json`);
  if (!fs.existsSync(templatePath)) throw new Error('Template not found');
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  const files = [...template.base];
  if (configs.includes('typescript') && template.typescript) files.push(...template.typescript);
  // Add more config logic as needed

  files.forEach(({ path: filePath, template: tpl }) => {
    const absPath = path.join(outDir, filePath);
    ensureDirSync(path.dirname(absPath));
    fs.writeFileSync(absPath, renderTemplate(tpl, { projectName }));
  });
}

module.exports = { generateProject };
