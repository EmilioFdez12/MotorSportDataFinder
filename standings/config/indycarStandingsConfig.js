const INDYCAR_TEAM_MAP = {
    "Team Penske": { 
        id: 1, 
        name: "Team Penske",
        car: "/indycar/images/cars/team-penske.webp",
        logo: "/indycar/images/logos/penske.webp"
    },
    "A.J. Foyt Enterprises": { 
        id: 2, 
        name: "A.J. Foyt Enterprises",
        car: "/indycar/images/cars/aj-foyt.webp",
        logo: "/indycar/images/logos/foyt.webp"
    },
    "Arrow McLaren": { 
        id: 3, 
        name: "Arrow McLaren",
        car: "/indycar/images/cars/mclaren.webp",
        logo: "/indycar/images/logos/mclaren.webp"
    },
    "Meyer Shank Racing": { 
        id: 4, 
        name: "Meyer Shank Racing",
        car: "/indycar/images/cars/meyer-shank.webp",
        logo: "/indycar/images/logos/shank.webp"
    },
    "Chip Ganassi Racing": { 
        id: 5, 
        name: "Chip Ganassi Racing",
        car: "/indycar/images/cars/ganassi.webp",
        logo: "/indycar/images/logos/ganassi.webp"
    },
    "Rahal Letterman Lanigan Racing": { 
        id: 6, 
        name: "Rahal Letterman Lanigan Racing",
        car: "/indycar/images/cars/rahal.webp",
        logo: "/indycar/images/logos/rahal.webp"
    },
    "Dale Coyne Racing": { 
        id: 7, 
        name: "Dale Coyne Racing",
        car: "/indycar/images/cars/coyne.webp",
        logo: "/indycar/images/logos/coyne.webp"
    },
    "Ed Carpenter Racing": { 
        id: 8, 
        name: "Ed Carpenter Racing",
        car: "/indycar/images/cars/carpenter.webp",
        logo: "/indycar/images/logos/carpenter.webp"
    },
    "Dreyer & Reinbold Racing": { 
        id: 9, 
        name: "Dreyer & Reinbold Racing",
        car: "/indycar/images/cars/dreyer-reinbold.webp",
        logo: "/indycar/images/logos/dreyer.webp"
    },
    "Andretti Global": { 
        id: 10, 
        name: "Andretti Autosport",
        car: "/indycar/images/cars/andretti.webp",
        logo: "/indycar/images/logos/andretti.webp"
    },
    "Juncos Hollinger Racing": { 
        id: 11, 
        name: "Juncos Hollinger Racing",
        car: "/indycar/images/cars/juncos.webp",
        logo: "/indycar/images/logos/juncos.webp"
    },
    "Prema Racing": { 
        id: 12, 
        name: "Prema Powerteam",
        car: "/indycar/images/cars/prema.webp",
        logo: "/indycar/images/logos/prema.webp"
    }
};

