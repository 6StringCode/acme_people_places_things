const express = require('express'); //1
const app = express(); //2
const { syncAndSeed, Person, Place, Thing, Souvenir } = require('./db');

app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

app.delete('/:id', async(req, res, next)=>{
    try{
        const souvenir = await Souvenir.findByPk(req.params.id);
        await souvenir.destroy();
        res.redirect('/');
    }
    catch(ex){
        next(ex);
    }
});

app.post('/souvenirs', async(req, res, next)=> {
    try{
        await Souvenir.create(req.body);
        res.redirect('/');
    }
    catch(ex){
        next(ex);
    }
});

app.get('/', async(req, res, next)=> {
    try {
        const [ people, places, things, souvenirs] = 
        await Promise.all([
            Person.findAll(),
            Place.findAll(),
            Thing.findAll(),
            Souvenir.findAll(
                {
                    include: [Person, Place, Thing]
                }
            )
        ]);
        res.send(
            `<html>
                <header>
                    <title>Acme People, Places and Things</title>
                    <link rel='stylesheet' href='/assets/styles.css'/>
                </header>
                <body>
                    <h1>Acme People, Places and Things</h1>
                    <main>
                    <div>
                        <h2>People</h2>
                        <ul>
                            ${ people.map( person => {
                                return `<li> ${ person.name } </li>`
                                }).join('')
                            }
                        </ul>
                    </div>
                    <div>
                        <h2>Places</h2>
                        <ul>
                            ${ places.map( place => {
                            return `<li> ${ place.name } </li>`
                            }).join('')
                        }
                        </ul>
                    </div>
                    <div>
                        <h2>Things</h2>
                        <ul>
                            ${ things.map( thing => {
                                return `<li> ${ thing.name } </li>`
                            }).join('')
                        }
                        </ul>
                    </div>
                    <div>
                        <h2>Souvenir Purchases</h2>
                        <p>Create a new Souvenir Purchase by selecting a Person, 
                        the Place they purchased the souvenir, and the Thing they bought.</p>
                        <form method='POST' action='/souvenirs'>
                            <label>Person</label> 
                            <select name='personId'>
                            ${
                                people.map( person => {
                                return `
                                    <option value=${person.id}>
                                    ${ person.name }
                                    </option>
                                `;
                                }).join('')
                            }
                            </select>
                            <label>Person</label> 
                            <select name='placeId'>
                            ${
                                places.map( place => {
                                return `
                                    <option value=${place.id}>
                                    ${ place.name }
                                    </option>
                                `;
                                }).join('')
                            }
                            </select>
                            <label>Person</label> 
                            <select name='thingId'>
                            ${
                                things.map( thing => {
                                return `
                                    <option value=${thing.id}>
                                    ${ thing.name }
                                    </option>
                                `;
                                }).join('')
                            }
                            </select>
                            <button>Create</button>
                        </form>
                        <ul>
                            ${ souvenirs.map( souvenir => {
                                return `<li>${ souvenir.person.name } purchased a
                                ${ souvenir.thing.name } in ${ souvenir.place.name } 
                                <form method='POST' action='/${souvenir.id}?_method=DELETE'>
                                <button>
                                Delete 
                                </button>
                                </form>
                                </li>`
                            }).join('')}
                        </ul>
                    </div>
                    </main>
                </body>
            </html>`
        )
    }
    catch(ex){
        next(ex);
    }
});


const init = async() => {
    try {
        await syncAndSeed();
        console.log('DB Setup');
        const port = process.env.PORT || 3000; //3
        app.listen(port, ()=> console.log(`listening on port ${port}`));

    }
    catch(ex) {
        console.log(ex)
    }
}

init ();