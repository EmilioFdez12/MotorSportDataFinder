const { F1_TEAM_MAP, F1_DRIVER_INFO } = require('./f1StandingsConfig');
const { MOTOGP_TEAM_MAP, MOTOGP_DRIVER_INFO } = require('./motogpStandingsConfig');
const { INDYCAR_TEAM_MAP, INDYCAR_DRIVER_INFO } = require('./indycarStandingsConfig');

module.exports = {
    f1: {
        url: 'https://www.motorsport.com/f1/standings/',
        teamMap: F1_TEAM_MAP,
        driverInfo: F1_DRIVER_INFO
    },
    motogp: {
        url: 'https://www.motorsport.com/motogp/standings/',
        teamMap: MOTOGP_TEAM_MAP,
        driverInfo: MOTOGP_DRIVER_INFO
    },
    indycar: {
        url: 'https://www.motorsport.com/indycar/standings/',
        teamMap: INDYCAR_TEAM_MAP,
        driverInfo: INDYCAR_DRIVER_INFO
    }
};