#!/usr/bin/python

import re

excelExport = open('data-2018.txt', 'r');
output = open('data-2018.sql', 'w');

output.write('INSERT INTO tunnit(id, date, tuloaika, lahtoaika, lounaita, kirjaus) VALUES \n')

first = True;

for line in excelExport:
    tokens = line.split('\t');
    if len(tokens) == 30:
        #tyopaiva = tokens[3] == 'T'
        #lomapaiva = tokens[4] <> ''
        #saikku = tokens[5] <> ''
        #pyha = tokens[6] <> ''
        #muu = tokens[7] <> ''
        #ylityo = tokens[8] <> ''

        #print tokens[0] + '-> ' + str(tyopaiva) + ' ' + str(lomapaiva) + ' ' + str(saikku) + ' ' + str(pyha) + ' ' + str(muu) + ' ' + str(ylityo)

        def toDate(value):
            tokens = value.split(".")
            return "2018-" + tokens[1].zfill(2) + "-" + tokens[0].zfill(2)

        def toTime(value):
            tokens = value.split(":")
            return tokens[0].zfill(2) + ":" + tokens[1].zfill(2)

        if tokens[13] <> '':
            if not first:
                output.write(", \n")
            else:
                first = False;

            output.write("( '" + toDate(tokens[0]) + "', '" + toTime(tokens[11]) + "', '" + toTime(tokens[13]) + "', null, null ), \n" )
            output.write("( '" + toDate(tokens[0]) + "', '" + toTime(tokens[15]) + "', '" + toTime(tokens[17]) + "', " + tokens[19] + ", " + tokens[29].split()[0] + " )" )
        else:
            if not first:
                output.write(", \n")
            else:
                first = False;
            output.write("( '" + toDate(tokens[0]) + "', '" + toTime(tokens[11]) + "', '" + toTime(tokens[17]) + "', " + tokens[19] + ", " + tokens[29].split()[0] + " )" )