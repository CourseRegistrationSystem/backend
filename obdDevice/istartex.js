const net = require('net');
const EventEmitter = require('events');

const PORT = 8989

const event = new EventEmitter()

const RX_HEADER = 0;
const RX_MESSAGE_ID = 1;
const RX_BODY_LEN = 2;
const RX_DEVICE_ID = 3;
const RX_SERIAL_NUMBER = 4;
const RX_DATA = 5;
const RX_CRC = 6;
const RX_END = 7;

net.createServer((socket) => {
    console.log("========Connected==============")

    socket.on('close', function () { });
    socket.on('drain', function () { });
    socket.on('data', function (data) {
        // console.log(byteArrayToHex([...data]))
        serialRx(data, socket)
    });
    socket.on('end', function () {
        // clients.splice(clients.indexOf(socket), 1);
    });
    socket.on('error', function (err) {
        // clients.splice(clients.indexOf(socket), 1);
        console.log("Caught Socket Error: " + err)
    });
}).listen(PORT);
console.log('Server Started on PORT ', PORT)


// Escape rules are defined as follows: 
// ➢ 0x7e <----> 0x7d followed by a 0x02; 
// ➢ 0x7d <----> 0x7d followed by a 0x01. 

let RX_STATE = RX_HEADER;
let bodyLength = 0;
let uidArray = []
let count = 0
let escape = false

function serialRx(data, socket) {
    for (let i = 0; i < data.length; i++) {
        switch (RX_STATE) {
            case RX_HEADER:
                // console.log('RX_HEADER');
                if (data[i] !== 0x7E) {
                    return;
                }
                uidArray = []

                RX_STATE = RX_MESSAGE_ID;
                break;
            case RX_MESSAGE_ID:
                // console.log('RX_MESSAGE_ID');
                uidArray.push(data[i])
                count++
                if (count === 2) {
                    RX_STATE = RX_BODY_LEN;
                    count = 0
                    escape = false
                }
                break;
            case RX_BODY_LEN:
                // console.log('RX_BODY_LEN', data[i]);
                if (data[i] === 0x7D) {
                    escape = true
                    break
                }
                if (escape) {
                    if (data[i] === 0x01) {
                        uidArray.push(0x7D)
                        escape = false
                    } else if (data[i] === 0x02) {
                        uidArray.push(0x7E)
                        escape = false
                    } else {
                        break
                    }
                } else {
                    uidArray.push(data[i])
                }

                count++
                if (count === 2) {
                    RX_STATE = RX_DEVICE_ID;
                    count = 0
                    escape = false
                    bodyLength = parseInt(byteToHexString(uidArray[2]) + byteToHexString(uidArray[3]), 16)
                }

                break;
            case RX_DEVICE_ID:
                // console.log('RX_DEVICE_ID');
                if (data[i] === 0x7D) {
                    escape = true
                    break
                }
                if (escape) {
                    if (data[i] === 0x01) {
                        uidArray.push(0x7D)
                        escape = false
                    } else if (data[i] === 0x02) {
                        uidArray.push(0x7E)
                        escape = false
                    } else {
                        break
                    }
                } else {
                    uidArray.push(data[i])
                }

                count++
                if (count === 6) {
                    RX_STATE = RX_SERIAL_NUMBER;
                    count = 0
                    escape = false
                }

                break;
            case RX_SERIAL_NUMBER:
                // console.log('RX_SERIAL_NUMBER');
                if (data[i] === 0x7D) {
                    escape = true
                    break
                }
                if (escape) {
                    if (data[i] === 0x01) {
                        uidArray.push(0x7D)
                        escape = false
                    } else if (data[i] === 0x02) {
                        uidArray.push(0x7E)
                        escape = false
                    } else {
                        break
                    }
                } else {
                    uidArray.push(data[i])
                }

                count++
                if (count === 2) {
                    if (bodyLength === 0) {
                        RX_STATE = RX_CRC;
                    } else {
                        RX_STATE = RX_DATA;
                    }

                    count = 0
                    escape = false
                }
                break;
            case RX_DATA:
                // console.log('RX_DATA');
                if (data[i] === 0x7D) {
                    escape = true
                    break
                }
                if (escape) {
                    if (data[i] === 0x01) {
                        uidArray.push(0x7D)
                        escape = false
                    } else if (data[i] === 0x02) {
                        uidArray.push(0x7E)
                        escape = false
                    } else {
                        break
                    }
                } else {
                    uidArray.push(data[i])
                }

                count++
                if (count === bodyLength) {
                    RX_STATE = RX_CRC;
                    count = 0
                    escape = false
                }
                break;
            case RX_CRC:
                // console.log('RX_CRC');
                if (data[i] === 0x7D) {
                    escape = true
                    break
                }
                let crc = ''
                if (escape) {
                    if (data[i] === 0x01) {
                        crc = 0x7D
                        escape = false
                    } else if (data[i] === 0x02) {
                        crc = 0x7E
                        escape = false
                    }
                } else {
                    crc = data[i]
                }

                let crcSum = checkSum(uidArray)
                // console.log(crcSum, crc)
                if (crcSum !== crc) {
                    console.log('Checksum Error..')
                    RX_STATE = RX_HEADER
                    break
                }
                RX_STATE = RX_END
                break;
            case RX_END:
                // console.log('RX_END');
                RX_STATE = RX_HEADER;
                if (data[i] === 0x7E) {
                    parseTrackerMessage(uidArray, socket)
                }
                break
        }
    }
}
function checkEscape(message) {
    let temp = []
    message.forEach(element => {
        if (element === 0x7E) {
            temp.push(0x7D)
            temp.push(2)
        } else if (element === 0x7D) {
            temp.push(0x7D)
            temp.push(1)
        } else {
            temp.push(element)
        }
    });

    return temp
}
function checkSum(buff) {
    let cSum = buff[0];
    for (let i = 1; i < buff.length; i++) {
        cSum ^= buff[i];
        // console.log(cSum.toString(16))
    }

    return cSum
}

