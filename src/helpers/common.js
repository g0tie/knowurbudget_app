import {getByDate, getData, getExpensesByType, getDatas, getCurrentUser} from  "../store/database";

function calculatePercentage(value, max) {
    if (max < value) return 100;
    return (value / max) * 100;
}

function getTypeName(id) {
    return getData(parseInt(id), 'types')?.name;
}

function calculateTotalExpenses(expenses)
{   
    if (!expenses) return 0;
    return expenses.reduce((prev, curr) => prev + parseInt(curr.amount), 0);
}

function getDatetime() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Format data to the correct form for ChartJs
 * @param {Array} expenses 
 * @param {Array} types 
 * @returns {Array}
 */
function sortExpensesByMonths(expenses, types) {
    let datasets = [];
    let colors =   [
        '#2cf6b3',
        '#f0f757',
        '#ffbc42',
        '#715BFD',
        '#ff90b3',
        '#25ced1',
        '#8d918b',  
        '#8f2d56'
      ];

    types.forEach((type, key) => {

        datasets[key] = {
            id: key,
            label:type.name,
            data: totalExpensesByMonth(expenses.filter(expense => getTypeName(expense.typeid) === type.name)),
            backgroundColor: colors[key]
        }
      
    });
    return datasets;
}

/**
 * Get the total sum by month of the year from user expenses
 * @param {Array} expenses 
 * @returns {Array} sum of the expennses sorted by months
 */
function totalExpensesByMonth(expenses) {
    let result = [];
    
    for (let i = 0; i < 12; i++) {
        let month = i < 9 ? `0${i + 1}` : i + 1;
        let monthString = new Date().getFullYear() + '-' + month;
        
        result.push(expenses.map(expense => {
            if (expense.date.includes(monthString)) {
                return expense.amount
            } else {
                return 0;
            }
        })
        .reduce((prev, curr) => prev + parseInt(curr), 0)
        )
        
    }

    return result;
}
/**
 * Sort user expenses by week
 * @param {Array} types 
 * @returns {Array}
 */
function sortExpensesByWeek(types)
{
    let weekStart = new Date().getDate() - new Date().getDay() +1
    let weekEnd = weekStart + 6; 
    let month = new Date().getMonth() +1
    month = month < 10 ? `-0${month}` : month;


    let weekStringStart = new Date().getFullYear() + `-${month}-${weekStart}`;
    let weekStringEnd =  new Date().getFullYear() + `-${month}-${weekEnd}`;

    
    return getTotalExpensesByType(
        getByDate('expenses', weekStringStart, weekStringEnd, getCurrentUser()),
        types
    );
}

/**
 * Calculate the sum of all user expenses sorted by type
 * @param {Array} expenses list of user expenses
 * @param {Array} types list of expenses possible types
 * @returns {Array} of the sum by types
 */
function getTotalExpensesByType(expenses, types)
{
    let results = [];

    types.forEach(type => {

        results.push(
            expenses.map(expense => {
                if (getTypeName(expense.typeid) === type.name)  {
                    return expense.amount
                } else {
                    return 0;
                }
            })
            .reduce((prev, curr) => prev + parseInt(curr), 0)
        );

    });

    return results;
}

/**
 * Get default user data from local database and return a new formated state context
 * @async
 * @param { Object } state current state
 * @returns { Object }
 */
async function getDefaultUserData(state)
{
    const user =  await getData(getCurrentUser(), "users");
    const limit = await  await getData(getCurrentUser(), "limit");
    const expenses = await getDatas("expenses", getCurrentUser());
    const totalExpenses = await calculateTotalExpenses(expenses);

    let newState = await {
      ...state, 
      limit: { value: limit.amount },
      expenses,
      totalExpenses,
      user : {name:user.username},
      logged: false
    } ;

    return newState;
}

export {
    calculatePercentage,
    getTypeName,
    calculateTotalExpenses,
    getDatetime,
    sortExpensesByWeek,
    sortExpensesByMonths,
    getDefaultUserData
}