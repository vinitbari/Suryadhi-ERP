const fs = require('fs');
const lines = fs.readFileSync('schema.prisma', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('enum ')) console.log(i + 1, l);
});
