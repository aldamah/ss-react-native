import db from "./SQLiteDb";

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS EditNoDueDateOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,name TEXT,description TEXT,eventDate DATE);"
  );
});

const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO EditNoDueDateOffline (idTask, name  ,description ,eventDate  ) values (?, ?, ?, ?);",
        [obj.idTask, obj.name, obj.description, obj.eventDate ],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj));
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
        "SELECT * FROM EditNoDueDateOffline;",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM EditNoDueDateOffline WHERE id=?;",
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
  create,
  all,
  remove
};
