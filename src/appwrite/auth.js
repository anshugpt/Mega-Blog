import config from "../config/config";
import {Client, Account, ID} from 'appwrite'

export class AuthService {
    client = new Client();
    account;

    constructor () {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectID);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try {
            const newAccount = await this.account.create(ID.unique(), email, password, name);
            if (newAccount) {
                // call login method
                return this.login({email, password});
            } else {
                return newAccount;
            }
        } catch (error) {
            console.log(`Error :: createAccount :: error :: ${error}`);
        } 
    }

    async login({email, password}) {
        try {
           return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log(`Error :: login :: error :: ${error}`);
        }
    }

    async getUserStatus(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log(`Error :: getUserStatus :: error :: ${error}`);
        }
        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log(`Error :: logout :: error :: ${error}`);
        }
    }
}

const authService = new AuthService();

export default authService

