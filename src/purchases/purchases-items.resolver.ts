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

import { PurchasesItemsService } from './purchases-items-service'

import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'
import { Purchase } from './entities/purchase.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'

import { CreatePurchaseItemInput } from './inputs/create-purchase-with-items.input'
import { UpdatePurchaseItemInput } from './inputs/update-purchase-item.input'

@Resolver(() => PurchaseItem)
export class PurchasesItemsResolver {
  constructor(private readonly purchasesItemsService: PurchasesItemsService) {}

  @ResolveField(() => Book)
  book(@Parent() purchaseItem: PurchaseItem) {
    return this.purchasesItemsService.findBook(purchaseItem.bookId)
  }

  @ResolveField(() => Purchase)
  purchase(@Parent() purchaseItem: PurchaseItem) {
    return this.purchasesItemsService.findPurchase(purchaseItem.purchaseId)
  }

  @Query(() => [PurchaseItem], { name: 'purchasesItems' })
  list() {
    return this.purchasesItemsService.list()
  }

  @Query(() => [PurchaseItem], { name: 'purchaseItems' })
  purchaseItems(
    @Args('purchaseId', { type: () => String }, ParseUUIDPipe)
    purchaseId: string,
  ) {
    return this.purchasesItemsService.listItemsByPurchaseId(purchaseId)
  }

  @Query(() => Purchase, { name: 'purchaseItem' })
  findById(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return this.purchasesItemsService.findById(id)
  }

  @Authorize(UserRole.EDITOR, UserRole.ADMIN)
  @Mutation(() => Purchase)
  createPurchaseWithItems(
    @Args('purchaseId', { type: () => String }, ParseUUIDPipe)
    purchaseId: string,
    @Args('createPurchaseItemInput')
    createPurchaseItemInput: CreatePurchaseItemInput,
  ) {
    return this.purchasesItemsService.create(
      purchaseId,
      createPurchaseItemInput,
    )
  }

  @Authorize(UserRole.EDITOR, UserRole.ADMIN)
  @Mutation(() => Purchase)
  updatePurchase(
    @Args('updatePurchaseItemInput')
    updatePurchaseItemInput: UpdatePurchaseItemInput,
  ) {
    return this.purchasesItemsService.update(
      updatePurchaseItemInput.id,
      updatePurchaseItemInput,
    )
  }

  @Mutation(() => Purchase)
  removePurchase(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.purchasesItemsService.remove(id)
  }
}
