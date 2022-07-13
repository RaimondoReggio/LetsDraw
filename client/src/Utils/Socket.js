import {io} from "socket.io-client";
//import { SOCKET_URL } from "config";

export default class Socket {
    static SOCKET_URL = "localhost:5000"

    constructor(controller) {
        this.socket = null;
        this.controller = controller;
    }

    connect(JWT, addr = Socket.SOCKET_URL) { 
        if(this.socket == null) {
            this.socket = io (addr, {
                query: "token=" + JWT
            })

            if(addr !== Socket.SOCKET_URL) {
                this.socket.on("connect", () => {
                    this.drawing_topics();
                    this.neural_guess();
                    this.other_player_lines_update(); 
                })
            }

            console.log("In connect:")
            console.log(this.socket)
        }
    }

    enqueue_lobby() {
        console.log(this.socket);
        this.socket.emit('join-queue', localStorage.getItem("token"));
    }
    
    dequeue_lobby() {
        this.socket.emit('leave-queue');
    }

    update_queue_count() {
        this.socket.on("update-queue-count", (value) => {
            this.controller.updateLobbyCount(value);
        });
    }

    start_game() {
        this.socket.on("start_game", (value) => {
            localStorage.setItem("players_ingame", JSON.stringify(value.players));
            this.controller.connectGameSocket(value.game_server);
            this.controller.updateIsStartObserve(true);
            console.log("naviga App");
        });
    }

    login_connect(token) {
        this.socket.emit("login-event", token);
    }


    upload_event(lines) {
        this.socket.emit("upload-event", lines);
    }


    neural_guess() {
        console.log(this.socket)
        this.socket.on("neural-guess", (pred) => {
            this.controller.updateMatchedWord(pred);
        })
    }

    other_player_lines_update() {
        this.socket.on("other-player-lines-update", (message) => {
            console.log("\t Ricevuto: ",message.id);
            this.controller.updateWatchLive(message);
        })
    }

    drawing_topics() {
        this.socket.on("drawing-topics", (topics) => {
            console.log(topics);
            this.controller.updateWordToDrow1(topics.topic1);
            this.controller.updateWordToDrow2(topics.topic2);
        })
    }

}