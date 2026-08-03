import os, random

seed_content = '''import { PrismaClient } from '@prisma/client';

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

'''

media_dir = 'apps/frontend/public/media'
categories_map = {
    'kurti': ('kurti', 'Kurti', ['Embroidered Cotton Kurti', 'Linen Daily Kurti', 'Floral Print Kurti', 'Tassel Collar Kurti', 'Ethnic Motif Kurti', 'Printed Tunic Kurti', 'Minimalist Office Kurti', 'Pastel Charm Kurti', 'Jacquard Kurti', 'Traditional Collar Kurti']),
    'one_piece': ('one-piece', 'One Piece', ['Chiffon Floral One Piece', 'Fusion Flare Dress', 'Georgette Elegance One Piece', 'Maxi Summer Dress', 'Cotton Printed One Piece', 'Boho Chic Long Dress', 'Pastel Printed One Piece']),
    'two_piece': ('two-piece', 'Two Piece', ['Silk Kurti & Palazzo Set', 'Embellished Two Piece Set', 'Cotton Trousers Set', 'Printed Dupatta & Kurti Set', 'Linen Co-ord Set', 'Casual Two Piece Outfit', 'Ethnic Co-Ord Set', 'Embroidered Two Piece']),
    'three_piece': ('three-piece', 'Three Piece', ['Organza Dupatta 3-Piece Suit', 'Velvet Border Salwar Suit', 'Lawn Embroidered 3-Piece', 'Chanderi Silk Suite', 'Festive Zari 3-Piece', 'Jacquard Cotton Salwar Set', 'Royal Dupatta Ensemble', 'Printed Lawn 3-Piece', 'Heritage Linen Suite', 'Luxury Festive Salwar']),
    'festive': ('festive', 'Festive', ['Grand Velvet Celebration Suit', 'Dazzling Zari Silk Outfit', 'Maroon Majesty Festive Set', 'Royal Wedding Wear Suit', 'Golden Sequin Festive Dress', 'Luxury Chiffon Celebration', 'Embroidered Festive Gown', 'Premium Party Ensemble'])
}

prices_pool = [590, 620, 650, 680, 690, 720, 750, 780, 790, 820, 850]
compare_pool = [890, 950, 990, 1050, 1150, 1200]

products_list = []
idx = 101

for cat_folder, (cat_slug, cat_name, title_list) in categories_map.items():
    cat_path = os.path.join(media_dir, cat_folder)
    if not os.path.exists(cat_path): continue
    files = sorted([f for f in os.listdir(cat_path) if f.endswith(('.jpeg', '.jpg', '.png'))])
    
    # Group images into products (1 to 2 images per product)
    for i in range(0, len(files), 2):
        chunk = files[i:i+2]
        title_name = title_list[(i//2) % len(title_list)] + f' Vol-{(i//2) + 1}'
        slug = title_name.lower().replace(' ', '-').replace('&', 'and').replace("'", "") + f'-{idx}'
        
        base_p = random.choice(prices_pool)
        comp_p = random.choice(compare_pool)
        
        img_urls = [f'/media/{cat_folder}/{img}' for img in chunk]
        
        cat_var = f"{cat_folder}_VAR"
        
        products_list.append({
            'idx': idx,
            'name': title_name,
            'slug': slug,
            'description': f'Premium quality Bangladeshi women ethnic wear {title_name}. High quality fabric, comfortable fit and elegant design.',
            'basePrice': base_p,
            'compareAtPrice': comp_p,
            'cat_folder': cat_folder,
            'isFeatured': (idx % 2 == 0),
            'images': img_urls
        })
        idx += 1

# Generate JS objects
js_items = []
for p in products_list:
    cat_ref = "kurtiCat.id"
    if p['cat_folder'] == 'one_piece': cat_ref = "onePieceCat.id"
    elif p['cat_folder'] == 'two_piece': cat_ref = "twoPieceCat.id"
    elif p['cat_folder'] == 'three_piece': cat_ref = "threePieceCat.id"
    elif p['cat_folder'] == 'festive': cat_ref = "festiveCat.id"

    imgs_js = ", ".join([f'"{url}"' for url in p['images']])
    
    item_str = f'''    {{
      idx: {p['idx']},
      name: "{p['name']}",
      slug: "{p['slug']}",
      description: "{p['description']}",
      basePrice: {p['basePrice']},
      compareAtPrice: {p['compareAtPrice']},
      categoryId: {cat_ref},
      isFeatured: {str(p['isFeatured']).lower()},
      images: [{imgs_js}]
    }}'''
    js_items.append(item_str)

seed_content += "  const productsData = [\n" + ",\n".join(js_items) + "\n  ];\n\n"

seed_content += '''  for (const p of productsData) {
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
'''

with open('apps/backend/prisma/seed.ts', 'w') as f:
    f.write(seed_content)

print(f'Generated seed.ts with {len(products_list)} products!')
