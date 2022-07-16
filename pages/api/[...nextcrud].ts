import NextCrud, {PrismaAdapter} from "@premieroctet/next-crud";
import prisma from "../../lib/prisma";

const handler = NextCrud({
    adapter: new PrismaAdapter({
        prismaClient: prisma
    }),
})

export default handler;