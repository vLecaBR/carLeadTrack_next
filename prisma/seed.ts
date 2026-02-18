import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

// 1. Cria a conexão usando o pacote 'pg'
const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// 2. Passa o adaptador para o Prisma 7
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: 'vitartas@icloud.com' }, 
    update: {},
    create: {
      email: 'vitartas@icloud.com',
      name: 'Admin Master',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Usuário Administrador criado com sucesso:', admin.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })