// mapPosition.js
// usage: node mapPosition.js <sourcemap-file> <line> <column>
const fs = require('fs');
const path = require('path');
const { SourceMapConsumer } = require('source-map');

async function main() {
  const [, , mapPath, lineStr, colStr] = process.argv;
  if (!mapPath || !lineStr || !colStr) {
    console.error('Usage: node mapPosition.js <sourcemap-file> <line> <column>');
    process.exit(2);
  }
  const mapRaw = fs.readFileSync(mapPath, 'utf8');
  const line = parseInt(lineStr, 10);
  const column = parseInt(colStr, 10);

  const consumer = await new SourceMapConsumer(mapRaw);
  const pos = consumer.originalPositionFor({ line, column });
  console.log('Mapped position:', pos);
  // pos: { source: 'src/path/YourFile.js', line: xx, column: yy, name: 'fnName' }
  consumer.destroy();
}

main().catch(e => { console.error(e); process.exit(1); });
