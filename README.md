# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Docs for making production level Blog application

### Basic Setup 
- Create [Vite](https://vitejs.dev/) App
- **Add Packages**
  - [react-redux](https://www.npmjs.com/package/react-redux)
  - [redux](https://www.npmjs.com/package/redux)
  - [react-router-dom](https://www.npmjs.com/package/react-router-dom)
  - [appwrite](https://appwrite.io/)
  - [tinyMCE](https://www.npmjs.com/package/tinymce)
  - [html-react-parser](https://www.npmjs.com/package/html-react-parser)
  - [react-hook-form](https://www.npmjs.com/package/react-hook-form)
- Make a file in **src** folder __.env__ to store __sensitive info__ and push that into git ignore.
- The sample for EV is :-
```env
VITE_APPWRITE_URL=""
VITE_APPWRITE_PROJECT_ID=""
VITE_APPWRITE_DATABASE_ID=""
VITE_APPWRITE_COLLECTION_ID=""
VITE_APPWRITE_BUCKET_ID=""
``` 
- To access the env data in vite is __import.meta.env.variable_name__, if you made an app with create react app then you can access it by __process.env.variable_name__ but remember you have to start you variable name with __REACT_APP__ 

## Setup Appwrite
- Make account on [appwrite](https://appwrite.io/), so that we have our own URL, password and IDs.
- Create a project, that will provide you project ID and appwrite URL after that paste that url and id into __env__.
- Create a Database, there is database ID and inside it create a collection where you will find collection ID, In collection go to attribute and create multiple attribute now paste that IDs into __env__.
- In collection go to setting -> update permission -> to all user -> enable all __CRUD__.
- Attribute - **Title, content, blogImg, userId & status** where all the key is __string and 255__ where status is __not requried__.
- Go to index -> create index -> __key(status) attribute(status)__
- Now go to Storage, create a bucket(name - image) -> paste bucket ID in env -> go to settings -> update permission -> CRUD.
- we need five __URL__ all five __URL__ is collected.

### Better Way to access ENV in Production App
-Make a folder in __src__ -> __conf__ -> make a file -> __conf.js__ -> make a object and export that object, It will reduce the change of getting a non string URL
```javascript
const conf = {
    appwriteURL : String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectID : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatebaseID : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionID : String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketID : String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}

export default conf
```

## Setup Auth File in React
- Make a folder in src -> appwrite(all the appwrite work will done here) -> make a file -> __auth.js__.
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
- __This type of service is not dependent on any service like we can change our backend service an time we just need to chnage our methods__.

## Setup Database Service
- Make a config file in appwrite -> __config.js__.
- import __conf, Client, ID, Database, Storage, Query__
- Make a class called __Service__ and make its object __service__, export that object.
- In class make Property :-
```javascript
client = new Client();
databases;
bucket; // storage
```
- Now make constructor :-
```javascript
 constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
```
- Now we gonna make a method called __createPost__ that will return a promise so we gonna use __async and await__.
```javascript
async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatebaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log(`Error from :: createPost :: ${error}`);
        }
    }
```
- Now make a __updatePost__ method :-
```javascript
async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatebaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log(`Error from :: updatePost :: ${error}`);
        }
    }
```
- Now make a __deletePost__ method :-
```javascript
async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatebaseID,
                conf.appwriteCollectionID,
                slug
            )
            return true
        } catch (error) {
            console.log(`Error from :: deletePost :: ${error}`);
            return false
        }
    }
```
- Now make a method to get single post __getPost__ :-
```javascript
async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatebaseID,
                conf.appwriteCollectionID,
                slug
            )
        } catch (error) {
            console.log(`Error from :: getPost :: ${error}`);
            return false;
        }
    }
```
- Now make a method to get all the posts __getPosts__ :-
```javascript
async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatebaseID,
                conf.appwriteCollectionID,
                queries
            )
        } catch (error) {
            console.log(`Error from :: getPosts :: ${error}`);
            return false;
        }
    }
```
- Now we gonna write File Uploade part 
- Make a method to __uploadeFile__ :-
```javascript
async uploadeFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log(`Error from :: uploadeFile :: ${error}`);
            return false
        }
    }
```
- Now we need method for __deleteFile__ :-
```javascript
async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileId
            )
            return true
        } catch (error) {
            console.log(`Error from :: deleteFile :: ${error}`);
            return false;
        }
    }
```
- Now we need method to __getFilePreview__ :-
```javascript
getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketID,
            fileId
        )
    }
```
## Setup Redux-Toolkit
- Make a store folder in __src__ -> make a file in it -> __store.js__.
- import __configureStore__ and __reducer__.
- Make a variable store and make configureStore in it and pass the reducer :-
```javascript
const store = configureStore({
    reducer : authReducers
})

export default store;
```
- Export that to use in __provider__ to pass prop.
- We made the store now we need to make slice for auth.
- Make a file in store -> __authSlice.js__.
- Import __createSlice__ from redux.
- Now first we will make __initialState__ :-
```javascript
const initialState = {
    // initial state will be for checking is user logged in or not
    status : false,
    userData : null
}
```
- Now we will create slice named -> __authSlice__ :-
```javascript
const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        login : (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout : (state) => {
            state.status = false,
            state.userData = null;
        }
    }
})
```
- This slice take object with three property __name, initialState, reducers__
- reducers -> __You can call it property or functionality for auth__.
- In this reducers there is two functionality for auth.
- __login and logout__
- To understand more about redux-toolkit see this [redux-toolkit-crash-course](https://www.youtube.com/watch?v=1i04-A7kfFI&list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige&index=15) by [hitesh](https://github.com/hiteshchoudhary)
- Now put __authSlice.reducers__ into a variable :-
```javascript
const authReducers = authSlice.reducer;

export default authReducers;
```
- Export that to use in store
- Now we will export our reducer functionality from __authSlice.actions__ :-
```javascript
export const {login, logout} = authSlice.actions;
```

## Setup App.jsx
- We will make a state __loading__.
- We will use dispatch to send __userData__ to __authSlice__.
- We will use __useEffect__ to get user status.
- We will then render things based on __loading state__
```jsx
import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import {Header, Footer} from './components/index'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getUserStatus()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header/>
        <main>
          {/* <Outlet/> */}
        </main>
        <Footer/>
      </div>
    </div>
  ) : null
}

export default App
```
- We can render our __Layout__ if loading is false or if true then we can provide __sign up page__.
- Now Important thing go to __main.jsx__ -> import __Provider and store__ -> wrap __app component__ with __Provider__ and pass the prop named __store__ in Provider.
```jsx
<Provider store={store}>
    <App />
    </Provider>
```