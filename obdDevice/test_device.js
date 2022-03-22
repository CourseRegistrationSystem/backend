var net = require('net');

var client = new net.Socket();
client.connect(8989, '127.0.0.1', function () {
    console.log('Connected');
    setTimeout(() => {
        console.log('Send Login Request..')
        // client.write(Buffer.from(loginMessage))
        createLoginMessage()
    }, 5000)
});

client.on('data', function (data) {
    // console.log('Pkt Data: ', byteArrayToHex([...data]))
    serialRx(data, client)
});

client.on('close', function () {
    console.log('Connection closed');
});


//===============
const DEVICE_ID = 0x061213300066
let AuthCode = []
let MSG_STATE = 0

let loginMessage = [
    0x7e,
    01, 00, // message id
    00, 0x2d, // length
    0x06, 0x12, 0x13, 0x30, 0x00, 0x66, //device id
    00, 05, // serial number
    00, 01,
    00, 01,
    0x53, 0x4b, 0x45, 0x52, 0x54,
    0x42, 0x35, 0x30, 0x4c, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00,
    0x06, 0x12, 0x13, 0x30, 0x00, 0x66, 0x00,
    00,
    0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38,
    0x71,
    0x7e
]
let authMessage = [
    0x7e,
    0x01, 0x02,
    0x00, 0x10,
    0x06, 0x12, 0x13, 0x30, 0x00, 0x66,
    0x03, 0xc0,
    0x54, 0x52, 0x32, 0x30, 0x31, 0x37, 0x31, 0x30, 0x31, 0x38, 0x30, 0x39, 0x30, 0x30, 0x31, 0x37,
    0x84,
    0x7e
]
let positionMessage = [
    0x7e,
    0x02, 0x00,
    0x00, 0xe0, // 224
    0x06, 0x12, 0x13, 0x30, 0x00, 0x66,
    0x00, 0x00,

    0x00, 0x00, 0x00, 0x00,
    0x00, 0x0c, 0x10, 0x00,
    0x00, 0x17, 0xd6, 0x15,
    0x06, 0x2c, 0xeb, 0x6e,
    0x00, 0x00,
    0x00, 0x00,
    0x00, 0xc7,
    0x21, 0x09, 0x30, 0x22, 0x02, 0x30,

    0x01, 0x04, 0x00, 0x00, 0x01, 0x9c,
    0x02, 0x02, 0x00, 0x00,
    0x03, 0x02, 0x00, 0x00,
    0x25, 0x04, 0x00, 0x00, 0x00, 0x00,
    0x2a, 0x02, 0x00, 0x00,
    0x2b, 0x04, 0x00, 0x00, 0x00, 0x00,
    0x30, 0x01, 0x16,
    0x31, 0x01, 0x00,
    0xe3, 0x06, 0x00, 0x00, 0x04, 0xbe, 0x00, 0x00,

    0xf3, 0x96,
    0x00, 0x02, 0x02, 00, 00,
    0x00, 0x03, 0x02, 00, 00,
    0x00, 0x04, 0x02, 0x2f, 0x6c,
    0x00, 0x05, 0x04, 00, 00, 00, 00,
    0x00, 0x06, 0x02, 00, 00,
    0x00, 0x07, 0x02, 00, 00,
    0x00, 0x08, 0x01, 00,
    0x00, 0x09, 0x02, 00, 00,
    0x00, 0x0b, 0x02, 00, 00,
    0x00, 0x0c, 0x02, 00, 00,
    0x00, 0x0d, 0x02, 00, 00,
    0x00, 0x0e, 0x01, 00,
    0x00, 0x0f, 0x01, 00,
    0x00, 0x52, 0x04, 00, 00, 00, 00,
    0x01, 0x00, 0x02, 00, 00,
    0x01, 0x01, 0x04, 00, 00, 00, 00,
    0x01, 0x02, 0x02, 00, 00,
    0x01, 0x03, 0x04, 00, 00, 00, 00,
    0x01, 0x04, 0x02, 00, 00,
    0x01, 0x0c, 0x02, 00, 00,
    0x01, 0x0d, 0x02, 00, 00,
    0x01, 0x0e, 0x02, 00, 00,
    0x01, 0x0f, 0x02, 00, 00,
    0x01, 0x10, 0x02, 00, 00,
    0x01, 0x11, 0x02, 00, 00,
    0x01, 0x12, 0x02, 00, 00,
    0x01, 0x13, 0x02, 00, 00,
    0x01, 0x14, 0x02, 00, 00,
    0x01, 0x16, 0x02, 00, 00,

    0x95,
    0x7e
]

