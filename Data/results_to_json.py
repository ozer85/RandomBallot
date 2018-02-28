import csv
import json
from collections import defaultdict

results_json = defaultdict(dict)


with open('HoC-results-raw.csv') as inp:
    results = csv.reader(inp, delimiter=',')
    list_res = list(results)

    first_line = True
    index = []

    for line in list_res:

        if first_line:
            first_line = False
        else:

            if results_json[line[0]]:
                ##APPEND TO CONSTITUENCY OBJECT##
                results_json[line[0]]['candidates'].append({
                    "firstname": str(line[9]),
                    "surname": str(line[10]),
                    "party_full": str(line[7]),
                    "party_abr": str(line[8]),
                    "votes": int(line[14]),
                    "vote_share": float(line[15]),
                    "gender": str(line[11])
                })
            else:
                ##CREATE CONSTITUENCY OBJECT##
                results_json[line[0]] = {
                    "name": str(line[2]),
                    "type": str(line[6]),
                    "candidates": []
                }
                results_json[line[0]]['candidates'].append({
                    "firstname": str(line[9]),
                    "surname": str(line[10]),
                    "party_full": str(line[7]),
                    "party_abr": str(line[8]),
                    "votes": int(line[14]),
                    "vote_share": float(line[15]),
                    "gender": str(line[11])
                })
                
with open('results2017.json', 'w') as outfile:
    json.dump(results_json, outfile)

print(results_json['E14000530'])
