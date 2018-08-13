import axios from 'axios';
import _ from 'lodash';

export const TIME_REGEX = /(\d\d?).(\d\d?)/;
export const UI_DATE_REGEX = /(\d\d?).(\d\d?).(\d{4})/;
export const DB_DATE_REGEX = /(\d{4}).(\d{2}).(\d{2})/;

export function aikavaliMinuutteina(alku, loppu, lounaita=0) {
    if (!alku || !loppu) {
        return "-";
    }
    const alkuH = parseInt(alku.replace(TIME_REGEX, '$1'));
    const alkuM = parseInt(alku.replace(TIME_REGEX, '$2'));
    const loppuH = parseInt(loppu.replace(TIME_REGEX, '$1'));
    const loppuM = parseInt(loppu.replace(TIME_REGEX, '$2'));
    return (loppuH - alkuH) * 60 + (loppuM - alkuM) - (lounaita * 30);
}


// IDEA replace
// (\d{1,2}\.\d{1,2}\.)\s*[a-zA-Z\s]*(\d{1,2}:\d\d)[\s-]*(\d{1,2}:\d\d).*(\d)
// { date: '$1.2018', tuloaika: '$2', lahtoaika: '$3', lounaat: $4 },

const data = {
    merkinnat: [
        {id: 1, date: '2018-01-02', tuloaika: '09:05', lahtoaika: '16:50', lounaita: 1},
        {id: 2, date: '2018-01-03', tuloaika: '09:10', lahtoaika: '17:30', lounaita: 2},
        {id: 3, date: '2018-01-04', tuloaika: '09:05', lahtoaika: '17:00', lounaita: 1},
        {id: 4, date: '2018-01-05', tuloaika: '08:45', lahtoaika: '16:20', lounaita: 1},
        {id: 5, date: '2018-01-09', tuloaika: '08:50', lahtoaika: '20:25', lounaita: 2},
        {id: 6, date: '2018-01-10', tuloaika: '09:10', lahtoaika: '18:00', lounaita: 1},
        {id: 7, date: '2018-01-11', tuloaika: '08:55', lahtoaika: '17:15', lounaita: 1},
        {id: 8, date: '2018-01-12', tuloaika: '09:05', lounaita: 1}
    ]
};

function laskeSaldot() {
    _.chain(data.merkinnat)
        .sortBy(['date', 'tuloaika'])
        .forEach((merkinta, index, merkinnat) => {
            if (index===0) {
                merkinta.saldo = 0;
            } else {
                const saldomuutos = aikavaliMinuutteina(merkinta.tuloaika, merkinta.lahtoaika, merkinta.lounaita) - (7.5 * 60);
                merkinta.saldo = merkinnat[index - 1].saldo + (_.isNaN(saldomuutos) ? 0 : saldomuutos);
            }

        })
        .value();
}

laskeSaldot();

axios.create().get('/tunnit.data')
    .then((response) => {
        data.merkinnat = response.data;
        laskeSaldot();
    });

const Tuntikirjanpito = {
    get() {
        return data;
    },
    laskeSaldot() {
        laskeSaldot();
    }
};


export default Tuntikirjanpito;