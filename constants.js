const STR = "STRENGTH"
const AGI = "AGILITY"
const INT = "INTELLIGENCE"
const strAliases = new Array(STR, "STR", "S")
const agiAliases = new Array(AGI, "AGI", "A")
const intAliases = new Array(INT, "INT", "I")

function getActualAttribute(attribute){
    if (strAliases.includes(attribute))
        return STR
    if (agiAliases.includes(attribute))
        return AGI
    return INT
}

module.exports = Object.freeze({
    STR : STR,
    AGI : AGI,
    INT : INT,
    strAliases : strAliases,
    agiAliases : agiAliases,
    intAliases : intAliases,
    attributeAliases : [].concat(strAliases, agiAliases, intAliases),
    getActualAttribute : getActualAttribute
})