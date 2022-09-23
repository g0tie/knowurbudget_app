import  alasql from 'alasql';

function getCurrentUser()
{
    return parseInt( window.localStorage.getItem('currentUser') );
}

function setCurrentUser(value)
{
    window.localStorage.setItem('currentUser', value);
}

const createDatabase = () =>
{
    alasql(`
    CREATE LOCALSTORAGE DATABASE IF NOT EXISTS db;
    ATTACH LOCALSTORAGE DATABASE db;
    USE db;
    `);
}

/**
 * Create local db tables
 * @async
 */
const  createTables = async () =>
{
    try {

        await alasql(`CREATE TABLE IF NOT EXISTS Users(id INT PRIMARY KEY, username STRING, UNIQUE(id));`)
        
        await alasql(`CREATE TABLE IF NOT EXISTS Types(id INT AUTOINCREMENT PRIMARY KEY, name STRING, user_id INT REFERENCES Users(id));`);
        
        await alasql(`CREATE TABLE IF NOT EXISTS Expenses(id INT AUTOINCREMENT PRIMARY KEY, name STRING, amount INT, date DATETIME, typeid INT REFERENCES Types(id), user_id INT REFERENCES Users(id));`)
        
        await alasql(`CREATE TABLE IF NOT EXISTS Limit(id INT AUTOINCREMENT PRIMARY KEY, amount INT, date DATETIME, user_id INT REFERENCES Users(id) );`)
        
    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}
/**
 * Delete user in local database
 * @async
 * @param {Number} userId 
 */
const deleteUserData = async (userId) => {
    try {
        await alasql(`DELETE FROM Users WHERE id = ?`, [userId]) ;
        
        await alasql(`DELETE FROM Expenses WHERE user_id = ?`, [userId]);
        await alasql(`DELETE FROM Limit WHERE user_id = ?`, [userId]);

    } catch (e) {
        console.error(`Error occured: ${e}`)
    }
}

/**
 * Replace old user data by new data to local database
 * @async
 * @param {Object} data 
 * @param {number} userId 
 */
const persistData = async (data, userId) => {
    try {
        await deleteUserData(userId);
        await alasql(`INSERT INTO Users VALUES ?`, [{ username:data.user.name, id:userId }]);
        
        await data.expenses.map(expense => {
            alasql(`INSERT INTO Expenses VALUES ?`, [expense]);
        });

        await alasql(`INSERT INTO Limit VALUES ?`, [{amount: data.limit.value, user_id: userId }]);
        await  window.localStorage.setItem("logged", true);

    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}

/**
 * insert Data to local database
 * @async
 * @param {String} table 
 * @param {any} payload 
 */
const insertData = async (table,payload) =>
{
    try {
        switch (table) {
            case "expenses":
                alasql(`INSERT INTO Expenses VALUES ?`, [payload]);
            break;

            case "types":
                alasql(`INSERT INTO Types VALUES ?`, [payload]);
            break;

            case "limit":
                alasql(`INSERT INTO Limit VALUES ?`, [payload]);
            break;
            
            case "users":
                alasql(`INSERT INTO Users VALUES ?`, [payload]);
            break;
        }
    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}

/**
 * Get first datas from a specific table in local db
 * @param {Number} id 
 * @param {String} table 
 * @returns {any} can return an Array, String, Number
 */
const getData = (id, table) =>
{
    switch (table) {
        case "expenses":
           return alasql(`SELECT * FROM Expenses WHERE user_id = ?`, [id]);

        case "types":
           return alasql(`SELECT * FROM Types WHERE id = ?`, [id])[0];

        case "limit":
           return alasql(`SELECT * FROM Limit WHERE user_id = ?`, [id])[0];
           
        case "users":
            return alasql(`SELECT * FROM Users WHERE id = ?`, [id])[0];
            
        default:
            return
    }

}

/**
 * Get all user expenses by given type
 * @param {Number} typeId 
 * @param {Nulber} userId 
 * @returns {Array}
 */
const getExpensesByType = (typeId, userId) => {
    if (isNaN(typeId)) return getDatas("expenses", userId);
    return alasql(`SELECT * FROM Expenses WHERE typeid = ? AND user_id = ?`, [typeId, userId])
    .map(expense => ({...expense, typeid:typeId})  );
}

/**
 * Get the list of all elements for a given user in local db
 * @param {String} table 
 * @param {Number} userId 
 * @returns {Array}
 */
const getDatas = (table, userId = 0) => {
    switch (table) {
        case "expenses":
           return alasql(`SELECT * FROM Expenses WHERE user_id = ?`, [userId]);

        case "types":
           return alasql(`SELECT * FROM Types`);

        case "limit":
           return alasql(`SELECT * FROM Limit WHERE user_id = ?`, [userId]);
    }
}

const getByDate = (table, start, end, userId) => {
    return (alasql(`SELECT * from Expenses WHERE date BETWEEN ? AND ? AND user_id = ?`, [start, end, userId]));
}

/**
 * Change a specific data in local db
 * @param {Number} id 
 * @param {String} table 
 * @param {any} payload 
 */
const updateData = (id, table, payload) =>
{
    switch (table) {
        case "expenses":
            alasql(`UPDATE FROM Expenses SET ? WHERE user_id = ?`, [payload, id]);
        break;

        case "types":
            alasql(`UPDATE FROM Types SET ? WHERE user_id = ?`, [payload, id]);
        break;

        case "limit":
            alasql(`UPDATE Limit SET amount = ? WHERE user_id = ?`, [payload, id]);
        break;
    }

}

/**
 * Delete user related data from given table
 * @param {Number} id 
 * @param {String} table 
 * @param {Number} userId 
 */
const deleteData = (id, table, userId) =>
{
    switch (table) {
        case "expenses":
            alasql(`DELETE FROM Expenses WHERE id = ? AND user_id = ? `, [id, userId]);
        break;

        case "types":
            alasql(`DELETE FROM Types WHERE id = ? `, [id]);
        break;

        case "limit":
            alasql(`DELETE FROM Limit WHERE id = ? AND user_id = ? `, [id, userId]);
        break;
    }

}

export {
    createDatabase,
    createTables,
    insertData,
    getData,
    getDatas,
    updateData,
    deleteData,
    getExpensesByType,
    getByDate,
    persistData,
    getCurrentUser,
    setCurrentUser,
    deleteUserData
}