const requestOrg = require('request');
const util = require('util');
const fs = require('fs');
const { isNil, kebabCase } = require('lodash');
const request = util.promisify(requestOrg);

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

function getDistVaxMap(vaxScheduleRaw) {
  const districtIds = [...new Set(
    vaxScheduleRaw.filter((item) => item.district_id.startsWith("LK")).map((item => (item.district_id)))
  )];

  let distVaxMap = { };
  districtIds.forEach((id) => {
    distVaxMap[id] = [...new Set(vaxScheduleRaw.filter(item => item.district_id == id).map((item) => item.vaccine))];
  });
  return distVaxMap;
}

async function fetchData(){

  let distVaxMap = {};

  // try {
  //   const vaxScheduleRaw = await request({
  //     'method': 'GET',
  //     'url': 'https://raw.githubusercontent.com/nuuuwan/covid19/data/lk_vax_schedule/schedule.20210826.tsv',
  //   }).catch((e)=> {
  //     throw Error("Unable to fetch vax schedule");
  //   }).then((response) => (tsvJSON(response.body).filter(isValidDataVax)));
  //   distVaxMap = getDistVaxMap(vaxScheduleRaw);  
  // } catch (e) {
  //   throw Error("Unable to fetch vax schedule");
  // }

  const vaxCenters = await request({
    'method': 'GET',
    'url': 'https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.lk_vax_centers.latest.tsv',
  }).catch((e)=> {
    throw Error("Unable to fetch vax centers");
  }).then((response) => (tsvJSON(response.body).filter(isValidDataVax)));

  const transformedCenters = {
    districtSlugs: [... new Set(vaxCenters.map(a=> kebabCase(a.district)))],
    dataSet: vaxCenters.map((item) => ({
      ...item,
      districtSlug: kebabCase(item.district),
      centerSlug: kebabCase(item.center),
      vaxes: distVaxMap[item.district_id] || []
    }))
  }
  fs.writeFileSync("./data/latest.json", JSON.stringify(transformedCenters, null, 4));

  const vaxStats = await request({
    'method': 'GET',
    'url': 'https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.epid.vaxs.latest.tsv',
  }).catch((e)=> {
    throw Error("Unable to fetch vax stats");
  }).then((response) => (tsvJSON(response.body).filter(isValidDataStat)));
  
  fs.writeFileSync("./data/vax-latest.json", JSON.stringify(vaxStats, null, 4));

}

fetchData();