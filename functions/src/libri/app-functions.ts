const mysql = require("mysql");

/**
 * TODO(developer): specify SQL connection details
 */
const connectionName =
  process.env.INSTANCE_CONNECTION_NAME || "libri-238805:asia-east1:libri";
const dbUser = process.env.SQL_USER || "libri-app";
const dbPassword = process.env.SQL_PASSWORD || "Manual@123";
const dbName = process.env.SQL_NAME || "koha";

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

/**
 * Checking whether user is available in the library database.
 * If user is not registered or an active user of the libaray he/she may not be able to do some functionalities
 * @param req
 * @param res
 */
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

/**
 *Retreve book records from the mysql database according to the user entered value
 * @param req
 * @param res
 */
export const getBooks = async (req: any, res: any) => {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig);
  }
  const value = req.body.data.value || "";
  const column = req.body.data.column || "title";
  await mysqlPool.query(
    `SELECT biblio.biblionumber,biblio.title,biblio.author,biblio.abstract,biblio.copyrightdate,biblioitems.biblioitemnumber,biblioitems.isbn,biblioitems.url FROM biblio,biblioitems where biblio.biblionumber = biblioitems.biblionumber AND biblio.${column} like '%${value}%' LIMIT 20`,
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

export const getPersonalBorrowings = async (req: any, res: any) => {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig);
  }
  const id = req.body.data.id || "";
  await mysqlPool.query(
    `select issue_id,itemnumber,date_due,returndate,issuedate from issues where borrowernumber == ${id}`,
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

export const processPenaltyPayment = async (req: any, res: any) => {
  console.log("processing payment");
  console.log("req", req);
  res.send({ data: { msg: "successfully saved" } });
};

export const isBookTransferable = async (req: any, res: any) => {
  console.log("processing payment");
  console.log("req", req);
  res.send({ data: { msg: "successfully saved" } });
};
