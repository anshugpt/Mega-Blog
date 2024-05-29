import config from "../config/config";
import {Client, Databases, ID, Storage, Query} from 'appwrite';

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                config.appwriteDatebaseID,
                config.appwriteCollectionID,
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

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                config.appwriteDatebaseID,
                config.appwriteCollectionID,
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

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                config.appwriteDatebaseID,
                config.appwriteCollectionID,
                slug
            )
            return true
        } catch (error) {
            console.log(`Error from :: deletePost :: ${error}`);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                config.appwriteDatebaseID,
                config.appwriteCollectionID,
                slug
            )
        } catch (error) {
            console.log(`Error from :: getPost :: ${error}`);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                config.appwriteDatebaseID,
                config.appwriteCollectionID,
                queries
            )
        } catch (error) {
            console.log(`Error from :: getPosts :: ${error}`);
            return false;
        }
    }

    // File Uploade Service

    async uploadeFile(file){
        try {
            return await this.bucket.createFile(
                config.appwriteBucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log(`Error from :: uploadeFile :: ${error}`);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketID,
                fileId
            )
            return true
        } catch (error) {
            console.log(`Error from :: deleteFile :: ${error}`);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            config.appwriteBucketID,
            fileId
        )
    }
}

const service = new Service();

export default service;