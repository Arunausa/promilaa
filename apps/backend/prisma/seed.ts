import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding full Promilaa product catalog with affordable prices (৳590 - ৳850)...');

  // 1. Clear existing data
  await prisma.inventoryLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@promilaa.com',
      passwordHash: '$2b$10$26Ci1yce6hLqyHUCUUMi6uFxZU10RTyQgLxM2Yb0pjIE0v7rJp8Me',
      name: 'Promilaa Admin',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: '$2a$10$wT112K.9uSgKzLpGg9z3i.e4T5J4pG9z3i.e4T5J4pG9z3i.e4T5J',
      name: 'Nusrat Jahan',
      role: 'CUSTOMER',
    },
  });

  // 3. Seed Categories
  const kurtiCat = await prisma.category.create({
    data: { name: 'Kurti', slug: 'kurti', gender: 'women' },
  });
  const onePieceCat = await prisma.category.create({
    data: { name: 'One Piece', slug: 'one-piece', gender: 'women' },
  });
  const twoPieceCat = await prisma.category.create({
    data: { name: 'Two Piece', slug: 'two-piece', gender: 'women' },
  });
  const threePieceCat = await prisma.category.create({
    data: { name: 'Three Piece', slug: 'three-piece', gender: 'women' },
  });
  const festiveCat = await prisma.category.create({
    data: { name: 'Festive Collection', slug: 'festive', gender: 'women' },
  });
  const eidCat = await prisma.category.create({
    data: { name: 'Eid Collection', slug: 'eid-collection', gender: 'women' },
  });
  const newArrivalCat = await prisma.category.create({
    data: { name: 'New Arrivals', slug: 'new-arrivals', gender: 'women' },
  });

  const productsData = [
    {
      idx: 101,
      name: "Embroidered Cotton Kurti Vol-1",
      slug: "embroidered-cotton-kurti-vol-1-101",
      description: "Premium quality Bangladeshi women ethnic wear Embroidered Cotton Kurti Vol-1. High quality fabric, comfortable fit and elegant design.",
      basePrice: 620,
      compareAtPrice: 990,
      categoryId: kurtiCat.id,
      isFeatured: false,
      images: ["/media/kurti/1.jpeg", "/media/kurti/10.jpeg"]
    },
    {
      idx: 102,
      name: "Linen Daily Kurti Vol-2",
      slug: "linen-daily-kurti-vol-2-102",
      description: "Premium quality Bangladeshi women ethnic wear Linen Daily Kurti Vol-2. High quality fabric, comfortable fit and elegant design.",
      basePrice: 620,
      compareAtPrice: 950,
      categoryId: kurtiCat.id,
      isFeatured: true,
      images: ["/media/kurti/2.jpeg", "/media/kurti/3.jpeg"]
    },
    {
      idx: 103,
      name: "Floral Print Kurti Vol-3",
      slug: "floral-print-kurti-vol-3-103",
      description: "Premium quality Bangladeshi women ethnic wear Floral Print Kurti Vol-3. High quality fabric, comfortable fit and elegant design.",
      basePrice: 820,
      compareAtPrice: 1050,
      categoryId: kurtiCat.id,
      isFeatured: false,
      images: ["/media/kurti/4.jpeg", "/media/kurti/5.jpeg"]
    },
    {
      idx: 104,
      name: "Tassel Collar Kurti Vol-4",
      slug: "tassel-collar-kurti-vol-4-104",
      description: "Premium quality Bangladeshi women ethnic wear Tassel Collar Kurti Vol-4. High quality fabric, comfortable fit and elegant design.",
      basePrice: 690,
      compareAtPrice: 1050,
      categoryId: kurtiCat.id,
      isFeatured: true,
      images: ["/media/kurti/6.jpeg", "/media/kurti/7.jpeg"]
    },
    {
      idx: 105,
      name: "Ethnic Motif Kurti Vol-5",
      slug: "ethnic-motif-kurti-vol-5-105",
      description: "Premium quality Bangladeshi women ethnic wear Ethnic Motif Kurti Vol-5. High quality fabric, comfortable fit and elegant design.",
      basePrice: 680,
      compareAtPrice: 950,
      categoryId: kurtiCat.id,
      isFeatured: false,
      images: ["/media/kurti/8.jpeg", "/media/kurti/9.jpeg"]
    },
    {
      idx: 106,
      name: "Chiffon Floral One Piece Vol-1",
      slug: "chiffon-floral-one-piece-vol-1-106",
      description: "Premium quality Bangladeshi women ethnic wear Chiffon Floral One Piece Vol-1. High quality fabric, comfortable fit and elegant design.",
      basePrice: 850,
      compareAtPrice: 890,
      categoryId: onePieceCat.id,
      isFeatured: true,
      images: ["/media/one_piece/1.jpeg", "/media/one_piece/2.jpeg"]
    },
    {
      idx: 107,
      name: "Fusion Flare Dress Vol-2",
      slug: "fusion-flare-dress-vol-2-107",
      description: "Premium quality Bangladeshi women ethnic wear Fusion Flare Dress Vol-2. High quality fabric, comfortable fit and elegant design.",
      basePrice: 590,
      compareAtPrice: 1150,
      categoryId: onePieceCat.id,
      isFeatured: false,
      images: ["/media/one_piece/3.jpeg", "/media/one_piece/4.jpeg"]
    },
    {
      idx: 108,
      name: "Georgette Elegance One Piece Vol-3",
      slug: "georgette-elegance-one-piece-vol-3-108",
      description: "Premium quality Bangladeshi women ethnic wear Georgette Elegance One Piece Vol-3. High quality fabric, comfortable fit and elegant design.",
      basePrice: 620,
      compareAtPrice: 890,
      categoryId: onePieceCat.id,
      isFeatured: true,
      images: ["/media/one_piece/5.jpeg", "/media/one_piece/6.jpeg"]
    },
    {
      idx: 109,
      name: "Maxi Summer Dress Vol-4",
      slug: "maxi-summer-dress-vol-4-109",
      description: "Premium quality Bangladeshi women ethnic wear Maxi Summer Dress Vol-4. High quality fabric, comfortable fit and elegant design.",
      basePrice: 750,
      compareAtPrice: 990,
      categoryId: onePieceCat.id,
      isFeatured: false,
      images: ["/media/one_piece/7.jpeg", "/media/one_piece/Woman_wearing_floral_dress_202608030601.jpeg"]
    },
    {
      idx: 110,
      name: "Cotton Printed One Piece Vol-5",
      slug: "cotton-printed-one-piece-vol-5-110",
      description: "Premium quality Bangladeshi women ethnic wear Cotton Printed One Piece Vol-5. High quality fabric, comfortable fit and elegant design.",
      basePrice: 590,
      compareAtPrice: 950,
      categoryId: onePieceCat.id,
      isFeatured: true,
      images: ["/media/one_piece/Woman_wearing_floral_dress_202608030601_2.jpeg", "/media/one_piece/Woman_wearing_floral_dress_202608030601_3.jpeg"]
    },
    {
      idx: 111,
      name: "Boho Chic Long Dress Vol-6",
      slug: "boho-chic-long-dress-vol-6-111",
      description: "Premium quality Bangladeshi women ethnic wear Boho Chic Long Dress Vol-6. High quality fabric, comfortable fit and elegant design.",
      basePrice: 680,
      compareAtPrice: 990,
      categoryId: onePieceCat.id,
      isFeatured: false,
      images: ["/media/one_piece/Woman_wearing_floral_dress_202608030601_4.jpeg"]
    },
    {
      idx: 112,
      name: "Silk Kurti & Palazzo Set Vol-1",
      slug: "silk-kurti-and-palazzo-set-vol-1-112",
      description: "Premium quality Bangladeshi women ethnic wear Silk Kurti & Palazzo Set Vol-1. High quality fabric, comfortable fit and elegant design.",
      basePrice: 780,
      compareAtPrice: 950,
      categoryId: twoPieceCat.id,
      isFeatured: true,
      images: ["/media/two_piece/1.jpeg", "/media/two_piece/2.jpeg"]
    },
    {
      idx: 113,
      name: "Embellished Two Piece Set Vol-2",
      slug: "embellished-two-piece-set-vol-2-113",
      description: "Premium quality Bangladeshi women ethnic wear Embellished Two Piece Set Vol-2. High quality fabric, comfortable fit and elegant design.",
      basePrice: 780,
      compareAtPrice: 990,
      categoryId: twoPieceCat.id,
      isFeatured: false,
      images: ["/media/two_piece/3.jpeg", "/media/two_piece/4.jpeg"]
    },
    {
      idx: 114,
      name: "Cotton Trousers Set Vol-3",
      slug: "cotton-trousers-set-vol-3-114",
      description: "Premium quality Bangladeshi women ethnic wear Cotton Trousers Set Vol-3. High quality fabric, comfortable fit and elegant design.",
      basePrice: 750,
      compareAtPrice: 1050,
      categoryId: twoPieceCat.id,
      isFeatured: true,
      images: ["/media/two_piece/5.jpeg", "/media/two_piece/6.jpeg"]
    },
    {
      idx: 115,
      name: "Printed Dupatta & Kurti Set Vol-4",
      slug: "printed-dupatta-and-kurti-set-vol-4-115",
      description: "Premium quality Bangladeshi women ethnic wear Printed Dupatta & Kurti Set Vol-4. High quality fabric, comfortable fit and elegant design.",
      basePrice: 690,
      compareAtPrice: 1050,
      categoryId: twoPieceCat.id,
      isFeatured: false,
      images: ["/media/two_piece/7.jpeg", "/media/two_piece/8.jpeg"]
    },
    {
      idx: 116,
      name: "Linen Co-ord Set Vol-5",
      slug: "linen-co-ord-set-vol-5-116",
      description: "Premium quality Bangladeshi women ethnic wear Linen Co-ord Set Vol-5. High quality fabric, comfortable fit and elegant design.",
      basePrice: 720,
      compareAtPrice: 990,
      categoryId: twoPieceCat.id,
      isFeatured: true,
      images: ["/media/two_piece/Womens_two_piece_outfit_202608030602.jpeg", "/media/two_piece/Womens_two_piece_outfit_202608030602_2.jpeg"]
    },
    {
      idx: 117,
      name: "Casual Two Piece Outfit Vol-6",
      slug: "casual-two-piece-outfit-vol-6-117",
      description: "Premium quality Bangladeshi women ethnic wear Casual Two Piece Outfit Vol-6. High quality fabric, comfortable fit and elegant design.",
      basePrice: 590,
      compareAtPrice: 1050,
      categoryId: twoPieceCat.id,
      isFeatured: false,
      images: ["/media/two_piece/Womens_two_piece_outfit_202608030602_3.jpeg", "/media/two_piece/Womens_two_piece_outfit_202608030602_4.jpeg"]
    },
    {
      idx: 118,
      name: "Organza Dupatta 3-Piece Suit Vol-1",
      slug: "organza-dupatta-3-piece-suit-vol-1-118",
      description: "Premium quality Bangladeshi women ethnic wear Organza Dupatta 3-Piece Suit Vol-1. High quality fabric, comfortable fit and elegant design.",
      basePrice: 620,
      compareAtPrice: 1200,
      categoryId: threePieceCat.id,
      isFeatured: true,
      images: ["/media/three_piece/1.jpeg", "/media/three_piece/10.jpeg"]
    },
    {
      idx: 119,
      name: "Velvet Border Salwar Suit Vol-2",
      slug: "velvet-border-salwar-suit-vol-2-119",
      description: "Premium quality Bangladeshi women ethnic wear Velvet Border Salwar Suit Vol-2. High quality fabric, comfortable fit and elegant design.",
      basePrice: 850,
      compareAtPrice: 1200,
      categoryId: threePieceCat.id,
      isFeatured: false,
      images: ["/media/three_piece/11.jpeg", "/media/three_piece/12.jpeg"]
    },
    {
      idx: 120,
      name: "Lawn Embroidered 3-Piece Vol-3",
      slug: "lawn-embroidered-3-piece-vol-3-120",
      description: "Premium quality Bangladeshi women ethnic wear Lawn Embroidered 3-Piece Vol-3. High quality fabric, comfortable fit and elegant design.",
      basePrice: 690,
      compareAtPrice: 1150,
      categoryId: threePieceCat.id,
      isFeatured: true,
      images: ["/media/three_piece/13.jpeg", "/media/three_piece/14.jpeg"]
    },
    {
      idx: 121,
      name: "Chanderi Silk Suite Vol-4",
      slug: "chanderi-silk-suite-vol-4-121",
      description: "Premium quality Bangladeshi women ethnic wear Chanderi Silk Suite Vol-4. High quality fabric, comfortable fit and elegant design.",
      basePrice: 650,
      compareAtPrice: 890,
      categoryId: threePieceCat.id,
      isFeatured: false,
      images: ["/media/three_piece/15.jpeg", "/media/three_piece/16.jpeg"]
    },
    {
      idx: 122,
      name: "Festive Zari 3-Piece Vol-5",
      slug: "festive-zari-3-piece-vol-5-122",
      description: "Premium quality Bangladeshi women ethnic wear Festive Zari 3-Piece Vol-5. High quality fabric, comfortable fit and elegant design.",
      basePrice: 680,
      compareAtPrice: 950,
      categoryId: threePieceCat.id,
      isFeatured: true,
      images: ["/media/three_piece/2.jpeg", "/media/three_piece/3.jpeg"]
    },
    {
      idx: 123,
      name: "Jacquard Cotton Salwar Set Vol-6",
      slug: "jacquard-cotton-salwar-set-vol-6-123",
      description: "Premium quality Bangladeshi women ethnic wear Jacquard Cotton Salwar Set Vol-6. High quality fabric, comfortable fit and elegant design.",
      basePrice: 650,
      compareAtPrice: 890,
      categoryId: threePieceCat.id,
      isFeatured: false,
      images: ["/media/three_piece/4.jpeg", "/media/three_piece/5.jpeg"]
    },
    {
      idx: 124,
      name: "Royal Dupatta Ensemble Vol-7",
      slug: "royal-dupatta-ensemble-vol-7-124",
      description: "Premium quality Bangladeshi women ethnic wear Royal Dupatta Ensemble Vol-7. High quality fabric, comfortable fit and elegant design.",
      basePrice: 780,
      compareAtPrice: 1050,
      categoryId: threePieceCat.id,
      isFeatured: true,
      images: ["/media/three_piece/6.jpeg", "/media/three_piece/7.jpeg"]
    },
    {
      idx: 125,
      name: "Printed Lawn 3-Piece Vol-8",
      slug: "printed-lawn-3-piece-vol-8-125",
      description: "Premium quality Bangladeshi women ethnic wear Printed Lawn 3-Piece Vol-8. High quality fabric, comfortable fit and elegant design.",
      basePrice: 780,
      compareAtPrice: 1150,
      categoryId: threePieceCat.id,
      isFeatured: false,
      images: ["/media/three_piece/8.jpeg", "/media/three_piece/9.jpeg"]
    },
    {
      idx: 126,
      name: "Grand Velvet Celebration Suit Vol-1",
      slug: "grand-velvet-celebration-suit-vol-1-126",
      description: "Premium quality Bangladeshi women ethnic wear Grand Velvet Celebration Suit Vol-1. High quality fabric, comfortable fit and elegant design.",
      basePrice: 620,
      compareAtPrice: 950,
      categoryId: festiveCat.id,
      isFeatured: true,
      images: ["/media/festive/1.jpeg", "/media/festive/2.jpeg"]
    },
    {
      idx: 127,
      name: "Dazzling Zari Silk Outfit Vol-2",
      slug: "dazzling-zari-silk-outfit-vol-2-127",
      description: "Premium quality Bangladeshi women ethnic wear Dazzling Zari Silk Outfit Vol-2. High quality fabric, comfortable fit and elegant design.",
      basePrice: 680,
      compareAtPrice: 950,
      categoryId: festiveCat.id,
      isFeatured: false,
      images: ["/media/festive/3.jpeg", "/media/festive/4.jpeg"]
    },
    {
      idx: 128,
      name: "Maroon Majesty Festive Set Vol-3",
      slug: "maroon-majesty-festive-set-vol-3-128",
      description: "Premium quality Bangladeshi women ethnic wear Maroon Majesty Festive Set Vol-3. High quality fabric, comfortable fit and elegant design.",
      basePrice: 590,
      compareAtPrice: 950,
      categoryId: festiveCat.id,
      isFeatured: true,
      images: ["/media/festive/5.jpeg", "/media/festive/6.jpeg"]
    },
    {
      idx: 129,
      name: "Royal Wedding Wear Suit Vol-4",
      slug: "royal-wedding-wear-suit-vol-4-129",
      description: "Premium quality Bangladeshi women ethnic wear Royal Wedding Wear Suit Vol-4. High quality fabric, comfortable fit and elegant design.",
      basePrice: 780,
      compareAtPrice: 1200,
      categoryId: festiveCat.id,
      isFeatured: false,
      images: ["/media/festive/7.jpeg", "/media/festive/8.jpeg"]
    }
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        categoryId: p.categoryId,
        isPublished: true,
        isFeatured: p.isFeatured,
        variants: {
          create: [
            { sku: `PRM-${p.idx}-S`, size: 'S', color: 'Standard', stock: 15 },
            { sku: `PRM-${p.idx}-M`, size: 'M', color: 'Standard', stock: 25 },
            { sku: `PRM-${p.idx}-L`, size: 'L', color: 'Standard', stock: 20 },
            { sku: `PRM-${p.idx}-XL`, size: 'XL', color: 'Standard', stock: 10 },
          ],
        },
        images: {
          create: p.images.map((imgUrl: string, i: number) => ({
            url: imgUrl,
            altText: `${p.name} - View ${i + 1}`,
            position: i,
          })),
        },
      },
    });

    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        title: 'অসাধারণ কোয়ালিটি ও দাম!',
        body: 'এত কম দামে এত সুন্দর কোয়ালিটি সত্যিই অবিশ্বাস্য। খুব ভালো ফিটিং হয়েছে।',
      },
    });
  }

  console.log(`Successfully seeded ${productsData.length} products with affordable ৳600-৳850 pricing!`);
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
