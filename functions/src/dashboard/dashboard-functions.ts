import * as admin from "firebase-admin";

/**
 * This method includes registration of penalty payments under users and updating the book receive status
 * @param req Information about the user and the book issue
 * @param res Success information
 */
export const enableOrDisableUser = async (req: any, res: any) => {
  const uid = req.body.data.uid || "";
  const state = req.body.data.state || "";
  const disabled = state === "activate" ? false : true;
  return admin
    .auth()
    .updateUser(uid, { disabled })

    .then(data => {
      console.log("Success with changing state", data);
      res.status(200).send({ data: {} });
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).send(err);
    });
};
