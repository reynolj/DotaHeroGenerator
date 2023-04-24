import json

sortByName = []

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
            'thumbnail': p['thumbnail']
        }
        sortByName.append(element)

sortByName.sort(key= lambda x: x["name"])

reNumbered = []

i = 1
for p in sortByName:
    element = {
        'id': i,
        'name': p['name'],
        'lore': p['lore'],
        'attribute': p['attribute'],
        'attackType': p['attackType'],
        'wikiLink': p['wikiLink'],
        'thumbnail': p['thumbnail']
    }
    reNumbered.append(element)
    i+=1

with open('heroes3.json', 'w', encoding='utf-8') as f:
    json.dump(reNumbered, f, ensure_ascii=False, indent=4)