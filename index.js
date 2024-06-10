const net = require('net');

function scanPort(host, port, callback) {
    const socket = new net.Socket();
    let isOpen = false;

    socket.setTimeout(2000);

    socket.on('connect', () => {
        isOpen = true;
        socket.destroy();
    });

    socket.on('timeout', () => {
        socket.destroy();
    });

    socket.on('error', (err) => {
        socket.destroy();
    });

    socket.on('close', () => {
        callback(port, isOpen);
    });

    socket.connect(port, host);
}

function scanPorts(host, ports, callback) {
    const results = {};
    let completed = 0;

    ports.forEach((port) => {
        scanPort(host, port, (port, isOpen) => {
            results[port] = isOpen;
            completed++;
            if (completed === ports.length) {
                callback(results);
            }
        });
    });
}

// Example usage
const host = 'localhost';
const ports = [80, 443, 8080];

scanPorts(host, ports, (results) => {
    console.log('Scan results:', results);
});
