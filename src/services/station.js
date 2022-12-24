import request from "../utils/request"

export const getAllStaion = async () => {
    const res = await request.get('/station/get-all')
    if (res.data.success) return res.data.data
    return []
}