// ===========================
const RX_HEADER = 0;
const RX_MESSAGE_ID = 1;
const RX_BODY_LEN = 2;
const RX_DEVICE_ID = 3;
const RX_SERIAL_NUMBER = 4;
const RX_DATA = 5;
const RX_CRC = 6;
const RX_END = 7;

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

                if (checkSum(uidArray) !== crc) {
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

    return cSum & 0xFF
}
function parseTrackerMessage(data, socket) {
    // console.log('Body Data: ', byteArrayToHex([...data]))
    let message = {
        messageId: parseInt(byteToHexString(data[0]) + byteToHexString(data[1]), 16),
        length: parseInt(byteToHexString(data[2]) + byteToHexString(data[3]), 16),
        deviceId: byteToHexString(data[4]) + byteToHexString(data[5]) + byteToHexString(data[6]) + byteToHexString(data[7]) + byteToHexString(data[8]) + byteToHexString(data[9]),
        serialNumber: byteToHexString(data[10]) + byteToHexString(data[11])
    }

    if (message.messageId === 0x8001) {
        // 0x8001 Universal Respond of Server
        // Send Position Message

        let serialNUmber = parseInt(byteToHexString(data[12]) + byteToHexString(data[13]), 16)
        let responseID = parseInt(byteToHexString(data[14]) + byteToHexString(data[15]), 16)
        let result = data[16]

        if (MSG_STATE === 0) {
            // console.log(responseID, result)
            if (responseID === 0x0102) {
                if (result === 0) {
                    MSG_STATE = 1
                    console.log('Send Position Message')
                    // Start send Data
                    sendDataPosition()
                } else {
                    console.log('Fail: ', result)
                }
            }
        }
    } else if (message.messageId === 0x8100) {
        // 0x8100 Login Respond
        let responseID = parseInt(byteToHexString(data[12]) + byteToHexString(data[13]), 16)
        let result = data[14]
        let value = []

        if (result === 0) {
            // console.log(message.length)
            for (let j = 15; j < (12 + message.length); j++) {
                // value += String.fromCharCode((data[j]))
                value.push(data[j])
            }
            AuthCode = value
            // console.log(AuthCode)
            // Send AuthMessage
            console.log('Send Auth Request')
            // socket.write(Buffer.from(authMessage))
            createAuthMessage(AuthCode)
        } else {
            console.log('Fail to Login: ', result)
            setTimeout(() => {
                console.log('Send Login Request..')
                createLoginMessage()
            }, 10000)
        }
    } else if (message.messageId === 0x8F01) {
        // 0x8F01 Time sync Respond
    } else if (message.messageId === 0x8300) {
        // 0x8300 Text message down (1024 e maximum, GBK(ASCII) )
    }
}

//========
function byteToHexString(data) {
    // 25 => '19'
    return data.toString(16).padStart(2, '0')
}
function stringToASCIIArray(str) {
    // 'abc123' => [,,, 49, 50, 51]
    let a = str.split('').map(function (c) { return c.charCodeAt(0); })
    return a
}
function decTo2ByteArray(decValue) {
    // 2489 => [9, 185]
    decValue = decValue & 0xffff
    decValue = decValue.toString(16).padStart(4, '0')

    return [
        parseInt(decValue.substr(0, 2), 16),
        parseInt(decValue.substr(2, 2), 16)
    ]
}
function decTo4ByteArray(decValue) {
    // 2489 => [0, 0, 9, 185]
    decValue = decValue.toString(2).padStart(32, '0')
    decValue = decValue.substr(decValue.length - 32, 32)
    // console.log(decValue)
    return [
        parseInt(decValue.substr(0, 8), 2),
        parseInt(decValue.substr(8, 8), 2),
        parseInt(decValue.substr(16, 8), 2),
        parseInt(decValue.substr(24, 8), 2)
    ]
}
function stringHexToByteArray(hexValue) {
    // '051B0A03' => [5, 27, 10, 3]
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
    // [5, 15] => '050E' 
    let a = ''
    arrayData.forEach(element => {
        a += element.toString(16).padStart(2, '0') + ' '
    });
    return a
}

