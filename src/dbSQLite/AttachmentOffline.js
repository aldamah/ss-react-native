import db from "./SQLiteDb";

const createTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS attachment (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, idTask TEXT, filename TEXT);"
        );
    });
}


const create = (uri, idTask, filename) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO attachment (uri, idTask, filename) values (?,?,?);",
                [uri, idTask, filename],
                (_, { rowsAffected, insertId }) => {
                    if (rowsAffected > 0) resolve(insertId);
                    else reject("Error inserting attachment: " + JSON.stringify(obj));
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
                "SELECT * FROM attachment;",
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
          "SELECT * FROM attachment WHERE id=?;",
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

  const findByTaskId = (taskId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM attachment WHERE idTask=?;",
          [taskId],
          //-----------------------
          (_, { rows }) => {
            console.log('mqkjdfmq', rows._array)
            resolve(rows._array)
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
                "DROP TABLE IF EXISTS attachment;",
                [],
                (_, { rowsAffected }) => {
                    resolve(rowsAffected);
                },
                (_, error) => reject(error)
            );
        });
    });
};

const remove = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM attachment WHERE id=?;",
          [id],
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
    findByTaskId,
    removeAll,
    remove
};
