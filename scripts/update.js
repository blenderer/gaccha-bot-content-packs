require('dotenv').config();

const fs = require('fs');
const fk = require('firebase-key');
const admin = require('firebase-admin');

const contentPackName = process.argv[2];

if (!contentPackName) {
  throw 'Please provide contentPack name that matches JSON file';
}

const fileString = fs.readFileSync(`./contentPacks/${contentPackName}.json`, {
  encoding: 'utf8',
});
console.log(JSON.parse(fileString));
