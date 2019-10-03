require('dotenv').config();

const fs = require('fs');
const fk = require('firebase-key');
const admin = require('firebase-admin');

const diff = require('deep-diff')

const contentPackName = process.argv[2];
const shouldExecute = process.argv[3] === "execute";

if (!contentPackName) {
  throw 'Please provide contentPack name that matches JSON file';
}

const fileString = fs.readFileSync(`./contentPacks/${contentPackName}.json`, {
  encoding: 'utf8',
});
const fileData = JSON.parse(fileString);

const contentItems = fileData.items.reduce(
  (items, fileItem) => ({
    ...items,
    [fk.encode(fileItem.name)]: {
      name: fileItem.name,
      rarity: fileItem.rarity,
    },
  }),
  {}
);

const rarityCache = {
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
};

fileData.items.forEach(fileItem => {
  rarityCache[fileItem.rarity][fk.encode(fileItem.name)] = true;
});

const fireData = {
  rarityTiers: fileData.rarityTiers,
  items: contentItems,
  rarityCache,
};

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://gaccha-bot.firebaseio.com',
});
// Initialize Firebase
const database = admin.database();

run();

async function run() {
  const contentPackRef = database.ref(`/contentPacks/${contentPackName}`);

  const contentPackSnapshot = await contentPackRef.once("value");
  const contentPack = contentPackSnapshot.val();

  // dry run
  if (!shouldExecute) {
    return console.log(diff(fireData, contentPack))
  }

  contentPackRef.update(fireData, error => {
    return console.log(error ? error : 'successful!')
  })
}
