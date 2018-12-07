export class Transaction{

    public fromAddress;
    public privateKey;
    public address = [];
    public tokens = [];

    constructor(fromAddress:any, privateKey:any, address :any , tokens:any){
        this.fromAddress = fromAddress;
        this.privateKey = privateKey;
        this.address = address;
        this.tokens = tokens;
    }
}