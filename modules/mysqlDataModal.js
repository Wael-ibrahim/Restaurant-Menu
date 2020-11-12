const mySql = require('mysql')

let con = null
function connect() {
    return new Promise((resolve, reject) => {
        if (con) {
            if (con.state === 'disconnected') {
                con.connect(error => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                })
            } else {
                resolve()
            }
        } else {
            con = mySql.createConnection({
                multipleStatements: true,
                host: 'localhost',
                port: 3306,
                user: 'codings2_highclass',
                password: '!234qweR',
                database: 'codings2_highclass'
            })
            con.connect(error => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        }
    })
}

function runQuery(queryString) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            con.query(queryString, (error, result, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function dataSender(table_number, fname, lname, email, telephone, address, city, zip) {
    return new Promise((resolve, reject) => {
        runQuery(`INSERT INTO users (table_number, fname, lname, email, telephone, address, city, zip, date) VALUES 
        ('${table_number}', '${fname}', '${lname}', '${email}', '${telephone}', '${address}', '${city}', '${zip}', now())`).then(() => {
            resolve()
        }).catch(error => {    
            if (error.errno === 1062) {
                reject('exist')
            } else {
                reject(error)
            }
            
        })
    })
}

function checkUser(user_name, password) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM admin where user_name like '${user_name}'`).then((result) => {
            if(result.length === 0) {
                reject(4)
            } else {
                if(password === result[0].password) {
                    resolve(result[0])
                } else {
                    reject(3)
                }
            }
            
        }).catch(error => {    
            reject(error)    
        })
    })
}

function getData() {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM users`).then((result) => {
            resolve(result)
        }).catch(error => {    
            if (error.errno === 1062) {
                reject(4)
            } else {
                reject(2)
            }
            
        })
    })
}

module.exports = {  
    dataSender,
    checkUser,
    getData
}