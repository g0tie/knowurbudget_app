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
        "Courses"
    ].forEach(type => DB.insertData("types", {name:type}));
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
    createDefaultUser
}