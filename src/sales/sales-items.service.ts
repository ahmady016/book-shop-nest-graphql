import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Book } from 'src/books/entities/book.entity'
import { Stock } from 'src/books/entities/stock.entity'
import { Sale } from './entities/sale.entity'
import { SaleItem } from './entities/sale-item.entity'

import { CreateSaleItemInput } from './inputs/create-sale-with-items.input'
import { UpdateSaleItemInput } from './inputs/update-sale-item.input'

@Injectable()
export class SalesItemsService {
  constructor(
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Sale) private salesRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private salesItemsRepo: Repository<SaleItem>,
    @InjectRepository(Stock) private stocksRepo: Repository<Stock>,
  ) {}

  private async updateStocks(item: SaleItem, action: string) {
    // get stock and update computed fields and save it
    const stock = await this.stocksRepo.findOne(item.bookId)
    switch (action) {
      case 'add':
        stock.totalSalesQuantity += item.quantity
        stock.totalInStock -= item.quantity
        stock.totalSalesPrice += item.totalPrice
        stock.profit += item.totalPrice
        break
      case 'remove':
        stock.totalSalesQuantity -= item.quantity
        stock.totalInStock += item.quantity
        stock.totalSalesPrice -= item.totalPrice
        stock.profit -= item.totalPrice
        break
      default:
        break
    }
    await this.stocksRepo.save(stock)
  }

  findBook(bookId: string) {
    return this.booksRepo.findOne(bookId)
  }

  findSale(saleId: string) {
    return this.salesRepo.findOne(saleId)
  }

  list() {
    return this.salesItemsRepo.find({ order: { createdAt: 'ASC' } })
  }

  listItemsBySaleId(saleId: string) {
    return this.salesItemsRepo.find({
      where: { saleId },
      order: { createdAt: 'ASC' },
    })
  }

  async findById(id: string) {
    const saleItem = await this.salesItemsRepo.findOne(id)
    if (!saleItem) throw new NotFoundException('saleItem not found!')
    return saleItem
  }

  async create(saleId: string, item: CreateSaleItemInput) {
    // calc item totalPrice if not provided
    if (!item.totalPrice) {
      item.totalPrice = item.unitPrice * item.quantity
    }
    // create and save saleItem
    let newItem = this.salesItemsRepo.create({
      ...item,
      saleId,
    })
    newItem = await this.salesItemsRepo.save(newItem)

    // get the sale
    const sale = await this.salesRepo.findOne(saleId)
    // update totalPrice in sale and save it
    sale.totalPrice += newItem.totalPrice
    await this.salesRepo.save(sale)

    // update stocks values
    await this.updateStocks(newItem, 'add')

    // return the new created saleItem
    return newItem
  }

  async update(id: string, attrs: UpdateSaleItemInput) {
    // get the old saleItem
    const existedItem = await this.salesItemsRepo.findOne(id)
    // calc the totalPrice if not provided
    if(!attrs.totalPrice) {
      attrs.totalPrice = existedItem.unitPrice * attrs.quantity
    }
    // merge it with new values and save it
    let updatedItem = this.salesItemsRepo.merge(existedItem, attrs)
    updatedItem = await this.salesItemsRepo.save(updatedItem)

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
      } as SaleItem
      // update stocks values
      await this.updateStocks(itemWithDiffValues, 'add')
    }

    // return the updatedItem
    return updatedItem
  }

  async remove(id: string) {
    // get saleItem and remove it form db
    const existedItem = await this.salesItemsRepo.findOne(id)
    let removedItem = await this.salesItemsRepo.remove(existedItem)

    // update stocks values
    await this.updateStocks(existedItem, 'remove')

    // return the removed saleItem
    removedItem.id = id
    return removedItem
  }
}