// =======================================
function parseTrackerMessage(data, socket) {
    let message = {
        messageId: parseInt(byteToHexString(data[0]) + byteToHexString(data[1]), 16),
        length: parseInt(byteToHexString(data[2]) + byteToHexString(data[3]), 16),
        deviceId: byteToHexString(data[4]) + byteToHexString(data[5]) + byteToHexString(data[6]) + byteToHexString(data[7]) + byteToHexString(data[8]) + byteToHexString(data[9]),
        serialNumber: byteToHexString(data[10]) + byteToHexString(data[11])
    }
    // console.log(message.messageId)

    if (message.messageId === 0x0001) {
        // Universal Respond of Tracker
        message.serialNumber = byteToHexString(data[12]) + byteToHexString(data[13])
        message.responseId = byteToHexString(data[14]) + byteToHexString(data[15])
        message.result = data[16]

        event.emit('onTrackerResponse', message, socket)
    } else if (message.messageId === 0x0002) {
        // event.emit('onTrackerHeartbeat', message, socket)
        sendGeneralResponse(message.messageId, message.deviceId, message.serialNumber, 0, socket)
    } else if (message.messageId === 0x0100) {
        // Tracker Login
        message.countryCode = byteToHexString(data[12]) + byteToHexString(data[13])
        message.cityCode = byteToHexString(data[14]) + byteToHexString(data[15])
        message.factoryId = byteToHexString(data[16]) + byteToHexString(data[17]) + byteToHexString(data[18]) + byteToHexString(data[19]) + byteToHexString(data[20])
        message.trackerTerminalId = ''
        for (let i = 21; i < 40; i++) {
            message.trackerTerminalId += byteToHexString(data[i])
        }
        message.trackerTerminalString = ''
        for (let i = 41; i < 48; i++) {
            message.trackerTerminalString += byteToHexString(data[i])
        }
        message.color = data[48]
        message.carNumber = ''
        for (let i = 49; i < (12+message.length); i++) {
            message.carNumber += String.fromCharCode(data[i])
        }

        event.emit('onTrackerLogin', message, socket)
    } else if (message.messageId === 0x0102) {
        message.authCode = ''
        for (let i = 12; i < (12 + message.length); i++) {
            message.authCode += String.fromCharCode((data[i]))
        }

        event.emit('onTrackerAuthReq', message, socket)
    } else if (message.messageId === 0x0200) {
        // Position Message

        let alarmFlag = byteToHexString(data[12]) + byteToHexString(data[13]) + byteToHexString(data[14]) + byteToHexString(data[15])
        alarmFlag = parseInt(alarmFlag, 16)
        alarmFlag = alarmFlag.toString(2).padStart(32, '0')
        message.alarmOverSpeed = parseInt(alarmFlag.charAt(1))
        message.alarmTired = parseInt(alarmFlag.charAt(2))
        message.alarmLowPower = parseInt(alarmFlag.charAt(7))
        message.alarmRemove = parseInt(alarmFlag.charAt(8))
        message.alarmMotion = parseInt(alarmFlag.charAt(15))
        message.alarmCrash = parseInt(alarmFlag.charAt(29))

        let status = byteToHexString(data[16]) + byteToHexString(data[17]) + byteToHexString(data[18]) + byteToHexString(data[19])
        status = parseInt(status, 16)
        status = status.toString(2).padStart(32, '0')
        message.statusAcc = parseInt(status.charAt(0))// 0:ACC off  1 :ACC on
        message.statusGPS = parseInt(status.charAt(1))// 0:GPS not fix, 1:GPS fix 
        message.statusLatitude = parseInt(status.charAt(2))// 0:North Latitude  1:South Latitude 
        message.statusLongitude = parseInt(status.charAt(3)) // 0:East longitude   1: West longitude 

        message.latitude = parseInt(byteToHexString(data[20]) + byteToHexString(data[21]) + byteToHexString(data[22]) + byteToHexString(data[23]), 16) / 1000000
        message.longitude = parseInt(byteToHexString(data[24]) + byteToHexString(data[25]) + byteToHexString(data[26]) + byteToHexString(data[27]), 16) / 1000000
        message.altitude = parseInt(byteToHexString(data[28]) + byteToHexString(data[29]), 16)
        message.speed = parseInt(byteToHexString(data[30]) + byteToHexString(data[31]), 16)
        message.direction = parseInt(byteToHexString(data[32]) + byteToHexString(data[33]), 16)
        message.datetime = byteToHexString(data[34]) + '-' + byteToHexString(data[35]) + '-' + byteToHexString(data[36]) + ' ' + byteToHexString(data[37]) + ':' + byteToHexString(data[38]) + ':' + byteToHexString(data[39])

        for (let i = 40; i < message.length; i++) {
            message.obdData = {}
            let len = 0
            let value = ''
            if (data[i] === 0xF3) {
                i++
                len = data[i]
                i++
                let temp = data.splice(i, i + len)
                message.obdData = parseOBDData(temp)
                i += len
            } else {
                if (data[i] === 0x01) {
                    // 01 04 00 00 01 9c 
                    i++
                    len = data[i]
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                    message.mileageOnMeter = parseInt(value, 16) / 10
                } else if (data[i] === 0x02) {
                    // 02 02 00 00 
                    i++
                    len = data[i]
                    value = ''
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                    message.fuel = parseInt(value, 16) / 10
                } else if (data[i] === 0x03 || data <= 0x024) {
                    // Reserved
                    // 03 02 00 00 
                    i++
                    len = data[i]
                    value = ''
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                } else if (data[i] === 0x25) {
                    // Extend status
                    // 25 04 00 00 00 00 
                    i++
                    len = data[i]
                    value = ''
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                    message.extendStatus = parseInt(value, 16)
                } else if (data[i] === 0x2A) {
                    // IO status 
                    // 2a 02 00 00  
                    i++
                    len = data[i]
                    value = ''
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                    message.ioStatus = parseInt(value, 16)
                } else if (data[i] === 0x2B) {
                    // Reserved
                    // 2b 04 00 00 00 00 
                    i++
                    len = data[i]
                    value = ''
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                } else if (data[i] === 0x30) {
                    // Network signal
                    // 30 01 16
                    i++
                    len = data[i]
                    value = ''
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                    message.networkSignal = parseInt(value, 16)
                } else if (data[i] === 0x31) {
                    // GNSS satellite quantity
                    // 31 01 00
                    i++
                    len = data[i]
                    value = 0
                    for (let j = 0; j < len; j++) {
                        i++
                        value += byteToHexString(data[i])
                    }
                    message.numberSatellite = parseInt(value, 16)
                } else if (data[i] === 0xE3) {
                    // Battery Voltage = 0x0304 (0.001V)
                    // e3 06 00 00 04 be 00 00
                    i++
                    message.bateryVoltage = parseInt(byteToHexString(data[i + 3]) + byteToHexString(data[i + 4]), 16) / 1000
                    i += 6
                }
            }
        }

        event.emit('onTrackerPositionMessage', message, socket)
    } else if (message.messageId === 0x0900) {
        // Event Message Report
        message.flag = bytebyteToHexString(data[12]) + bytebyteToHexString(data[13]) + byteToHexString(data[14])

        let dataLen = parseInt(byteToHexString(data[15]) + byteToHexString(data[16]), 16)
        if (dataLen > 0) {
            message.eventType = data[17]
            message.time = byteToHexString(data[18]) + '-' + byteToHexString(data[19]) + '-' + byteToHexString(data[20]) + ' ' + byteToHexString(data[21]) + ':' + byteToHexString(data[22]) + ':' + byteToHexString(data[23])
            message.tripNumber = byteToHexString(data[24]) + byteToHexString(data[25]) + byteToHexString(data[26]) + byteToHexString(data[27])
            message.latitude = parseInt(byteToHexString(data[28]) + byteToHexString(data[29]) + byteToHexString(data[30]) + byteToHexString(data[31]), 16) / 1000000
            message.longitude = parseInt(byteToHexString(data[32]) + byteToHexString(data[33]) + byteToHexString(data[34]) + byteToHexString(data[35]), 16) / 1000000

            if (message.eventType === 1) {
                message.tripMileage = 0
                message.totalMileage = parseInt(byteToHexString(data[36]) + byteToHexString(data[37]) + byteToHexString(data[38]) + byteToHexString(data[39]), 16) * 0.01
            } else {
                message.tripMileage = parseInt(byteToHexString(data[36]) + byteToHexString(data[37]) + byteToHexString(data[38]) + byteToHexString(data[39]), 16)
                message.totalMileage = parseInt(byteToHexString(data[40]) + byteToHexString(data[41]) + byteToHexString(data[42]) + byteToHexString(data[43]), 16) * 0.01
            }
        }

        event.emit('onTrackerEventMessage', message, socket)
    } else if (message.messageId === 0x0f01) {
        // Time sync Request
        sendTimeSyncResponse(message.deviceId, message.serialNumber, 1, socket)
    } else if (message.messageId === 0x0300) {
        // Text message up
        message.textMessage = ''
        for (let i = 12; i < (12 + message.length); i++) {
            message.textMessage += String.fromCharCode((data[i]))
        }

        event.emit('onTrackerTextMessage', message, socket)
    } else if (message.messageId === 0x0107) {
        // Unknown
        console.log('Unknown..')
    }
    // console.log(message)
}
function parseOBDData(data) {
    const CMD = 0
    const LEN = 1
    const VALUE = 2
    let __state = CMD

    let __cmd = ''
    let __len = 0
    let __value = ''
    let count = 0

    let obdData = {}

    data.forEach(element => {
        switch (__state) {
            case CMD:
                __cmd += byteToHexString(element)
                count++
                if (count === 2) {
                    __cmd = parseInt(__cmd, 16)
                    __state = LEN
                    count = 0
                }
                break;
            case LEN:
                __len = element
                __state = VALUE
                break;
            case VALUE:
                __value += byteToHexString(element)
                count++
                if (count === __len) {
                    // console.log('*****', __cmd)
                    if (__cmd === 0x0002) {
                        obdData.speed = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0003) {
                        obdData.engineSpeed = parseInt(__value, 16)
                    } else if (__cmd === 0x0004) {
                        obdData.batteryVoltage = parseInt(__value, 16) * 0.001
                    } else if (__cmd === 0x0005) {
                        obdData.totalMileage = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0006) {
                        obdData.fuelConsumptionIdle = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0007) {
                        obdData.fuelConsumptionDriving = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0008) {
                        obdData.engineLoad = parseInt(__value, 16)
                    } else if (__cmd === 0x0009) {
                        obdData.coolantTemperature = parseInt(__value, 16)
                        if (obdData.coolantTemperature > 32767) {
                            obdData.coolantTemperature = obdData.coolantTemperature - 65536
                        }
                    } else if (__cmd === 0x000B) {
                        obdData.map = parseInt(__value, 16)
                    } else if (__cmd === 0x000C) {
                        obdData.mat = parseInt(__value, 16)
                        if (obdData.mat > 32767) {
                            obdData.mat = obdData.mat - 65536
                        }
                    } else if (__cmd === 0x000D) {
                        obdData.intakeFlowRate = parseInt(__value, 16) / 100
                    } else if (__cmd === 0x000E) {
                        obdData.throttlePosition = parseInt(__value, 16) * 100 / 255
                    } else if (__cmd === 0x000F) {
                        obdData.ignitionTiming = parseInt(__value, 16) * 0.5 - 64
                    } else if (__cmd === 0x0050) {
                        obdData.vehicleVIN = parseInt(__value, 16)
                    } else if (__cmd === 0x0051) {
                        obdData.faultCode = parseInt(__value, 16)
                    } else if (__cmd === 0x0052) {
                        obdData.tripId = parseInt(__value, 16)
                    } else if (__cmd === 0x0100) {
                        obdData.tripMileage = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0101) {
                        obdData.totalTripMileage = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0102) {
                        obdData.tripFuelConsumption = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0103) {
                        obdData.totalFuelConsumption = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x0104) {
                        obdData.tripAverageFuelConsumption = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x010C) {
                        obdData.tripAverageSpeed = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x010D) {
                        obdData.tripMaximumSpeed = parseInt(__value, 16) * 0.1
                    } else if (__cmd === 0x010E) {
                        obdData.tripMaximumEngineSpeed = parseInt(__value, 16)
                    } else if (__cmd === 0x010F) {
                        obdData.tripMaximumCoolantTemperature = parseInt(__value, 16)
                        if (obdData.tripMaximumCoolantTemperature > 32767) {
                            obdData.tripMaximumCoolantTemperature = obdData.tripMaximumCoolantTemperature - 65536
                        }
                    } else if (__cmd === 0x0110) {
                        obdData.tripMaximumVoltage = parseInt(__value, 16) * 0.001
                    } else if (__cmd === 0x0112) {
                        obdData.tripRapidAccelerate = parseInt(__value, 16)
                    } else if (__cmd === 0x0113) {
                        obdData.tripRapidDecelerate = parseInt(__value, 16)
                    } else if (__cmd === 0x0116) {
                        obdData.tripRapidStop = parseInt(__value, 16)
                    }

                    count = 0
                    __cmd = ''
                    __len = 0
                    __value = ''
                    __state = CMD
                }
                break;
        }
    });

    return obdData
}


