const mysql = require("mysql");

/**
 * TODO(developer): specify SQL connection details
 */
const connectionName =
  process.env.INSTANCE_CONNECTION_NAME || "libri-238805:asia-east1:libri";
const dbUser = process.env.SQL_USER || "libri-app";
const dbPassword = process.env.SQL_PASSWORD || "Manual@123";
const dbName = process.env.SQL_NAME || "koha_library";

const mysqlConfig = {
  connectionLimit: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  socketPath: ""
};
if (process.env.NODE_ENV === "production") {
  mysqlConfig.socketPath = `/cloudsql/${connectionName}`;
}

// Connection pools reuse connections between invocations,
// and handle dropped or expired connections automatically.
let mysqlPool: any;

exports.mysqlDemo = (req: any, res: any) => {
  // Initialize the pool lazily, in case SQL access isn't needed for this
  // GCF instance. Doing so minimizes the number of active SQL connections,
  // which helps keep your GCF instances under SQL connection limits.
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig);
  }

  mysqlPool.query("SELECT NOW() AS now", (err: any, results: any) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });

  // Close any SQL resources that were declared inside this function.
  // Keep any declared in global scope (e.g. mysqlPool) for later reuse.
};

export const checkAccountAvailable = async (req: any, res: any) => {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig);
  }
  const id = req.body.data.id || "SE/2014/011";
  console.log("Query id", id);
  await mysqlPool.query(
    `SELECT borrowernumber,cardnumber from borrowers where cardnumber like '${id}'`,
    (err: any, results: any) => {
      if (err) {
        console.error(err);
        res.status(500).send({ data: { err } });
      } else {
        res.send({ data: { result: JSON.stringify(results) } });
      }
    }
  );
};
