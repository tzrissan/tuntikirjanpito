import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';

export const TIME_REGEX = /(\d\d?).(\d\d?)/;
export const UI_DATE_REGEX = /(\d\d?).(\d\d?).(\d{4})/;
export const DB_DATE_REGEX = /(\d{4}).(\d{2}).(\d{2})/;

export function nyt() {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();
    let minuteRounded = Math.round(minute / 5) * 5;
    if (minuteRounded >= 60) {
        hour++;
        minuteRounded -= 60;
    }
    const hourFormatted = numeral(hour).format('00');
    const minuteRoundedAndFormatted = numeral(minuteRounded).format('00');
    return `${hourFormatted}:${minuteRoundedAndFormatted}`;
}

export function formatTimeFromString(time) {
    if (!time || time.length === 0) {
        return undefined;
    } else {
        const hour = numeral(time.replace(TIME_REGEX, '$1')).format('00');
        const minute = numeral(time.replace(TIME_REGEX, '$2')).format('00');
        return `${hour}:${minute}`;
    }
}

export function formatUiDateFromDbString(date) {
    const day = numeral(date.replace(DB_DATE_REGEX, '$3')).format('00');
    const month = numeral(date.replace(DB_DATE_REGEX, '$2')).format('00');
    const year = numeral(date.replace(DB_DATE_REGEX, '$1')).format('0000');
    return `${day}.${month}.${year}`;
}

export function formatDbDateFromUiString(date) {
    const day = numeral(date.replace(UI_DATE_REGEX, '$1')).format('00');
    const month = numeral(date.replace(UI_DATE_REGEX, '$2')).format('00');
    const year = numeral(date.replace(UI_DATE_REGEX, '$3')).format('0000');
    return `${year}-${month}-${day}`;
}

export function tanaan() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

export function aikavaliMinuutteina(alku, loppu, lounaita = 0, oletusarvo = undefined) {
    if (!alku || !loppu) {
        return oletusarvo;
    }
    const alkuH = parseInt(alku.replace(TIME_REGEX, '$1'));
    const alkuM = parseInt(alku.replace(TIME_REGEX, '$2'));
    const loppuH = parseInt(loppu.replace(TIME_REGEX, '$1'));
    const loppuM = parseInt(loppu.replace(TIME_REGEX, '$2'));
    return (loppuH - alkuH) * 60 + (loppuM - alkuM) - (lounaita * 30);
}

export function aikavali2UiStr(aikavaliMinuutteina, naytaPlusMerkki = false) {
    if (_.isNumber(aikavaliMinuutteina) && !_.isNaN(aikavaliMinuutteina)) {
        const sign = aikavaliMinuutteina < 0 ? '-' : (aikavaliMinuutteina > 0 && naytaPlusMerkki ? '+' : '');
        const minuutteja = Math.abs(aikavaliMinuutteina);
        const d = numeral(Math.trunc(minuutteja / (24 * 60))).format('0');
        const h = numeral(Math.trunc(minuutteja / 60) - (d * 24)).format('00');
        const m = numeral(Math.trunc(minuutteja % 60)).format('00');
        const fullText = `${sign}${d}:${h}:${m}`;
        return fullText.replace(/^([+-]?)0:0?([1-9]?[0-9]:)/, '$1$2').replace(/^0:00$/, '-');
    } else {
        return aikavaliMinuutteina;
    }
}

export function minuutitKellonaikana(minuuttia = 0) {
    const h = Math.trunc(minuuttia / 60);
    const m = Math.trunc(minuuttia % 60);
    return numeral(h).format('00') + ':' + numeral(m).format('00')
}

export function kaikkiAikavalit(alku, loppu, step = 'week') {
    const aikavalit = [];
    for (let i = moment(alku).startOf(step); !i.isAfter(loppu); i = i.add(1, step)) {
        aikavalit.push({
            alku: moment(i).startOf(step),
            loppu: moment(i).endOf(step),
        });
    }
    return aikavalit;
}

export function kaikkiAikavalitTapahtumienValilla(merkinnat = [], step = 'week') {
    const ekaPaiva = moment(merkinnat.reduce((a, m) => {
        return _.isUndefined(a) || m.paiva.isBefore(a) ? moment(m.paiva) : a;
    }, undefined));
    ekaPaiva.startOf(step);

    const vikaPaiva = moment(merkinnat.reduce((a, m) => {
        return _.isUndefined(a) || m.paiva.isAfter(a) ? moment(m.paiva) : a;
    }, undefined));
    vikaPaiva.endOf(step);

    return kaikkiAikavalit(ekaPaiva, vikaPaiva, step)
}
