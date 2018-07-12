const cci = require('../interfaces/cci.interface');

let interface = new cci("/dev/tty.wchusbserial1420");

let credit = 1.5;


interface.on('status', (request, response) => {
    console.log('Status: %o', request);
});

interface.on('credit', (request, response) => {
    console.log('Credit: %o', request);
    response.creditOrPrice = credit;
});

interface.on('vend', (request, response) => {
    console.log('Vend: %o', request);
    //aktiv inaktiv
});

interface.on('inquiry', (request, response) => {
    console.log('inquiry: %o', request);
    let price = interface.getPrice(0, request.product);

    if(!price)
        return;

    if(price <= credit)
        response.status = true;

    credit -= price;
});

interface.open();