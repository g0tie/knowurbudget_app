import * as DB from './database';

/**
 * Fill the local database with default types
 */
function seedTypes() {

    if (DB.getDatas('types').length > 0) return;

    [
        "Alimentaire",
        "Vehicule",
        "Divertissement",
        "Santé",
        "Vêtements",
        "Sport",
        "Shopping",
        "Impôts",
        "Esthétique / soins",
        "Animaux",
        
    ].forEach(type => DB.insertData("types", {name:type}));
}

function seedColors() {
    return [
        '#2cf6b3',
        '#2e3532',
        '#ffbc42',
        '#715BFD',
        '#ff90b3',
        '#25ced1',
        '#8d918b',  
        '#8f2d56',
        '#3c4f76',
        '#320e3b'
    ]
}

async function createDefaultUser() {
    
    try {
        
        const username = "default";
        const limit = 500;
        const id  = 0;

        if ( !DB.getData(id, "users") ) {
            DB.insertData("users", {id:id, username: username});
            DB.insertData("limit", {amount: limit, user_id: id});
            DB.setCurrentUser(id);
            window.localStorage.removeItem("logged");
        }

    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}

export {
    seedTypes,
    createDefaultUser,
    seedColors
}