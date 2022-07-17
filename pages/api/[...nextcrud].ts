import NextCrud, {PrismaAdapter} from "@premieroctet/next-crud";
import prisma from "../../lib/prisma";

const handlerPrisma = NextCrud({
    adapter: new PrismaAdapter({
        prismaClient: prisma
    }),
})

export default handlerPrisma;