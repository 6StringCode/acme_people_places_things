const { syncAndSeed } = require('./db');

const init = async() => {
    try {
        await syncAndSeed();
        console.log('DB Setup');

    }
    catch(ex) {
        console.log(ex)
    }
}

init ();