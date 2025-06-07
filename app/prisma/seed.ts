import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "Health", icon: "💪", color: "#10B981" },
  { name: "Learning", icon: "📚", color: "#3B82F6" },
  { name: "Productivity", icon: "⚡", color: "#F59E0B" },
  { name: "Mindfulness", icon: "🧘", color: "#8B5CF6" },
  { name: "Social", icon: "👥", color: "#EF4444" },
  { name: "Creative", icon: "🎨", color: "#EC4899" },
];

async function main() {
  console.log("Start seeding...");

  // Create default categories
  for (const category of DEFAULT_CATEGORIES) {
    const result = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    console.log(`Created/Updated category: ${result.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
