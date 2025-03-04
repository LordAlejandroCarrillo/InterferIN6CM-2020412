import Company from "../companies/company.model.js"

export const existentEmail = async (email = ' ') => {
    
    const existEmail = await User.findOne({email})
    
    if(existEmail){
        throw new Error(`El correo ${ email } ya existe en la base de datos`)
    }
}

export const companyExistsById = async(id = "") => {
    const companyExists = await Company.findById(id)

    if(!companyExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}