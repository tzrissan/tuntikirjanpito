import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import { aikavaliMinuutteina } from './date-time-util';

export const PROD = !window.location.href.match(/localhost/);

const data = {
    merkinnat: [],
    merkinnatPaivittain: {},
    ensimmainenPaiva: undefined,
    pyhat: [
        {"date":"2016-01-01", "paiva": moment("2016-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2016-01-06", "paiva": moment("2016-01-06"), "name":"Loppiainen"},
        {"date":"2016-01-31", "paiva": moment("2016-01-31"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2016-02-07", "paiva": moment("2016-02-07"), "name":"Laskiaissunnuntai"},
        {"date":"2016-03-13", "paiva": moment("2016-03-13"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2016-03-20", "paiva": moment("2016-03-20"), "name":"Palmusunnuntai"},
        {"date":"2016-03-25", "paiva": moment("2016-03-25"), "name":"Pitk\u00e4perjantai"},
        {"date":"2016-03-27", "paiva": moment("2016-03-27"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2016-03-28", "paiva": moment("2016-03-28"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2016-05-01", "paiva": moment("2016-05-01"), "name":"Vappu"},
        {"date":"2016-05-05", "paiva": moment("2016-05-05"), "name":"Helatorstai"},
        {"date":"2016-05-15", "paiva": moment("2016-05-15"), "name":"Helluntai"},
        {"date":"2016-05-15", "paiva": moment("2016-05-15"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2016-05-22", "paiva": moment("2016-05-22"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2016-06-25", "paiva": moment("2016-06-25"), "name":"Juhannus"},
        {"date":"2016-06-26", "paiva": moment("2016-06-26"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2016-07-10", "paiva": moment("2016-07-10"), "name":"Kirkastussunnuntai"},
        {"date":"2016-10-02", "paiva": moment("2016-10-02"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2016-11-05", "paiva": moment("2016-11-05"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2016-11-20", "paiva": moment("2016-11-20"), "name":"Tuomiosunnuntai"},
        {"date":"2016-12-06", "paiva": moment("2016-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2016-12-25", "paiva": moment("2016-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2016-12-26", "paiva": moment("2016-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2017-01-01", "paiva": moment("2017-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2017-01-06", "paiva": moment("2017-01-06"), "name":"Loppiainen"},
        {"date":"2017-02-05", "paiva": moment("2017-02-05"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2017-02-26", "paiva": moment("2017-02-26"), "name":"Laskiaissunnuntai"},
        {"date":"2017-03-26", "paiva": moment("2017-03-26"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2017-04-09", "paiva": moment("2017-04-09"), "name":"Palmusunnuntai"},
        {"date":"2017-04-14", "paiva": moment("2017-04-14"), "name":"Pitk\u00e4perjantai"},
        {"date":"2017-04-16", "paiva": moment("2017-04-16"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2017-04-17", "paiva": moment("2017-04-17"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2017-05-01", "paiva": moment("2017-05-01"), "name":"Vappu"},
        {"date":"2017-05-21", "paiva": moment("2017-05-21"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2017-05-25", "paiva": moment("2017-05-25"), "name":"Helatorstai"},
        {"date":"2017-06-04", "paiva": moment("2017-06-04"), "name":"Helluntai"},
        {"date":"2017-06-11", "paiva": moment("2017-06-11"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2017-06-24", "paiva": moment("2017-06-24"), "name":"Juhannus"},
        {"date":"2017-07-16", "paiva": moment("2017-07-16"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2017-07-30", "paiva": moment("2017-07-30"), "name":"Kirkastussunnuntai"},
        {"date":"2017-10-01", "paiva": moment("2017-10-01"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2017-11-04", "paiva": moment("2017-11-04"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2017-11-26", "paiva": moment("2017-11-26"), "name":"Tuomiosunnuntai"},
        {"date":"2017-12-06", "paiva": moment("2017-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2017-12-25", "paiva": moment("2017-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2017-12-26", "paiva": moment("2017-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2018-01-01", "paiva": moment("2018-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2018-01-06", "paiva": moment("2018-01-06"), "name":"Loppiainen"},
        {"date":"2018-02-04", "paiva": moment("2018-02-04"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2018-02-11", "paiva": moment("2018-02-11"), "name":"Laskiaissunnuntai"},
        {"date":"2018-03-18", "paiva": moment("2018-03-18"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2018-03-25", "paiva": moment("2018-03-25"), "name":"Palmusunnuntai"},
        {"date":"2018-03-30", "paiva": moment("2018-03-30"), "name":"Pitk\u00e4perjantai"},
        {"date":"2018-04-01", "paiva": moment("2018-04-01"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2018-04-02", "paiva": moment("2018-04-02"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2018-05-01", "paiva": moment("2018-05-01"), "name":"Vappu"},
        {"date":"2018-05-10", "paiva": moment("2018-05-10"), "name":"Helatorstai"},
        {"date":"2018-05-20", "paiva": moment("2018-05-20"), "name":"Helluntai"},
        {"date":"2018-05-20", "paiva": moment("2018-05-20"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2018-05-27", "paiva": moment("2018-05-27"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2018-06-23", "paiva": moment("2018-06-23"), "name":"Juhannus"},
        {"date":"2018-07-01", "paiva": moment("2018-07-01"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2018-07-15", "paiva": moment("2018-07-15"), "name":"Kirkastussunnuntai"},
        {"date":"2018-09-30", "paiva": moment("2018-09-30"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2018-11-03", "paiva": moment("2018-11-03"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2018-11-25", "paiva": moment("2018-11-25"), "name":"Tuomiosunnuntai"},
        {"date":"2018-12-06", "paiva": moment("2018-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2018-12-25", "paiva": moment("2018-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2018-12-26", "paiva": moment("2018-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2019-01-01", "paiva": moment("2019-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2019-01-06", "paiva": moment("2019-01-06"), "name":"Loppiainen"},
        {"date":"2019-02-03", "paiva": moment("2019-02-03"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2019-03-03", "paiva": moment("2019-03-03"), "name":"Laskiaissunnuntai"},
        {"date":"2019-03-24", "paiva": moment("2019-03-24"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2019-04-14", "paiva": moment("2019-04-14"), "name":"Palmusunnuntai"},
        {"date":"2019-04-19", "paiva": moment("2019-04-19"), "name":"Pitk\u00e4perjantai"},
        {"date":"2019-04-21", "paiva": moment("2019-04-21"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2019-04-22", "paiva": moment("2019-04-22"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2019-05-01", "paiva": moment("2019-05-01"), "name":"Vappu"},
        {"date":"2019-05-19", "paiva": moment("2019-05-19"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2019-05-30", "paiva": moment("2019-05-30"), "name":"Helatorstai"},
        {"date":"2019-06-09", "paiva": moment("2019-06-09"), "name":"Helluntai"},
        {"date":"2019-06-16", "paiva": moment("2019-06-16"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2019-06-22", "paiva": moment("2019-06-22"), "name":"Juhannus"},
        {"date":"2019-07-21", "paiva": moment("2019-07-21"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2019-08-04", "paiva": moment("2019-08-04"), "name":"Kirkastussunnuntai"},
        {"date":"2019-09-29", "paiva": moment("2019-09-29"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2019-11-02", "paiva": moment("2019-11-02"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2019-11-24", "paiva": moment("2019-11-24"), "name":"Tuomiosunnuntai"},
        {"date":"2019-12-06", "paiva": moment("2019-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2019-12-25", "paiva": moment("2019-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2019-12-26", "paiva": moment("2019-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2020-01-01", "paiva": moment("2020-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2020-01-06", "paiva": moment("2020-01-06"), "name":"Loppiainen"},
        {"date":"2020-02-02", "paiva": moment("2020-02-02"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2020-02-23", "paiva": moment("2020-02-23"), "name":"Laskiaissunnuntai"},
        {"date":"2020-03-22", "paiva": moment("2020-03-22"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2020-04-05", "paiva": moment("2020-04-05"), "name":"Palmusunnuntai"},
        {"date":"2020-04-10", "paiva": moment("2020-04-10"), "name":"Pitk\u00e4perjantai"},
        {"date":"2020-04-12", "paiva": moment("2020-04-12"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2020-04-13", "paiva": moment("2020-04-13"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2020-05-01", "paiva": moment("2020-05-01"), "name":"Vappu"},
        {"date":"2020-05-17", "paiva": moment("2020-05-17"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2020-05-21", "paiva": moment("2020-05-21"), "name":"Helatorstai"},
        {"date":"2020-05-31", "paiva": moment("2020-05-31"), "name":"Helluntai"},
        {"date":"2020-06-07", "paiva": moment("2020-06-07"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2020-06-20", "paiva": moment("2020-06-20"), "name":"Juhannus"},
        {"date":"2020-07-12", "paiva": moment("2020-07-12"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2020-07-26", "paiva": moment("2020-07-26"), "name":"Kirkastussunnuntai"},
        {"date":"2020-10-04", "paiva": moment("2020-10-04"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2020-10-31", "paiva": moment("2020-10-31"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2020-11-22", "paiva": moment("2020-11-22"), "name":"Tuomiosunnuntai"},
        {"date":"2020-12-06", "paiva": moment("2020-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2020-12-25", "paiva": moment("2020-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2020-12-26", "paiva": moment("2020-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2021-01-01", "paiva": moment("2021-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2021-01-06", "paiva": moment("2021-01-06"), "name":"Loppiainen"},
        {"date":"2021-02-07", "paiva": moment("2021-02-07"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2021-02-14", "paiva": moment("2021-02-14"), "name":"Laskiaissunnuntai"},
        {"date":"2021-03-21", "paiva": moment("2021-03-21"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2021-03-28", "paiva": moment("2021-03-28"), "name":"Palmusunnuntai"},
        {"date":"2021-04-02", "paiva": moment("2021-04-02"), "name":"Pitk\u00e4perjantai"},
        {"date":"2021-04-04", "paiva": moment("2021-04-04"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2021-04-05", "paiva": moment("2021-04-05"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2021-05-01", "paiva": moment("2021-05-01"), "name":"Vappu"},
        {"date":"2021-05-13", "paiva": moment("2021-05-13"), "name":"Helatorstai"},
        {"date":"2021-05-16", "paiva": moment("2021-05-16"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2021-05-23", "paiva": moment("2021-05-23"), "name":"Helluntai"},
        {"date":"2021-05-30", "paiva": moment("2021-05-30"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2021-06-26", "paiva": moment("2021-06-26"), "name":"Juhannus"},
        {"date":"2021-07-04", "paiva": moment("2021-07-04"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2021-07-18", "paiva": moment("2021-07-18"), "name":"Kirkastussunnuntai"},
        {"date":"2021-10-03", "paiva": moment("2021-10-03"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2021-11-06", "paiva": moment("2021-11-06"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2021-11-21", "paiva": moment("2021-11-21"), "name":"Tuomiosunnuntai"},
        {"date":"2021-12-06", "paiva": moment("2021-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2021-12-25", "paiva": moment("2021-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2021-12-26", "paiva": moment("2021-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2022-01-01", "paiva": moment("2022-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2022-01-06", "paiva": moment("2022-01-06"), "name":"Loppiainen"},
        {"date":"2022-02-06", "paiva": moment("2022-02-06"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2022-02-27", "paiva": moment("2022-02-27"), "name":"Laskiaissunnuntai"},
        {"date":"2022-03-27", "paiva": moment("2022-03-27"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2022-04-10", "paiva": moment("2022-04-10"), "name":"Palmusunnuntai"},
        {"date":"2022-04-15", "paiva": moment("2022-04-15"), "name":"Pitk\u00e4perjantai"},
        {"date":"2022-04-17", "paiva": moment("2022-04-17"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2022-04-18", "paiva": moment("2022-04-18"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2022-05-01", "paiva": moment("2022-05-01"), "name":"Vappu"},
        {"date":"2022-05-15", "paiva": moment("2022-05-15"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2022-05-26", "paiva": moment("2022-05-26"), "name":"Helatorstai"},
        {"date":"2022-06-05", "paiva": moment("2022-06-05"), "name":"Helluntai"},
        {"date":"2022-06-12", "paiva": moment("2022-06-12"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2022-06-25", "paiva": moment("2022-06-25"), "name":"Juhannus"},
        {"date":"2022-07-17", "paiva": moment("2022-07-17"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2022-07-31", "paiva": moment("2022-07-31"), "name":"Kirkastussunnuntai"},
        {"date":"2022-10-02", "paiva": moment("2022-10-02"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2022-11-05", "paiva": moment("2022-11-05"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2022-11-20", "paiva": moment("2022-11-20"), "name":"Tuomiosunnuntai"},
        {"date":"2022-12-06", "paiva": moment("2022-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2022-12-25", "paiva": moment("2022-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2022-12-26", "paiva": moment("2022-12-26"), "name":"Tapaninp\u00e4iv\u00e4"},
        {"date":"2023-01-01", "paiva": moment("2023-01-01"), "name":"Uudenvuodenp\u00e4iv\u00e4"},
        {"date":"2023-01-06", "paiva": moment("2023-01-06"), "name":"Loppiainen"},
        {"date":"2023-02-05", "paiva": moment("2023-02-05"), "name":"Kynttil\u00e4np\u00e4iv\u00e4"},
        {"date":"2023-02-19", "paiva": moment("2023-02-19"), "name":"Laskiaissunnuntai"},
        {"date":"2023-03-26", "paiva": moment("2023-03-26"), "name":"Marian ilmestysp\u00e4iv\u00e4"},
        {"date":"2023-04-02", "paiva": moment("2023-04-02"), "name":"Palmusunnuntai"},
        {"date":"2023-04-07", "paiva": moment("2023-04-07"), "name":"Pitk\u00e4perjantai"},
        {"date":"2023-04-09", "paiva": moment("2023-04-09"), "name":"P\u00e4\u00e4si\u00e4issunnuntai"},
        {"date":"2023-04-10", "paiva": moment("2023-04-10"), "name":"Toinen p\u00e4\u00e4si\u00e4isp\u00e4iv\u00e4"},
        {"date":"2023-05-01", "paiva": moment("2023-05-01"), "name":"Vappu"},
        {"date":"2023-05-18", "paiva": moment("2023-05-18"), "name":"Helatorstai"},
        {"date":"2023-05-21", "paiva": moment("2023-05-21"), "name":"Kaatuneiden muistop\u00e4iv\u00e4"},
        {"date":"2023-05-28", "paiva": moment("2023-05-28"), "name":"Helluntai"},
        {"date":"2023-06-04", "paiva": moment("2023-06-04"), "name":"Pyh\u00e4n Kolminaisuuden p\u00e4iv\u00e4"},
        {"date":"2023-06-24", "paiva": moment("2023-06-24"), "name":"Juhannus"},
        {"date":"2023-07-09", "paiva": moment("2023-07-09"), "name":"Apostolien p\u00e4iv\u00e4"},
        {"date":"2023-07-23", "paiva": moment("2023-07-23"), "name":"Kirkastussunnuntai"},
        {"date":"2023-10-01", "paiva": moment("2023-10-01"), "name":"Mikkelinp\u00e4iv\u00e4"},
        {"date":"2023-11-04", "paiva": moment("2023-11-04"), "name":"Pyh\u00e4inp\u00e4iv\u00e4"},
        {"date":"2023-11-26", "paiva": moment("2023-11-26"), "name":"Tuomiosunnuntai"},
        {"date":"2023-12-06", "paiva": moment("2023-12-06"), "name":"Suomen itsen\u00e4isyysp\u00e4iv\u00e4"},
        {"date":"2023-12-25", "paiva": moment("2023-12-25"), "name":"Joulup\u00e4iv\u00e4"},
        {"date":"2023-12-26", "paiva": moment("2023-12-26"), "name":"Tapaninp\u00e4iv\u00e4"}
        ]
};

function laskeMerkintojenMeta(merkinnat) {
    merkinnat.forEach(m => {
        m.paiva = moment(m.date);
        m.tyoaika = aikavaliMinuutteina(m.tuloaika, m.lahtoaika, m.lounaita, 0, '-');
        m.kirjausvirhe = m.tyoaika - (m.kirjaus * 60);
    });
    return merkinnat;
}

const pyhienPaivamaaratListassa = data.pyhat.map(p => p.date);
function laskeSaldomuutos(date, paiva, kirjaus = 0) {
    const viikonloppu = paiva.weekday() > 4;
    const pyhapaiva = pyhienPaivamaaratListassa.includes(date);
    return (_.isNumber(kirjaus) && !_.isNaN(kirjaus) ? kirjaus : 0) - (viikonloppu || pyhapaiva ? 0 : 7.5);
}

function laskePaivienMeta(paivat) {
    function sum(acc, n) {
        return acc + n;
    }
    return _.chain(paivat)
        .sortBy('date')
        .map((paiva, idx, all) => {
            paiva.kirjaus = paiva.merkinnat.map(m => m.kirjaus).reduce(sum, 0);
            paiva.ylityo = paiva.merkinnat.reduce((a, m) => a + (m.ylityo ? m.ylityo : 0), 0);
            paiva.lounaita = paiva.merkinnat.map(m => m.lounaita).reduce(sum, 0);
            paiva.saldomuutos = laskeSaldomuutos(paiva.date, paiva.paiva, paiva.kirjaus);
            paiva.saldomuutosAlert = Math.abs(paiva.saldomuutos) > 3;
            paiva.saldo = (idx ? all[idx - 1].saldo : saldoAikojenAlussa) + (_.isNaN(paiva.saldomuutos) ? 0 : paiva.saldomuutos) - paiva.ylityo;
            paiva.tyoaika = paiva.merkinnat.map(m => m.tyoaika).reduce(sum, 0);
            paiva.kirjausvirheenmuutos = paiva.tyoaika - (paiva.kirjaus * 60);
            paiva.kirjausvirheAlert = Math.abs(paiva.kirjausvirheenmuutos) > 15;

            return paiva;
        })
        .value();
}

function laskeMerkinnatPaivittain(merkinnat) {
    return _.fromPairs(laskePaivienMeta(
        _.chain(merkinnat)
            .groupBy('date')
            .toPairs()
            .map(pair => {
                return {
                    date: pair[0],
                    paiva: moment(pair[0]),
                    merkinnat: _.sortBy(pair[1], ['tuloaika', 'lahtoaika'])
                }
            })
            .value()
    ).map(pm => {
        return [ pm.date, pm ]
    }));
}

function laskeMetaData(merkinnat) {
    data.merkinnat = laskeMerkintojenMeta(merkinnat);
    data.merkinnatPaivittain = laskeMerkinnatPaivittain(merkinnat);
    data.ensimmainenPaiva = moment(merkinnat.sort((a, b) => a.paiva.isBefore(b.paiva))[0].paiva);
}

if (PROD) {
    axios.create().get('/tunnit.data')
        .then((response) => {
            laskeMetaData(response.data);
        });
} else {
    setTimeout(function() {
        const merkinnat = [{"kirjaus": 8.0, "lahtoaika": "17:40", "date": "2019-02-18", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2604, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "16:50", "date": "2019-02-19", "lounaita": 1, "kommentti": null, "tuloaika": "08:45", "id": 2603, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:15", "date": "2019-02-20", "lounaita": 1, "kommentti": null, "tuloaika": "08:50", "id": 2602, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "16:55", "date": "2019-02-21", "lounaita": 1, "kommentti": "Aamulla ty\u00f6haastattelu kotoa k\u00e4sin", "tuloaika": "08:15", "id": 2600, "ylityo": null}, {"kirjaus": 6.0, "lahtoaika": "16:15", "date": "2019-02-22", "lounaita": 3, "kommentti": null, "tuloaika": "08:40", "id": 2605, "ylityo": null}, {"kirjaus": 7.0, "lahtoaika": "17:00", "date": "2019-02-25", "lounaita": 2, "kommentti": null, "tuloaika": "09:05", "id": 2606, "ylityo": null}, {"kirjaus": 8.5, "lahtoaika": "18:15", "date": "2019-02-26", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2607, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:10", "date": "2019-02-27", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2608, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-02-28", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2609, "ylityo": null}, {"kirjaus": 7.0, "lahtoaika": "16:30", "date": "2019-03-01", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2610, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:45", "date": "2019-03-04", "lounaita": 2, "kommentti": null, "tuloaika": "09:15", "id": 2611, "ylityo": null}, {"kirjaus": 9.0, "lahtoaika": "18:20", "date": "2019-03-05", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2612, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-03-06", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2613, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-03-07", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2614, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "16:00", "date": "2019-03-08", "lounaita": 0, "kommentti": null, "tuloaika": "08:40", "id": 2615, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:45", "date": "2019-03-11", "lounaita": 1, "kommentti": null, "tuloaika": "09:15", "id": 2616, "ylityo": null}, {"kirjaus": 9.0, "lahtoaika": "18:45", "date": "2019-03-12", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2617, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:00", "date": "2019-03-13", "lounaita": 1, "kommentti": null, "tuloaika": "08:40", "id": 2618, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:25", "date": "2019-03-14", "lounaita": 1, "kommentti": null, "tuloaika": "08:50", "id": 2619, "ylityo": null}, {"kirjaus": 6.0, "lahtoaika": "15:00", "date": "2019-03-15", "lounaita": 1, "kommentti": null, "tuloaika": "08:35", "id": 2620, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:45", "date": "2019-03-18", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2621, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "16:40", "date": "2019-03-19", "lounaita": 1, "kommentti": null, "tuloaika": "08:50", "id": 2622, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-03-20", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2623, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-03-21", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2624, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "16:45", "date": "2019-03-22", "lounaita": 1, "kommentti": null, "tuloaika": "08:50", "id": 2625, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:45", "date": "2019-03-25", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2626, "ylityo": null}, {"kirjaus": 9.0, "lahtoaika": "18:30", "date": "2019-03-26", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2627, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-03-27", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2628, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:05", "date": "2019-03-28", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2629, "ylityo": null}, {"kirjaus": 6.0, "lahtoaika": "15:00", "date": "2019-03-29", "lounaita": 1, "kommentti": null, "tuloaika": "08:45", "id": 2630, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:35", "date": "2019-04-01", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2631, "ylityo": null}, {"kirjaus": 9.5, "lahtoaika": "19:30", "date": "2019-04-02", "lounaita": 1, "kommentti": null, "tuloaika": "09:25", "id": 2632, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-04-03", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2633, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-04-04", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2634, "ylityo": null}, {"kirjaus": 7.0, "lahtoaika": "16:40", "date": "2019-04-05", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2635, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:45", "date": "2019-04-08", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2637, "ylityo": null}, {"kirjaus": 10.0, "lahtoaika": "18:30", "date": "2019-04-09", "lounaita": 1, "kommentti": null, "tuloaika": "07:45", "id": 2636, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-04-10", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2638, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:20", "date": "2019-04-11", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2639, "ylityo": null}, {"kirjaus": 6.0, "lahtoaika": "15:00", "date": "2019-04-12", "lounaita": 1, "kommentti": null, "tuloaika": "08:35", "id": 2640, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-04-23", "lounaita": 1, "kommentti": null, "tuloaika": "08:55", "id": 2641, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-04-24", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2642, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:10", "date": "2019-04-25", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2643, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-04-26", "lounaita": 1, "kommentti": null, "tuloaika": "08:50", "id": 2644, "ylityo": null}, {"kirjaus": 6.5, "lahtoaika": "16:00", "date": "2019-04-30", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2645, "ylityo": null}, {"kirjaus": 8.5, "lahtoaika": "17:50", "date": "2019-05-02", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2646, "ylityo": null}, {"kirjaus": 7.0, "lahtoaika": "16:15", "date": "2019-05-03", "lounaita": 1, "kommentti": null, "tuloaika": "08:50", "id": 2647, "ylityo": null}, {"kirjaus": 6.5, "lahtoaika": "16:10", "date": "2019-05-06", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2648, "ylityo": null}, {"kirjaus": 8.5, "lahtoaika": "17:50", "date": "2019-05-07", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2649, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:10", "date": "2019-05-08", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2650, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-05-09", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2651, "ylityo": null}, {"kirjaus": 7.0, "lahtoaika": "16:30", "date": "2019-05-10", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2652, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:45", "date": "2019-05-13", "lounaita": 1, "kommentti": null, "tuloaika": "09:15", "id": 2653, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-05-14", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2654, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:10", "date": "2019-05-15", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2655, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-05-16", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2656, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-05-17", "lounaita": 1, "kommentti": null, "tuloaika": "09:15", "id": 2657, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:40", "date": "2019-05-20", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2658, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:00", "date": "2019-05-21", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2659, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:15", "date": "2019-05-22", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2660, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:05", "date": "2019-05-23", "lounaita": 1, "kommentti": null, "tuloaika": "09:05", "id": 2661, "ylityo": null}, {"kirjaus": 5.5, "lahtoaika": "14:30", "date": "2019-05-24", "lounaita": 1, "kommentti": null, "tuloaika": "08:40", "id": 2662, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "17:50", "date": "2019-05-27", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2663, "ylityo": null}, {"kirjaus": 9.5, "lahtoaika": "18:50", "date": "2019-05-28", "lounaita": 1, "kommentti": null, "tuloaika": "09:00", "id": 2664, "ylityo": null}, {"kirjaus": 7.5, "lahtoaika": "17:10", "date": "2019-05-29", "lounaita": 1, "kommentti": null, "tuloaika": "09:10", "id": 2665, "ylityo": null}, {"kirjaus": 8.0, "lahtoaika": "16:55", "date": "2019-05-31", "lounaita": 1, "kommentti": null, "tuloaika": "08:35", "id": 2666, "ylityo": null}];
        laskeMetaData(merkinnat);
    }, 1500);
}

const Tuntikirjanpito = {
    get() {
        return data;
    },
    laskeUudestaan() {
        data.merkinnat = laskeMerkintojenMeta(data.merkinnat);
        data.merkinnatPaivittain = laskeMerkinnatPaivittain(data.merkinnat);
        data.ensimmainenPaiva = moment(data.merkinnat.sort((a,b) => a.paiva.isBefore(b.paiva))[0].paiva);
    }
};

export const saldoAikojenAlussa = -1.5;
export const virheAikojenAlussa = 0;
export const beginningOfTime = '2000-01-01';
export const endOfTime = '2100-12-31';


export default Tuntikirjanpito;
