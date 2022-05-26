'use strict';
const uid = require('uid2');
const LENGTH = 16

module.exports = function (Student) {
    _disableRemoteMethod(Student)

    var __app;

    Student.on('attached', function (a) {
        __app = a;
    });

    //Register =========================================================
    Student.register = async function (data) {
        // console.log(data)
        if (typeof (data.name) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing name.' })
        }
        if (typeof (data.devid) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
        }

        try {
            // Check
            let __sensor = await Student.findOne({ where: { device_id: data.devid } })
            if (__sensor !== null) {
                return Promise.reject({ statusCode: 400, message: 'Sensor Student already register!.' })
            }

            let _apiKey = await __createApiKey()
            let _data = { name: data.name, device_id: data.devid, api_key: _apiKey }
            let _res = await Student.create(_data)

            return Promise.resolve(_res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Student.remoteMethod('register', {
        description: 'Register Student',
        isStatic: true,
        accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/register', verb: 'post' }
    })

    //----- UPDATE -----

    Student.updateStudent = async function (id, body) {
        console.log(id)
        console.log(body)
        try {

            // let _id = await CollarStudent.findOne({ where: { id: id } })
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

            await Student.updateAll({ id: id }, body)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Student.remoteMethod('updateStudent', {
        description: `Update Student`,
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
        http: { path: '/updateStudent/:id', verb: 'post' }
    })

    //Retrieve ==============================================
    Student.listStudent = function (cb) {
        __listStudent(__app, cb)
    }
    Student.remoteMethod('listStudent', {
        description: `Get List of Students`,
        isStatic: true,
        accepts: [],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/listStudent', verb: 'get' }
    })

    //----- DELETE -----

    Student.removeStudent = async function (id) {
        try {
            let _id = await Student.findOne({ where: { id: id } })
            if (_id === null) {
                return Promise.reject({ statusCode: 400, message: 'ID not Found.' })
            }

            await Student.destroyById(_id.id)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Student.remoteMethod('removeStudent', {
        description: `Remove Student`,
        isStatic: true,
        accepts: { arg: 'id', type: 'number', required: true },
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/removeStudent/:id', verb: 'delete' }
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

async function __listStudent(app ,cb) {
    try {

      
        let curriculum = await app.models.Student.find(
          {
            // fields: [
            //     "id_kurikulum" ,
            //     "tahun_masuk" ,
            //     "sesi_masuk" ,
            //     "kod_kurikulum" ,
            //     "nama_kurikulum" ,
            //     "semester_masuk" ,
            // ],
            where: { isDeleted: false },
            // where: { and: [{ isDeleted: false }, { deviceId: ListID[index] } ] },
            include: "Section",
        }
        )
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
