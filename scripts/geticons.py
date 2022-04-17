import json

heros = []



i = 1
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
            'icon': f'./assets/icons/{i}.png',
            "STR_Gain": p['STR_Gain'],
            "AGI_Gain": p['AGI_Gain'],
            "INT_Gain": p['INT_Gain'],
            "range": p['range']
        }
        heros.append(element)
        i += 1

with open('heros_with_icons.json', 'w', encoding='utf-8') as f:
    json.dump(heros, f, ensure_ascii=False, indent=4)