function createLoginMessage() {
    // 0x7e,
    // 01, 00, // message id
    // 00, 0x2d, // length
    // 0x06, 0x12, 0x13, 0x30, 0x00, 0x66, //device id
    // 00, 05, // serial number

    // 00, 01,
    // 00, 01,
    // 0x53, 0x4b, 0x45, 0x52, 0x54,
    // 0x42, 0x35, 0x30, 0x4c, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00,
    // 0x06, 0x12, 0x13, 0x30, 0x00, 0x66, 0x00,
    // 00,
    // 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38,

    // 0x71,
    // 0x7e    

    let proviceId = [0, 1]
    let cityId = [0, 1]
    let factoryId = [0x53, 0x4b, 0x45, 0x52, 0x54]
    let terminalId = [0x42, 0x35, 0x30, 0x4c, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00]
    let terminalString = [0x06, 0x12, 0x13, 0x30, 0x00, 0x66, 0x00]
    let colorCar = 0
    let carNUmber = 'JJJ1234'

    let bodyData = []
    bodyData = bodyData.concat(proviceId)
    bodyData = bodyData.concat(cityId)
    bodyData = bodyData.concat(factoryId)
    bodyData = bodyData.concat(terminalId)
    bodyData = bodyData.concat(terminalString)
    bodyData.push(colorCar)
    bodyData = bodyData.concat(stringToASCIIArray(carNUmber))


    let message = []
    cmd = decTo2ByteArray(0x0100)
    message = message.concat(cmd)

    let length = decTo2ByteArray(bodyData.length)
    message.push(length[0])
    message.push(length[1])

    let deviceId = stringHexToByteArray(DEVICE_ID.toString(16))
    deviceId = deviceId.slice(deviceId.length - 6, 6)
    message = message.concat(deviceId)

    let serialNumber = 1
    serialNumber = decTo2ByteArray(serialNumber)
    message = message.concat(serialNumber)

    message = message.concat(bodyData)

    let crc = checkSum(message)
    message.push(crc)

    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(0x7E)
    // console.log(byteArrayToHex(packet))

    client.write(Buffer.from(packet))
}
function createAuthMessage(authCode) {
    // 7E
    // cmd
    // <body length 2 byte>
    // <device id>
    // <serialNumber tracker>
    // <body data>
    // <crc>
    // 7E

    // 0x7e,
    // 0x01, 0x02,
    // 0x00, 0x10,
    // 0x06, 0x12, 0x13, 0x30, 0x00, 0x66,
    // 0x03, 0xc0,
    // 0x54, 0x52, 0x32, 0x30, 0x31, 0x37, 0x31, 0x30, 0x31, 0x38, 0x30, 0x39, 0x30, 0x30, 0x31, 0x37,
    // 0x84,
    // 0x7e


    let message = []
    cmd = decTo2ByteArray(0x0102)
    message = message.concat(cmd)

    let length = decTo2ByteArray(authCode.length)
    message.push(length[0])
    message.push(length[1])

    let deviceId = stringHexToByteArray(DEVICE_ID.toString(16))
    deviceId = deviceId.slice(deviceId.length - 6, 6)
    message = message.concat(deviceId)

    let serialNumber = 1
    serialNumber = decTo2ByteArray(serialNumber)
    message = message.concat(serialNumber)

    message = message.concat(authCode)

    let crc = checkSum(message)
    message.push(crc)

    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(0x7E)
    // console.log(byteArrayToHex(packet))

    client.write(Buffer.from(packet))
}
function createMessageData(cmd, deviceId, serialNumber, data) {
    // 7E
    // cmd
    // <body length 2 byte>
    // <device id>
    // <serialNumber tracker>
    // <body data>
    // <crc>
    // 7E

    let bodyData = []

    let alarm = '0' + data.alarm.alarmOverSpeed.toString()
    alarm += data.alarm.tired.toString() + '000'
    alarm += data.alarm.lowPower.toString() + data.alarm.remove.toString() + '000000'
    alarm += data.alarm.motion.toString() + '0000000000000'
    alarm += data.alarm.crash.toString() + '00'
    alarm = parseInt(alarm, 2)
    alarm = decTo4ByteArray(alarm)
    bodyData = bodyData.concat(alarm)

    let status = '' + data.status.acc.toString() + data.status.gps.toString() + data.status.latitude.toString() + data.status.logitude.toString()
    status += '0000000000000000000000000000'
    status = parseInt(status, 2)
    status = decTo4ByteArray(status)
    bodyData = bodyData.concat(status)

    data.latitude = decTo4ByteArray(data.latitude * 1000000)
    bodyData = bodyData.concat(data.latitude)

    data.longitude = decTo4ByteArray(data.longitude * 1000000)
    bodyData = bodyData.concat(data.longitude)

    data.altitude = decTo2ByteArray(data.altitude)
    bodyData = bodyData.concat(data.altitude)

    data.speed = decTo2ByteArray(data.speed)
    bodyData = bodyData.concat(data.speed)

    data.direction = decTo2ByteArray(data.direction)
    bodyData = bodyData.concat(data.direction)

    const dates = new Date()
    let datetime = dates.getFullYear().toString().substr(2, 2) + (dates.getMonth() + 1).toString().padStart(2, '0') + dates.getDate().toString().padStart(2, '0')
    datetime = datetime + dates.getHours().toString().padStart(2, '0') + dates.getMinutes().toString().padStart(2, '0') + dates.getSeconds().toString().padStart(2, '0')
    datetime = stringHexToByteArray(datetime)
    bodyData = bodyData.concat(datetime)


    let extData = []

    data.mileageOnMeter = decTo4ByteArray(data.mileageOnMeter * 10)
    extData.push(0x01)
    extData.push(4)
    extData = extData.concat(data.mileageOnMeter)

    data.fuel = decTo2ByteArray(data.fuel * 10)
    extData.push(0x02)
    extData.push(2)
    extData = extData.concat(data.fuel)

    data.extendStatus = decTo4ByteArray(data.extendStatus)
    extData.push(0x25)
    extData.push(4)
    extData = extData.concat(data.extendStatus)

    data.ioStatus = decTo2ByteArray(data.ioStatus)
    extData.push(0x2A)
    extData.push(2)
    extData = extData.concat(data.ioStatus)

    extData.push(0x30)
    extData.push(1)
    extData.push(data.networkSignal)

    extData.push(0x31)
    extData.push(1)
    extData.push(data.numberSatellite)

    data.bateryVoltage = decTo2ByteArray(data.bateryVoltage * 1000)
    let battery = [0, 0, data.bateryVoltage[0], data.bateryVoltage[1], 0, 0]
    extData.push(0xE3)
    extData.push(6)
    extData = extData.concat(battery)

    let obdData = []
    data.obdData.speed = decTo2ByteArray(data.obdData.speed * 10)
    obdData.push(0x00)
    obdData.push(0x02)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.speed)

    data.obdData.engineSpeed = decTo2ByteArray(data.obdData.engineSpeed)
    obdData.push(0x00)
    obdData.push(0x03)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.engineSpeed)

    data.obdData.batteryVoltage = decTo2ByteArray(data.obdData.batteryVoltage * 1000)
    obdData.push(0x00)
    obdData.push(0x04)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.batteryVoltage)

    data.obdData.totalMileage = decTo4ByteArray(data.obdData.totalMileage * 10)
    obdData.push(0x00)
    obdData.push(0x05)
    obdData.push(4)
    obdData = obdData.concat(data.obdData.totalMileage)

    data.obdData.fuelConsumptionIdle = decTo2ByteArray(data.obdData.fuelConsumptionIdle * 10)
    obdData.push(0x00)
    obdData.push(0x06)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.fuelConsumptionIdle)

    data.obdData.fuelConsumptionDriving = decTo2ByteArray(data.obdData.fuelConsumptionDriving * 10)
    obdData.push(0x00)
    obdData.push(0x07)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.fuelConsumptionDriving)

    obdData.push(0x00)
    obdData.push(0x08)
    obdData.push(1)
    obdData.push(data.obdData.engineLoad)

    if (data.obdData.coolantTemperature < 0) {
        // -1 = 65535
        // -2 = 65534
        // -3 = 65533
        // -32768 = 32766
        // -32767 = 0x8001 
        data.obdData.coolantTemperature = 65536 - data.obdData.coolantTemperature
    }
    data.obdData.coolantTemperature = decTo2ByteArray(data.obdData.coolantTemperature)
    obdData.push(0x00)
    obdData.push(0x09)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.coolantTemperature)

    data.obdData.map = decTo2ByteArray(data.obdData.map)
    obdData.push(0x00)
    obdData.push(0x0B)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.map)

    if (data.obdData.mat < 0) {
        // -1 = 65535
        // -2 = 65534
        // -3 = 65533
        // -32768 = 32766
        // -32767 = 0x8001 
        data.obdData.mat = 65536 - data.obdData.mat
    }
    data.obdData.mat = decTo2ByteArray(data.obdData.mat)
    obdData.push(0x00)
    obdData.push(0x0C)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.mat)

    data.obdData.intakeFlowRate = decTo2ByteArray(data.obdData.intakeFlowRate * 100)
    obdData.push(0x00)
    obdData.push(0x0D)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.intakeFlowRate)

    obdData.push(0x00)
    obdData.push(0x0E)
    obdData.push(1)
    obdData.push(data.obdData.throttlePosition)

    obdData.push(0x00)
    obdData.push(0x0F)
    obdData.push(1)
    obdData.push(data.obdData.ignitionTiming)

    data.obdData.tripId = decTo4ByteArray(data.obdData.tripId)
    obdData.push(0x00)
    obdData.push(0x52)
    obdData.push(4)
    obdData = obdData.concat(data.obdData.tripId)

    data.obdData.tripMileage = decTo2ByteArray(data.obdData.tripMileage * 10)
    obdData.push(0x01)
    obdData.push(0x00)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripMileage)

    data.obdData.totalMileage = decTo4ByteArray(data.obdData.totalMileage * 10)
    obdData.push(0x01)
    obdData.push(0x01)
    obdData.push(4)
    obdData = obdData.concat(data.obdData.totalMileage)

    data.obdData.tripFuelConsumption = decTo2ByteArray(data.obdData.tripFuelConsumption * 10)
    obdData.push(0x01)
    obdData.push(0x02)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripFuelConsumption)

    data.obdData.totalFuelConsumption = decTo4ByteArray(data.obdData.totalFuelConsumption * 10)
    obdData.push(0x01)
    obdData.push(0x03)
    obdData.push(4)
    obdData = obdData.concat(data.obdData.totalFuelConsumption)

    data.obdData.tripAverageFuelConsumption = decTo2ByteArray(data.obdData.tripAverageFuelConsumption * 10)
    obdData.push(0x01)
    obdData.push(0x04)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripAverageFuelConsumption)

    data.obdData.tripAverageSpeed = decTo2ByteArray(data.obdData.tripAverageSpeed * 10)
    obdData.push(0x01)
    obdData.push(0x0C)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripAverageSpeed)

    data.obdData.tripMaximumSpeed = decTo2ByteArray(data.obdData.tripMaximumSpeed * 10)
    obdData.push(0x01)
    obdData.push(0x0D)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripMaximumSpeed)

    data.obdData.tripMaximumEngineSpeed = decTo2ByteArray(data.obdData.tripMaximumEngineSpeed)
    obdData.push(0x01)
    obdData.push(0x0E)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripMaximumEngineSpeed)

    data.obdData.tripMaximumCoolantTemperature = decTo2ByteArray(data.obdData.tripMaximumCoolantTemperature)
    obdData.push(0x01)
    obdData.push(0x0F)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripMaximumCoolantTemperature)

    data.obdData.tripMaximumVoltage = decTo2ByteArray(data.obdData.tripMaximumVoltage * 1000)
    obdData.push(0x01)
    obdData.push(0x10)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripMaximumVoltage)

    data.obdData.tripRapidAccelerate = decTo2ByteArray(data.obdData.tripRapidAccelerate)
    obdData.push(0x01)
    obdData.push(0x12)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripRapidAccelerate)

    data.obdData.tripRapidDecelerate = decTo2ByteArray(data.obdData.tripRapidDecelerate)
    obdData.push(0x01)
    obdData.push(0x13)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripRapidDecelerate)

    data.obdData.tripRapidStop = decTo2ByteArray(data.obdData.tripRapidStop)
    obdData.push(0x01)
    obdData.push(0x16)
    obdData.push(2)
    obdData = obdData.concat(data.obdData.tripRapidStop)

    extData.push(0xF3)
    extData.push(obdData.length)
    extData = extData.concat(obdData)

    bodyData = bodyData.concat(extData)


    let message = []
    cmd = decTo2ByteArray(cmd)
    message = message.concat(cmd)

    let length = decTo2ByteArray(bodyData.length)
    message.push(length[0])
    message.push(length[1])

    deviceId = stringHexToByteArray(deviceId.toString(16))
    deviceId = deviceId.slice(deviceId.length - 6, 6)
    message = message.concat(deviceId)

    serialNumber = decTo2ByteArray(serialNumber)
    message = message.concat(serialNumber)

    message = message.concat(bodyData)

    let crc = checkSum(message)
    message.push(crc)
    // console.log('CRC: ',crc)

    message = checkEscape(message)

    let packet = [0x7E]
    packet = packet.concat(message)
    packet.push(0x7E)
    // console.log(byteArrayToHex(packet))

    client.write(Buffer.from(packet))
}


