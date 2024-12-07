import { Prisma } from '@prisma/client'
import { returnCaregoryObject } from 'src/category/return-category.object'
import { returnReviewObject } from 'src/review/return-review.object'

export const returnProductObject: Prisma.ProductSelect = {
    images: true,
    description: true,
    id: true,
    name: true,
    price: true,
    createdAt: true,
    slug: true,
    category: { select: returnCaregoryObject },
    reviews: {
        select: returnReviewObject,
        orderBy: {
            createdAt: 'desc'
        }
    }
}

export const returnProductObjectFullest: Prisma.ProductSelect = {
    ...returnProductObject
}