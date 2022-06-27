"use strict";
const uid = require("uid2");
const LENGTH = 16;

module.exports = function (RegistrationSchedule) {
  _disableRemoteMethod(RegistrationSchedule);

  var __app;

  RegistrationSchedule.on("attached", function (a) {
    __app = a;
  });

  RegistrationSchedule.register = async function (data) {
    console.log(data);
    // if (typeof (data.name) === 'undefined') {
    //     return Promise.reject({ statusCode: 400, message: 'Missing name.' })
    // }
    // if (typeof (data.devid) === 'undefined') {
    //     return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
    // }

    try {
      // Check
      let session_semester = data.data.session + data.data.semester;
      console.log(session_semester, new Date());
      let Registration = await RegistrationSchedule.findOne({
        where: { id_RegistrationSchedule: session_semester },
      });
      if (Registration !== null) {
        return Promise.reject({
          statusCode: 400,
          message: "Registration schedule for session " +data.data.session +" semester " +data.data.semester +" is already registered.",
        });
      }
      // avoid register schedule date redundant with other registration schedule
      let time = await RegistrationSchedule.find({
        where: {
          or: [{and: [{
                  startDateTime: { lte: data.data.startDate },
                  endDateTime: { gte: data.data.startDate },
                },],},{and: [{
                  startDateTime: { lte: data.data.endDate },
                  endDateTime: { gte: data.data.endDate },
                },],}, {and: [ {
                  startDateTime: { gte: new Date() } // if there is more than one registration after current date
                },],},],
        },
      });
      console.log(time)
      if (time.length !== 0) {
        let string = "";
        time.map((dataList, index) => {
          string = string + dataList.id_RegistrationSchedule + " ";
        });
        return Promise.reject({
          statusCode: 400,
          message:
            "Unable to register due to redundant date with other registration schedule " +
            string,
        });
      }

      let _data = {
        startDateTime: data.data.startDate,
        endDateTime: data.data.endDate,
        session: data.data.session,
        semester: data.data.semester,
        nameCreatedBy: data.user.name,
        id_RegistrationSchedule: session_semester,
      };
      let _res = await RegistrationSchedule.create(_data);

      return Promise.resolve(_res);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  RegistrationSchedule.remoteMethod("register", {
    description: "Register RegistrationSchedule",
    isStatic: true,
    accepts: [{ arg: "data", type: "object", http: { source: "body" } }],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register", verb: "post" },
  });

  RegistrationSchedule.updateInfo = async function (id, data) {
    // console.log(data)
    // if (typeof (id) === 'undefined') {
    //     return Promise.reject({ statusCode: 400, message: 'Missing id.' })
    // }
    // if (typeof (data.name) === 'undefined') {
    //     return Promise.reject({ statusCode: 400, message: 'Missing name.' })
    // }
    // if (typeof (data.devid) === 'undefined') {
    //     return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
    // }

    try {
      // Check
      // let __sensor = await RegistrationSchedule.findOne({ where: { device_id: data.devid } })
      // if (__sensor !== null) {
      //     if (__sensor.id !== id) {
      //         return Promise.reject({ statusCode: 400, message: 'RegistrationSchedule already register!.' })
      //     }
      // }

      let _res = await RegistrationSchedule.updateAll({ id: id }, data);

      return Promise.resolve(_res);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  RegistrationSchedule.remoteMethod("updateInfo", {
    description: "Update Info",
    isStatic: true,
    accepts: [
      { arg: "id", type: "string", required: true },
      { arg: "data", type: "object", http: { source: "body" } },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/update/info/:id", verb: "post" },
  });

  //----- UPDATE -----

  RegistrationSchedule.updateRegistrationSchedule = async function (id, body) {
    console.log(id);
    console.log(body);
    try {
      // let _id = await CollarRegistrationSchedule.findOne({ where: { id: id } })
      // if (_id === null) {
      //     return Promise.reject({ statusCode: 400, message: 'User not Found.' })
      // }

      // if (typeof (body.username) !== 'undefined') {
      //     return Promise.reject({ statusCode: 400, message: 'Cannot update username.' })
      // }

      // if (typeof (body.username) !== 'undefined') {
      //     return Promise.reject({ statusCode: 400, message: 'Cannot update username.' })
      // }
      console.log(body);

      await RegistrationSchedule.updateAll({ id: id }, body);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  RegistrationSchedule.remoteMethod("updateRegistrationSchedule", {
    description: `Update RegistrationSchedule`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/updateRegistrationSchedule/:id", verb: "post" },
  });

  RegistrationSchedule.updateRegistrationSchedule = async function (id, body) {
    console.log(id);
    console.log(body);
    try {
      // let _id = await CollarRegistrationSchedule.findOne({ where: { id: id } })
      // if (_id === null) {
      //     return Promise.reject({ statusCode: 400, message: 'User not Found.' })
      // }

      // if (typeof (body.username) !== 'undefined') {
      //     return Promise.reject({ statusCode: 400, message: 'Cannot update username.' })
      // }

      // if (typeof (body.username) !== 'undefined') {
      //     return Promise.reject({ statusCode: 400, message: 'Cannot update username.' })
      // }
      console.log(body);

      await RegistrationSchedule.updateAll({ id: id }, body);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  RegistrationSchedule.remoteMethod("updateRegistrationSchedule", {
    description: `Update RegistrationSchedule`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/updateRegistrationSchedule/:id", verb: "post" },
  });

  RegistrationSchedule.listRegistrationSchedule = function (cb) {
    __listRegistrationSchedule(__app, cb);
  };
  RegistrationSchedule.remoteMethod("listRegistrationSchedule", {
    description: `Get List of RegistrationSchedules`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list", verb: "get" },
  });

  //----- DELETE -----

  RegistrationSchedule.removeRegistrationSchedule = async function (id) {
    try {
      let _id = await RegistrationSchedule.findOne({ where: { id: id } });
      if (_id === null) {
        return Promise.reject({ statusCode: 400, message: "ID not Found." });
      }

      await RegistrationSchedule.destroyById(_id.id);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  RegistrationSchedule.remoteMethod("removeRegistrationSchedule", {
    description: `Remove RegistrationSchedule`,
    isStatic: true,
    accepts: { arg: "id", type: "number", required: true },
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/removeRegistrationSchedule/:id", verb: "delete" },
  });
};

function _disableRemoteMethod(Model) {
  // GET
  Model.disableRemoteMethodByName("find");

  // POST
  Model.disableRemoteMethodByName("create");

  // PUT
  Model.disableRemoteMethodByName("replaceOrCreate");

  // PATCH
  Model.disableRemoteMethodByName("patchOrCreate");

  // GET /findOne
  Model.disableRemoteMethodByName("findOne");

  // GET /:id
  Model.disableRemoteMethodByName("findById");

  // GET /:id/exists
  Model.disableRemoteMethodByName("exists");

  // GET /count
  // Model.disableRemoteMethodByName('count')

  // POST /update
  Model.disableRemoteMethodByName("updateAll");

  // DELETE /:id
  Model.disableRemoteMethodByName("deleteById");

  // PATCH /:id
  Model.disableRemoteMethodByName("prototype.patchAttributes");

  // PUT /:id
  Model.disableRemoteMethodByName("replaceById");

  // POST|GET	/change-stream
  Model.disableRemoteMethodByName("createChangeStream");

  // POST	/upsertWithWhere
  Model.disableRemoteMethodByName("upsertWithWhere");

  //=================== From Related Model =====================================

  let _relationName = [];
  // POST /{id}/{relation-name}
  // Model.disableRemoteMethodByName('prototype.__create__' + _relationName)
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__create__" + element);
  });

  // // GET /{id}/{relation-name}
  // Model.disableRemoteMethodByName('prototype.__get__' + _relationName);

  // DELETE /{id}/{relation-name}
  // Model.disableRemoteMethodByName('prototype.__delete__' + _relationName)
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__delete__" + element);
  });

  // // PUT /{id}/{relation-name}
  // Model.disableRemoteMethodByName('prototype.__update__' + _relationName);
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__update__" + element);
  });

  // // DELETE /{id}/{relation-name}
  // Model.disableRemoteMethodByName('prototype.__destroy__' + _relationName)
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__destroy__" + element);
  });

  // GET /{id}/{relation-name}/{fk}
  // Model.disableRemoteMethodByName('prototype.__findById__' + _relationName);
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__findById__" + element);
  });

  // PUT /{id}/{relation-name}/{fk}
  // Model.disableRemoteMethodByName('prototype.__updateById__' + _relationName);
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__updateById__" + element);
  });

  // DELETE /{id}/{relation-name}/{fk}
  // Model.disableRemoteMethodByName('prototype.__destroyById__' + _relationName)
  _relationName.forEach((element) => {
    Model.disableRemoteMethodByName("prototype.__destroyById__" + element);
  });
}

async function __listRegistrationSchedule(app, cb) {
  try {
    let registrationSchedule = await app.models.RegistrationSchedule.find({});
    cb(null, registrationSchedule);
  } catch (error) {
    cb(error);
  }
}

function __createApiKey() {
  return new Promise((resolve, reject) => {
    uid(LENGTH, function (err, guid) {
      if (err) {
        console.log(err);
        return reject(err);
      }

      // console.log(guid)
      resolve(guid);
    });
  });
}
