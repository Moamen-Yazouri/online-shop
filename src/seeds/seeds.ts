import { faker } from "@faker-js/faker"
import { PrismaClient } from "generated/prisma"
import { generateUserForSeed } from "./user.seeds";
import { generateProductForSeed } from "./product.seeds";
import * as argon from "argon2";
import { RegisterDTO } from "src/modules/auth/dto/auth.dto";

const prisma = new PrismaClient()
const main = async () => {
    await prisma.user.deleteMany({});
    await prisma.product.deleteMany({});

    const pass = await argon.hash('123456');
    const merchantForSeed: RegisterDTO = {
        email: 'moamen@email.com',
        name: 'moamen',
        password: pass,
        role: "MERCHANT"
    };

    const usersForSeed = [...faker.helpers.multiple(generateUserForSeed, {count: 10}), merchantForSeed];

    await prisma.user.createMany({
        data: usersForSeed
    });

    const merchants = await prisma.user.findMany({
        where: {
            role: "MERCHANT"
        }
    })

    for(const merchant of merchants) {
        const productsForSeed = faker.helpers.multiple(() => generateProductForSeed(merchant.id), {
            count: 5,
        });

        await prisma.product.createMany({
            data: productsForSeed
        });

    }
    
    console.log("database seeded successfully!");

}

main().catch((err) => {
    console.log(err);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});

export default main