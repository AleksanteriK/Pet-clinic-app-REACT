
var Pet = require('./petClass');

module.exports = {
    //28.1.2024 AleksanteriK added internal info to the constructors
    pets: [
        new Pet(1, 1, "Buddy", "dog", "alive", "2019-10-07", 'Care carefully'), 
        new Pet(4, 1, "Lisa", "dog", "alive", "2022-04-13", 'allows you to do anything'), 
        new Pet(2, 2, "Elmo", "cat", "deceased", "2008-12-22", 'regular visitor'), 
        new Pet(5, 2, "Lily", "dog", "alive", "2016-05-30", 'Temperative behaviour'), 
        new Pet(6, 2, "Kenny", "cat", "alive", "2018-02-09", 'Domestic cat'), 
        new Pet(3, 3, "Rose", "cat", "alive", "2023-06-01", 'Still have manners to learn')
    ],
    nextId: 7
}