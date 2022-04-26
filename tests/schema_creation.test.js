const csv2sql = require('../out/csv2sql');
const fs = require('fs');
const { equal } = require('assert');

test('simple int table', async () => {
    const csv = `A; B
    0; 1
    1; 2`;

    const expectedSQL = `drop table if exists \`test\`; create table if not exists \`test\` (\`A\` int unique not null, \`B\` int unique not null); insert into \`test\` (\`A\`, \`B\`) values (0, 1), (1, 2);`;
    const sql = (await csv2sql(csv, 'test')).replaceAll(/\n|\t/g, '');

    expect(sql).toBe(expectedSQL);
});

test('simple text table', async () => {
    const csv = `A; B
    john; doe
    jane; d'oe`;

    const expectedSQL = `drop table if exists \`test\`; create table if not exists \`test\` (\`A\` text unique not null, \`B\` text unique not null); insert into \`test\` (\`A\`, \`B\`) values ('john', 'doe'), ('jane', 'd\\'oe');`;
    const sql = (await csv2sql(csv, 'test')).replaceAll(/\n|\t/g, '');

    expect(sql).toBe(expectedSQL);
});

test('simple boolean table', async () => {
    const csv = `A; B
    false; true
    True; true`;

    const expectedSQL = `drop table if exists \`test\`; create table if not exists \`test\` (\`A\` tinyint unique not null, \`B\` tinyint not null); insert into \`test\` (\`A\`, \`B\`) values (0, 1), (1, 1);`;
    const sql = (await csv2sql(csv, 'test')).replaceAll(/\n|\t/g, '');

    expect(sql).toBe(expectedSQL);
});

test('mixed table', async () => {
    const csv = `FirstName; LastName; hasGraduated; Year
    John; D'oe; true; 1987
    Alice; P'oe; false; 1989`;

    const expectedSQL = `drop table if exists \`test\`; create table if not exists \`test\` (\`FirstName\` text unique not null, \`LastName\` text unique not null, \`hasGraduated\` tinyint unique not null, \`Year\` int unique not null); insert into \`test\` (\`FirstName\`, \`LastName\`, \`hasGraduated\`, \`Year\`) values ('John', 'D\\'oe', 1, 1987), ('Alice', 'P\\'oe', 0, 1989);`;
    const sql = (await csv2sql(csv, 'test')).replaceAll(/\n|\t/g, '');
    expect(sql).toBe(expectedSQL);
});