(() => {
    class Client {
        constructor() {
            console.log('init');
            this.socket = null;
            this.devices = [];
            this.url = window.location.hostname;
        }

        setup() {
            let client = this;

            client.wsConnect();

            let startLearnForm = $('#startLearnForm');
            startLearnForm.submit(function (event) {
                client.startLearn((res) => {
                    this.logMessage(res);
                });
                event.preventDefault();
            });
        }

        logMessage(mesg) {
            let consoleCard = $('#consoleCard');
            consoleCard.append('<samp>'+mesg+'</samp>');
        }

        wsConnect() {
            let wsUrl = 'ws://'+this.url+':1337/events/websocket';
            let socket = new WebSocket(wsUrl);
            socket.onopen = (event) => {
                this.logMessage('[websocket] Connected');
                setInterval(() => {
                    socket.send(JSON.stringify({ ping: true }));
                }, 1000);
            };
            socket.onmessage = (event) => {
                this.onMessage(JSON.parse(event.data));
            };
            this.socket = socket;
        }

        startLearn(email, password, env, next) {
            let url = this.url + "/oauth/oauth/v2/token";

            $.post(url, (res) => {
                next(null, res);
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