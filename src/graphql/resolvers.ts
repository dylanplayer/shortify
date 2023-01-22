export const resolvers = {
  Query: {
    links: () => {
      return prisma.link.findMany();
    },
  },
};
