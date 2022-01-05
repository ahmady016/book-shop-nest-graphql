import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { Authorize } from 'src/auth/helpers/auth.guard'
import { UserRole } from 'src/__common/types'

import { SalesItemsService } from './sales-items.service'

import { Book } from 'src/books/entities/book.entity'
import { Sale } from './entities/sale.entity'
import { SaleItem } from './entities/sale-item.entity'

import { CreateSaleItemInput } from './inputs/create-sale-with-items.input'
import { UpdateSaleItemInput } from './inputs/update-sale-item.input'

@Resolver(() => SaleItem)
export class SalesItemsResolver {
  constructor(private readonly salesItemsService: SalesItemsService) {}

  @ResolveField(() => Book)
  book(@Parent() saleItem: SaleItem) {
    return this.salesItemsService.findBook(saleItem.bookId)
  }

  @ResolveField(() => Sale)
  sale(@Parent() saleItem: SaleItem) {
    return this.salesItemsService.findSale(saleItem.saleId)
  }

  @Query(() => [SaleItem], { name: 'salesItems' })
  list() {
    return this.salesItemsService.list()
  }

  @Query(() => [SaleItem], { name: 'saleItems' })
  saleItems(
    @Args('saleId', { type: () => String }, ParseUUIDPipe)
    saleId: string,
  ) {
    return this.salesItemsService.listItemsBySaleId(saleId)
  }

  @Query(() => SaleItem, { name: 'saleItem' })
  findById(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return this.salesItemsService.findById(id)
  }

  @Authorize(UserRole.EDITOR, UserRole.ADMIN)
  @Mutation(() => SaleItem)
  createSaleItem(
    @Args('saleId', { type: () => String }, ParseUUIDPipe)
    saleId: string,
    @Args('createSaleItemInput')
    createSaleItemInput: CreateSaleItemInput,
  ) {
    return this.salesItemsService.create(saleId, createSaleItemInput)
  }

  @Authorize(UserRole.EDITOR, UserRole.ADMIN)
  @Mutation(() => SaleItem)
  updateSaleItem(
    @Args('updateSaleItemInput')
    updateSaleItemInput: UpdateSaleItemInput,
  ) {
    return this.salesItemsService.update(
      updateSaleItemInput.id,
      updateSaleItemInput,
    )
  }

  @Mutation(() => SaleItem)
  removeSaleItem(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.salesItemsService.remove(id)
  }
}
