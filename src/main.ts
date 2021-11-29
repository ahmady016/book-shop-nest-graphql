import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  // create the nest logger instance
  const logger = new Logger("Bootstrap_Server")
  // create the nest app
  const app = await NestFactory.create(AppModule)
  // setup global validation
  app.useGlobalPipes(new ValidationPipe())
  // enable cors
  app.enableCors({ origin: '*', credentials: true })
  // parse cookies
  app.use(cookieParser())
  // setup the port and domain url
  const PORT = process.env.PORT || 8007
  const BASE_URL = process.env.BASE_URL || 'http://localhost'
  // run the app [web server]
  await app.listen(PORT)
  // log message after sever start
  logger.log(`The Web Server is running on ${BASE_URL}:${PORT}`)
}
bootstrap()
