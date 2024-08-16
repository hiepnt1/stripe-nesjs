import { Request } from "express"
import { User } from "src/user/entity/user.entity"

interface requestWithUser extends Request {
    user: User
}

export default requestWithUser