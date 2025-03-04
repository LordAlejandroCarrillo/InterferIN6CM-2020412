import { Router } from "express"
import { check } from "express-validator"
import { addCompany, getCompanies, getCompaniesByYear, getCompaniesAscendedly, 
        getCompaniesDescendedly, getCompanyByName, getCompanyByImpact, getCompanyByCategory,
        generateReport, updateCompany
} from "../companies/company.controller.js"
import { validateFields } from "../middlewares/validate-fields.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { companyExistsById } from '../helpers/db-validator.js'

const router = Router()

router.get("/get-categories/", getCompanies)

router.get("/get-categories-year/:year", getCompaniesByYear)

router.get("/get-categories-ascendedly/", getCompaniesAscendedly)

router.get("/get-categories-descendedly/", getCompaniesDescendedly)

router.get("/get-categories-name/:name", getCompanyByName)

router.get("/get-categories-impact/:impact", getCompanyByImpact)

router.get("/get-categories-category/:category", getCompanyByCategory)

router.get("/generate-report/", generateReport)

router.post(
    "/add-category/",
    [
        validateFields,
        deleteFileOnError
    ],
    addCompany
)

router.put(
    "/update-category/:id",
    [
        validateFields,
        deleteFileOnError,
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(companyExistsById)
    ],
    updateCompany
)

export default router