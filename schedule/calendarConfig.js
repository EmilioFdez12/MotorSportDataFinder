// config.js
module.exports = {
    f1: {
        url: 'https://es.motorsport.com/f1/schedule/2025/',
        sessionMap: {
            'fp1': 'practice1',
            'libres 1': 'practice1',
            'practice 1': 'practice1',
            'fp2': 'practice2',
            'libres 2': 'practice2',
            'practice 2': 'practice2',
            'fp3': 'practice3',
            'libres 3': 'practice3',
            'practice 3': 'practice3',
            'clasificación sprint': 'sprintQualifying',
            'sprint shootout': 'sprintQualifying',
            'qualy sprint': 'sprintQualifying',
            'sprint': 'sprint',
            'clasificación': 'qualifying',
            'qualifying': 'qualifying',
            'carrera': 'race',
            'race': 'race'
        }
    },
    motogp: {
        url: 'https://es.motorsport.com/motogp/schedule/2025/',
        sessionMap: {
            'fp1': 'practice1',
            'práctica': "practice2",
            'fp2': 'practice3',
            'q1': 'qualifying',
            'sprint': 'sprint',
            'carrera': 'race',
            'race': 'race'
        }
    },
    indycar: {
        url:'https://es.motorsport.com/indycar/schedule/2025/',
        sessionMap: {
            'practice 1': 'practice1',
            'práctica 1': 'practice1',
            'libres 1': 'practice1',
            'fp1': 'practice1',
            'practice 2': 'practice2',
            'práctica 2': 'practice2',
            'libres 2': 'practice2',
            'fp2': 'practice2',
            'practice 3': 'practice3',
            'práctica 3': 'practice3',
            'libres 3': 'practice3',
            'fp3': 'practice3',
            'qualy': 'qualifying',
            'qualifications': 'qualifying',
            'clasificación': 'qualifying',
            'carrera': 'race',
            'race': 'race'
        }
    }
};