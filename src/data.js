import axios from 'axios';
import { aikavaliMinuutteina } from './date-time-util';

export const PROD = !window.location.href.match(/localhost/);

const data = {
    merkinnat: []
};

function laskeMerkintojenMeta(merkinnat) {
    merkinnat.forEach(m => {
        m.tyoaika = aikavaliMinuutteina(m.tuloaika, m.lahtoaika, m.lounaita, 0);
        m.kirjausvirhe = m.tyoaika - (m.kirjaus * 60);
    });
    return merkinnat;
}

if (PROD) {
    axios.create().get('/tunnit.data')
        .then((response) => {
            const merkinnat = response.data;
            data.merkinnat = laskeMerkintojenMeta(merkinnat);
        });
} else {
    setTimeout(function(){
        const merkinnat = [
            {"lahtoaika": "16:50", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-01-02", "lounaita": 1, "id": 159},
            {"lahtoaika": "17:30", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-01-03", "lounaita": 2, "id": 160},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-01-04", "lounaita": 1, "id": 161},
            {"lahtoaika": "16:20", "kommentti": null, "tuloaika": "08:45", "kirjaus": 7.0, "date": "2018-01-05", "lounaita": 1, "id": 162},
            {"lahtoaika": "16:30", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.0, "date": "2018-01-08", "lounaita": 1, "id": 163},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "08:50", "kirjaus": 7.5, "date": "2018-01-09", "lounaita": 2, "id": 164},
            {"lahtoaika": "18:00", "kommentti": null, "tuloaika": "09:10", "kirjaus": 8.5, "date": "2018-01-10", "lounaita": 1, "id": 165},
            {"lahtoaika": "17:15", "kommentti": null, "tuloaika": "08:55", "kirjaus": 7.5, "date": "2018-01-11", "lounaita": 1, "id": 166},
            {"lahtoaika": "16:00", "kommentti": "Folkkis", "tuloaika": "09:05", "kirjaus": 6.5, "date": "2018-01-12", "lounaita": 1, "id": 167},
            {"lahtoaika": "17:55", "kommentti": null, "tuloaika": "08:55", "kirjaus": 8.5, "date": "2018-01-22", "lounaita": 1, "id": 168},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-01-23", "lounaita": 1, "id": 169},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-01-24", "lounaita": 1, "id": 170},
            {"lahtoaika": "18:15", "kommentti": null, "tuloaika": "08:55", "kirjaus": 7.5, "date": "2018-01-25", "lounaita": 3, "id": 171},
            {"lahtoaika": "16:25", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.0, "date": "2018-01-26", "lounaita": 1, "id": 172},
            {"lahtoaika": "17:55", "kommentti": null, "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-01-29", "lounaita": 2, "id": 173},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-01-30", "lounaita": 1, "id": 174},
            {"lahtoaika": "17:30", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-01-31", "lounaita": 2, "id": 175},
            {"lahtoaika": "17:10", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-02-01", "lounaita": 1, "id": 176},
            {"lahtoaika": "16:00", "kommentti": null, "tuloaika": "08:50", "kirjaus": 6.5, "date": "2018-02-02", "lounaita": 1, "id": 177},
            {"lahtoaika": "14:00", "kommentti": null, "tuloaika": "08:40", "kirjaus": null, "date": "2018-02-05", "lounaita": 0, "id": 178},
            {"lahtoaika": "17:45", "kommentti": null, "tuloaika": "16:35", "kirjaus": 5.5, "date": "2018-02-05", "lounaita": 2, "id": 179},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-02-06", "lounaita": 1, "id": 180},
            {"lahtoaika": "18:25", "kommentti": null, "tuloaika": "09:10", "kirjaus": 8.5, "date": "2018-02-07", "lounaita": 1, "id": 181},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "08:10", "kirjaus": 8.0, "date": "2018-02-08", "lounaita": 1, "id": 182},
            {"lahtoaika": "18:00", "kommentti": null, "tuloaika": "09:05", "kirjaus": 8.0, "date": "2018-02-09", "lounaita": 2, "id": 183},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-02-12", "lounaita": 2, "id": 184},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-02-13", "lounaita": 1, "id": 185},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "08:55", "kirjaus": 8.5, "date": "2018-02-14", "lounaita": 1, "id": 186},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "08:15", "kirjaus": 8.0, "date": "2018-02-15", "lounaita": 1, "id": 187},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.0, "date": "2018-02-16", "lounaita": 3, "id": 188},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:05", "kirjaus": 8.0, "date": "2018-02-19", "lounaita": 1, "id": 189},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "08:55", "kirjaus": 8.0, "date": "2018-02-20", "lounaita": 1, "id": 190},
            {"lahtoaika": "14:10", "kommentti": "Markun l\u00e4ksi\u00e4iset oli tiistaina. Aika rapea olo.", "tuloaika": "09:45", "kirjaus": 4.5, "date": "2018-02-21", "lounaita": 1, "id": 191},
            {"lahtoaika": "18:30", "kommentti": "Suomen peli keskell\u00e4 p\u00e4iv\u00e4\u00e4", "tuloaika": "16:25", "kirjaus": 1.5, "date": "2018-02-21", "lounaita": 0, "id": 192},
            {"lahtoaika": "16:25", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.0, "date": "2018-02-22", "lounaita": 1, "id": 193},
            {"lahtoaika": "17:15", "kommentti": null, "tuloaika": "08:50", "kirjaus": 7.5, "date": "2018-02-23", "lounaita": 2, "id": 194},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:05", "kirjaus": 8.0, "date": "2018-02-26", "lounaita": 1, "id": 195},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-02-27", "lounaita": 1, "id": 196},
            {"lahtoaika": "17:30", "kommentti": "Viikki", "tuloaika": "08:55", "kirjaus": 8.0, "date": "2018-02-28", "lounaita": 1, "id": 197},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "08:50", "kirjaus": 7.5, "date": "2018-03-01", "lounaita": 1, "id": 198},
            {"lahtoaika": "20:30", "kommentti": null, "tuloaika": "09:00", "kirjaus": 11.0, "date": "2018-03-02", "lounaita": 1, "id": 199},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:05", "kirjaus": 8.0, "date": "2018-03-05", "lounaita": 1, "id": 200},
            {"lahtoaika": "16:40", "kommentti": "Viikki", "tuloaika": "08:40", "kirjaus": 7.5, "date": "2018-03-06", "lounaita": 1, "id": 201},
            {"lahtoaika": "18:50", "kommentti": null, "tuloaika": "09:00", "kirjaus": 9.0, "date": "2018-03-07", "lounaita": 2, "id": 202},
            {"lahtoaika": "16:00", "kommentti": "Viikki", "tuloaika": "08:40", "kirjaus": 7.0, "date": "2018-03-08", "lounaita": 1, "id": 203},
            {"lahtoaika": "16:15", "kommentti": null, "tuloaika": "09:00", "kirjaus": 6.0, "date": "2018-03-09", "lounaita": 2, "id": 204},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:20", "kirjaus": 8.0, "date": "2018-03-12", "lounaita": 1, "id": 205},
            {"lahtoaika": "17:25", "kommentti": null, "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-03-13", "lounaita": 1, "id": 206},
            {"lahtoaika": "16:15", "kommentti": "Viikki", "tuloaika": "08:55", "kirjaus": 7.0, "date": "2018-03-14", "lounaita": 1, "id": 207},
            {"lahtoaika": "17:10", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-03-15", "lounaita": 1, "id": 208},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-03-16", "lounaita": 1, "id": 209},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:15", "kirjaus": 8.0, "date": "2018-03-19", "lounaita": 1, "id": 210},
            {"lahtoaika": "16:50", "kommentti": "Viikki", "tuloaika": "08:45", "kirjaus": 7.5, "date": "2018-03-20", "lounaita": 1, "id": 211},
            {"lahtoaika": "11:50", "kommentti": null, "tuloaika": "09:05", "kirjaus": null, "date": "2018-03-21", "lounaita": 0, "id": 212},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "13:35", "kirjaus": 6.0, "date": "2018-03-21", "lounaita": 0, "id": 213},
            {"lahtoaika": "16:50", "kommentti": "Viikki", "tuloaika": "08:45", "kirjaus": 7.5, "date": "2018-03-22", "lounaita": 1, "id": 214},
            {"lahtoaika": "16:05", "kommentti": null, "tuloaika": "09:05", "kirjaus": 6.5, "date": "2018-03-23", "lounaita": 1, "id": 215},
            {"lahtoaika": "17:50", "kommentti": null, "tuloaika": "09:05", "kirjaus": 8.0, "date": "2018-03-26", "lounaita": 1, "id": 216},
            {"lahtoaika": "17:10", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-03-27", "lounaita": 1, "id": 217},
            {"lahtoaika": "16:40", "kommentti": null, "tuloaika": "08:30", "kirjaus": 7.5, "date": "2018-03-28", "lounaita": 1, "id": 218},
            {"lahtoaika": "16:30", "kommentti": "Viikki", "tuloaika": "09:05", "kirjaus": 7.0, "date": "2018-03-29", "lounaita": 1, "id": 219},
            {"lahtoaika": "17:35", "kommentti": null, "tuloaika": "08:30", "kirjaus": 8.0, "date": "2018-04-09", "lounaita": 2, "id": 220},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-04-10", "lounaita": 1, "id": 221},
            {"lahtoaika": "16:15", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 7.0, "date": "2018-04-11", "lounaita": 1, "id": 222},
            {"lahtoaika": "16:30", "kommentti": "Viikki", "tuloaika": "08:55", "kirjaus": 7.0, "date": "2018-04-12", "lounaita": 1, "id": 223},
            {"lahtoaika": "12:15", "kommentti": "P\u00e4rr\u00e4 ulos talviparkista", "tuloaika": "08:45", "kirjaus": 3.0, "date": "2018-04-13", "lounaita": 1, "id": 224},
            {"lahtoaika": "16:15", "kommentti": "", "tuloaika": "14:25", "kirjaus": 2.0, "date": "2018-04-13", "lounaita": 0, "id": 225},
            {"lahtoaika": "17:45", "kommentti": null, "tuloaika": "09:10", "kirjaus": 8.0, "date": "2018-04-16", "lounaita": 1, "id": 226},
            {"lahtoaika": "17:30", "kommentti": null, "tuloaika": "09:20", "kirjaus": 7.5, "date": "2018-04-17", "lounaita": 1, "id": 227},
            {"lahtoaika": "17:25", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-04-18", "lounaita": 1, "id": 228},
            {"lahtoaika": "16:20", "kommentti": "Viikki", "tuloaika": "08:55", "kirjaus": 7.0, "date": "2018-04-19", "lounaita": 1, "id": 229},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "08:50", "kirjaus": 8.0, "date": "2018-04-20", "lounaita": 1, "id": 230},
            {"lahtoaika": "17:45", "kommentti": null, "tuloaika": "08:00", "kirjaus": 8.5, "date": "2018-04-23", "lounaita": 2, "id": 231},
            {"lahtoaika": "17:15", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-04-24", "lounaita": 1, "id": 232},
            {"lahtoaika": "16:30", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.0, "date": "2018-04-25", "lounaita": 1, "id": 233},
            {"lahtoaika": "16:30", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.0, "date": "2018-04-26", "lounaita": 1, "id": 234},
            {"lahtoaika": "17:15", "kommentti": null, "tuloaika": "08:50", "kirjaus": 8.0, "date": "2018-04-27", "lounaita": 1, "id": 235},
            {"lahtoaika": "16:00", "kommentti": null, "tuloaika": "09:05", "kirjaus": 5.5, "date": "2018-04-30", "lounaita": 3, "id": 236},
            {"lahtoaika": "16:15", "kommentti": "Viikki", "tuloaika": "08:50", "kirjaus": 7.0, "date": "2018-05-02", "lounaita": 1, "id": 237},
            {"lahtoaika": "16:00", "kommentti": "Workshoppia aamulla", "tuloaika": "07:55", "kirjaus": 7.5, "date": "2018-05-03", "lounaita": 1, "id": 238},
            {"lahtoaika": "16:30", "kommentti": null, "tuloaika": "08:55", "kirjaus": 7.0, "date": "2018-05-04", "lounaita": 1, "id": 239},
            {"lahtoaika": "18:00", "kommentti": "Viikki", "tuloaika": "08:55", "kirjaus": 8.5, "date": "2018-05-07", "lounaita": 1, "id": 240},
            {"lahtoaika": "17:15", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-05-08", "lounaita": 1, "id": 241},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-05-09", "lounaita": 1, "id": 242},
            {"lahtoaika": "16:55", "kommentti": null, "tuloaika": "08:55", "kirjaus": 7.5, "date": "2018-05-11", "lounaita": 1, "id": 243},
            {"lahtoaika": "17:50", "kommentti": "Viikki", "tuloaika": "08:50", "kirjaus": 8.5, "date": "2018-05-14", "lounaita": 1, "id": 244},
            {"lahtoaika": "12:15", "kommentti": "Ti lounastauolla", "tuloaika": "09:05", "kirjaus": 3.0, "date": "2018-05-15", "lounaita": 0, "id": 245},
            {"lahtoaika": "17:30", "kommentti": "", "tuloaika": "13:30", "kirjaus": 3.5, "date": "2018-05-15", "lounaita": 0, "id": 246},
            {"lahtoaika": "17:10", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-05-16", "lounaita": 1, "id": 247},
            {"lahtoaika": "16:00", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 6.5, "date": "2018-05-17", "lounaita": 1, "id": 248},
            {"lahtoaika": "15:30", "kommentti": "Civilpoint", "tuloaika": "08:50", "kirjaus": 6.5, "date": "2018-05-18", "lounaita": 1, "id": 249},
            {"lahtoaika": "18:10", "kommentti": "Viikki", "tuloaika": "08:50", "kirjaus": 9.0, "date": "2018-05-21", "lounaita": 1, "id": 250},
            {"lahtoaika": "20:25", "kommentti": "Civilpoint", "tuloaika": "09:30", "kirjaus": 9.5, "date": "2018-05-22", "lounaita": 3, "id": 251},
            {"lahtoaika": "17:40", "kommentti": null, "tuloaika": "09:15", "kirjaus": 8.0, "date": "2018-05-23", "lounaita": 1, "id": 252},
            {"lahtoaika": "17:10", "kommentti": "Et\u00e4 kotona +Viikki", "tuloaika": "09:00", "kirjaus": 7.0, "date": "2018-05-24", "lounaita": 2, "id": 253},
            {"lahtoaika": "16:45", "kommentti": "Kev\u00e4tp\u00e4iv\u00e4", "tuloaika": "09:00", "kirjaus": 7.0, "date": "2018-05-25", "lounaita": 1, "id": 254},
            {"lahtoaika": "16:50", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-05-28", "lounaita": 1, "id": 255},
            {"lahtoaika": "17:30", "kommentti": null, "tuloaika": "09:15", "kirjaus": 7.5, "date": "2018-05-29", "lounaita": 1, "id": 256},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "08:55", "kirjaus": 8.0, "date": "2018-05-30", "lounaita": 1, "id": 257},
            {"lahtoaika": "16:00", "kommentti": "Viikki", "tuloaika": "08:50", "kirjaus": 6.5, "date": "2018-05-31", "lounaita": 1, "id": 258},
            {"lahtoaika": "15:00", "kommentti": "Kotkaan/saareen", "tuloaika": "09:00", "kirjaus": 5.5, "date": "2018-06-01", "lounaita": 1, "id": 259},
            {"lahtoaika": "16:30", "kommentti": "Aamu Mittaviivalla", "tuloaika": "08:55", "kirjaus": 7.0, "date": "2018-06-04", "lounaita": 1, "id": 260},
            {"lahtoaika": "18:55", "kommentti": "Aamu Civilpointilla", "tuloaika": "08:30", "kirjaus": 10.0, "date": "2018-06-05", "lounaita": 1, "id": 261},
            {"lahtoaika": "17:15", "kommentti": "Viikki, koulutusp\u00e4iv\u00e4", "tuloaika": "08:30", "kirjaus": 8.0, "date": "2018-06-06", "lounaita": 1, "id": 262},
            {"lahtoaika": "16:00", "kommentti": "Mitpa/Vallila", "tuloaika": "09:00", "kirjaus": 6.5, "date": "2018-06-07", "lounaita": 1, "id": 263},
            {"lahtoaika": "16:00", "kommentti": "Mitpa/Vallila", "tuloaika": "08:55", "kirjaus": 6.5, "date": "2018-06-08", "lounaita": 1, "id": 264},
            {"lahtoaika": "19:00", "kommentti": "Tuntikirjaukset valkkarin voimalla illalla", "tuloaika": "18:30", "kirjaus": 0.5, "date": "2018-06-08", "lounaita": 0, "id": 299},
            {"lahtoaika": "16:00", "kommentti": null, "tuloaika": "08:55", "kirjaus": 6.5, "date": "2018-06-11", "lounaita": 1, "id": 266},
            {"lahtoaika": "17:00", "kommentti": "Viikki, koulutusp\u00e4iv\u00e4", "tuloaika": "08:30", "kirjaus": 8.0, "date": "2018-06-12", "lounaita": 1, "id": 267},
            {"lahtoaika": "18:15", "kommentti": null, "tuloaika": "08:55", "kirjaus": 9.0, "date": "2018-06-13", "lounaita": 1, "id": 268},
            {"lahtoaika": "17:10", "kommentti": null, "tuloaika": "08:50", "kirjaus": 7.5, "date": "2018-06-14", "lounaita": 2, "id": 269},
            {"lahtoaika": "16:00", "kommentti": "Viikki, koulutusp\u00e4iv\u00e4", "tuloaika": "08:35", "kirjaus": 7.0, "date": "2018-06-15", "lounaita": 1, "id": 270},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-06-18", "lounaita": 1, "id": 271},
            {"lahtoaika": "17:30", "kommentti": null, "tuloaika": "09:00", "kirjaus": 8.0, "date": "2018-06-19", "lounaita": 1, "id": 272},
            {"lahtoaika": "16:45", "kommentti": "Viikki", "tuloaika": "08:55", "kirjaus": 7.0, "date": "2018-06-20", "lounaita": 2, "id": 273},
            {"lahtoaika": "15:05", "kommentti": "Saareen", "tuloaika": "08:55", "kirjaus": 5.5, "date": "2018-06-21", "lounaita": 1, "id": 274},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-06-25", "lounaita": 1, "id": 275},
            {"lahtoaika": "17:30", "kommentti": null, "tuloaika": "08:50", "kirjaus": 8.0, "date": "2018-06-26", "lounaita": 1, "id": 276},
            {"lahtoaika": "20:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 10.5, "date": "2018-06-27", "lounaita": 1, "id": 277},
            {"lahtoaika": "17:20", "kommentti": null, "tuloaika": "09:05", "kirjaus": 8.0, "date": "2018-06-28", "lounaita": 1, "id": 278},
            {"lahtoaika": "16:00", "kommentti": "Viikki", "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-06-29", "lounaita": 1, "id": 279},
            {"lahtoaika": "16:40", "kommentti": null, "tuloaika": "09:00", "kirjaus": null, "date": "2018-07-23", "lounaita": 0, "id": 280},
            {"lahtoaika": "18:00", "kommentti": null, "tuloaika": "17:40", "kirjaus": 7.5, "date": "2018-07-23", "lounaita": 1, "id": 281},
            {"lahtoaika": "17:15", "kommentti": null, "tuloaika": "09:15", "kirjaus": 7.5, "date": "2018-07-24", "lounaita": 1, "id": 282},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-07-25", "lounaita": 1, "id": 283},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-07-26", "lounaita": 1, "id": 284},
            {"lahtoaika": "20:30", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-07-27", "lounaita": 8, "id": 285},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-07-30", "lounaita": 1, "id": 286},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-07-31", "lounaita": 1, "id": 287},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-08-01", "lounaita": 1, "id": 288},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-08-02", "lounaita": 1, "id": 289},
            {"lahtoaika": "15:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 5.5, "date": "2018-08-03", "lounaita": 1, "id": 290},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-08-06", "lounaita": 1, "id": 13},
            {"lahtoaika": "19:45", "kommentti": "", "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-08-07", "lounaita": 6, "id": 14},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:00", "kirjaus": 7.5, "date": "2018-08-08", "lounaita": 1, "id": 18},
            {"lahtoaika": "16:25", "kommentti": null, "tuloaika": "09:15", "kirjaus": 7.5, "date": "2018-08-09", "lounaita": 1, "id": 15},
            {"lahtoaika": "16:30", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-08-13", "lounaita": 1, "id": 16},
            {"lahtoaika": "18:10", "kommentti": null, "tuloaika": "09:05", "kirjaus": 7.5, "date": "2018-08-14", "lounaita": 1, "id": 24},
            {"lahtoaika": "16:00", "kommentti": null, "tuloaika": "08:35", "kirjaus": 7.0, "date": "2018-08-15", "lounaita": 1, "id": 148},
            {"lahtoaika": "16:20", "kommentti": null, "tuloaika": "08:30", "kirjaus": 7.5, "date": "2018-08-16", "lounaita": 1, "id": 149},
            {"lahtoaika": "15:30", "kommentti": null, "tuloaika": "08:55", "kirjaus": 6.0, "date": "2018-08-17", "lounaita": 1, "id": 303},
            {"lahtoaika": "17:10", "kommentti": null, "tuloaika": "08:55", "kirjaus": 7.5, "date": "2018-08-20", "lounaita": 1, "id": 304},
            {"lahtoaika": "19:40", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-08-21", "lounaita": 6, "id": 305},
            {"lahtoaika": "15:30", "kommentti": "Janin l\u00e4ks\u00e4rit", "tuloaika": "08:55", "kirjaus": 6.0, "date": "2018-08-24", "lounaita": 1, "id": 308},
            {"lahtoaika": "16:45", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.0, "date": "2018-08-27", "lounaita": 1, "id": 316},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "08:55", "kirjaus": 7.5, "date": "2018-08-28", "lounaita": 1, "id": 320},
            {"lahtoaika": "17:00", "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-08-29", "lounaita": 1, "id": 328},
            {"lahtoaika": "16:10", "kommentti": "apr pasilassa", "tuloaika": "09:05", "kirjaus": 6.5, "date": "2018-08-30", "lounaita": 1, "id": 330},
            {"lahtoaika": "16:00", "kommentti": null, "tuloaika": "08:45", "kirjaus": 7.0, "date": "2018-08-31", "lounaita": 1, "id": 332},
            {"lahtoaika": null, "kommentti": null, "tuloaika": "09:10", "kirjaus": 7.5, "date": "2018-09-03", "lounaita": 1, "id": 334}
        ];
        data.merkinnat = laskeMerkintojenMeta(merkinnat);
    }, 1500);
}

const Tuntikirjanpito = {
    get() {
        return data;
    },
    laskeUudestaan() {
        data.merkinnat = laskeMerkintojenMeta(data.merkinnat);
    }
};

export const v2018alkusaldo = 18.0;
export const v2018alkuvirhe = 0;
export const beginningOfTime = '2000-01-01';
export const endOfTime = '2100-12-31';


export default Tuntikirjanpito;