// =========== Message to Tracker =================
function sendLoginResponse(bodyData, deviceId, serialNumber, result, socket) {
    // 7E
    // 81 00
    // <body length 2 byte>
    // <device id>
    // <serialNumber tracker>

    // <serialNumber server>
    // <result>
    // <body data>
    // <crc>
    // 7E
    if (result === 0) {
        bodyData = stringToASCIIArray(bodyData)
    } else {
        bodyData = []
    }   

    let message = [0x81, 0x00]

    let length = decTo2ByteArray(bodyData.length + 3)
    message.push(length[0])
    message.push(length[1])

    deviceId = stringHexToByteArray(deviceId)
    message = message.concat(deviceId)

    serialNumber = stringHexToByteArray(serialNumber)
    message = message.concat(serialNumber)
    
    message = message.concat(serialNumber)
    message.push(result)
    message = message.concat(bodyData)

    let crc = checkSum(message)
    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(crc)
    packet.push(0x7E)

    // console.log('Response Login Packet..')
    // console.log(byteArrayToHex(packet))

    socket.write(Buffer.from(packet))
}
function sendGeneralResponse(messageId, deviceId, serialNumber, result, socket) {
    // 7E
    // 80 01
    // 03
    // <device id>
    // <serialNumber tracker>
    // <serialNumber server>
    // <response message id>
    // <result>
    // <crc>
    // 7E

    let message = [0x80, 0x01]

    message.push(0)
    message.push(5)

    deviceId = stringHexToByteArray(deviceId)
    message = message.concat(deviceId)

    serialNumber = stringHexToByteArray(serialNumber)
    message = message.concat(serialNumber)

    message = message.concat(serialNumber)

    messageId = decTo2ByteArray(messageId)
    message = message.concat(messageId)

    message.push(result)
    let crc = checkSum(message)
    message.push(crc)

    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(0x7E)

    // console.log('sendGeneralResponse')
    // console.log(byteArrayToHex(packet))

    socket.write(Buffer.from(packet))
}
function sendTimeSyncResponse(deviceId, serialNumber, result, socket) {
    // 7E
    // 8F 01
    // 00 07
    // <device id>
    // <serialNumber tracker>

    // <result>
    // <datetime YYMMDDhhmmss>
    // <crc>
    // 7E

    let message = [0x8F, 0x01]

    message.push(0)
    message.push(7)

    deviceId = stringHexToByteArray(deviceId)
    message = message.concat(deviceId)

    serialNumber = stringHexToByteArray(serialNumber)
    message = message.concat(serialNumber)

    message.push(result)

    const dates = new Date()
    let datetime = dates.getFullYear().toString().substr(2, 2) + (dates.getMonth() + 1).toString().padStart(2, '0') + dates.getDate().toString().padStart(2, '0')
    datetime = datetime + dates.getHours().toString().padStart(2, '0') + dates.getMinutes().toString().padStart(2, '0') + dates.getSeconds().toString().padStart(2, '0')
    // console.log(datetime)
    datetime = stringHexToByteArray(datetime)
    message = message.concat(datetime)

    let crc = checkSum(message)
    message.push(crc)

    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(0x7E)

    // console.log('sendGeneralResponse')
    // console.log(byteArrayToHex(packet))

    socket.write(Buffer.from(packet))
}
function sendTextMessage(deviceId, serialNumber, flaq, textMessage, socket) {
    // 7E
    // 0x8300
    // <body length>
    // <device id>
    // <serialNumber tracker>

    // <flaq>
    // <Message Content (max 1024)>
    // <crc>
    // 7E

    let message = [0x83, 0x00]

    message.push(0)
    message.push(7)

    deviceId = stringHexToByteArray(deviceId)
    message = message.concat(deviceId)

    serialNumber = stringHexToByteArray(serialNumber)
    message = message.concat(serialNumber)

    message.push(flaq)

    textMessage = stringToASCIIArray(textMessage)
    message = message.concat(textMessage)

    let crc = checkSum(message)
    message.push(crc)

    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(0x7E)

    // console.log('sendTextMessage')
    // console.log(byteArrayToHex(packet))

    socket.write(Buffer.from(packet))
}


