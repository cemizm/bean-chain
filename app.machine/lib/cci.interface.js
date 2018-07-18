var SerialPort = require('serialport');

String.prototype.pad = function(size) {
    var s = this;
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

const States = {
    WaitForSTX: 0,
    WaitForETX: 1,
    WaitForETB: 2
}

const Delimiters = {
    STX: 0x02,
    ETX: 0x03,
    ETB: 0x17,
}

const Responses = {
    ACK: 0x06,
    NACK: 0x15
}

const TelegramTypes = {
    Vend: 'V'.charCodeAt(0),
    Status: 'S'.charCodeAt(0),
    Credit: 'C'.charCodeAt(0),
    Price: 'P'.charCodeAt(0),
    Inquiry: 'I'.charCodeAt(0),
    Identification: 'X'.charCodeAt(0),
    MachineMode: 'M'.charCodeAt(0),
    Parameter: 'E'.charCodeAt(0),
    Amount: 'B'.charCodeAt(0)
}

const InterfaceTypes = {

}

class Utils {
    static calculateChecksum(data) {
        let checksum = 0;
        for (const value of data.values()) {
            checksum = checksum ^ value;
        }

        //console.log("%o -> %s", data, checksum.toString(16).pad(2).toUpperCase())

        return Buffer.from(checksum.toString(16).pad(2).toUpperCase(), 'ascii').readUInt16BE();
    }
}

module.exports = class CCIParser {
    constructor(port) {
        this.port = new SerialPort(port, {autoOpen: false});

        this.state = States.WaitForSTX;
        this.data = null;

        this.cbs = {};
        this.prices = {}

        this.port.on('data', (rawdata) => {
            rawdata.forEach(async (value) => await this._handleInput(value));
        });
    }

    open() {
        this.port.open();
    }

    on(type, cb) {
        this.cbs[type] = cb;
    }

    getPricelist() {
        return this.prices;
    }

    getPrice(pricelist, product) {
        if(!this.prices[pricelist])
            return null;

        return this.prices[pricelist][product]
    }

    setPrice(pricelist, product, price) {
        if(!this.prices[pricelist])
            this.prices[pricelist] = {};
        
        this.prices[pricelist][product] = price;
    }

    async _execCallback(name, request, response){
        if(!this.cbs[name])
            return;

        await this.cbs[name](request, response);
    }

    async _handleInput(char) {
        switch(this.state){
            case States.WaitForSTX:
                if(char === Delimiters.STX)
                    this.state = States.WaitForETX;
    
                this.data = [char]
                break;
            case States.WaitForETX:
                if(this.data == null)
                    return;

                this.data.push(char);

                if(char === Delimiters.ETX) {
                    this.state = States.WaitForETB;
                    return;
                }
                break;
            case States.WaitForETB:
                if(this.data == null)
                    return;

                this.data.push(char);

                if(char === Delimiters.ETB) {
                    this.state = States.WaitForSTX;
                    let tmp = this.data;
                    this.data = null;
                    await this._handleTelegram(tmp);
                    return;
                }
                
                break;
        }
    }

    async _handleTelegram(data) {
        let buffer = Buffer.from(data);

        let type = buffer.readUInt8(1);
        let payload = buffer.slice(2, buffer.length - 4);
        let checksum = buffer.readUInt16BE(buffer.length - 3);

        let calcCheck = Utils.calculateChecksum(buffer.slice(1, buffer.length - 3));

        //console.log("%s Request:  %o (0x%s)", new Date().getTime(), buffer, calcCheck.toString(16));

        if(checksum !== calcCheck) 
            return this.port.write([Responses.NACK]); // invalid checkum
        
        let result = null;
        switch(type){
            case TelegramTypes.Identification:
                result = this.handleIdentification();
                break;
            case TelegramTypes.Status:
                result = this.handleStatus();
                break;
            case TelegramTypes.Credit:
                result = await this.handleCredit(payload);
                break;
            case TelegramTypes.Vend:
                result = this.handleVend(payload);
                break;
            case TelegramTypes.Inquiry:
                result = this.handleInquiry(payload);
                break;
            case TelegramTypes.Price:
                result = this.handlePrice(payload);
                break;
            default:
                this.port.write([Responses.NACK]);
                return console.log("Unknown Type: " + type.toString(16));
        }
    
        this.port.write([result.status ? Responses.ACK : Responses.NACK]);
    
        if(result.status && result.data) {
            this.handleResponse(type, result.data);
        }
    }

    handleResponse(type, payload) {
        let buffer = Buffer.alloc(payload.length + 6);
    
        let offset = 0;
    
        buffer.writeUInt8(Delimiters.STX, offset++);
        buffer.writeUInt8(type, offset++);

        payload.copy(buffer, offset);
        offset += payload.length;
    
        buffer.writeUInt8(Delimiters.ETX, offset++);

        let checksum = Utils.calculateChecksum(buffer.slice(1, offset));
        buffer.writeUInt16BE(checksum, offset);
        offset += 2;
        
        buffer.writeUInt8(Delimiters.ETB, offset++);
        
        //console.log("%s Response:  %o (0x%s)", new Date().getTime(), buffer, checksum.toString(16));

        this.port.write(buffer);
    }

    handlePrice(payload) {
        let request = {
            pricelist: parseInt(payload.toString('ascii', 0, 1)),
            product: payload.toString('ascii', 1, 4),
            price: parseInt(payload.toString('ascii', 4, 10)) / 100
        }

        this.setPrice(request.pricelist, request.product, request.price);

        let response = {
            status: true
        }

        this._execCallback('price', request, response);

        return response;
    }

    async handleInquiry(payload) {
        let request = {
            product: payload.toString('ascii', 0, 3),
            debit: payload.toString('ascii', 3, 4) == '1'
        }

        let response = {
            status: false
        }

        await this._execCallback('inquiry', request, response);

        let data = Buffer.alloc(1);

        data.write(response.status ? '1' : '0', 0, 1, 'ascii');

        return {status: true, data: data}
    }

    handleVend(payload) {
        let request = {
            mode: payload.toString('ascii', 0, 1) === '1'
        }

        let response = {
            enable: true
        }

        this._execCallback('vend', request, response);

        return {status: response.enable};
    }

    handleCredit(payload) {
        let request = {
            product: payload.toString('ascii', 0, 3),
            exec: parseInt(payload.toString('ascii', 3, 4))
        }

        let response = {
            creditOrPrice: 0
        }

        this._execCallback('credit', request, response);

        let data = Buffer.alloc(7);

        let value = ~~(response.creditOrPrice * 100);

        value = value.toString();
        if(value.length < 6)
            value = value.pad(6);

        data.write(value, 0, 6, 'ascii');       //value
        data.write('2', 6, 1, 'ascii');         //decimal point
        
        return {status: true, data: data};
    }

    handleStatus() {
        let response = {
            status: 0,
            showCredit: true,
            responseTime: 5
        }

        this._execCallback('status', null, response);

        //IF_STAT bit information:
        //Bit 7     -> 1 (always)
        //Bit 5,6   -> X (reserved)
        //Bit 4     -> CREDIT_HIDDEN 
        //Bit 3     -> JUST_RESET
        //Bit 2     -> AB_GELD
        //Bit 1     -> SERVICE
        //Bit 0     -> GRATIS 

        let ifstat = 0;
        ifstat |= 1 << 7;
        ifstat |= (response.showCredit ? 0 : 1) << 4;

        let data = Buffer.alloc(4);
        let offset = 0;

        data.write(response.status.toString(), offset++, 1, 'ascii');   //Status
        data.writeUInt8(ifstat.toString(), offset++);                   //interface status
        data.writeUInt8(0x30 + response.responseTime, offset++);        //TO_PS (time to process transaction before it times out)
        data.writeUInt8(0, offset++);                                   //reserved 

        return {status: true, data: data};
    }

    handleIdentification() {
        let data = Buffer.alloc(8);
        let offset = 0;

        //Interface Type
        data.write('2', offset++, 1, 'ascii');
        //Zahlungssystem 
        data.write('6', offset++, 1, 'ascii');
        data.write('2', offset++, 1, 'ascii');
        //Versionsnummer
        data.write('2', offset++, 1, 'ascii');
        data.write('9', offset++, 1, 'ascii');
        data.write('0', offset++, 1, 'ascii');
        //Level
        data.write('0', offset++, 1, 'ascii');
        data.write('1', offset++, 1, 'ascii');
        
        return {status: true, data: data};
    }
}