import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Sale } from './entities/sale.entity'
import { SaleItem } from './entities/sale-item.entity'
import { User } from 'src/auth/entities/user.entity'
import { Stock } from 'src/books/entities/stock.entity'

import { CreateSaleWithItemsInput } from './inputs/create-sale-with-items.input'
import { UpdateSaleInput } from './inputs/update-sale.input'

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Sale) private salesRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private salesItemsRepo: Repository<SaleItem>,
    @InjectRepository(Stock) private stocksRepo: Repository<Stock>,
  ) {}

  private async updateStocks(items: SaleItem[], action: string) {
    // update computed fields in each [book stock] in purchaseItems
    let booksIds = items.map((item) => item.bookId)
    let stocks = await this.stocksRepo.find({ where: { bookId: In(booksIds) } })
    for (const stock of stocks) {
      let saleItem = items.find((item) => item.bookId === stock.bookId)
      if (saleItem) {
        switch (action) {
          case 'add':
            stock.totalSalesQuantity += saleItem.quantity
            stock.totalInStock -= saleItem.quantity
            stock.totalSalesPrice += saleItem.totalPrice
            stock.profit += saleItem.totalPrice
            break
          case 'remove':
            stock.totalSalesQuantity -= saleItem.quantity
            stock.totalInStock += saleItem.quantity
            stock.totalSalesPrice -= saleItem.totalPrice
            stock.profit -= saleItem.totalPrice
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

  findItems(saleId: string) {
    return this.salesItemsRepo.find({ saleId })
  }

  list() {
    return this.salesRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    const sale = await this.salesRepo.findOne(id)
    if (!sale) throw new NotFoundException('sale not found!')
    return sale
  }

  async createSaleWithItems(
    employeeId: string,
    { sale, items }: CreateSaleWithItemsInput,
  ) {
    // calc each item totalPrice if not provided
    for (const item of items) {
      if (!item.totalPrice) {
        item.totalPrice = item.unitPrice * item.quantity
      }
    }
    // calc sale totalPrice if not provided
    let newSale: Sale
    if (!sale.totalPrice) {
      sale.totalPrice = items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      )
    }
    // create the sale entity
    newSale = this.salesRepo.create({ ...sale, employeeId })
    // save purchase
    newSale = await this.salesRepo.save(newSale)

    // assign to each item the generated saleId and create the entities
    let newItems = items.map((item) =>
      this.salesItemsRepo.create({ ...item, saleId: newSale.id }),
    )
    // save (bulk insert) sale items
    newItems = await this.salesItemsRepo.save(newItems)

    // update stocks values
    await this.updateStocks(newItems, 'add')

    // return newSale
    return newSale
  }

  async updateSale(
    employeeId: string,
    saleId: string,
    updateSaleInput: UpdateSaleInput,
  ) {
    const existedSale = await this.findById(saleId)
    const updatedSale = this.salesRepo.merge(existedSale, {
      ...updateSaleInput,
      employeeId,
    })
    return this.salesRepo.save(updatedSale)
  }

  async remove(id: string) {
    // find existedSale with items
    const existedSale = await this.salesRepo.findOne(id, {
      relations: ['items'],
    })
    // remove existedSale with its items
    const removedSale = await this.salesRepo.remove(existedSale)
    // update stocks values
    await this.updateStocks(existedSale.items, 'remove')
    // return the removedSale
    removedSale.id = id
    return removedSale
  }
}