// SImulate Data
let data1 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563427,
    longitude: 103.613132,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // 0-255
        ignitionTiming: 130, // 
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 10, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 1,
        tripRapidDecelerate: 1,
        tripRapidStop: 0
    }
}
let data2 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563515,
    longitude: 103.613194,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 20.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1.1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 10, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 1,
        tripRapidDecelerate: 1,
        tripRapidStop: 0
    }
}
let data3 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563619,
    longitude: 103.613260,
    altitude: 20, // m
    speed: 30.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 35.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 24, //km/h
        tripMaximumSpeed: 35.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 1,
        tripRapidDecelerate: 1,
        tripRapidStop: 0
    }
}
let data4 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563739,
    longitude: 103.613340,
    altitude: 20, // m
    speed: 40.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 40.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 1,
        tripRapidDecelerate: 1,
        tripRapidStop: 0
    }
}
let data5 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563853,
    longitude: 103.613417,
    altitude: 20, // m
    speed: 40.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 40.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 1,
        tripRapidDecelerate: 1,
        tripRapidStop: 0
    }
}
let data6 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563974,
    longitude: 103.613500,
    altitude: 20, // m
    speed: 40.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 40.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 2,
        tripRapidDecelerate: 2,
        tripRapidStop: 0
    }
}
let data7 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.564037,
    longitude: 103.613600,
    altitude: 20, // m
    speed: 40.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 40.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 2,
        tripRapidDecelerate: 2,
        tripRapidStop: 0
    }
}
let data8 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563950,
    longitude: 103.613816,
    altitude: 20, // m
    speed: 30.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 31.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 2,
        tripRapidDecelerate: 2,
        tripRapidStop: 0
    }
}
let data9 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563811,
    longitude: 103.614020,
    altitude: 20, // m
    speed: 30.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 30.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 2,
        tripRapidDecelerate: 2,
        tripRapidStop: 0
    }
}
let data10 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563692,
    longitude: 103.614191,
    altitude: 20, // m
    speed: 30.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 30.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 2,
        tripRapidDecelerate: 2,
        tripRapidStop: 0
    }
}
let data11 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563519,
    longitude: 103.614442,
    altitude: 20, // m
    speed: 25.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 25.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 2,
        tripRapidDecelerate: 2,
        tripRapidStop: 0
    }
}
let data12 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563299,
    longitude: 103.614755,
    altitude: 20, // m
    speed: 25.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 25.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 3,
        tripRapidDecelerate: 3,
        tripRapidStop: 0
    }
}
let data13 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563127,
    longitude: 103.614998,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 3,
        tripRapidDecelerate: 3,
        tripRapidStop: 0
    }
}
let data14 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562921,
    longitude: 103.615311,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 3,
        tripRapidDecelerate: 3,
        tripRapidStop: 0
    }
}
let data15 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562630,
    longitude: 103.615726,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data16 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562275,
    longitude: 103.616256,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data17 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.561977,
    longitude: 103.616708,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data18 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.561772,
    longitude: 103.616996,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data19 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.561476,
    longitude: 103.617227,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data20 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.561377,
    longitude: 103.616477,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data21 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.561241,
    longitude: 103.615546,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data22 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.561421,
    longitude: 103.614755,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data23 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562014,
    longitude: 103.613836,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data24 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562294,
    longitude: 103.613418,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data25 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562484,
    longitude: 103.613136,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data26 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.562938,
    longitude: 103.613428,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data27 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563223,
    longitude: 103.613035,
    altitude: 20, // m
    speed: 10.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 10.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
