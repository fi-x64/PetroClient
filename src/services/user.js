import request from "../utils/request"

export const handleSearchAPI = async (values) => {
    const res = await request.post('/user/search', values);
    if (res.data.success) return res.data.data
    return []
}