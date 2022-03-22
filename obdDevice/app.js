const iStartex = require('./istartex')
var appServer = null

iStartex.event.on('onTrackerLogin', (message, socket) => {
    onTrackerLogin(message, socket)
})
iStartex.event.on('onTrackerAuthReq', (message, socket) => {
    onTrackerAuthReq(message, socket)
})
iStartex.event.on('onTrackerTextMessage', (message, socket) => {
    onTrackerTextMessage(message, socket)
})
iStartex.event.on('onTrackerEventMessage', (message, socket) => {
    onTrackerEventMessage(message, socket)
})
iStartex.event.on('onTrackerPositionMessage', (message, socket) => {
    onTrackerPositionMessage(message, socket)
})

//============================
async function onTrackerLogin(message, socket) {
    console.log('onTrackerLogin')
    // console.log(message)

    // 0: success
    // 1: the ID has beed login
    // 2:no car in the system
    if (appServer === null) {
        return
    }

    try {
        let device = await appServer.models.Device.findOne({ where: { device_id: message.deviceId } })
        console.log(device)
        if (device === null) {
            iStartex.device.sendLoginResponse(null, message.deviceId, message.serialNumber, 2, socket)
            return
        }
        iStartex.device.sendLoginResponse(device.api_key, message.deviceId, message.serialNumber, 0, socket)
    } catch (error) {
        console.log(error)
    }
}
async function onTrackerAuthReq(message, socket) {
    console.log('onTrackerAuthReq')
    // console.log(message)

    // 0: success
    // 1:failed
    // 2:message error
    // 3:unknow message
    // 4.alarm confirm
    if (appServer === null) {
        return
    }

    try {
        let device = await appServer.models.Device.findOne({ where: { and: [{ device_id: message.deviceId }, { api_key: message.authCode }] } })
        if (device === null) {
            return
        }
        iStartex.device.sendGeneralResponse(message.messageId, message.deviceId, message.serialNumber, 0, socket)
    } catch (error) {
        console.log(error)
    }
}
function onTrackerTextMessage(message, socket) {
    console.log('onTrackerTextMessage')
    // console.log(message)
}
function onTrackerEventMessage(message, socket) {
    console.log('onTrackerEventMessage')
    // console.log(message)
    iStartex.device.sendGeneralResponse(message.messageId, message.deviceId, message.serialNumber, 0, socket)
}
async function onTrackerPositionMessage(message, socket) {
    console.log('onTrackerPositionMessage')
    console.log(message)
    iStartex.device.sendGeneralResponse(message.messageId, message.deviceId, message.serialNumber, 0, socket)

    if (appServer === null) {
        return
    }

    try {
        let device = await appServer.models.Device.findOne({ where: { device_id: message.deviceId } })
        if (device === null) {
            return
        }


        // 1. Insert Data to Database
        await appServer.models.DeviceData.create({
            alarmOverSpeed: message.alarmOverSpeed,
            alarmRemove: message.alarmRemove,
            alarmCrash: message.alarmCrash,
            latitude: message.latitude,
            longitude: message.longitude,
            altitude: message.altitude,
            speed: message.obdData.speed,
            engineSpeed: message.obdData.engineSpeed,
            batteryVoltage: message.obdData.batteryVoltage,
            totalMileage: message.obdData.totalMileage,
            deviceId: device.id
        })
        // 2. Send data to Dashboard
        let msg = {
            alarmOverSpeed: message.alarmOverSpeed,
            alarmRemove: message.alarmRemove,
            alarmMotion: message.alarmMotion,
            alarmCrash: message.alarmCrash,
            latitude: message.latitude,
            longitude: message.longitude,
            altitude: message.altitude,
            speed: message.speed,
            direction: message.direction,
            datetime: message.datetime,
            id: device.id
        }
        appServer.rtapi.publish({
            topic: 'datastream',
            payload: JSON.stringify(msg)
        })

        // alarmOverSpeed: 0,
        // alarmTired: 0,
        // alarmLowPower: 0,
        // alarmRemove: 0,
        // alarmMotion: 0,
        // alarmCrash: 0,
        // statusAcc: 0,
        // statusGPS: 0,
        // statusLatitude: 0,
        // statusLongitude: 0,
        // latitude: 1.562133,
        // longitude: 103.60715,
        // altitude: 0,
        // speed: 0,
        // direction: 199,
        // datetime: '21-09-30 22:02:30',
        // obdData: {
        //   speed: 0,
        //   engineSpeed: 0,
        //   batteryVoltage: 12.14,
        //   totalMileage: 0,
        //   fuelConsumptionIdle: 0,
        //   fuelConsumptionDriving: 0,
        //   engineLoad: 0,
        //   coolantTemperature: 0,
        //   map: 0,
        //   mat: 0,
        //   intakeFlowRate: 0,
        //   throttlePosition: 0,
        //   ignitionTiming: -64,
        //   tripId: 0,
        //   tripMileage: 0,
        //   tripFuelConsumption: 0,
        //   totalFuelConsumption: 0,
        //   tripAverageFuelConsumption: 0,
        //   tripAverageSpeed: 0,
        //   tripMaximumSpeed: 0,
        //   tripMaximumEngineSpeed: 0,
        //   tripMaximumCoolantTemperature: 0,
        //   tripMaximumVoltage: 0,
        //   tripRapidAccelerate: 0,
        //   tripRapidDecelerate: 0,
        //   tripRapidStop: 0
        // },
        // mileageOnMeter: 412,
        // fuel: 0,
        // extendStatus: 0,
        // ioStatus: 0,
        // networkSignal: 22,
        // numberSatellite: 0,
        // bateryVoltage: 0.004

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    setServerInstance: (serverInstance) => { appServer = serverInstance },
}
