const { brandsPaths } = require('@yext/pages-buildtools/webpack/config.brands.js');
let externalTemplates = require('./entries.json');

const templates = externalTemplates ? externalTemplates.templates : [
  'locationEntity',
  'stateList',
  'cityList',
  'locationList',
  'search',
  'four_oh_four',
  'internet_explorer',
  'answers'
];

function entries({ data, type }) {
  const { brand, locale } = data;
  return () => new Promise((resolve) => {
    let entries = {};

    for (let template of templates) {
      switch (type) {
        case 'js': {
          Object.assign(entries, entry({
            key: `${brand}/${template}/${locale}`,
            value: brandsPaths['js'] + `${brand}/${template}-script.js`
          }));
          break;
        }
        case 'scss': {
          const isDirectoryAsset = ['stateList', 'cityList', 'locationList'].indexOf(template) !== -1;
          const assetFolder = isDirectoryAsset ? 'directory' : template;
          Object.assign(entries, entry({
            key: `${brand}/${template}/styles`,
            value: brandsPaths['scss'] + `${brand}/${assetFolder}/default.scss`
          }));
          break;
        }
      }
    }

    resolve(entries);
  });
}

function entry ({ key, value }) {
  return {
    [key]: value
  };
}

module.exports = entries;
