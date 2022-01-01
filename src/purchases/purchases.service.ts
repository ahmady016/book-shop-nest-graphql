import { Injectable, NotFoundException } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from 'src/auth/entities/user.entity'
import { Purchase } from './entities/purchase.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'
import { Stock } from 'src/books/entities/stock.entity'

import { CreatePurchaseWithItemsInput } from './inputs/create-purchase-with-items.input'
import { UpdatePurchaseInput } from './inputs/update-purchase.input'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Purchase) private purchasesRepo: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private purchasesItemsRepo: Repository<PurchaseItem>,
    @InjectRepository(Stock) private stocksRepo: Repository<Stock>,
  ) {}

  private async updateStocks(items: PurchaseItem[], action: string) {
    // update computed fields in each [book stock] in purchaseItems
    let booksIds = items.map((item) => item.bookId)
    let stocks = await this.stocksRepo.find({ where: { bookId: In(booksIds) } })
    for (const stock of stocks) {
      let purchaseItem = items.find((item) => item.bookId === stock.bookId)
      if (purchaseItem) {
        switch (action) {
          case 'add':
            stock.totalPurchasesQuantity += purchaseItem.quantity
            stock.totalInStock += purchaseItem.quantity
            stock.totalPurchasesPrice += purchaseItem.totalPrice
            stock.profit -= purchaseItem.totalPrice
            break
          case 'remove':
            stock.totalPurchasesQuantity -= purchaseItem.quantity
            stock.totalInStock -= purchaseItem.quantity
            stock.totalPurchasesPrice -= purchaseItem.totalPrice
            stock.profit += purchaseItem.totalPrice
            break
          default:
            break
        }
      }
    }
    // save the updated books stocks
    await this.stocksRepo.save(stocks)
  }

  findEmployee(employeeId: string) {
    return this.usersRepo.findOne(employeeId)
  }

  findItems(purchaseId: string) {
    return this.purchasesItemsRepo.find({ purchaseId })
  }

  list() {
    return this.purchasesRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    const purchase = await this.purchasesRepo.findOne(id)
    if (!purchase) throw new NotFoundException('purchase not found!')
    return purchase
  }

  async createPurchaseWithItems(
    employeeId: string,
    { purchase, items }: CreatePurchaseWithItemsInput,
  ) {
    // calc each item totalPrice if not provided
    for (const item of items) {
      if (!item.totalPrice) {
        item.totalPrice = item.unitPrice * item.quantity
      }
    }
    // calc purchase totalPrice if not provided
    let newPurchase: Purchase
    if (!purchase.totalPrice) {
      purchase.totalPrice = items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      )
    }
    // create the purchase entity
    newPurchase = this.purchasesRepo.create({ ...purchase, employeeId })
    // save purchase
    newPurchase = await this.purchasesRepo.save(newPurchase)

    // assign to each item the generated purchaseId and create the entities
    let newItems = items.map((item) =>
      this.purchasesItemsRepo.create({ ...item, purchaseId: newPurchase.id }),
    )
    // save (bulk insert) purchase items
    newItems = await this.purchasesItemsRepo.save(newItems)

    // update stocks values
    await this.updateStocks(newItems, 'add')

    // return newPurchase
    return newPurchase
  }

  async update(
    employeeId: string,
    purchaseId: string,
    updatePurchaseInput: UpdatePurchaseInput,
  ) {
    const existedPurchase = await this.findById(purchaseId)
    const updatedPurchase = this.purchasesRepo.merge(existedPurchase, {
      ...updatePurchaseInput,
      employeeId,
    })
    return this.purchasesRepo.save(updatedPurchase)
  }

  async remove(id: string) {
    // find existedPurchase with items
    const existedPurchase = await this.purchasesRepo.findOne(id, {
      relations: ['items'],
    })
    // remove existedPurchase with its items
    const removedPurchase = await this.purchasesRepo.remove(existedPurchase)
    // update stocks values
    await this.updateStocks(existedPurchase.items, 'remove')
    // return the removedPurchase
    removedPurchase.id = id
    return removedPurchase
  }
}
