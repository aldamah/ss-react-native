import db from "./SQLiteDb";

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS AddNoDueDateOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,eventDate DATE,equipmentId TEXT);"
  );
});

const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO AddNoDueDateOffline (name  ,description ,eventDate ,equipmentId ) values (?, ?, ?, ?);",
        [obj.name, obj.description, obj.eventDate, obj.equipmentId ],
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
        "SELECT * FROM AddNoDueDateOffline;",
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
        "DELETE FROM AddNoDueDateOffline WHERE id=?;",
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
