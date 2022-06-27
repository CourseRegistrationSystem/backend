'use strict';
const uid = require('uid2');
const LENGTH = 16

module.exports = function (Table) {
    _disableRemoteMethod(Table)

    var __app;

    Table.on('attached', function (a) {
        __app = a;
    });

    Table.register = async function (data) {
        console.log(data)

        console.log(data.course,data.course.table)
        // if (typeof (data.name) === 'undefined') {
        //     return Promise.reject({ statusCode: 400, message: 'Missing name.' })
        // }
        // if (typeof (data.devid) === 'undefined') {
        //     return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
        // }

        try {
            // Check
            let __sensor = await Table.findOne({ where: { kad_matrik_pelajar: data.user.matricNo } })
            if (__sensor !== null) {
                return Promise.reject({ statusCode: 400, message: 'The student already registered!.' })
            }

            // let _apiKey = await __createApiKey()
            // let _data = { kod_subjek: data.course.kod_subjek, nama_subjek: data.course.nama_subjek, nama_pensyarah: data.course.pensyarah,seksyen: data.course.seksyen, nama_pelajar: data.user.name, kad_matrik_pelajar: data.user.matricNo }
            // let _res = await Table.create(_data)
            // console.log(__app.models)
            // data.course.table.map((dataList,index) => {
              // let _dataTable = {masa: dataList.masa, hari: dataList.hari, registration_id: _data.id }
              // await __app.models.Table.create(_dataTable)
            // })


            return Promise.resolve(_res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Table.remoteMethod('register', {
        description: 'Register Table',
        isStatic: true,
        accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/register', verb: 'post' }
    })

    Table.updateInfo = async function (id, data) {
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
            // let __sensor = await Table.findOne({ where: { device_id: data.devid } })
            // if (__sensor !== null) {
            //     if (__sensor.id !== id) {
            //         return Promise.reject({ statusCode: 400, message: 'Table already register!.' })
            //     }
            // }

            let _res = await Table.updateAll({id: id}, data)

            return Promise.resolve(_res)
        } catch (error) {
            return Promise.reject(error)
        }
    }


    Table.remoteMethod('updateInfo', {
        description: 'Update Info',
        isStatic: true,
        accepts: [
            { arg: 'id', type: 'string', required: true },
            { arg: 'data', type: 'object', http: { source: 'body' } }
        ],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/update/info/:id', verb: 'post' }
    })

    //----- UPDATE -----

    Table.updateRegistration = async function (id, body) {
        console.log(id)
        console.log(body)
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
            console.log(body)

            await Table.updateAll({ id: id }, body)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Table.remoteMethod('updateRegistration', {
        description: `Update Table`,
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
        http: { path: '/updateRegistration/:id', verb: 'post' }
    })

    Table.updateRegistration = async function (id, body) {
        console.log(id)
        console.log(body)
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
            console.log(body)

            await Table.updateAll({ id: id }, body)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Table.remoteMethod('updateRegistration', {
        description: `Update Table`,
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
        http: { path: '/updateRegistration/:id', verb: 'post' }
    })

    Table.listRegistration = function (cb) {
        __listRegistration(__app, cb)
    }
    Table.remoteMethod('listRegistration', {
        description: `Get List of Registrations`,
        isStatic: true,
        accepts: [],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/list', verb: 'get' }
    })

    //----- DELETE -----

    Table.removeRegistration = async function (id) {
        try {
            let _id = await Table.findOne({ where: { id: id } })
            if (_id === null) {
                return Promise.reject({ statusCode: 400, message: 'ID not Found.' })
            }

            await Table.destroyById(_id.id)

            return Promise.resolve('OK')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Table.remoteMethod('removeRegistration', {
        description: `Remove Table`,
        isStatic: true,
        accepts: { arg: 'id', type: 'number', required: true },
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/removeRegistration/:id', verb: 'delete' }
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

async function __listRegistration(app ,cb) {
    try {
        let table = await app.models.Table.find({
            // fields: [
            //     "onlineStatus" ,
            //     "name" ,
            //     "device_id" ,
            //     "api_key" ,
            //     "createdDate" ,
            //     "modifiedDate" ,
            //     "ownerName" ,
            //     "ownerIc" ,
            //     "ownerPhoneNum" ,
            //     "ownerLicenseNum" ,
            //     "ownerBirthDate" ,
            //     "vehicleModel" ,
            //     "vehiclePlateNum" ,
            //     "vehicleChasisNum" ,
            //     "vehicleEngineNumber" ,
            //     "vehiclePicture",
            // ],
            // where: { isDeleted: false },
        })
        cb(null, table)
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