const INDYCAR_DRIVER_INFO = {
    "J. Newgarden": { name: "Josef Newgarden", number: 2, portrait: "/indycar/images/drivers/JOSNEW01.webp" },
    "S. McLaughlin": { name: "Scott McLaughlin", number: 3, portrait: "/indycar/images/drivers/SCOMCL01.webp" },
    "D. Malukas": { name: "David Malukas", number: 4, portrait: "/indycar/images/drivers/DAVMAL01.webp" },
    "P. O'Ward": { name: "Patricio O'Ward", number: 5, portrait: "/indycar/images/drivers/PATOWA01.webp" },
    "H. Castroneves": { name: "Helio Castroneves", number: 6, portrait: "/indycar/images/drivers/HELCAS01.webp" },
    "N. Siegel": { name: "Nolan Siegel", number: 6, portrait: "/indycar/images/drivers/NOLSIE01.webp" },
    "C. Lundgaard": { name: "Christian Lundgaard", number: 7, portrait: "/indycar/images/drivers/CHRLUN01.webp" },
    "K. Simpson": { name: "Kyffin Simpson", number: 8, portrait: "/indycar/images/drivers/KYFSIM01.webp" },
    "S. Dixon": { name: "Scott Dixon", number: 9, portrait: "/indycar/images/drivers/SCODIX01.webp" },
    "A. Palou": { name: "Alex Palou", number: 10, portrait: "/indycar/images/drivers/ALEPAL01.webp" },
    "W. Power": { name: "Will Power", number: 12, portrait: "/indycar/images/drivers/WILPOW01.webp" },
    "S. Ferrucci": { name: "Santino Ferrucci", number: 14, portrait: "/indycar/images/drivers/SANFER01.webp" },
    "G. Rahal": { name: "Graham Rahal", number: 15, portrait: "/indycar/images/drivers/GRARAH01.webp" },
    "K. Larson": { name: "Kyle Larson", number: 17, portrait: "/indycar/images/drivers/KYLLAR01.webp" },
    "R. VeeKay": { name: "Rinus VeeKay", number: 18, portrait: "/indycar/images/drivers/RINVEE01.webp" },
    "A. Rossi": { name: "Alexander Rossi", number: 20, portrait: "/indycar/images/drivers/ALEROS01.webp" },
    "R. Hunter-Reay": { name: "Ryan Hunter-Reay", number: 23, portrait: "/indycar/images/drivers/RYAHUN01.webp" },
    "J. Harvey": { name: "Jack Harvey", number: 24, portrait: "/indycar/images/drivers/JACHAR01.webp" },
    "C. Herta": { name: "Colton Herta", number: 26, portrait: "/indycar/images/drivers/COLHER01.webp" },
    "K. Kirkwood": { name: "Kyle Kirkwood", number: 27, portrait: "/indycar/images/drivers/KYLKIR01.webp" },
    "M. Ericsson": { name: "Marcus Ericsson", number: 28, portrait: "/indycar/images/drivers/MARERI01.webp" },
    "D. DeFrancesco": { name: "Devlin DeFrancesco", number: 30, portrait: "/indycar/images/drivers/DEVDEF01.webp" },
    "E. Carpenter": { name: "Ed Carpenter", number: 33, portrait: "/indycar/images/drivers/EDCAR01.webp" },
    "L. Foster": { name: "Louis Foster", number: 45, portrait: "/indycar/images/drivers/LOUFOS01.webp" },
    "J. Abel": { name: "Jacob Abel", number: 51, portrait: "/indycar/images/drivers/JACABE01.webp" },
    "F. Rosenqvist": { name: "Felix Rosenqvist", number: 60, portrait: "/indycar/images/drivers/FELROS01.webp" },
    "M. Armstrong": { name: "Marcus Armstrong", number: 66, portrait: "/indycar/images/drivers/MARARM01.webp" },
    "S. Robb": { name: "Sting Ray Robb", number: 77, portrait: "/indycar/images/drivers/STIROB01.webp" },
    "C. Daly": { name: "Conor Daly", number: 78, portrait: "/indycar/images/drivers/CONDAL01.webp" },
    "R. Shwartzman": { name: "Robert Shwartzman", number: 83, portrait: "/indycar/images/drivers/ROBSHW01.webp" },
    "C. Ilott": { name: "Callum Ilott", number: 90, portrait: "/indycar/images/drivers/CALILO01.webp" },
    "M. Andretti": { name: "Marco Andretti", number: 98, portrait: "/indycar/images/drivers/MARAND01.webp" },
    "C. Rasmussen": { name: "Christian Rasmussen", number: 21, portrait: "/indycar/images/drivers/CHRRAS01.webp" },
    "R. van Kalmthout": { name: "Rinus Veekay", number: 18, portrait: "/indycar/images/drivers/RINVEE01.webp" },
    "R. Robb Sting": { name: "Sting Ray Robb", number: 77, portrait: "/indycar/images/drivers/STIROB01.webp" },
};

module.exports = {
    INDYCAR_TEAM_MAP,
    INDYCAR_DRIVER_INFO
};