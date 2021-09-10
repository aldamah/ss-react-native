import db from "./SQLiteDb";

const createTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS language (id INTEGER PRIMARY KEY AUTOINCREMENT,lang TEXT);"
        );
    });
}


const create = (lang) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO language (lang) values (?);",
                [lang],
                (_, { rowsAffected, insertId }) => {
                    if (rowsAffected > 0) resolve(insertId);
                    else reject("Error inserting lang: " + JSON.stringify(obj));
                },
                (_, error) => reject(error)
            );
        });
    });
};



const all = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM language;",
                [],
                (_, { rows }) => resolve(rows._array),
                (_, error) => reject(error)
            );
        });
    });
};

const find = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM language WHERE id=?;",
          [id],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows._array[0]);
            else reject("Obj not found: id=" + id); 
          },
          (_, error) => reject(error)
        );
      });
    });
  };

const removeAll = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DROP TABLE IF EXISTS language;",
                [],
                (_, { rowsAffected }) => {
                    resolve(rowsAffected);
                },
                (_, error) => reject(error)
            );
        });
    });
};




export default {
    createTable,
    create,
    all,
    find,
    removeAll
};
