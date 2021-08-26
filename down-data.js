var request = require('request');
const fs = require('fs');
const { isNil, kebabCase } = require('lodash');

const isValidDataVax = (itm) => {
  return (!isNil(itm.district) && (itm.district != "")) && !isNil(itm.center) && (itm.center != "");
}

const isValidDataStat = (itm) => {
  return (!isNil(itm.date) && (itm.date != "")) && !isNil(itm.cum_total) && (itm.cum_total != "");
}

function tsvJSON(tsv) {
    const lines = tsv.split('\n');
    const headers = lines.shift().split('\t');
    return lines.map(line => {
      const data = line.split('\t');
      return headers.reduce((obj, nextKey, index) => {
        obj[nextKey.trim()] = data[index];
        return obj;
      }, {});
    });
}

var options = {
    'method': 'GET',
    'url': 'https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.lk_vax_centers.latest.tsv',
    'headers': {
    }
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  data = tsvJSON(response.body).filter(isValidDataVax).map((item) => ({
    ...item,
    districtSlug: kebabCase(item.district),
    centerSlug: kebabCase(item.center),
  }));

  transform = {
    districtSlugs: (
      [... new Set(data.map(a=> a.districtSlug))]
    ),
    dataSet: data
  }
  fs.writeFileSync("./data/latest.json", JSON.stringify(transform, null, 4));
});

var options = {
  'method': 'GET',
  'url': 'https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.epid.vaxs.latest.tsv',
  'headers': {
  }
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  data = tsvJSON(response.body).filter(isValidDataStat);
  fs.writeFileSync("./data/vax-latest.json", JSON.stringify(data, null, 4));
});