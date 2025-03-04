import Company from './company.model.js'
import jwt from 'jsonwebtoken'
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, "../../reports", "company_report.xlsx");

async function createExcelFile(companies) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log("Existing file deleted.");
    }

    const cleanCompanies = companies.map(company => company.toObject ? company.toObject() : company)

    const updatedCleanCompanies = cleanCompanies.map( ({ _id ,...localCompany }) =>({
            id : _id.toString(),
            ...localCompany
    }))

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(updatedCleanCompanies);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies Report");

    XLSX.writeFile(workbook, filePath);
    console.log("Excel file created successfully.");
}

export const addCompany = async (req, res) => {
    try {
        const data =  req.body

        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        let name = data.name
        const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
        
        let impact = data.impact
        const impactCapitalized = impact.charAt(0).toUpperCase() + impact.slice(1)
        
        let category = data.category
        const categoryUpper = category.toUpperCase()
        
        let compnayCount = 0
        
        console.log(categoryUpper)

        companies.map( localCompany => {
            if(localCompany.name == nameCapitalized){
                compnayCount++
            }
        })
        
        const categories = ["MICROENTERPRISE", "SMALL_COMPANY", "MIDDLE_COMPANY", "GRAND_COMPANY"]
        
        if(uid){
            if(compnayCount == 0){
                if(categories.includes(categoryUpper)){
                    const company = await Company.create({
                        name: nameCapitalized,
                        impact: impactCapitalized,
                        years: data.years,
                        category: categoryUpper
                    })
                    const [totalC, newCompanies] = await Promise.all([
                        Company.countDocuments(query),
                        Company.find(query)
                    ])
                    createExcelFile(newCompanies)
            
                    res.status(200).json({
                        success: true,
                        msg: "Company added successfuly",
                        company
                    })
                } else{
                    res.status(400).json({
                        success: false,
                        msg: "The category doesnt exist."
                    })
                }
            } else{
                res.status(400).json({
                    success: false,
                    msg: "Company already exists"
                })
            }
        } else{
            res.status(400).json({
                success: false,
                msg: "You are not allowed to do that."
            })
        }

    } catch (error) {  
        res.status(500).json({
            scucess: false,
            message: 'Error adding company',
            error
        })
    }
}

export const getCompanies = async (req, res) =>{
    try {
        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const getExistentCompanies = companies.filter(localCompany => localCompany.state == true)
        if(getExistentCompanies.length != 0){
            return res.status(200).json({
                success: true,
                msg: "Companies found.",
                getExistentCompanies,
            })
        } else{
            return res.status(401).json({
                success: true,
                msg: "Companies not found.",
                getExistentCompanies,
            })
        }
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Products not found.",
            error: e.message
        })
    }
}

export const getCompaniesByYear = async (req, res) =>{
    try {

        const { year } = req.params

        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const getExistentCompanies = companies.filter(localCompany => localCompany.state == true)
        
        const filterByYear = getExistentCompanies.filter(localCompany => localCompany.years.toString().startsWith(year.toString()))

        if(filterByYear.length != 0){
            return res.status(200).json({
                success: true,
                msg: "Companies found.",
                filterByYear,
            })
        } else{
            return res.status(401).json({
                success: true,
                msg: "Companies not found.",
                filterByYear,
            })
        }
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Products not found.",
            error: e.message
        })
    }
}

export const getCompaniesAscendedly = async (req, res) =>{
    try {

        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const getExistentCompanies = companies.filter(localCompany => localCompany.state == true)
        
        const filterAscendedly = getExistentCompanies.sort((a,b) => a.name.localeCompare(b.name))

        if(filterAscendedly.length != 0){
            return res.status(200).json({
                success: true,
                msg: "Companies found.",
                filterAscendedly,
            })
        } else{
            return res.status(401).json({
                success: true,
                msg: "Companies not found.",
                filterAscendedly,
            })
        }
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Products not found.",
            error: e.message
        })
    }
}

export const getCompaniesDescendedly = async (req, res) =>{
    try {

        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const getExistentCompanies = companies.filter(localCompany => localCompany.state == true)
        
        const filterDescendedly = getExistentCompanies.sort((a,b) => b.name.localeCompare(a.name))

        if(filterDescendedly.length != 0){
            return res.status(200).json({
                success: true,
                msg: "Companies found.",
                filterDescendedly,
            })
        } else{
            return res.status(401).json({
                success: true,
                msg: "Companies not found.",
                filterDescendedly,
            })
        }
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Products not found.",
            error: e.message
        })
    }
}

