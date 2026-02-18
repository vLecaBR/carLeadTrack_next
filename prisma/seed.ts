import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  // Puxa as credenciais do .env de forma segura
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  // Trava de segurança caso as variáveis não estejam no .env
  if (!email || !password) {
    throw new Error('❌ Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não encontradas no arquivo .env')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email: email }, 
    update: {},
    create: {
      email: email,
      name: 'Admin Master',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Usuário Administrador garantido com sucesso:', admin.email)
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