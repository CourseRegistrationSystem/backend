"use strict";
const uid = require("uid2");
const course = require("./course");
const LENGTH = 16;

module.exports = function (Registration) {
  _disableRemoteMethod(Registration);

  var __app;

  Registration.on("attached", function (a) {
    __app = a;
  });

  Registration.register = async function (data) {
    // console.log(data);

    try {
      // Check
      let getIDstudent = null

      let checkStudent = await __app.models.Student.findOne({ // check if the course availability
        where: { matricNo: data.user.matricNo }
      });

      getIDstudent = checkStudent.id
      // if(checkStudent !== null){
      //   getIDstudent = checkStudent.id
      // }else{
      //   console.log(checkStudent)
      //   // let _dataStudent = {
      //   //   name: data.user.name,
      //   //   matricNo: data.user.matricNo,
      //   // };
      //   // let result = await __app.models.Student.create(_dataStudent);
      //   getIDstudent = result.id
      // }

      let checkCourse = await __app.models.Course.findOne({ // check if the course availability
        where: {
          and: [
            { kod_subjek: data.course.kod_subjek },
            { semester: data.semester },
            { sesi: data.sesi },
          ],
        },
      });

      if (checkCourse !== null) { // have course in the list
        let checkSection = await __app.models.Section.findOne({ // check if the course availability
          where: {
            and: [
              { section: data.course.seksyen },
              { course_id: checkCourse.id },
            ],
          },
        });

        if (checkSection !== null) { // have section in the list

          let _dataSection = {
            capacity: checkSection.capacity + 1,
          };
          await __app.models.Section.updateAll(
            { id: checkSection.id },
            _dataSection
          );

          let _dataRegister = {
            kod_subjek: data.course.kod_subjek,
            nama_subjek: data.course.nama_subjek,
            nama_pensyarah: data.course.pensyarah,
            seksyen: data.course.seksyen,
            nama_pelajar: data.user.name,
            kad_matrik_pelajar: data.user.matricNo,
            sesi: data.sesi,
            section_id: checkSection.id,
            student_id: getIDstudent
          };

          let _res = await __app.models.Registration.create(_dataRegister);
          return Promise.resolve(_res);
        }else{ //no section in the list

          let _dataSection = {
            section: data.course.seksyen,
            capacity: 1,
            nama_pensyarah: data.course.pensyarah,
            course_id: checkCourse.id,
          };
          let result = await __app.models.Section.create(_dataSection);

          data.course.table.map(async (dataList, index) => {
            let _dataTable = {
              masa: dataList.masa,
              hari: dataList.hari,
              section_id: result.id,
            };
            await __app.models.Table.create(_dataTable);
          });

          let _dataRegister = {
            kod_subjek: data.course.kod_subjek,
            nama_subjek: data.course.nama_subjek,
            nama_pensyarah: data.course.pensyarah,
            seksyen: data.course.seksyen,
            nama_pelajar: data.user.name,
            kad_matrik_pelajar: data.user.matricNo,
            sesi: data.sesi,
            section_id: result.id,
            student_id: getIDstudent
          };

          let _res = await __app.models.Registration.create(_dataRegister);
          return Promise.resolve(_res);
        }


      }else{ // no course in the list
        console.log('no section')

        let _dataCourse = {
          kod_subjek: data.course.kod_subjek,
          nama_subjek: data.course.nama_subjek,
          sesi: data.sesi,
          semester: data.semester,
        };
        let dataCourse = await __app.models.Course.create(_dataCourse);

        let _dataSection = {
          section: data.course.seksyen,
          capacity: 1,
          nama_pensyarah: data.course.pensyarah,
          course_id: dataCourse.id,
        };
        let result = await __app.models.Section.create(_dataSection);

        data.course.table.map(async (dataList, index) => {
          let _dataTable = {
            masa: dataList.masa,
            hari: dataList.hari,
            section_id: result.id,
          };
          await __app.models.Table.create(_dataTable);
        });


        let _dataRegister = {
          kod_subjek: data.course.kod_subjek,
          nama_subjek: data.course.nama_subjek,
          nama_pensyarah: data.course.pensyarah,
          seksyen: data.course.seksyen,
          nama_pelajar: data.user.name,
          kad_matrik_pelajar: data.user.matricNo,
          sesi: data.sesi,
          section_id: result.id,
          student_id: getIDstudent
        };

        let _res = await __app.models.Registration.create(_dataRegister);
        return Promise.resolve(_res);
      }



    } catch (error) {
      return Promise.reject(error);
    }
  };
  Registration.remoteMethod("register", {
    description: "Register Registration",
    isStatic: true,
    accepts: [{ arg: "data", type: "object", http: { source: "body" } }],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register", verb: "post" },
  });

  Registration.updateInfo = async function (id, data) {
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
      // let __sensor = await Registration.findOne({ where: { device_id: data.devid } })
      // if (__sensor !== null) {
      //     if (__sensor.id !== id) {
      //         return Promise.reject({ statusCode: 400, message: 'Registration already register!.' })
      //     }
      // }

      let _res = await Registration.updateAll({ id: id }, data);

      return Promise.resolve(_res);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  Registration.remoteMethod("updateInfo", {
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

  Registration.updateRegistration = async function (id, body) {
    console.log(id);
    console.log(body);
    try {
      // let _id = await CollarRegistration.findOne({ where: { id: id } })
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

      await Registration.updateAll({ id: id }, body);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  Registration.remoteMethod("updateRegistration", {
    description: `Update Registration`,
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
    http: { path: "/updateRegistration/:id", verb: "post" },
  });

  Registration.updateRegistration = async function (id, body) {
    console.log(id);
    console.log(body);
    try {
      // let _id = await CollarRegistration.findOne({ where: { id: id } })
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

      await Registration.updateAll({ id: id }, body);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  Registration.remoteMethod("updateRegistration", {
    description: `Update Registration`,
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
    http: { path: "/updateRegistration/:id", verb: "post" },
  });

  Registration.listRegistration = function (cb) {
    __listRegistration(__app, cb);
  };
  Registration.remoteMethod("listRegistration", {
    description: `Get List of Registrations`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list", verb: "get" },
  });

  Registration.listOneMatric = function (cb) {
    __listOneMatric(__app, cb);
  };
  Registration.remoteMethod("listOneMatric", {
    description: `Get List One Matric`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/listOneMatric", verb: "get" },
  });

  Registration.getRegistrationListById = function (filter, cb) {
    __getRegistrationListById(__app, cb, filter);
  };
  Registration.remoteMethod("getRegistrationListById", {
    description: `Get Registrations List of Respective Student`,
    isStatic: true,
    accepts: [{ arg: "filter", type: "object", required: true }],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/getRegistrationListById", verb: "get" },
  });

  Registration.checkEligible = async function (data) {
    let matricNo = data.matricNo;
    try {
      // Check

      // have upcoming registration session
      let beforeRegistration = await __app.models.RegistrationSchedule.findOne({
        where: {
          startDateTime: { gt: new Date() },
        },
      });

      let inRegistration = await __app.models.RegistrationSchedule.findOne({
        where: {
          startDateTime: { lte: new Date() },
        },
      });

      // console.log(beforeRegistration,'nak register ni')
      if (beforeRegistration !== null) {
        return Promise.resolve({
          statusToRegister: false,
          message:
            "Registration for session " +
            beforeRegistration.session +
            " Semester " +
            beforeRegistration.semester +
            " is in schedule",
          data: beforeRegistration,
          type: 1
        });
      } else {
        // in registration range
        let time = await __app.models.RegistrationSchedule.findOne({
          where: {
            and: [
              {
                startDateTime: { lt: new Date() },
                endDateTime: { gt: new Date() },
              },
            ],
          },
        });
        // console.log(time);
        if (time !== null) {
          // there are session that able to perform course registration by student
          // return Promise.resolve({statusToRegister: false,message: "user is already registered his/her course",data: __sensor}

          let registerDetails = await __app.models.Student.findOne({
            where: { matricNo: matricNo },
            include: [
              {
                relation: "Registration",
                scope: {
                  include: [
                    {
                      relation: "section",
                      scope: {
                        include: [{ relation: "table" }, { relation: "course" }],
                      },
                    },
                  ],
                },
              },
            ],
          });
          console.log(registerDetails);
          if (registerDetails !== null) {
            // ada dalam database
            time.registerDetails = registerDetails
            return Promise.resolve({
              statusToRegister: false,
              message: "User is already registered his/her course",
              data: time,
              type: 2
            });
          } else {
            return Promise.resolve({
              statusToRegister: true,
              message: "Course registration is available",
              data: inRegistration,
              type: 3
            });
          }
        } else {
          return Promise.resolve({
            statusCode: 400,
            statusToRegister: false,
            message: "Course registration is not available at this moment",
            data: null,
            type: 4
          });
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  Registration.remoteMethod("checkEligible", {
    // need to check the correctness
    description: `Check Eligible`,
    isStatic: true,
    accepts: [{ arg: "data", type: "object", http: { source: "body" } }],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/checkEligible", verb: "post" },
  });

  //----- DELETE -----

  Registration.removeRegistration = async function (id) {
    try {
      let _id = await Registration.findOne({ where: { id: id } });
      if (_id === null) {
        return Promise.reject({ statusCode: 400, message: "ID not Found." });
      }

      await Registration.destroyById(_id.id);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  Registration.remoteMethod("removeRegistration", {
    description: `Remove Registration`,
    isStatic: true,
    accepts: { arg: "id", type: "number", required: true },
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/removeRegistration/:id", verb: "delete" },
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

async function __listRegistration(app, cb) {
  try {
    let registration = await app.models.Registration.find({
      where: { isDeleted: false },
      include: {
        relation: "section",
      },
    });
    cb(null, registration);
  } catch (error) {
    cb(error);
  }
}

async function __listOneMatric(app, cb) {
  try {
    let registration = await app.models.Registration.find({
      where: { isDeleted: false },
      include: [
        {
          relation: 'section',
          scope: {
            include: [{relation: 'course'}],
          },
        },
      ],
    });

    // console.log(registration)

    let arrayMatric = []
    let arrayDatabySingleMatric = []
    registration.map(async (dataList,index) => {
      if(arrayMatric.includes(dataList.kad_matrik_pelajar)){
        console.log('masuk',dataList.kad_matrik_pelajar)
      }else{
        arrayMatric.push(dataList.kad_matrik_pelajar)
        arrayDatabySingleMatric.push(dataList)
      }
    })

    console.log(arrayDatabySingleMatric)
    cb(null, arrayDatabySingleMatric);
  } catch (error) {
    cb(error);
  }
}

async function __getRegistrationListById(app, cb, filter) {
  try {
    let registration = await app.models.Registration.find({
      where: {
        and: [
          { isDeleted: false },
          { kad_matrik_pelajar: filter.matricNo },
          {
            // createdDate: {
            //   between: [filter + " 00:00:00", filter + " 23:59:59"],
            // },
          },
        ],
      },
      // include: {section: [{timetable}]}
      // include: ['section','timetable'],

      include: [
        {
          relation: 'section',
          scope: {
            include: [{relation: 'table'}],
          },
        },
      ],

    });
    cb(null, registration);
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
