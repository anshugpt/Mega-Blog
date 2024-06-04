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

## Production Grade Component
- Input
  - We will make a separate component for input.
  - So that we can use it different place.
- Make a __container__ folder in __components__ -> make a file in it -> __Container.jsx__.
  - that's a common thing to make. 
  // add more details about container
```jsx
import React from "react";

export default function Container({children}){
    return <div className="w-full max-w-7xl mx-auto px-4">{children}</div>; 
}
```
- In coperate, we will see this **one line syntaxt** to return.
- Now go to footer and add this in footer file :-
```jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-gray-400 border border-t-2 border-t-black">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center">
                                <Logo width="100px" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    &copy; Copyright 2023. All Rights Reserved by DevUI.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                                Company
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Affiliate Program
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Press Kit
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                                Support
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Account
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Help
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Customer Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                                Legals
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        Licensing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default Footer
```
- Now we will make a logo file in components :-
```jsx
import React from "react";

export default function Logo({width = "100px"}){
    return <div>logo</div>
}
```
- Now make a logout button component in header folder :-
```jsx
import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
```
- First we make a onClick method, this will call appwrite for logout and dispatch the logout so that in store every thing will be updated.
- Make sure to export all the component from __index.js file__.
- Now we gonna add code in header file.
```jsx
import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px'   />

              </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
        </Container>
    </header>
  )
}

export default Header
```
- __Navigation__ from react-router is use to navigate, it just need URL in it which we define __slug__.
- __useSelector__ help us to get the status, is use login or not.
- Production level way to show nav item is make a array of object put __name, slug(url) and status__.
- We will display those nav item who is active only.
- At last after displaying all nav items we will check authStatus if true then we will show logout componet button.
```jsx
{authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
```
- This is very common syntax, if __authStatus__ if true then the __parentishis__ will execute otherwise it will not.
- Now we will make button component like in Production :-
```jsx
import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}
```
- Now we gonna make our input comonent :-
```jsx
import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='inline-block mb-1 pl-1' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input
```
- we gonna learn about __useRef__ to get reference of something from other component.
- Now we will make __Select.jsx__ component for our select drop down for active and not active.
```javascript JSX
import React, {useId} from 'react'

function Select({
    options,
    label,
    className = "",
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className=''></label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)
```
- In option array will come so we goona do conditional loop other wise app will crash.
- Now we gonna make __PostCard.jsx__ component
``` javascript JSX
import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage}) {
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                <img src={appwriteService.getFilePreview(featuredImage)} alt={title}
                className='rounded-xl' />

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard
```
- We have to put dollar sign in id thats appwrite syntax.
- Now we gonna make login component :-
``` javascript JSX
import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from "./index"
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div
    className='flex items-center justify-center w-full'
    >
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-8'>
            <div className='space-y-5'>
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type="submit"
                className="w-full"
                >Sign in</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login
```
- We changed the name of __login__ that come from __authSlice__ to __authLogin__.