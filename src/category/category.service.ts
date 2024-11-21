import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { returnCaregoryObject } from './return-category.object';
import { CategoryDto } from './category.dto';
import { generateSlug } from 'src/utils/generate-slug';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async byId(id: number) {
        const category = await this.prisma.category.findUnique({
            where: {
                id
            },
            select: returnCaregoryObject
        })

        if (!category) throw new NotFoundException('Category not found')

        return category
    }

    async bySlug(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug
            },
            select: returnCaregoryObject
        })

        if (!category) throw new NotFoundException('Category not found')

        return category
    }

    async getAll() {
        const category = await this.prisma.category.findMany({
            select: returnCaregoryObject
        })

        if (!category) throw new Error('Category not found')

        return category
    }

    async create(dto: CategoryDto) {
        return this.prisma.category.create({
            data: {
                name: dto.name,
                slug: generateSlug(dto.name)
            }
        })
    }

    async update(id: number, dto: CategoryDto) {
        return this.prisma.category.update({
            where: {
                id
            },
            data: {
                name: dto.name,
                slug: generateSlug(dto.name)
            }
        })
    }

    async delete(id: number) {
        const category = await this.prisma.category.findUnique({
            where: {
                id
            },
            select: returnCaregoryObject
        })

        if (!category) throw new NotFoundException('Category not found')

        return await this.prisma.category.delete({
            where: {
                id
            }
        })
    }
}
