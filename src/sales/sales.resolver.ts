import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { CurrentUser } from 'src/auth/helpers/current-user.decorator'
import { SalesService } from './sales.service'

import { User } from 'src/auth/entities/user.entity'
import { Sale } from './entities/sale.entity'
import { SaleItem } from './entities/sale-item.entity'

import { CreateSaleWithItemsInput } from './inputs/create-sale-with-items.input'
import { UpdateSaleInput } from './inputs/update-sale.input'

@Resolver(() => Sale)
export class SalesResolver {
  constructor(private readonly salesService: SalesService) {}

  @ResolveField(() => User)
  employee(@Parent() sale: Sale) {
    return this.salesService.findEmployee(sale.employeeId)
  }

  @ResolveField(() => [SaleItem])
  items(@Parent() sale: Sale) {
    return this.salesService.findItems(sale.id)
  }

  @Query(() => [Sale], { name: 'sales' })
  list() {
    return this.salesService.list()
  }

  @Query(() => Sale, { name: 'sale' })
  findById(@Args('id', { type: () => Int }, ParseUUIDPipe) id: string) {
    return this.salesService.findById(id)
  }

  @Mutation(() => Sale)
  createSale(
    @CurrentUser() employee: User,
    @Args('createSaleWithItemsInput')
    createSaleWithItemsInput: CreateSaleWithItemsInput,
  ) {
    return this.salesService.createSaleWithItems(
      employee.id,
      createSaleWithItemsInput,
    )
  }

  @Mutation(() => Sale)
  updateSale(
    @CurrentUser() employee: User,
    @Args('updateSaleInput') updateSaleInput: UpdateSaleInput,
  ) {
    return this.salesService.updateSale(
      employee.id,
      updateSaleInput.id,
      updateSaleInput,
    )
  }

  @Mutation(() => Sale)
  removeSale(@Args('id', { type: () => Int }, ParseUUIDPipe) id: string) {
    return this.salesService.remove(id)
  }
}
