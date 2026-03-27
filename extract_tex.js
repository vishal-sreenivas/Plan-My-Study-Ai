const fs = require('fs');

// Read the markdown file
const md = fs.readFileSync('sampel_latex_code.md', 'utf8');

// Extract LaTeX content (remove ```latex wrapper)
let tex = md.replace(/^```latex\r?\n/, '').replace(/\r?\n```\s*$/, '');

// Comment out \includegraphics lines since images aren't available yet
// Also comment out subfigure environments that wrap images
tex = tex.replace(/^(\s*\\includegraphics.*$)/gm, '% $1  % [IMAGE PLACEHOLDER]');
tex = tex.replace(/^(\s*\\begin\{subfigure\}.*$)/gm, '% $1');
tex = tex.replace(/^(\s*\\end\{subfigure\}.*$)/gm, '% $1');

// Write the .tex file
fs.writeFileSync('report.tex', tex, 'utf8');
console.log('Created report.tex (' + tex.length + ' bytes)');
