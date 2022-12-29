import * as yup from "yup";

export const basicSchema = yup.object().shape({
    name: yup.string().min(4).max(100).required("Required"),
    companyName: yup.string().min(4).max(100).required("Required"),
    address: yup.string().required("Required"),
    longitude: yup.number().integer().min(-180).max(180).required("Required"),
    latitude: yup.number().integer().min(-90).max(90).required("Required"),
    numColumn: yup.number().integer().required("Required"),
    fuelNumber: yup.number().integer().min(1).required("Required"),
    checkNumber: yup.number().integer().required("Required"),
    columnType: yup.string().min(1).required("Required"),
})