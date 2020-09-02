/* /////////////////////////////////////////////////////////////////////////////

(c) 2016-2020, Theodore Kruczek
http://keeptrack.space

All code is Copyright © 2016-2020 by Theodore Kruczek. All rights reserved.
No part of this web site may be reproduced, published, distributed, displayed,
performed, copied or stored for public or private use, without written
permission of the author.

No part of this code may be modified or changed or exploited in any way used
for derivative works, or offered for sale, or used to construct any kind of database
or mirrored at any other location without the express written permission of the author.

///////////////////////////////////////////////////////////////////////////// */

;(function () {
  // Requires starManager Module
  try {
    starManager.isConstellationVisible = false
    starManager.isAllConstellationVisible = false
    starManager.findStarsConstellation = function (starName) {
      for (var i = 0; i < starManager.constellations.length; i++) {
        for (var s = 0; s < starManager.constellations[i].stars.length; s++) {
          if (starManager.constellations[i].stars[s][0] === starName) {
            return starManager.constellations[i].name
          }
          if (starManager.constellations[i].stars[s][1] === starName) {
            return starManager.constellations[i].name
          }
        }
      }
      return null
    }
    starManager.drawAllConstellations = function () {
      for (var i = 0; i < starManager.constellations.length; i++) {
        for (var s = 0; s < starManager.constellations[i].stars.length; s++) {
          // Verify Stars Exist
          try {
            var star1 = satSet.getSat(
              satSet.getIdFromStarName(
                starManager.constellations[i].stars[s][0],
              ),
            )
            var star2 = satSet.getSat(
              satSet.getIdFromStarName(
                starManager.constellations[i].stars[s][1],
              ),
            )
            if (star1 == null || star2 == null) {
              continue
            }
          } catch (e) {
            console.warn(`Star/Constellation error - i: ${i} - s: ${s}`)
            continue
          }
          drawLineList.push({
            line: new Line(),
            star1: starManager.constellations[i].stars[s][0],
            star2: starManager.constellations[i].stars[s][1],
            color: [1, 1, 1, 1],
          })
          starManager.isConstellationVisible = true
          starManager.isAllConstellationVisible = true
        }
      }
    }
    starManager.drawConstellations = function (C) {
      for (var i = 0; i < starManager.constellations.length; i++) {
        if (starManager.constellations[i].name === C) {
          for (var s = 0; s < starManager.constellations[i].stars.length; s++) {
            // Verify Stars Exist
            var star1 = satSet.getSat(
              satSet.getIdFromStarName(
                starManager.constellations[i].stars[s][0],
              ),
            )
            var star2 = satSet.getSat(
              satSet.getIdFromStarName(
                starManager.constellations[i].stars[s][1],
              ),
            )
            if (star1 == null || star2 == null) {
              continue
            }
            drawLineList.push({
              line: new Line(),
              star1: starManager.constellations[i].stars[s][0],
              star2: starManager.constellations[i].stars[s][1],
            })
            starManager.isConstellationVisible = true
          }
        }
      }
    }
    starManager.clearConstellations = function () {
      starManager.isConstellationVisible = false
      var isFoundStar = true
      var attempts = 0
      while (isFoundStar && attempts < 30) {
        isFoundStar = false
        for (var i = 0; i < drawLineList.length; i++) {
          if (
            typeof drawLineList[i].star1 !== 'undefined' ||
            typeof drawLineList[i].star2 !== 'undefined'
          ) {
            drawLineList.splice(i, 1)
            isFoundStar = true
          }
        }
        attempts++
      }
    }

    starManager.constellations = [
    {
      "name": "Ursa Minor",
      "stars": [["Polaris", "Yildun"],
                ["Yildun", "ε-UMi"],
                ["ε-UMi", "ζ-UMi"],
                ["ζ-UMi", "Kochab"],
                ["Kochab", "Pherkad"],
                ["Pherkad", "η-UMi"],
                ["η-UMi", "ζ-UMi"]]
    },
    {
      "name": "Ursa Major",
      "stars": [["Alkaid", "Mizar"],
                ["Mizar", "Alioth"],
                ["Alioth", "Megrez"],
                ["Megrez", "Dubhe"],
                ["Dubhe", "Merak"],
                ["Merak", "Phecda"],
                ["Phecda", "Megrez"]]
    },
    {
      "name": "Sextans",
      "stars": [["α-Sextans", "γ-Sextans"],
                ["γ-Sextans", "β-Sextans"],
                ["β-Sextans", "α-Sextans"]]
    },
    {
      "name": "Leo Minor",
      "stars": [["46-LMi", "β-LMi"],
                ["β-LMi", "21-LMi"]]
    },
    {
      "name": "Aquila",
      "stars": [["Altair", "Alshain"],
                ["Alshain", "θ-Aql"],
                ["θ-Aql", "η-Aql"],
                ["η-Aql", "δ-Aql"],
                ["δ-Aql", "ζ-Aql"],
                ["ζ-Aql", "Tarazed"],
                ["Tarazed", "Altair"],
                ["ζ-Aql", "ε-Aql"],
                ["δ-Aql", "λ-Aql"]]
    },
    {
      "name": "Aries",
      "stars": [["c-Ari", "Hamal"],
                ["Hamal", "Sheratan"],
                ["Sheratan", "Mesarthim"]]
    },
    {
      "name": "Perseus",
      "stars": [["Atik", "ζ-Per"],
                ["ζ-Per", "Menkib"],
                ["Menkib", "ε-Per"],
                ["ε-Per", "δ-Per"],
                ["δ-Per", "Mirphak"],
                ["Mirphak", "κ-Per"],
                ["κ-Per", "Algol"],
                ["Algol", "ρ-Per"],
                ["ρ-Per", "16-Per"],
                ["Mirphak", "γ-Per"],
                ["γ-Per", "η-Per"],
                ["η-Per", "φ-Per"]]
    },
    {
      "name": "Cassiopeia",
      "stars": [["ε-Cas", "Ruchbah"],
                ["Ruchbah", "γ-Cas"],
                ["γ-Cas", "Schedar"],
                ["Schedar", "Caph"]]
    },
    {
    "name": "Triangulum",
    "stars": [["γ-Tri", "β-Tri"],
              ["β-Tri", "Mothallah"],
              ["Mothallah", "γ-Tri"]]
    },
    {
    "name": "Antlia",
    "stars": [["ι-Ant", "α-Ant"],
              ["α-Ant", "θ-Ant"],
              ["θ-Ant", "ε-Ant"]]
    },
    {
    "name": "Pyxis",
    "stars": [["γ-Pyx", "α-Pyx"],
              ["α-Pyx", "β-Pyx"]]
    },
    {
    "name": "Corvus",
    "stars": [["Alchiba", "ε-Crv"],
              ["ε-Crv", "Gienah"],
              ["Gienah", "Algorab"],
              ["Algorab", "β-Crv"],
              ["β-Crv", "ε-Crv"]]
    },
    {
    "name": "Apus",
    "stars": [["α-Aps", "δ¹-Aps"],
              ["δ¹-Aps", "β-Aps"],
              ["β-Aps", "γ-Aps"],
              ["γ-Aps", "δ¹-Aps"]]
    },
    {
    "name": "Triangulum Australe",
    "stars": [["β-TrA", "η¹-TrA"],
              ["η¹-TrA", "Atria"],
              ["Atria", "γ-TrA"],
              ["γ-TrA", "ε-TrA"],
              ["ε-TrA", "β-TrA"]]
    },
    {
    "name": "Circinus",
    "stars": [["β-Cir", "θ-Cir"],
              ["θ-Cir", "α-Cir"],
              ["α-Cir", "γ-Cir"]]
    },
    {
    "name": "Norma",
    "stars": [["η-Nor", "γ¹-Nor"],
              ["γ¹-Nor", "γ²-Nor"],
              ["γ²-Nor", "ε-Nor"]]
    },
    {
    "name": "Scorpius",
    "stars": [["Shaula", "κ-Sco"],
              ["κ-Sco", "ι¹-Sco"],
              ["ι¹-Sco", "Sargas"],
              ["Sargas", "η-Sco"],
              ["η-Sco", "ζ²-Sco"],
              ["ζ²-Sco", "μ¹-Sco"],
              ["μ¹-Sco", "ε-Sco"],
              ["ε-Sco", "τ-Sco"],
              ["τ-Sco", "Antares"],
              ["Antares", "σ-Sco"],
              ["σ-Sco", "Dschubba"],
              ["Dschubba", "Acrab"],
              ["Acrab", "ν-Sco"],
              ["Dschubba", "π-Sco"],
              ["π-Sco", "ρ-Sco"]]
    },
    {
    "name": "Corona Borealis",
    "stars": [["ι-CrB", "ε-CrB"],
              ["ε-CrB", "γ-CrB"],
              ["γ-CrB", "Alphecca"],
              ["Alphecca", "Nusakan"],
              ["Nusakan", "θ-CrB"]]
    },
    {
    "name": "Serpens Cauda",
    "stars": [["ν-Ser", "ξ-Ser"],
              ["ξ-Ser", "O-Ser"],
              ["O-Ser", "η-Ser"],
              ["η-Ser", "Alya"],
              ["Alya", "β-TrA"]]
    },
    {
    "name": "Serpens Caput",
    "stars": [["μ-Ser", "ω-Ser"],
              ["ω-Ser", "ε-Ser"],
              ["ε-Ser", "Unukalhai"],
              ["Unukalhai", "16-Ser"],
              ["16-Ser", "δ-Ser"],
              ["δ-Ser", "β-Ser"],
              ["β-Ser", "γ-Ser"],
              ["γ-Ser", "κ-Ser"],
              ["κ-Ser", "β-Ser"]]
    },
    {
    "name": "Aquarius",
    "stars": [["c²-Aqr", "Skat"],
              ["Skat", "τ²-Aqr"],
              ["τ²-Aqr", "λ-Aqr"],
              ["λ-Aqr", "81-Aqr"],
              ["81-Aqr", "φ-Aqr"],
              ["φ-Aqr", "η-Aqr"],
              ["ζ¹-Aqr", "Sadachbia"],
              ["Sadachbia", "Sadalmelik"],
              ["Sadalmelik", "Ancha"],
              ["Ancha", "e-Aqr"],
              ["e-Aqr", "ι-Aqr"],
              ["Sadalmelik", "Sadalsuud"],
              ["Sadalsuud", "μ-Aqr"],
              ["μ-Aqr", "Albali"]]
    },
    {
    "name": "Crux",
    "stars": [["Gacrux", "Acrux"],
              ["Mimosa", "δ-Cru"]]
    },
    {
    "name": "Musca",
    "stars": [["δ-Mus", "α-Mus"],
              ["α-Mus", "β-Mus"],
              ["α-Mus", "γ-Mus"],
              ["α-Mus", "ζ¹-Mus"],
              ["ζ¹-Mus", "ε-Mus"],
              ["ε-Mus", "μ-Mus"],
              ["μ-Mus", "λ-Mus"]]
    },
    {
    "name": "Chamaeleon",
    "stars": [["β-Cha", "γ-Cha"],
              ["γ-Cha", "δ²-Cha"],
              ["δ²-Cha", "β-Cha"],
              ["γ-Cha", "α-Cha"],
              ["α-Cha", "θ-Cha"],
              ["θ-Cha", "η-Cha"],
              ["η-Cha", "RS Cha"],
              ["RS Cha","ι-Cha"]]
    },
    {
    "name": "Volans",
    "stars": [["α-Vol", "β-Vol"],
              ["β-Vol", "ε-Vol"],
              ["ε-Vol", "ζ-Vol"],
              ["ζ-Vol", "γ²-Vol"],
              ["γ²-Vol", "δ-Vol"],
              ["δ-Vol", "ε-Vol"]]
    },
    {
    "name": "Carina",
    "stars": [["υ-Car", "Miaplacidus"],
              ["Miaplacidus", "ω-Car"],
              ["ω-Car", "θ-Car"],
              ["θ-Car", "V337 Car"],
              ["V337 Car", "Aspidiske"],
              ["Aspidiske", "Avior"],
              ["Avior", "χ-Car"],
              ["χ-Car","N-Car"],
              ["N-Car", "Canopus"]]
    },
    {
    "name": "Pictor",
    "stars": [["β-Pic", "γ-Pic"],
              ["γ-Pic", "α-Pic"]]
    },
    {
    "name": "Dorado",
    "stars": [["36-Dor", "β-Dor"],
              ["δ-Dor", "β-Dor"],
              ["β-Dor", "ζ-Dor"],
              ["ζ-Dor", "α-Dor"],
              ["α-Dor", "γ-Dor"]]
    },
    {
    "name": "Reticulum",
    "stars": [["ε-Ret", "ι-Ret"],
              ["ι-Ret", "δ-Ret"],
              ["δ-Ret", "β-Ret"],
              ["β-Ret", "α-Ret"],
              ["α-Ret", "ε-Ret"]]
    },
    {
    "name": "Horologium",
    "stars": [["α-Hor", "ι-Hor"],
              ["ι-Hor", "η-Hor"],
              ["η-Hor", "ζ-Hor"],
              ["ζ-Hor", "μ-Hor"],
              ["μ-Hor", "β-Hor"]]
    },
    {
    "name": "Hydrus",
    "stars": [["β-Hyi", "γ-Hyi"],
              ["γ-Hyi", "ε-Hyi"],
              ["ε-Hyi", "δ-Hyi"],
              ["δ-Hyi", "α-Hyi"]]
    },
    {
    "name": "Octans",
    "stars": [["ν-Oct", "β-Oct"],
              ["β-Oct", "δ-Oct"],
              ["δ-Oct", "ν-Oct"]]
    },
    {
    "name": "Indus",
    "stars": [["δ-Ind", "θ-Ind"],
              ["θ-Ind", "β-Ind"],
              ["θ-Ind", "α-Ind"]]
    },
    {
    "name": "Tucana",
    "stars": [["δ-Tuc", "α-Tuc"],
              ["α-Tuc", "γ-Tuc"],
              ["γ-Tuc", "ε-Tuc"],
              ["ε-Tuc", "ζ-Tuc"],
              ["ζ-Tuc", "β¹-Tuc"],
              ["β¹-Tuc", "γ-Tuc"]]
    },
    {
    "name": "Grus",
    "stars": [["ζ-Gru", "ε-Gru"],
              ["ε-Gru", "β-Gru"],
              ["β-Gru", "ι-Gru"],
              ["ι-Gru", "θ-Gru"],
              ["β-Gru", "Alnair"],
              ["β-Gru", "δ²-Gru"],
              ["δ²-Gru", "δ¹-Gru"],
              ["δ¹-Gru", "μ²-Gru"],
              ["μ²-Gru", "μ¹-Gru"],
              ["μ¹-Gru", "λ-Gru"],
              ["λ-Gru", "γ-Gru"]]
    },
    {
    "name": "Microscopium",
    "stars": [["θ¹-Mic", "ε-Mic"],
              ["ε-Mic", "2-PsA"],
              ["2-PsA", "γ-Mic"],
              ["γ-Mic", "α-Mic"]]
    },
    {
    "name": "Corona Australis",
    "stars": [["λ-CrA", "ε-CrA"],
              ["ε-CrA", "γ-CrA"],
              ["γ-CrA", "α-CrA"],
              ["α-CrA", "β-CrA"],
              ["β-CrA", "δ-CrA"],
              ["δ-CrA", "ζ-CrA"],
              ["ζ-CrA", "η¹-CrA"]]
    },
    {
    "name": "Telescopium",
    "stars": [["ζ-Tel", "α-Tel"],
              ["α-Tel", "ε-Tel"]]
    },
    {
    "name": "Ara",
    "stars": [["θ-Ara", "α-Ara"],
              ["α-Ara", "κ-Ara"],
              ["κ-Ara", "ε¹-Ara"],
              ["ε¹-Ara", "ζ-Ara"],
              ["ζ-Ara", "η-Ara"],
              ["ζ-Ara", "γ-Ara"],
              ["γ-Ara", "δ-Ara"],
              ["γ-Ara", "β-Ara"],
              ["β-Ara", "α-Ara"]]
    },
    {
    "name": "Lynx",
    "stars": [["α-Lyn", "38-Lyn"],
              ["38-Lyn", "10-UMa"],
              ["10-UMa", "31-Lyn"],
              ["31-Lyn", "21-Lyn"],
              ["21-Lyn", "15-Lyn"],
              ["15-Lyn", "UZ Lyn"]]
    },
    {
    "name": "Gemini",
    "stars": [["Propus", "μ-Gem"],
              ["μ-Gem", "Mebsuta"],
              ["Mebsuta", "τ-Gem"],
              ["τ-Gem", "ρ-Gem"],
              ["ρ-Gem", "Castor"],
              ["Castor", "σ-Gem"],
              ["σ-Gem", "Pollux"],
              ["Pollux", "κ-Gem"],
              ["κ-Gem", "Wasat"],
              ["Wasat", "Mekbuda"],
              ["Mekbuda", "Alhena"],
              ["Alhena", "30-Gem"],
              ["30-Gem", "ξ-Gem"]]
    },
    {
    "name": "Canis Minor",
    "stars": [["Procyon", "Gomeisa"]]
    },
    {
    "name": "Monoceros",
    "stars": [["ζ-Mon", "α-Mon"],
              ["α-Mon", "δ-Mon"],
              ["δ-Mon", "β-Mon"],
              ["β-Mon", "γ-Mon"],
              ["δ-Mon", "18-Mon"],
              ["18-Mon", "ε-Mon"],
              ["ε-Mon", "13-Mon"]]
    },
    {
    "name": "Canis Major",
    "stars": [["Mirzam", "Sirius"],
              ["Sirius", "EY CMa"],
              ["EY CMa", "O²-CMa"],
              ["O²-CMa", "Wezen"],
              ["Wezen", "σ-CMa"],
              ["σ-CMa", "Adhara"],
              ["Wezen", "Aludra"]]
    },
    {
    "name": "Columba",
    "stars": [["δ-Col", "κ-Col"],
              ["κ-Col", "γ-Col"],
              ["γ-Col", "Wazn"],
              ["Wazn", "η-Col"],
              ["Wazn", "Phact"],
              ["Phact", "ε-Col"]]
    },
    {
    "name": "Caelum",
    "stars": [["α-Cae", "β-Cae"]]
    },
    {
    "name": "Puppis",
    "stars": [["τ-Pup", "ν-Pup"],
              ["ν-Pup", "π-Pup"],
              ["π-Pup", "NV Pup"],
              ["NV Pup", "p-Pup"],
              ["p-Pup", "κ²-Pup"],
              ["κ²-Pup", "ξ-Pup"],
              ["ξ-Pup", "Tureis"],
              ["Tureis", "Naos"],
              ["Naos", "σ-Pup"],
              ["σ-Pup", "L2 Pup"],
              ["L2 Pup", "τ-Pup"]]
    },
    {
    "name": "Lupus",
    "stars": [["θ-Lup", "η-Lup"],
              ["η-Lup", "γ-Lup"],
              ["γ-Lup", "ε-Lup"],
              ["ε-Lup", "κ¹-Lup"],
              ["κ¹-Lup", "ζ-Lup"],
              ["ζ-Lup", "α-Lup"],
              ["α-Lup", "β-Lup"],
              ["β-Lup", "δ-Lup"],
              ["δ-Lup", "γ-Lup"],
              ["δ-Lup", "φ¹-Lup"],
              ["φ¹-Lup", "χ-Lup"]]
    },
    {
    "name": "Pavo",
    "stars": [["Peacock", "β-Pav"],
              ["β-Pav", "δ-Pav"],
              ["δ-Pav", "λ-Pav"],
              ["λ-Pav", "ξ-Pav"],
              ["ξ-Pav", "π-Pav"],
              ["π-Pav", "η-Pav"],
              ["η-Pav", "ζ-Pav"],
              ["ζ-Pav", "ε-Pav"],
              ["ε-Pav", "υ-Pav"],
              ["υ-Pav", "β-Pav"],
              ["β-Pav", "γ-Pav"]]
    },
    {
    "name": "Bootes",
    "stars": [["θ-Boo", "λ-Boo"],
              ["λ-Boo", "Seginus"],
              ["Seginus", "ρ-Boo"],
              ["ρ-Boo", "Arcturus"],
              ["Arcturus", "Muphrid"],
              ["Arcturus", "ζ-Boo"],
              ["Arcturus", "W Boo"],
              ["W Boo", "Izar"],
              ["Izar", "δ-Boo"],
              ["δ-Boo", "Nekkar"],
              ["Nekkar", "Seginus"]]
    },
    {
    "name": "Canes Venatici",
    "stars": [["Cor Caroli", "9-CVn"],
              ["9-CVn", "Chara"]]
    },
    {
    "name": "Coma Berenices",
    "stars": [["α-Com", "β-Com"],
              ["β-Com", "γ-Com"]]
    },
    {
    "name": "Leo",
    "stars": [["ε-Leo", "Rasalas"],
              ["Rasalas", "Adhafera"],
              ["Adhafera", "Algieba"],
              ["Algieba", "η-Leo"],
              ["η-Leo", "Regulus"],
              ["Regulus", "k-Leo"],
              ["k-Leo", "Chertan"],
              ["Chertan", "Zosma"],
              ["Zosma", "Denebola"],
              ["Denebola", "Chertan"]]
    },
    {
    "name": "Camelopardalis",
    "stars": [["7-Cam", "β-Cam"],
              ["β-Cam", "α-Cam"],
              ["α-Cam", "γ-Cam"],
              ["γ-Cam", "HD 21291"]]
    },
    {
    "name": "Cancer",
    "stars": [["ι-Cnc", "Asellus Borealis"],
              ["Asellus Borealis", "Asellus Australis"],
              ["Asellus Australis", "54-Cnc"],
              ["54-Cnc", "Acubens"],
              ["Asellus Australis", "BP Cnc"],
              ["BP Cnc", "β-Cnc"]]
    },
    {
    "name": "Capricornus",
    "stars": [["Algedi", "Dabih"],
              ["Dabih", "O-Cap"],
              ["O-Cap", "ψ-Cap"],
              ["ψ-Cap", "ω-Cap"],
              ["ω-Cap", "A-Cap"],
              ["A-Cap", "ζ-Cap"],
              ["ζ-Cap", "b-Cap"],
              ["b-Cap", "37-Cap"],
              ["37-Cap", "ε-Cap"],
              ["ε-Cap", "δ-Cap"],
              ["δ-Cap", "ι-Cap"],
              ["ι-Cap", "θ-Cap"],
              ["θ-Cap", "Dabih"]]
    },
    {
    "name": "Centaurus",
    "stars": [["λ-Cen", "π-Cen"],
              ["π-Cen", "ρ-Cen"],
              ["ρ-Cen", "δ-Cen"],
              ["δ-Cen", "σ-Cen"],
              ["σ-Cen", "γ-Cen"],
              ["γ-Cen", "ε-Cen"],
              ["ε-Cen", "Hadar"],
              ["ε-Cen", "Rigil Kentaurus"],
              ["ε-Cen", "M-Cen"],
              ["M-Cen" ,"ζ-Cen"],
              ["ζ-Cen", "μ-Cen"],
              ["μ-Cen", "ν-Cen"],
              ["ν-Cen", "Menkent"],
              ["ν-Cen", "η-Cen"],
              ["η-Cen", "κ-Cen"],
              ["v-Cen", "ι-Cen"]]
    },
    {
    "name": "Cepheus",
    "stars": [["δ-Cep", "ε-Cep"],
              ["ε-Cep", "ζ-Cep"],
              ["ζ-Cep", "Alderamin"],
              ["Alderamin", "η-Cep"],
              ["η-Cep", "θ-Cep"],
              ["Alderamin", "Alfirk"],
              ["Alfirk", "78-Dra"],
              ["78-Dra", "16-Cep"],
              ["16-Cep", "Errai"],
              ["Errai", "ι-Cep"],
              ["ι-Cep" ,"ζ-Cep"]]
    },
    {
    "name": "Cetus",
    "stars": [["ι-Cet", "Diphda"],
              ["Diphda", "τ-Cet"],
              ["τ-Cet", "Baten Kaitos"],
              ["Baten Kaitos", "θ-Cet"],
              ["θ-Cet", "η-Cet"],
              ["η-Cet", "ι-Cet"],
              ["Baten Kaitos", "70-Cet"],
              ["70-Cet", "δ-Cet"],
              ["δ-Cet", "γ-Cet"],
              ["γ-Cet" ,"ν-Cet"]
              ["ν-Cet", "ξ²-Cet"],
              ["ξ²-Cet", "μ-Cet"],
              ["μ-Cet", "λ-Cet"],
              ["λ-Cet", "93-Cet"],
              ["93-Cet", "Menkar"],
              ["Menkar", "γ-Cet"]]
    },
    {
    "name": "Crater",
    "stars": [["η-Crt", "ζ-Crt"],
              ["ζ-Crt", "γ-Crt"],
              ["γ-Crt", "β-Crt"],
              ["β-Crt", "Alkes"],
              ["Alkes", "δ-Crt"],
              ["δ-Crt", "γ-Crt"],
              ["δ-Crt", "ε-Crt"],
              ["ε-Crt", "θ-Crt"]]
    },
    {
    "name": "Cygnus",
    "stars": [["ζ-Cyg", "DT Cyg"],
              ["DT Cyg", "ε-Cyg"],
              ["ε-Cyg", "Sadr"],
              ["Sadr", "Deneb"],
              ["Sadr", "η-Cyg"],
              ["η-Cyg", "9-Cyg"],
              ["9-Cyg", "Albireo"],
              ["Sadr", "δ-Cyg"],
              ["δ-Cyg", "θ-Cyg"],
              ["θ-Cyg" ,"ι-Cyg"],
              ["ι-Cyg", "κ-Cyg"]]
    },
    {
    "name": "Lyra",
    "stars": [["κ-Lyr", "Vega"],
              ["Vega", "ε²-Lyr"],
              ["ε²-Lyr", "ζ¹-Lyr"],
              ["ζ¹-Lyr", "Sheliak"],
              ["Sheliak", "Sulafat"],
              ["Sulafat", "δ²-Lyr"],
              ["δ²-Lyr", "δ¹-Lyr"],
              ["δ¹-Lyr", "ζ¹-Lyr"]]
    },
    {
    "name": "Vulpecula",
    "stars": [["1-Vul", "α-Vul"],
              ["α-Vul", "13-Vul"]]
    },
    {
    "name": "Delphinus",
    "stars": [["ε-Del", "Rotanev"],
              ["Rotanev", "Sualocin"],
              ["Sualocin", "γ²-Del"],
              ["γ²-Del", "δ-Del"],
              ["δ-Del", "Rotanev"]]
    },
    {
    "name": "Sagitta",
    "stars": [["η-Sge", "γ-Sge"],
              ["γ-Sge", "ζ-Sge"],
              ["ζ-Sge", "Sham"],
              ["ζ-Sge", "β-Sge"]]
    },
    {
    "name": "Equuleus",
    "stars": [["γ-Equ", "δ-Equ"],
              ["δ-Equ", "9-Equ"],
              ["9-Equ", "β-Equ"],
              ["β-Equ", "Kitalpha"],
              ["Kitalpha", "6-Equ"],
              ["6-Equ", "γ-Equ"]]
    },
    {
    "name": "Pegasus",
    "stars": [["Enif", "Biham"],
              ["Biham", "36-Peg"],
              ["36-Peg", "Homam"],
              ["Homam", "ξ-Peg"],
              ["ξ-Peg", "Markab"],
              ["1-Peg", "9-Peg"],
              ["9-Peg", "λ-Peg"],
              ["λ-Peg", "Sadalbari"],
              ["Sadalbari", "Scheat"],
              ["Scheat", "Matar"],
              ["Matar", "ι-Peg"],
              ["ι-Peg", "κ-Peg"],
              ["Scheat", "Markab"],
              ["Markab", "Algenib"],
              ["Algenib", "Alpheratz"],
              ["Alpheratz", "79-Peg"],
              ["79-Peg", "Scheat"]]
    },
    {
    "name": "Lacerta",
    "stars": [["1-Lac", "HD 211073"],
              ["HD 211073", "6-Lac"],
              ["6-Lac", "2-Lac"],
              ["2-Lac", "5-Lac"],
              ["5-Lac", "4-Lac"],
              ["4-Lac", "α-Lac"],
              ["α-Lac", "β-Lac"]]
    },
    {
    "name": "Andromeda",
    "stars": [["51-And", "A-And"],
              ["A-And", "Adhil"],
              ["Adhil", "μ-And"],
              ["μ-And", "π-And"],
              ["π-And", "Alpheratz"],
              ["Alpheratz", "δ-And"],
              ["δ-And", "Mirach"],
              ["Mirach", "47-And"],
              ["47-And", "Almach"]]
    },
    {
    "name": "Draco",
    "stars": [["λ-Dra", "2-Dra"],
              ["2-Dra", "κ-Dra"],
              ["κ-Dra", "Thuban"],
              ["Thuban", "Edasich"],
              ["Edasich", "θ-Dra"],
              ["θ-Dra", "η-Dra"],
              ["η-Dra", "h-Dra"],
              ["h-Dra", "ζ-Dra"],
              ["ζ-Dra", "ψ-Dra"],
              ["ψ-Dra", "χ-Dra"],
              ["χ-Dra", "τ-Dra"],
              ["τ-Dra", "ε-Dra"],
              ["ε-Dra", "Altais"],
              ["Altais", "Grumium"],
              ["Grumium", "ν²-Dra"],
              ["ν²-Dra", "Rastaban"],
              ["Rastaban", "Eltanin"],
              ["Eltanin", "Grumium"]]
    },
    {
    "name": "Hercules",
    "stars": [["φ-Her", "τ-Her"],
              ["τ-Her", "σ-Her"],
              ["σ-Her", "η-Her"],
              ["η-Her", "ζ-Her"],
              ["ζ-Her", "ε-Her"],
              ["ε-Her", "π-Her"],
              ["π-Her", "η-Her"],
              ["ζ-Her", "Kornephoros"],
              ["Kornephoros", "γ-Her"],
              ["Kornephoros", "Rasalgethi"],
              ["ε-Her", "Sarin"],
              ["Sarin", "Maasym"],
              ["Maasym", "μ-Her"],
              ["μ-Her", "ξ-Her"],
              ["ξ-Her", "O-Her"],
              ["π-Her", "ρ-Her"],
              ["ρ-Her", "θ-Her"],
              ["θ-Her", "f-Her"],
              ["f-Her", "ι-Her"]]
    },
    {
    "name": "Ophiuchus",
    "stars": [["d-Oph", "θ-Oph"],
              ["θ-Oph", "b-Oph"],
              ["b-Oph", "ξ-Oph"],
              ["ξ-Oph", "Sabik"],
              ["Sabik", "ζ-Oph"],
              ["ζ-Oph", "υ-Oph"],
              ["υ-Oph", "Yed Posterior"],
              ["Yed Posterior", "Yed Prior"],
              ["Yed Prior", "Marfik"],
              ["Marfik", "37-Her"],
              ["37-Her", "k-Her"],
              ["k-Her", "κ-Oph"],
              ["κ-Oph", "37-Oph"],
              ["37-Oph", "Rasalhague"],
              ["Rasalhague", "Cebalrai"],
              ["Cebalrai", "γ-Oph"],
              ["γ-Oph", "67-Oph"],
              ["67-Oph", "p-Oph"],
              ["γ-Oph", "ν-Oph"],
              ["Cebalrai", "47-Oph"],
              ["47-Oph", "Sabik"]]
    },
    {
    "name": "Scutum",
    "stars": [["γ-Sct", "α-Sct"],
              ["α-Sct", "ζ-Sct"],
              ["α-Sct", "β-Sct"]]
    },
    {
    "name": "Sagittarius",
    "stars": [["ρ¹-Sgr", "d-Sgr"],
              ["d-Sgr", "π-Sgr"],
              ["π-Sgr", "O-Sgr"],
              ["O-Sgr", "ξ¹-Sgr"],
              ["O-Sgr", "Nunki"],
              ["Nunki", "φ-Sgr"],
              ["φ-Sgr", "Ascella"],
              ["Ascella", "τ-Sgr"],
              ["τ-Sgr", "Nunki"],
              ["φ-Sgr", "Kaus Borealis"],
              ["Kaus Borealis", "μ-Sgr"],
              ["Kaus Borealis", "Kaus Media"],
              ["Kaus Media", "Alnasl"],
              ["Alnasl", "X Sgr"],
              ["Kaus Media", "Kaus Australis"],
              ["Kaus Australis", "η-Sgr"],
              ["τ-Sgr", "h²-Sgr"],
              ["h²-Sgr", "b¹-Sgr"],
              ["b¹-Sgr", "V3872 Sgr"],
              ["V3872 Sgr", "θ²-Sgr"],
              ["θ²-Sgr", "θ¹-Sgr"],
              ["θ¹-Sgr", "ι-Sgr"],
              ["ι-Sgr", "Rukbat"],
              ["ι-Sgr", "Arkab Prior"]]
    },
    {
    "name": "Pavo",
    "stars": [["γ-Pav", "β-Pav"],
              ["β-Pav", "Peacock"],
              ["β-Pav", "δ-Pav"],
              ["δ-Pav", "λ-Pav"],
              ["λ-Pav", "ξ-Pav"],
              ["ξ-Pav", "π-Pav"],
              ["π-Pav", "η-Pav"],
              ["η-Pav", "ζ-Pav"],
              ["ζ-Pav", "ε-Pav"],
              ["ε-Pav", "υ-Pav"],
              ["υ-Pav", "β-Pav"]]
    },
    {
    "name": "Vela",
    "stars": [["μ-Vel", "p-Vel"],
              ["p-Vel", "t-Vel"],
              ["t-Vel", "q-Vel"],
              ["q-Vel", "ψ-Vel"],
              ["ψ-Vel", "Suhail"],
              ["Suhail", "d-Vel"],
              ["d-Vel", "e-Vel"],
              ["e-Vel", "γ²-Vel"],
              ["γ²-Vel", "δ-Vel"],
              ["δ-Vel", "κ-Vel"],
              ["κ-Vel", "φ-Vel"],
              ["φ-Vel", "μ-Vel"]]
    },
    {
    "name": "Eridanus",
    "stars": [["Achernar", "χ-Eri"],
              ["χ-Eri", "φ-Eri"],
              ["φ-Eri", "κ-Eri"],
              ["κ-Eri", "ι-Eri"],
              ["ι-Eri", "Acamar"],
              ["Acamar", "e-Eri"],
              ["e-Eri", "y-Eri"],
              ["y-Eri", "f-Eri"],
              ["f-Eri", "g-Eri"],
              ["g-Eri", "υ⁴-Eri"],
              ["υ⁴-Eri", "d-Eri"],
              ["d-Eri", "υ²-Eri"],
              ["υ²-Eri", "υ¹-Eri"],
              ["υ¹-Eri", "τ^9-Eri"],
              ["τ^9-Eri", "τ^8-Eri"],
              ["τ^8-Eri", "τ⁶-Eri"],
              ["τ⁶-Eri", "τ⁵-Eri"],
              ["τ⁵-Eri", "τ⁴-Eri"],
              ["τ⁴-Eri", "τ³-Eri"],
              ["τ³-Eri", "τ²-Eri"],
              ["τ²-Eri", "τ¹-Eri"],
              ["τ¹-Eri", "Azha"],
              ["Azha", "14-Eri"],
              ["14-Eri", "Ran"],
              ["Ran", "δ-Eri"],
              ["δ-Eri", "π-Eri"],
              ["π-Eri", "Zaurak"],
              ["Zaurak", "Beid"],
              ["Beid", "ν-Eri"],
              ["ν-Eri", "ω-Eri"],
              ["ω-Eri", "Cursa"],
              ["Cursa", "λ-Eri"]]
    },
    {
    "name": "Orion",
    "stars": [["π¹-Ori", "π²-Ori"],
              ["π²-Ori", "π³-Ori"],
              ["π³-Ori", "π⁴-Ori"],
              ["π⁴-Ori", "π⁵-Ori"],
              ["π⁵-Ori", "π⁶-Ori"],
              ["π³-Ori", "Bellatrix"],
              ["Bellatrix", "Meissa"],
              ["Meissa", "Betelgeuse"],
              ["Betelgeuse", "Alnitak"],
              ["Alnitak", "Saiph"],
              ["Saiph", "Rigel"],
              ["Rigel", "τ-Ori"],
              ["τ-Ori", "CI Ori"],
              ["CI Ori", "Mintaka"],
              ["Mintaka", "Bellatrix"],
              ["Betelgeuse", "μ-Ori"],
              ["μ-Ori", "ξ-Ori"],
              ["ξ-Ori", "χ²-Ori"],
              ["ξ-Ori", "ν-Ori"],
              ["ν-Ori", "χ¹-Ori"]]
    },
    {
    "name": "Taurus",
    "stars": [["O-Tau", "ξ-Tau"],
              ["ξ-Tau", "e-Tau"],
              ["e-Tau", "λ-Tau"],
              ["λ-Tau", "γ-Tau"],
              ["γ-Tau", "V777 Tau"],
              ["V777 Tau", "θ²-Tau"],
              ["θ²-Tau", "Aldebaran"],
              ["Aldebaran", "ζ-Tau"],
              ["γ-Tau", "δ-Tau"],
              ["δ-Tau", "Ain"],
              ["Ain", "τ-Tau"],
              ["τ-Tau", "k-Tau"],
              ["k-Tau", "Elnath"]]
    },
    {
    "name": "Auriga",
    "stars": [["Elnath", "22-Aur"],
              ["22-Aur", "ι-Aur"],
              ["ι-Aur", "η-Aur"],
              ["η-Aur", "ε-Aur"],
              ["ε-Aur", "Capella"],
              ["Capella", "Menkalinan"],
              ["Menkalinan", "θ-Aur"],
              ["θ-Aur", "Elnath"]]
    },
    {
    "name": "Fornax",
    "stars": [["ν-For", "β-For"],
              ["β-For", "α-For"]]
    },
    {
    "name": "Sculptor",
    "stars": [["α-Scl", "ι-Scl"],
              ["ι-Scl", "δ-Scl"],
              ["δ-Scl", "γ-Scl"],
              ["γ-Scl", "β-Scl"]]
    },
    {
    "name": "Hydra",
    "stars": [["β-Hya", "ξ-Hya"],
              ["ξ-Hya", "ν-Hya"],
              ["ν-Hya", "φ-Hya"],
              ["φ-Hya", "φ²-Hya"],
              ["φ²-Hya", "μ-Hya"],
              ["μ-Hya", "λ-Hya"],
              ["λ-Hya", "υ²-Hya"],
              ["υ²-Hya", "υ¹-Hya"],
              ["υ¹-Hya", "Alphard"],
              ["Alphard", "ι-Hya"],
              ["ι-Hya", "θ-Hya"],
              ["θ-Hya", "ζ-Hya"],
              ["ζ-Hya", "ε-Hya"],
              ["ε-Hya", "δ-Hya"],
              ["δ-Hya", "σ-Hya"],
              ["σ-Hya", "η-Hya"],
              ["η-Hya", "ζ-Hya"]]
    },
    {
    "name": "Lepus",
    "stars": [["η-Lep", "ζ-Lep"],
              ["ζ-Lep", "Arneb"],
              ["Arneb", "μ-Lep"],
              ["Arneb", "Nihal"],
              ["Nihal", "ε-Lep"],
              ["Nihal", "12-Lep"],
              ["12-Lep", "γ-Lep"],
              ["γ-Lep", "δ-Lep"]]
    },
    {
    "name": "Libra",
    "stars": [["θ-Lib", "η-Lib"],
              ["η-Lib", "γ-Lib"],
              ["γ-Lib", "Zubeneschamali"],
              ["Zubeneschamali", "Zubenelgenubi"],
              ["Zubenelgenubi", "σ-Lib"],
              ["σ-Lib", "Zubeneschamali"],
              ["σ-Lib", "36-Lib"],
              ["36-Lib", "υ-Lib"],
              ["υ-Lib", "τ-Lib"]]
    },
    {
    "name": "Mensa",
    "stars": [["β-Men", "η-Men"],
              ["η-Men", "γ-Men"],
              ["γ-Men", "α-Men"]]
    },
    {
    "name": "Phoenix",
    "stars": [["δ-Phe", "γ-Phe"],
              ["γ-Phe", "ν-Phe"],
              ["ν-Phe", "β-Phe"],
              ["β-Phe", "Ankaa"],
              ["Ankaa", "ε-Phe"],
              ["ε-Phe", "η-Phe"],
              ["η-Phe", "ζ-Phe"],
              ["ζ-Phe", "β-Phe"]]
    },
    {
    "name": "Pisces",
    "stars": [["τ-Psc", "υ-Psc"],
              ["υ-Psc", "φ-Psc"],
              ["φ-Psc", "η-Psc"],
              ["η-Psc", "O-Psc"],
              ["O-Psc", "α-Psc"],
              ["α-Psc", "112-Psc"],
              ["112-Psc", "ν-Psc"],
              ["ν-Psc", "μ-Psc"],
              ["μ-Psc", "88-Psc"],
              ["88-Psc", "ε-Psc"],
              ["ε-Psc", "δ-Psc"],
              ["δ-Psc", "ω-Psc"],
              ["ω-Psc", "ι-Psc"],
              ["ι-Psc", "θ-Psc"],
              ["θ-Psc", "b-Psc"],
              ["b-Psc", "γ-Psc"],
              ["γ-Psc", "κ-Psc"],
              ["κ-Psc", "λ-Psc"],
              ["λ-Psc", "TX Psc"],
              ["TX Psc", "ι-Psc"]]
    },
    {
    "name": "Piscis Austrinus",
    "stars": [["Fomalhaut", "ε-PsA"],
              ["ε-PsA", "η-PsA"],
              ["η-PsA", "θ-PsA"],
              ["θ-PsA", "ι-PsA"],
              ["ι-PsA", "μ-PsA"],
              ["μ-PsA", "β-PsA"],
              ["β-PsA", "γ-PsA"],
              ["γ-PsA", "δ-PsA"],
              ["δ-PsA", "Fomalhaut"]]
    },
    {
    "name": "Virgo",
    "stars": [["109-Vir", "τ-Vir"],
              ["τ-Vir", "92-Vir"],
              ["92-Vir", "ζ-Vir"],
              ["ζ-Vir", "Spica"],
              ["Spica", "96-Vir"],
              ["96-Vir", "κ-Vir"],
              ["Spica", "θ-Vir"],
              ["θ-Vir", "k-Vir"],
              ["k-Vir", "Porrima"],
              ["Porrima", "Zaniah"],
              ["Zaniah", "Zavijava"],
              ["Porrima", "δ-Vir"],
              ["δ-Vir", "ζ-Vir"],
              ["δ-Vir", "Vindemiatrix"]]
    },
    ];
  } catch {
    console.log('starManager.constellations Plugin failed to load!');
  }
})()
