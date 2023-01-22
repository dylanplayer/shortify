// /graphql/types/Link.ts
import { nanoid } from "nanoid";
import { builder } from "../builder";

builder.prismaObject('Link', {
  fields: (t) => ({
    id: t.exposeID('id'),
    url: t.exposeString('url'),
    slug: t.exposeString('slug'),
    user: t.relation('user'),
  })
});

builder.queryField("links", (t) =>
  t.prismaConnection({
    type: 'Link',
    cursor: 'id',
    resolve: async (query, _parent, _args, ctx, _info) => {
      const {user} = await ctx;

      if (!user?.id) {
        throw new Error("You have to be logged in to perform this action")
      }
      
      return prisma.link.findMany({ ...query,
        where: {
          user: {
            id: user.id,
          }
        }
      })
    }
  })
)

builder.mutationField("createLink", (t) =>
  t.prismaField({
    type: 'Link',
    args: {
      url: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { url } = args

      const {user} = await ctx;

      if (!user?.id) {
        throw new Error("You have to be logged in to perform this action")
      }

      const slug = nanoid(10);
        
      return prisma.link.create({
        ...query,
        data: {
          url,
          slug,
          user: {
            connect: {
              id: user.id,
            }
          }
        }
      })
    }
  })
);
