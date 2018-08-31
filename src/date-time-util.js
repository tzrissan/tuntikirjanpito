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
    if (!time || time.length ===0) {
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

export function aikavaliMinuutteina(alku, loppu, lounaita = 0, oletusarvo = '-') {
    if (!alku || !loppu) {
        return oletusarvo;
    }
    const alkuH = parseInt(alku.replace(TIME_REGEX, '$1'));
    const alkuM = parseInt(alku.replace(TIME_REGEX, '$2'));
    const loppuH = parseInt(loppu.replace(TIME_REGEX, '$1'));
    const loppuM = parseInt(loppu.replace(TIME_REGEX, '$2'));
    return (loppuH - alkuH) * 60 + (loppuM - alkuM) - (lounaita * 30);
}

export function kaikkiViikotTapahtumienValilla(merkinnat = []) {
    const ekaPaiva = merkinnat.reduce((a, m) => {
        const d = moment(m.date);
        return _.isUndefined(a) || d.isBefore(a) ? d : a;
    }, undefined);

    const vikaPaiva = merkinnat.reduce((a, m) => {
        const d = moment(m.date);
        return _.isUndefined(a) || d.isAfter(a) ? d : a;
    }, undefined);

    const viikot = [];
    for (let i = moment(ekaPaiva); i.isBefore(vikaPaiva); i = i.add(7, 'days')) {
        viikot.push(moment(i));
    }
    return viikot;
}