import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        const review = await this.prisma.review.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: returnReviewObject
        })

        if (!review) throw new Error('Review not found')

        return review
    }

    async create(userId: number, dto: ReviewDto, productId: number) {
        return this.prisma.review.create({
            data: {
                ...dto,
                product: {
                    connect: {
                        id: productId
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    async getAverageVlueByProductId(productId: number) {
        return this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true }
        })
        .then(data => data._avg)
    }
}
