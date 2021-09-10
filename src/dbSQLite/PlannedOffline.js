import db from "./SQLiteDb";

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS PlannedOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,resolutionHourMeterValue INT,remark TEXT,subtask TEXT);"
  );
});

const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO PlannedOffline (idTask, actualResolutionDate, resolutionHourMeterValue, remark,subtask ) values (?, ?, ?, ?, ?);",
        [obj.idTask, obj.actualResolutionDate, obj.resolutionHourMeterValue, obj.remark,obj.subtask],
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
        "SELECT * FROM PlannedOffline;",
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
        "DELETE FROM PlannedOffline WHERE id=?;",
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
  remove,
};
