'use_strict';

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import { hash } from 'argon2'
import limiter from '../src/middlewares/validate-cant-requests.js'
import authRoutes from '../src/auth/auth.routes.js'
import companyRoutes from '../src/companies/company.routes.js';
import User from '../src/users/user.model.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended:false }))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app) => {
    app.use('/COPEREX-Interfer/v1/auth', authRoutes)
    app.use('/COPEREX-Interfer/v1/companies', companyRoutes)
}

const connectDB = async () => {
    try {
        await dbConnection()
        console.log('Database connected succesfully')
    } catch (error) {
        console.log('Error trying to connect to the database', error)
        process.exit(1)
    }
}

export const startServer = async () => {
    const app = express()
    const port = process.env.PORT || 3000

    try {
        middlewares(app)
        connectDB()
        routes(app)
        app.listen(port)
        const password = await hash("12345678")
        console.log(`Server running on port: ${port}`)
        const query = {state: true}

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])
        
        let userCount = 0
        if(total != 0){
            users.map( localUser =>{
                if(localUser.username == "hbautista" || localUser.email == "bautista@gmail.com"){
                    userCount++
                }
            })
        }
        
        //AGREGAR ADMIN
        if(userCount == 0){
            await User.create({
                name: "Hugo",
                surname: "Bautista",
                username: "hbautista",
                email: "bautista@gmail.com",
                phone: "57894568",
                password: password
            })
            console.log("")
            console.log("USER CREATED SUCCESFULLY")
        } else{
            console.log("")
            console.log("USER ALREADY CREATED")
        }
    } catch (e) {
        console.log(e)
    }
}