let data28 = {
    alarm: { alarmOverSpeed: 0, tired: 0, lowPower: 0, remove: 0, motion: 0, crash: 0 },
    status: { acc: 1, gps: 1, latitude: 0, logitude: 0 },
    latitude: 1.563406,
    longitude: 103.613124,
    altitude: 20, // m
    speed: 5.5, // KM
    direction: 20,
    datetime: '',
    mileageOnMeter: 50, // KM
    fuel: 1.5, // L
    extendStatus: 0,
    ioStatus: 0,
    networkSignal: 22,
    numberSatellite: 5,
    bateryVoltage: 1.5, // V
    obdData: {
        speed: 5.5, // km/h
        engineSpeed: 1500, // RPM
        batteryVoltage: 12.14, // V
        totalMileage: 1.4, //km
        fuelConsumptionIdle: 0.1, // 0.1L/h
        fuelConsumptionDriving: 10.5, // 0.1L/100km
        engineLoad: 20, // %
        coolantTemperature: 30, // degrees
        map: 100, // kPa
        mat: 40, // degrees
        intakeFlowRate: 10.35, // g/s
        throttlePosition: 30, // %
        ignitionTiming: 130, // degree
        tripId: 10,
        tripMileage: 1, // km
        totalTripMileage: 1, // km
        tripFuelConsumption: 1.0, // L
        totalFuelConsumption: 1.0, // L
        tripAverageFuelConsumption: 1.0,
        tripAverageSpeed: 10, //km/h
        tripMaximumSpeed: 40.5, //km/h
        tripMaximumEngineSpeed: 1500, //rpm
        tripMaximumCoolantTemperature: 80, // degre celcius
        tripMaximumVoltage: 14.5,
        tripRapidAccelerate: 4,
        tripRapidDecelerate: 3,
        tripRapidStop: 1
    }
}
// ==========
let data = [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, data16, data17, data18, data19, data20, data21, data22, data23, data24, data25, data26, data27, data28]
async function sendDataPosition() {
    try {
        for (let i = 0; i < 28; i++) {
            await delay(5000)
            console.log('Send Data ', (i + 1))
            createMessageData(0x0200, DEVICE_ID, i, data[i])
        }
        client.destroy();
    } catch (error) {
        console.log(error)
    }
}
function delay(delay = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            return resolve()
        }, delay)
    })
}