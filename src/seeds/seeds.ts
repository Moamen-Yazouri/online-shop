import { faker } from "@faker-js/faker"
import { PrismaClient } from "generated/prisma"
import { generateUserForSeed } from "./user.seeds";
import { generateProductForSeed } from "./product.seeds";


const prisma = new PrismaClient()
const main = async () => {
    await prisma.user.deleteMany({});
    await prisma.product.deleteMany({});
    
    const usersForSeed = faker.helpers.multiple(generateUserForSeed, {count: 10});

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