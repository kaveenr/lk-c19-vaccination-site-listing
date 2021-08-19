var request = require('request');
const fs = require('fs');
const { snakeCase } = require('lodash');

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
    data = tsvJSON(response.body).filter(a => a.district || false);

    transform = {
      districtSlugs: (
        [... new Set(data.map(a=> a.district))]
      ),
      dataSet: data
    }
    fs.writeFileSync("./data/latest.json", JSON.stringify(transform, null, 4));
  });