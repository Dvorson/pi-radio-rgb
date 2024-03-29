const axios = require('axios');
const Promise = require('bluebird');
const fs = require('fs');

const apiKey = '0a1a1ba17d3e9397f329a0f96ed22fce226ccc9e';
const apibase = 'api.radio.net';
const paths = {
    localStations: '/info/v2/search/localstations'
};

let stations = [];
let customStations = [];

async function readStationsFromFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/stations-custom.json`, async (err, customStationsJSON) => {
            if (err) {
                return reject(console.log(err));
            } else {
                fs.readFile(`${__dirname}/stations.json`, async (err, stationsJSON) => {
                    if (err) {
                        return reject(console.log(err));
                    } else {
                        customStations = JSON.parse(customStationsJSON);
                        stations = [...customStations, ...JSON.parse(stationsJSON)];
                        resolve(stations);
                    }
                });
            }
        });
    });
}

const localStationsGetter = axios.create({
    url: `https://${apibase}${paths.localStations}`,
    params: {
        apiKey
    }
});

async function getStreamUrls(subdomain) {
    const resp = await axios.get(`https://radio.net/s/${subdomain}`, { responseType: 'text' });
    const str = resp.data;
    const startPos = str.indexOf('"streamUrls":');
    const endPos = startPos + 2000;
    let currentPos = startPos;
    const buff = [];
    while (str[currentPos] !== ']' && currentPos < endPos) {
        buff.push(str[currentPos]);
        currentPos++
    }
    buff.push(']}');
    buff.unshift('{');
    try {
        const { streamUrls } = JSON.parse(buff.join(''));
        return streamUrls
    } catch (err) {
        console.log({ str: buff.join(''), err });
    }
};

function getMatches(category) {
    const { matches } = category;
    return matches.map(({
        logo175x175: logo,
        name: {
            value: title
        },
        subdomain: {
            value: subdomain
        }
    }) => ({ logo, title: title.replace('Radio ', ''), subdomain }));
}

async function harvestMatches(data) {
    const { numberPages, categories } = data;
    const matches = getMatches(categories[0]);
    const requestPageNumbers = [...Array(numberPages - 1).keys()].map(x => x+=2);
    const restMatches = await Promise.reduce(requestPageNumbers, async (acc, pageindex) => {
        const pageMatches = await localStationsGetter.request({
            params: {
                pageindex
            },
            transformResponse: (data) => {
                const { categories: [ category ] } = JSON.parse(data);
                return getMatches(category);
            }
        });
        try {
            return [...acc, ...pageMatches.data];
        } catch (err) {
            console.log({ err, data: pageMatches.data});
            return [...acc];
        }
    }, []);
    return [...matches, ...restMatches];
}

async function updateStations() {
    const localStations = await queryLocalStations();
    stations = [...customStations, ...localStations];
    const stationsJson = JSON.stringify(localStations);
    return new Promise((resolve, reject) => {
        fs.writeFile(`${__dirname}/stations-${Date.now()}.json`, stationsJson, (err) => {
            if (err) return reject(err);
            console.log('The file has been saved!');
        });
        fs.writeFile(`${__dirname}/stations.json`, stationsJson, (err) => {
            if (err) return reject(err);
            console.log('The file has been saved!');
            return resolve();
        });
    });
}

async function queryLocalStations() {
    const resp = await localStationsGetter.request({
        transformResponse: JSON.parse
    });
    const matches = await harvestMatches(resp.data);
    return Promise.map(
        [...customStations, ...matches],
        async (station) => ({
            ...station,
            streamUrls: await getStreamUrls(station.subdomain)
        }),
        { concurrency: 5 }
    )
}

async function getLocalStations() {
    if (stations.length) return Promise.resolve(stations);
    return readStationsFromFile();
}

module.exports = {
    getLocalStations,
    updateStations
}
