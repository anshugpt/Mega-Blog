# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Docs for making production level Blog application

## Setup Appwrite
- Make account on [appwrite](https://appwrite.io/).
- Create a project, that will provide you project ID and appwrite URL.
- Create a Database, there is database ID and inside it create a collection where you will find collection ID, In collection go to attribute and create multiple attribute.
- Attribute - **Title, content, blogImg, userId & status**.
- Now go to Storage, create a bucket where you find bucket ID.
- we need five __URL__ all five __URL__ is collected.

## Setup Auth File in React
- Import **Client, Account, ID** from [appwrite](https://appwrite.io/).
- Make a class where we gonna create methods for **Create Account, login, logout, see user status**.
```javascript
import conf from '../conf/conf';
import {Client, Account, ID} from 'appwrite'

export class AuthService {
    client = new Client();
    account;

    constructor () {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
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
```
- We made an object of that class and exported that object so that we can easily access the methods in this class.