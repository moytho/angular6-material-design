export default class Utils {

    static doSomething(val: string) { return val; }
    static doSomethingElse(val: string) { return val; }
    static getUrlAPI(){
        return 'your-api-key';
    }
    static determineId(id: any): string {
        if (id.constructor.name === 'array' && id.length > 0) {
           return '' + id[0];
        }
        return '' + id;
    }
    
    static compareByValue(f1: any, f2: any) { 
        return f1 && f2 && f1.name === f2.name; 
    }
    
}