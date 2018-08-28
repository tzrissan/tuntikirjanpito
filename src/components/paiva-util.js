import _ from "lodash";

const v2018alkusaldo = 18.0;
const v2018alkuvirhe = 0;

function laskeSaldomuutos(pvm, kirjaus=0) {
    //FIXME: Nyt oletetaan aina olevan arkipäivä. Ota la/su/pyhät yms huomioon
    return (_.isNumber(kirjaus) && !_.isNaN(kirjaus) ? kirjaus : 0) - 7.5;
}

function laskePaivienMeta(paivat) {
    function sum(acc, n) {
        return acc + n;
    }
    return _.chain(paivat)
        .sortBy('date')
        .map((paiva, idx, all) => {
            paiva.kirjaus = paiva.merkinnat.map(m => m.kirjaus).reduce(sum, 0);
            paiva.lounaita = paiva.merkinnat.map(m => m.lounaita).reduce(sum, 0);
            paiva.saldomuutos = laskeSaldomuutos(paiva.date, paiva.kirjaus);
            paiva.saldo = (idx ? all[idx - 1].saldo : v2018alkusaldo) + (_.isNaN(paiva.saldomuutos) ? 0 : paiva.saldomuutos);
            paiva.tyoaika = paiva.merkinnat.map(m => m.tyoaika).reduce(sum, 0);
            paiva.kirjausvirheenmuutos = paiva.tyoaika - (paiva.kirjaus * 60);
            paiva.kirjausvirhe = (idx ? all[idx - 1].kirjausvirhe : v2018alkuvirhe) + (_.isNaN(paiva.kirjausvirheenmuutos) ? 0 : paiva.kirjausvirheenmuutos);

            return paiva;
        })
        .value();
}

function laskevassaJarjestyksessa(paivat) {
    return _.sortBy(paivat, ['date', 'tuloaika']).reverse();
}

export function yhdistaPaivat(merkinnat) {
    return laskevassaJarjestyksessa(
        laskePaivienMeta(
            _.chain(merkinnat)
                .groupBy('date')
                .toPairs()
                .map(pair => {
                    return {
                        date: pair[0],
                        merkinnat: _.sortBy(pair[1], ['tuloaika', 'lahtoaika'])
                    }
                })
                .value()
        )
    );
}