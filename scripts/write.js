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
const fileData = JSON.parse(fileString);

const contentItems = fileData.items.reduce((items, fileItem) => ({
  ...items,
  [fk.encode(fileItem.name)]: {
    name: fileItem.name,
    rarity: fileItem.rarity,
  }
}), {});

const rarityCache = {
  0: {

  },
  1: {

  },
  2: {

  },
  3: {

  },
  4: {

  },
};

fileData.items.forEach((fileItem => {
  rarityCache[fileItem.rarity][fk.encode(fileItem.name)] = true;
}));

const fireData = {
  rarityTiers: fileData.rarityTiers,
  items: contentItems,
  rarityCache,
}

console.log(fireData)