export const getCompanyByName = async (req, res = response)=>{
    try {
        const { name } = req.params

        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const verifyIfCompanyExists = companies.filter(localCompany => localCompany.state == true)

        const categoryWithNameRequested = verifyIfCompanyExists.filter(localCompany => localCompany.name.toLowerCase().startsWith(name.toLowerCase()))
        if(categoryWithNameRequested.length != 0){
            res.status(200).json({
                success: true,
                msg: "Companies found",
                categoryWithNameRequested
            })
        } else{
            res.status(400).json({
                success:true,
                msg: "Companies not found or your name doesnt exist.",
                categoryWithNameRequested
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting companies.',
            error
        })
    }
}

export const getCompanyByImpact = async (req, res = response)=>{
    try {
        const { impact } = req.params

        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const verifyIfCompanyExists = companies.filter(localCompany => localCompany.state == true)

        const categoryWithImpactRequested = verifyIfCompanyExists.filter(localCompany => localCompany.impact.toLowerCase().startsWith(impact.toLowerCase()))
        if(categoryWithImpactRequested.length != 0){
            res.status(200).json({
                success: true,
                msg: "Companies found",
                categoryWithImpactRequested
            })
        } else{
            res.status(400).json({
                success:true,
                msg: "Companies not found or your level of impact doesnt exist.",
                categoryWithImpactRequested
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting companies.',
            error
        })
    }
}

export const getCompanyByCategory = async (req, res = response)=>{
    try {

        const { category } = req.params

        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        const verifyIfCategoryExists = companies.filter(localCompany => localCompany.state == true)

        const categoryWithoutUnderscore = category.replace("_","")

        const categoryWithCategoryRequested = verifyIfCategoryExists.filter(localCompany => localCompany.category.toLowerCase().replace("_","").startsWith(categoryWithoutUnderscore.toLowerCase()))
        if(categoryWithCategoryRequested.length != 0){
            res.status(200).json({
                success: true,
                msg: "Companies found",
                categoryWithCategoryRequested
            })
        } else{
            res.status(400).json({
                success:true,
                msg: "Companies not found or your level of impact doesnt exist.",
                categoryWithCategoryRequested
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting companies.',
            error
        })
    }
}

export const updateCompany = async (req, res) => {
    try {
        const data =  req.body

        const { id } = req.params

        const token = req.header('x-token')

        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])
        
        let name = data.name
        const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
        
        let impact = data.impact
        const impactCapitalized = impact.charAt(0).toUpperCase() + impact.slice(1)
        
        let category = data.category
        const categoryUpper = category.toUpperCase()
        let compnayCount = 0
        
        companies.map( localCompany => {
            if(localCompany.name == nameCapitalized){
                compnayCount++
            }
        })
        console.log("hola")
        const categories = ["MICROENTERPRISE", "SMALL_COMPANY", "MIDDLE_COMPANY", "GRAND_COMPANY"]
        
        if(uid){
            if(compnayCount == 0){
                if(categories.includes(categoryUpper)){
                    const company = await Company.findByIdAndUpdate(id,{
                        name: nameCapitalized,
                        impact: impactCapitalized,
                        years: data.years,
                        category: categoryUpper
                    }, {new:true})
                    const [totalC, newCompanies] = await Promise.all([
                        Company.countDocuments(query),
                        Company.find(query)
                    ])
                    createExcelFile(newCompanies)
            
                    res.status(200).json({
                        success: true,
                        msg: "Company updated successfuly",
                        company
                    })
                } else{
                    res.status(400).json({
                        success: false,
                        msg: "The category doesnt exist."
                    })
                }
            } else{
                res.status(400).json({
                    success: false,
                    msg: "Company already exists"
                })
            }
        } else{
            res.status(400).json({
                success: false,
                msg: "You are not allowed to do that."
            })
        }

    } catch (error) {  
        res.status(500).json({
            scucess: false,
            message: 'Error updating company',
            error
        })
    }
}

export const generateReport = async (req, res) =>{
    try {
        const token = req.header('x-token')
        if(!token){
            res.status(400).json({
                success: false,
                msg: "Token does not exist."
            })
        }
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const query = {state:true}
        const [totalC, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
        ])

        console.log('hola')
        if(uid){
            createExcelFile(companies)
            res.status(200).json({
                success: true,
                msg: "Report created successfuly."
            })
        } else{
            res.status(400).json({
                success: false,
                msg: "You are not a user."
            })
        }

    } catch (error) {
        res.status(400).json({
                success: false,
                msg: "Error while generating report.",
                error
            })
    }
}