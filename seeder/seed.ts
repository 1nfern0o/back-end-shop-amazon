import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const createProduct = async (quantity: number) => {
    const products: Product[] = []

    for (let i = 0; i < quantity; i++) {
        const productName = faker.commerce.productName()
        const catergoryName = faker.commerce.department()

        const product = await prisma.product.create({
            data: {
                name: productName,
                slug: faker.helpers.slugify(productName).toLocaleLowerCase(),
                description: faker.commerce.productDescription(),
                price: +faker.commerce.price({ min: 10, max: 999, dec: 0 }),
                images: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }).map(() => faker.image.url({width: 500, height: 500})),
                // images: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }).map(() => `/uploads/${faker.number.int({ min: 1, max: 5 })}`),
                category:{
                    create: {
                        name: catergoryName,
                        slug: faker.helpers.slugify(catergoryName).toLocaleLowerCase()
                    }
                },
                reviews: {
                    create: [
                        {
                            rating: faker.number.int({ min: 1, max: 5 }),
                            text: faker.lorem.paragraph(),
                            user: {
                                connect: {
                                    id: 1
                                }
                            }
                        },
                        {
                            rating: faker.number.int({ min: 1, max: 5 }),
                            text: faker.lorem.paragraph(),
                            user: {
                                connect: {
                                    id: 1
                                }
                            }
                        }
                    ]
                }
            }
        })

        products.push(product)
    }

    console.log(`Create ${products.length} products`)
}

async function main() {
    console.log('Start seeding....')
    await createProduct(10)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })