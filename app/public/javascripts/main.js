(() => {
    class Client {
        constructor() {
            console.log('init');
            this.socket = null;
            this.devices = [];
            this.url = window.location.hostname;
            this.fullUrl = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');
        }

        setup() {
            let client = this;

            client.wsConnect();

            let startLearnForm = $('#startLearnForm');
            startLearnForm.submit(function (event) {
                client.startLearn((res) => {
                    console.log(res);
                    client.logMessage(res);
                });
                event.preventDefault();
            });
        }

        logMessage(mesg) {
            let consoleCard = $('#consoleCard');
            var json = JSON.stringify(mesg);
            consoleCard.append('<samp>'+json+'</samp>');
        }

        wsConnect() {
            let wsUrl = 'ws://'+this.url+':1337/';
            let socket = new WebSocket(wsUrl);
            socket.onopen = (event) => {
                this.logMessage('[websocket] Connected');
                setInterval(() => {
                    socket.send(JSON.stringify({ ping: true }));
                }, 1000);
            };
            socket.onmessage = (event) => {
                this.logMessage(JSON.parse(event.data));
            };
            this.socket = socket;
        }

        startLearn(next) {
            let url = this.fullUrl + "/start-learn";

            $.post(url, (res) => {
                next(res);
            }).fail(() => {
                alert('StartLearn failed');
            });
        }
        
        run() {
            this.setup();
        }    
    }
    let client = new Client();
    client.run();
})();