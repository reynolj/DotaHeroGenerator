#Extract attack range

import json
from enum import IntEnum

json_elements = []

class Stats(IntEnum):
    heroName = 0,
    ATTRIBUTE = 4,
    STR = 7,
    STR_GAIN = 8,
    STR_30 = 9,
    AGI = 10,
    AGI_GAIN = 11,
    AGI_30 = 12,
    INT = 13,
    INT_GAIN = 14,
    INT_30 = 15,
    TOTAL = 16,
    TOTAL_GAIN = 17,
    TOTAL_30 = 18,
    MS = 19,
    ARMOR = 20,
    DMG_MIN = 21,
    DMG_MAX = 22,
    RANGE = 23,
    ATTACKSPEED = 24,
    BAT = 25,
    ATK_PT = 26,
    ATK_BS = 27,
    VIS_DAY = 28,
    VIS_NIGHT = 29,
    TURNRATE = 30,
    COLLISION = 31,
    HP_SEC = 32,
    LEGS = 33

def pos(stat : Stats, offset : int):
    value = stat.value
    return value + offset

def getOffset(elem : str):
    offset = 0
    #Counting words in name after first
    for e in range(1,len(elem)):
        if elem[e] != "minimap":
            offset += 1
        else:
            break
    #Name occurs twice in stats file
    return offset * 2

def getStat(stat : Stats, elem : list[str], offset: int):
    return elem[pos(stat, offset)]

def getName(elem : list[str]):
    name = ""
    for e in elem:
        if e != "minimap":
            if name != "":
                name += " "
            name += e
        else:
            return name

def convertToUrlFormat(hero : str):
    formattedHero = hero.replace(' ', '_')
    formattedHero = formattedHero.replace('\'','%27')
    return formattedHero

def determineAttackType(name : str, range : int):
    melee  = 'Melee'
    ranged = 'Ranged'
    MAX_MELEE_RANGE = 300
    MAX_RANGED_RANGE = 700

    if range <= 300 and name != "Templar Assassin":
        return melee
    else:
        return ranged

i = 1

with open('scripts\HeroStats.txt') as stats_file:
    for line in stats_file:
        elem = line.split() 
        offset = getOffset(elem)
        hero = getName(elem)

        j_elem = {
            Stats.heroName.name: hero,
            'wikiLink': f'https://dota2.fandom.com/wiki/{convertToUrlFormat(hero)}',
            'thumbnail': f'./assets/thumbnails/{hero}.png',
            'icon': f'./assets/icons/{hero}.png',
            Stats.RANGE.name: getStat(Stats.RANGE, elem, offset),
            'attackType': determineAttackType(hero, int(getStat(Stats.RANGE, elem, offset))),
            Stats.ATTRIBUTE.name: getStat(Stats.ATTRIBUTE, elem, offset).upper(),
            Stats.STR.name: getStat(Stats.STR, elem, offset),
            Stats.STR_GAIN.name: "%.1f" % float(getStat(Stats.STR_GAIN, elem, offset)),
            Stats.STR_30.name: getStat(Stats.STR_30, elem, offset),
            Stats.AGI.name: getStat(Stats.AGI, elem, offset),
            Stats.AGI_GAIN.name: "%.1f" % float(getStat(Stats.AGI_GAIN, elem, offset)),
            Stats.AGI_30.name: getStat(Stats.AGI_30, elem, offset),
            Stats.INT.name: getStat(Stats.INT, elem, offset),
            Stats.INT_GAIN.name: "%.1f" % float(getStat(Stats.INT_GAIN, elem, offset)),
            Stats.INT_30.name: getStat(Stats.INT_30, elem, offset),
            Stats.TOTAL.name: getStat(Stats.TOTAL, elem, offset),
            Stats.TOTAL_GAIN.name: "%.1f" % float(getStat(Stats.TOTAL_GAIN, elem, offset)),
            Stats.TOTAL_30.name: getStat(Stats.TOTAL_30, elem, offset),
            Stats.MS.name: getStat(Stats.MS, elem, offset),
            Stats.ARMOR.name: getStat(Stats.ARMOR, elem, offset),
            Stats.DMG_MIN.name: getStat(Stats.DMG_MIN, elem, offset),
            Stats.DMG_MAX.name: getStat(Stats.DMG_MAX, elem, offset),
            Stats.ATTACKSPEED.name: getStat(Stats.ATTACKSPEED, elem, offset),
            Stats.BAT.name: "%.1f" % float(getStat(Stats.BAT, elem, offset)),
            Stats.ATK_PT.name: getStat(Stats.ATK_PT, elem, offset),
            Stats.ATK_BS.name: getStat(Stats.ATK_BS, elem, offset),
            Stats.VIS_DAY.name: getStat(Stats.VIS_DAY, elem, offset),
            Stats.VIS_NIGHT.name: getStat(Stats.VIS_NIGHT, elem, offset),
            Stats.TURNRATE.name: getStat(Stats.TURNRATE, elem, offset),
            Stats.COLLISION.name: getStat(Stats.COLLISION, elem, offset),
            Stats.HP_SEC.name: getStat(Stats.HP_SEC, elem, offset),
            Stats.LEGS.name: getStat(Stats.LEGS, elem, offset)
        }

        json_elements.append(j_elem)
        print(i)
        i+=1

with open('all_stats.json', 'w', encoding='utf-8') as f:
    json.dump(json_elements, f, ensure_ascii=False, indent=4)