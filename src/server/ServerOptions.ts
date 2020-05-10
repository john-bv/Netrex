export interface ServerOptions {
    ServerName: string;
    Server_IP: string;
    Port: number;
    MOTD: string;
    MaxPlayers: number;
    DefaultGamemode: number; // 0 for survival, 1 for creative
    EnableQuery: boolean; //true for yes, false for no
    EnableRCON: boolean; //true for yes, false for no
    RCONPassword: string;
    World: string; //Name of server world
    AutoSave: boolean //true for yes, false for no
    PVP: boolean; //true for yes, false for no
    Hardcore: boolean; //true for yes, false fo rno
}