//========
function byteToHexString(data) {
    return data.toString(16).padStart(2, '0')
}
function stringToASCIIArray(str) {
    let a = str.split('').map(function (c) { return c.charCodeAt(0); })
    return a
}
function decTo2ByteArray(decValue) {
    decValue = decValue & 0xffff
    decValue = decValue.toString(16).padStart(4, '0')

    return [
        parseInt(decValue.substr(0, 2), 16),
        parseInt(decValue.substr(2, 2), 16)
    ]
}
function stringHexToByteArray(hexValue) {
    if (hexValue.length % 2 === 1) {
        hexValue = '0' + hexValue
    }

    const numChunks = Math.ceil(hexValue.length / 2)
    let chunks = []
    for (let i = 0, o = 0; i < numChunks; ++i, o += 2) {
        chunks[i] = parseInt(hexValue.substr(o, 2), 16)
    }

    return chunks
}
function byteArrayToHex(arrayData) {
    // let a = arrayData.map(function (c) { return (c.toString(16).padStart(2, '0') + ' ') })
    let a = ''
    arrayData.forEach(element => {
        a += element.toString(16).padStart(2, '0') + ' '
    });
    return a
}


module.exports = {
    device: {
        sendLoginResponse: sendLoginResponse,
        sendGeneralResponse: sendGeneralResponse,
        sendTextMessage: sendTextMessage
    },
    event: event,
}
