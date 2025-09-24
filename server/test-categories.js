const { PrismaClient } = require('@prisma/client');

async function testCategories() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Obteniendo categorías...');

    const categories = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
    });

    console.log('📊 Total categorías:', categories.length);
    console.log(
      '📋 Primeras 3 categorías:',
      categories.slice(0, 3).map((cat) => ({
        id: cat.id,
        codigo: cat.codigo,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        activo: cat.activo,
      })),
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCategories();
