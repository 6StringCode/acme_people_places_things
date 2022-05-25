const Sequelize = require('sequelize');
const { STRING, INTEGER } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things');

const Person = conn.define('person', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validation: {
            notEmpty: true
        }
    }
});

const Place = conn.define('place', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validation: {
            notEmpty: true
        }
    }
});

const Thing = conn.define('thing', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validation: {
            notEmpty: true
        }
    }
});

const Souvenir = conn.define('souvenir', {
    //the below isn't nec because of the belongs to
    // personId: {
    //     type: INTEGER,
    //     allowNull: false
    // },
    // placeId: {
    //     type: INTEGER,
    //     allowNull: false
    // },
    // thingId: {
    //     type: INTEGER,
    //     allowNull: false
    // }
});
Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

const syncAndSeed = async() => {
    await conn.sync ({ force: true });
    const [ moe, larry, lucy, ethyl, 
            paris, nyc, chicago, london,
            hat, bag, shirt, cup ] = await Promise.all([
        Person.create({ name: 'moe' }),
        Person.create({ name: 'larry' }),
        Person.create({ name: 'lucy' }),
        Person.create({ name: 'ethyl' }),
        Place.create({ name: 'paris' }),
        Place.create({ name: 'nyc' }),
        Place.create({ name: 'chicago' }),
        Place.create({ name: 'london' }),
        Thing.create({ name: 'hat' }),
        Thing.create({ name: 'bag' }),
        Thing.create({ name: 'shirt' }),
        Thing.create({ name: 'cup' }),
    ]);
    //console.log(chicago.get());

    await Promise.all([
        Souvenir.create({ 
            personId: moe.id, 
            placeId: london.id,
            thingId: hat.id,
        }),
        Souvenir.create({ 
            personId: ethyl.id, 
            placeId: nyc.id,
            thingId: shirt.id,
        }),
        Souvenir.create({ 
            personId: moe.id, 
            placeId: paris.id,
            thingId: bag.id,
        }),
    ]);
};


module.exports = { 
    syncAndSeed,
    Person,
    Place, 
    Thing,
    Souvenir
 };