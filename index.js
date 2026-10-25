import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

let parsed;
try {
  parsed = JSON.parse(payloadRaw);
} catch {
  throw new Error('Invalid input');
}

if (
  parsed === null ||
  typeof parsed !== 'object' ||
  Array.isArray(parsed) ||
  !Object.prototype.hasOwnProperty.call(parsed, 'records') ||
  !Object.prototype.hasOwnProperty.call(parsed, 'field')
) {
  throw new Error('Invalid input');
}

const { records, field } = parsed;

if (!Array.isArray(records) || typeof field !== 'string' || field.length === 0) {
  throw new Error('Invalid input');
}

let total = records.length;
let present = 0;
let missing = 0;
let nulls = 0;

for (let i = 0; i < records.length; i += 1) {
  const rec = records[i];
  if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
    throw new Error('Invalid input');
  }
  const has = Object.prototype.hasOwnProperty.call(rec, field);
  if (has) {
    present += 1;
    if (rec[field] === null) nulls += 1;
  } else {
    missing += 1;
  }
}

const result = { missing, nulls, present, total };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);