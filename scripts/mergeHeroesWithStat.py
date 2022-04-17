import json

heros = []
stats = []
heros_stats = []

with open('heroes.json') as json_file:
    data = json.load(json_file)
    for p in data:
        element = {
            'id': p['id'],
            'name': p['name'],
            'lore': p['lore'],
            'attribute': p['attribute'],
            'attackType': p['attackType'],
            'wikiLink': p['wikiLink'],
            'thumbnail': p['thumbnail'],
            'icon': p['icon']
            # "STR_Gain": p['STR_Gain'],
            # "AGI_Gain": p['AGI_Gain'],
            # "INT_Gain": p['INT_Gain'],
        }
        heros.append(element)

with open('all_stats.json') as json_file:
    data = json.load(json_file)
    for p in data:
        element = {
            'id': p['id'],
            "STR_GAIN": p['STR_GAIN'],
            "AGI_GAIN": p['AGI_GAIN'],
            "INT_GAIN": p['INT_GAIN'],
            "TOTAL_GAIN": p['TOTAL_GAIN'],
            "RANGE": p['RANGE'],
            "MS": p['MS'],
            "BAT": p['BAT']
        }
        stats.append(element)

i = 0
while (i < 123):
    element = {
        'id': heros[i]['id'],
        'name': heros[i]['name'],
        'lore': heros[i]['lore'],
        'attribute': heros[i]['attribute'],
        'attackType': heros[i]['attackType'],
        'wikiLink': heros[i]['wikiLink'],
        'thumbnail': heros[i]['thumbnail'],
        'icon': heros[i]['icon'],
        "STR_GAIN": stats[i]['STR_GAIN'],
        "AGI_GAIN": stats[i]['AGI_GAIN'],
        "INT_GAIN": stats[i]['INT_GAIN'],
        "TOTAL_GAIN": stats[i]['TOTAL_GAIN'],
        "RANGE": stats[i]['RANGE'],
        "MS": stats[i]['MS'],
        "BAT": stats[i]['BAT']
    }
    heros_stats.append(element)
    i += 1

with open('heros_updated.json', 'w', encoding='utf-8') as f:
    json.dump(heros_stats, f, ensure_ascii=False, indent=4)