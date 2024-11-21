import { Prisma } from '@prisma/client'

export const returnCaregoryObject: Prisma.CategorySelect = {
    id: true,
    name: true,
    slug: true
}