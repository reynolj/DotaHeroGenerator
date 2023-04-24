const STR = "STRENGTH"
const AGI = "AGILITY"
const INT = "INTELLIGENCE"
const UNI = "UNIVERSAL"
const strAliases = new Array(STR, "STR", "S")
const agiAliases = new Array(AGI, "AGI", "A")
const intAliases = new Array(INT, "INT", "I")
const uniAliases = new Array(UNI, "UNI", "U")

function getActualAttribute(attribute){
    if (strAliases.includes(attribute))
        return STR
    if (agiAliases.includes(attribute))
        return AGI
    if (intAliases.includes(attribute))
        return INT
    if (uniAliases.includes(attribute))
        return UNI
}

module.exports = Object.freeze({
    STR : STR,
    AGI : AGI,
    INT : INT,
    UNI : UNI,
    strAliases : strAliases,
    agiAliases : agiAliases,
    intAliases : intAliases,
    uniAliases : uniAliases,
    attributeAliases : [].concat(strAliases, agiAliases, intAliases, uniAliases),
    getActualAttribute : getActualAttribute
})