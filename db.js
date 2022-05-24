const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things');

const Person = conn.define('person', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

const Place = conn.define('place', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

const Thing = conn.define('thing', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});


const syncAndSeed = async() => {
    await conn.sync ({ force: true });
};

module.exports = { syncAndSeed };