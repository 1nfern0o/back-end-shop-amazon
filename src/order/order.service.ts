import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order.dto';
import { returnProductObject } from 'src/product/return-product.object';
import { faker } from '@faker-js/faker/.';
import * as YooKassa from 'yookassa'
import { PaymentStatusDto } from './payment-status.dto';
import { EnumOrderStatus } from '@prisma/client';

const yooKassa = new YooKassa({
    shopId: process.env['SHOP_ID'],
    secretKey: process.env['PAYMENT_TOKEN']
})

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getAll() {
        return this.prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: returnProductObject
                        }
                    }
                }
            }
        })
    }

    async getByUserId(userId: number) {
        return this.prisma.order.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: returnProductObject
                        }
                    }
                }
            }
        })
    }

    async placeOrder(dto: OrderDto, userId: number) {
        const total = dto.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

        const order = await this.prisma.order.create({
            data: {
                status: dto.status,
                items: {
                    create: dto.items
                },
                total,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        // const payment = await yooKassa.createPayment({
        //     amount: {
        //         value: total.toFixed(2),
        //         currency: 'USD'
        //     },
        //     patment_method_data: {
        //         // CHANGE
        //         type: 'bank_card'
        //     },
        //     confirmation: {
        //         type: 'redirect',
        //         // CHANGE
        //         return_url: 'http://localhost:3000/thanks'
        //     },
        //     // CHANGE
        //     description: `Order ${order.id}`
        // })

        // return payment
        return order
    }

    async updateStatus(dto: PaymentStatusDto) {
        if (dto.event === 'payment.waiting_for_capture') {
            const payment = await yooKassa.capturePayment(dto.object.id)
            return payment
        }

        if (dto.event === 'payment.succeeded') {
            const orderId = Number(dto.object.description.split('#')[1])

            await this.prisma.order.update({
                where:{
                    id: orderId
                },
                data: {
                    status: EnumOrderStatus.PAYED
                }
            })

            return true
        }

        return true
    }
}
