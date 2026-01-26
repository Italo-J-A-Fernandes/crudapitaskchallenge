import fs from 'node:fs';
import { parse } from 'csv-parse';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.resolve(__dirname, '../tasks_import.csv');
const readableStream = fs.createReadStream(csvFilePath, 'utf8');

const processFile = async () => {
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  readableStream.pipe(parser);

  parser.on('data', (row) => {
    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(row),
    }).catch((error) => {
      console.error('Erro:', error);
    });
  });

  parser.on('end', () => {
    console.log('Análise do CSV concluída!');
  });

  parser.on('error', (err) => {
    console.error('Erro ao analisar o CSV:', err);
  });
};

(async () => {
  await processFile();
})();
