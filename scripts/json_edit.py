import json

json_elements = []

with open('heroes2.json') as json_file:
    data = json.load(json_file)
    for p in data:
        element = {
            'id': p['id'],
            'name': p['name'],
            'lore': p['lore'],
            'attribute': p['attribute'],
            'attackType': p['attackType'],
            'wikiLink': p['wikiLink'],
            'pic': p['thumbnail']
        }
        json_elements.append(element)

    with open('heroes3.json', 'w', encoding='utf-8') as f:
        json.dump(json_elements, f, ensure_ascii=False, indent=4)
