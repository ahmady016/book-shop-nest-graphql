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
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'

import { PurchasesService } from './purchases.service'

import { User } from 'src/auth/entities/user.entity'
import { Purchase } from './entities/purchase.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'

import { CreatePurchaseWithItemsInput } from './inputs/create-purchase-with-items.input'
import { UpdatePurchaseInput } from './inputs/update-purchase.input'

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(private readonly purchasesService: PurchasesService) {}

  @ResolveField(() => User)
  employee(@Parent() purchase: Purchase) {
    return this.purchasesService.findEmployee(purchase.employeeId)
  }

  @ResolveField(() => [PurchaseItem])
  items(@Parent() purchase: Purchase) {
    return this.purchasesService.findItems(purchase.id)
  }

  @Query(() => [Purchase], { name: 'purchases' })
  list() {
    return this.purchasesService.list()
  }

  @Query(() => Purchase, { name: 'purchase' })
  findById(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return this.purchasesService.findById(id)
  }

  @Authorize(UserRole.EDITOR, UserRole.ADMIN)
  @Mutation(() => Purchase)
  createPurchaseWithItems(
    @CurrentUser() employee: User,
    @Args('createPurchaseWithItemsInput')
    createPurchaseWithItemsInput: CreatePurchaseWithItemsInput,
  ) {
    return this.purchasesService.createPurchaseWithItems(
      employee.id,
      createPurchaseWithItemsInput,
    )
  }

  @Authorize(UserRole.EDITOR, UserRole.ADMIN)
  @Mutation(() => Purchase)
  updatePurchase(
    @CurrentUser() employee: User,
    @Args('updatePurchaseInput') updatePurchaseInput: UpdatePurchaseInput,
  ) {
    return this.purchasesService.update(
      employee.id,
      updatePurchaseInput.id,
      updatePurchaseInput,
    )
  }

  @Mutation(() => Purchase)
  removePurchase(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.purchasesService.remove(id)
  }
}
