const axios = require('axios');
const Promise = require('bluebird');
const fs = require('fs');

const apiKey = '0a1a1ba17d3e9397f329a0f96ed22fce226ccc9e';
const apibase = 'api.radio.net';
const paths = {
    localStations: '/info/v2/search/localstations'
};

let stations = [];

fs.readFile(`${__dirname}/stations-custom.json`, async (err, customStationsJSON) => {
    if (err) {
        return console.log(err);
    } else {
        fs.readFile(`${__dirname}/stations.json`, async (err, stationsJSON) => {
            if (err) {
                return console.log(err);
            } else {
                stations = [...JSON.parse(customStationsJSON), ...JSON.parse(stationsJSON)];
            }
        });
    }
});

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
    stations = await queryLocalStations();
    const stationsJson = JSON.stringify(stations);
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
    const matches = harvestMatches(resp.data);
    return Promise.map(
        matches,
        async (station) => ({
            ...station,
            streamUrls: await getStreamUrls(station.subdomain)
        }),
        { concurrency: 5 }
    )
}

async function getLocalStations() {
    if (stations.length) return Promise.resolve(stations);
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/stations.json`, async (err, stations) => {
            if (err) {
                await updateStations();
                fs.readFile(`${__dirname}/stations.json`, (err, stations) => {
                    if (err) return reject(err);
                    resolve(JSON.parse(stations));
                });
            } else {
                resolve(JSON.parse(stations));
            }
        });
    })
}

module.exports = {
    getLocalStations,
    updateStations
}
