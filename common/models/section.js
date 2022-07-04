'use strict';
const uid = require('uid2');
const LENGTH = 16

module.exports = function (Section) {
    _disableRemoteMethod(Section)

    var __app;

    Section.on('attached', function (a) {
        __app = a;
    });

    //Register =========================================================
    Section.register = async function (data) {
        console.log(data)
        if (typeof (data.semester) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing name.' })
        }
        if (typeof (data.section) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
        }

        try {
            // Check
            let __sensor = await Section.findOne({ where: { section: data.section } })
            if (__sensor !== null) {
                return Promise.reject({ statusCode: 400, message: 'Section already register!.' })
            }

            // let _apiKey = await __createApiKey()
            let _data = { semester: data.semester, session: data.session, program: data.program, section:data.section }
            let _res = await Section.create(_data)

            return Promise.resolve(_res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Section.remoteMethod('register', {
        description: 'Register Section',
        isStatic: true,
        accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/register', verb: 'post' }
    })

    //----- UPDATE -----

    Section.updateSection = async function (id, body) {
        console.log(id)
        console.log(body)
        try {

            // let _id = await CollarSection.findOne({ where: { id: id } })
            // if (_id === null) {
            //     return Promise.reject({ statusCode: 400, message: 'User not Found.' })
            // }

            // if (typeof (body.username) !== 'undefined') {
            //     return Promise.reject({ statusCode: 400, message: 'Cannot update username.' })
            // }

            // if (typeof (body.username) !== 'undefined') {
            //     return Promise.reject({ statusCode: 400, message: 'Cannot update username.' })
            // }
            console.log(body)

            await Section.updateAll({ id: id }, body)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Section.remoteMethod('updateSection', {
        description: `Update Section`,
        isStatic: true,
        accepts: [
            { arg: 'id', type: 'number', required: true },
            { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            { arg: "options", type: "object", http: "optionsFromRequest" }
        ],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/updateSection/:id', verb: 'post' }
    })

    //Retrieve ==============================================
    Section.listSection = function (cb) {
        __listSection(__app, cb)
    }
    Section.remoteMethod('listSection', {
        description: `Get List of Sections`,
        isStatic: true,
        accepts: [],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/listSection', verb: 'get' }
    })

    Section.getSectionMemberListById = function (filter,cb) {
      getSectionMemberListById(__app, cb,filter)
  }
  Section.remoteMethod('getSectionMemberListById', {
      description: `getSectionMemberListById`,
      isStatic: true,
      accepts: [{ arg: "filter", type: "object", required: true }],
    returns: {
      type: "object",
      root: true,
    },
      http: { path: '/getSectionMemberListById', verb: 'get' }
  })

    //----- DELETE -----

    Section.removeSection = async function (id) {
        try {
            let _id = await Section.findOne({ where: { id: id } })
            if (_id === null) {
                return Promise.reject({ statusCode: 400, message: 'ID not Found.' })
            }

            await Section.destroyById(_id.id)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Section.remoteMethod('removeSection', {
        description: `Remove Section`,
        isStatic: true,
        accepts: { arg: 'id', type: 'number', required: true },
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/removeSection/:id', verb: 'delete' }
    })

};



function _disableRemoteMethod(Model) {
    // GET
    Model.disableRemoteMethodByName('find')

    // POST
    Model.disableRemoteMethodByName('create')

    // PUT
    Model.disableRemoteMethodByName('replaceOrCreate')

    // PATCH
    Model.disableRemoteMethodByName('patchOrCreate')

    // GET /findOne
    Model.disableRemoteMethodByName('findOne')

    // GET /:id
    Model.disableRemoteMethodByName('findById')

    // GET /:id/exists
    Model.disableRemoteMethodByName('exists')

    // GET /count
    // Model.disableRemoteMethodByName('count')

    // POST /update
    Model.disableRemoteMethodByName('updateAll')

    // DELETE /:id
    Model.disableRemoteMethodByName('deleteById')

    // PATCH /:id
    Model.disableRemoteMethodByName('prototype.patchAttributes')

    // PUT /:id
    Model.disableRemoteMethodByName('replaceById')

    // POST|GET	/change-stream
    Model.disableRemoteMethodByName('createChangeStream')

    // POST	/upsertWithWhere
    Model.disableRemoteMethodByName('upsertWithWhere')


    //=================== From Related Model =====================================

    let _relationName = []
    // POST /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__create__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__create__' + element)
    });

    // // GET /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__get__' + _relationName);

    // DELETE /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__delete__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__delete__' + element)
    });

    // // PUT /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__update__' + _relationName);
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__update__' + element)
    });

    // // DELETE /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__destroy__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__destroy__' + element)
    });

    // GET /{id}/{relation-name}/{fk}
    // Model.disableRemoteMethodByName('prototype.__findById__' + _relationName);
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__findById__' + element)
    });

    // PUT /{id}/{relation-name}/{fk}
    // Model.disableRemoteMethodByName('prototype.__updateById__' + _relationName);
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__updateById__' + element)
    });

    // DELETE /{id}/{relation-name}/{fk}
    // Model.disableRemoteMethodByName('prototype.__destroyById__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__destroyById__' + element)
    });

}

async function __listSection(app ,cb) {
    try {
        let curriculum = await app.models.Section.find(
          {
            // fields: [
            //     "session" ,

            // ],
            where: { isDeleted: false },
            include: "student",
        }
        )
        cb(null, curriculum)
    } catch (error) {
        cb(error)
    }
}


async function getSectionMemberListById(app ,cb,filter) {
  console.log(filter)
  try {
      let curriculum = await app.models.Section.findOne(
        {
          // fields: [
          //     "session" ,

          // ],
          where: {
            and: [
              { isDeleted: false },
              { id: filter.id },
              {
                // createdDate: {
                //   between: [filter + " 00:00:00", filter + " 23:59:59"],
                // },
              },
            ],
           },
           include: [{ relation: "registration" }, { relation: "course" }]
      }
      )
      console.log(curriculum)
      cb(null, curriculum)
  } catch (error) {
      cb(error)
  }
}

function __createApiKey() {
    return new Promise((resolve, reject) => {
        uid(LENGTH, function (err, guid) {
            if (err) {
                console.log(err)
                return reject(err)
            }

            // console.log(guid)
            resolve(guid)
        });
    })
}
