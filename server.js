const express = require('express'); //1
const app = express(); //2
const { syncAndSeed, Person, Place, Thing, Souvenir } = require('./db');

app.use('/assets', express.static('assets'));

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
                        <ul>
                            ${ souvenirs.map( souvenir => {
                                return `<li>${ souvenir.person.name } purchased a
                                ${ souvenir.thing.name } in ${ souvenir.place.name } </li>`
                            }).join('')
                        }
                        </ul>
                    </div>
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