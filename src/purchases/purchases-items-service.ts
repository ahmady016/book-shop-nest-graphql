import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Book } from 'src/books/entities/book.entity'
import { Purchase } from './entities/purchase.entity'
import { PurchaseItem } from './entities/purchase-item.entity'
import { Stock } from 'src/books/entities/stock.entity'

import { UpdatePurchaseItemInput } from './inputs/update-purchase-item.input'
import { CreatePurchaseItemInput } from './inputs/create-purchase-with-items.input'

@Injectable()
export class PurchasesItemsService {
  constructor(
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Purchase) private purchasesRepo: Repository<Purchase>,
    @InjectRepository(PurchaseItem) private purchasesItemsRepo: Repository<PurchaseItem>,
    @InjectRepository(Stock) private stocksRepo: Repository<Stock>,
  ) {}

  private async updateStocks(item: PurchaseItem, action: string) {
    // get stock and update computed fields and save it
    const stock = await this.stocksRepo.findOne(item.bookId)
    switch (action) {
      case 'add':
        stock.totalPurchasesQuantity += item.quantity
        stock.totalInStock += item.quantity
        stock.totalPurchasesPrice += item.totalPrice
        stock.profit -= item.totalPrice
        break
      case 'remove':
        stock.totalPurchasesQuantity -= item.quantity
        stock.totalInStock -= item.quantity
        stock.totalPurchasesPrice -= item.totalPrice
        stock.profit += item.totalPrice
        break
      default:
        break
    }
    await this.stocksRepo.save(stock)
  }

  findBook(bookId: string) {
    return this.booksRepo.findOne(bookId)
  }

  findPurchase(purchaseId: string) {
    return this.purchasesRepo.findOne(purchaseId)
  }

  list() {
    return this.purchasesItemsRepo.find({ order: { createdAt: 'ASC' } })
  }

  listItemsByPurchaseId(purchaseId: string) {
    return this.purchasesItemsRepo.find({
      where: { purchaseId },
      order: { createdAt: 'ASC' },
    })
  }

  async findById(id: string) {
    const purchaseItem = await this.purchasesItemsRepo.findOne(id)
    if (!purchaseItem) throw new NotFoundException('purchase item not found!')
    return purchaseItem
  }

  async create(purchaseId: string, item: CreatePurchaseItemInput) {
    // calc item totalPrice if not provided
    if (!item.totalPrice) {
      item.totalPrice = item.unitPrice * item.quantity
    }
    // create and save purchaseItem
    let newItem = this.purchasesItemsRepo.create({
      ...item,
      purchaseId,
    })
    newItem = await this.purchasesItemsRepo.save(newItem)

    // get the purchase
    const purchase = await this.purchasesRepo.findOne(purchaseId)
    // update totalPrice in purchase and save it
    purchase.totalPrice += newItem.totalPrice
    await this.purchasesRepo.save(purchase)

    // update stocks values
    await this.updateStocks(newItem, 'add')

    // return the new created purchaseItem
    return newItem
  }

  async update(id: string, attrs: UpdatePurchaseItemInput) {
    // get the old purchaseItem
    const existedItem = await this.purchasesItemsRepo.findOne(id)
    // calc the totalPrice if not provided
    if(!attrs.totalPrice) {
      attrs.totalPrice = existedItem.unitPrice * attrs.quantity
    }
    // merge it with new values and save it
    let updatedItem = this.purchasesItemsRepo.merge(existedItem, attrs)
    updatedItem = await this.purchasesItemsRepo.save(updatedItem)

    // calc the diff values between old and new
    const diffQuantity = attrs.quantity - existedItem.quantity
    const diffTotalPrice = attrs.totalPrice - existedItem.totalPrice
    // get stock and update computed fields and save it
    if(diffQuantity !== 0 || diffTotalPrice !== 0) {
      // construct itemWithDiffValues
      const itemWithDiffValues = {
        ...updatedItem,
        quantity: diffQuantity,
        totalPrice: diffTotalPrice,
      } as PurchaseItem
      // update stocks values
      await this.updateStocks(itemWithDiffValues, 'add')
    }

    // return the updatedItem
    return updatedItem
  }

  async remove(id: string) {
    // get purchaseItem and remove it form db
    const existedItem = await this.purchasesItemsRepo.findOne(id)
    let removedItem = await this.purchasesItemsRepo.remove(existedItem)

    // update stocks values
    await this.updateStocks(existedItem, 'remove')

    // return the removed purchaseItem
    removedItem.id = id
    return removedItem
  }
}
