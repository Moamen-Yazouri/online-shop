import { RegisterDTO } from "src/modules/auth/dto/auth.dto"
import { faker } from "@faker-js/faker"
export const generateUserForSeed = () => {
    const userForSeed: RegisterDTO = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(["CUSTOMER", "MERCHANT"])
    }
    return userForSeed;
}