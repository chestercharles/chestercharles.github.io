---
title: Abstract your data layer (you won't regret it)
date: 2022-11-17 21:07:31
tags:
---

The only thing engineers love to do more than warn other developers not to introduce premature abstractions is to propose abstractions. Shit, I've created generic interfaces for things with a single use case. I've defined interfaces to satisfy implementions. I've wallowed in regret as I spend hours digging through my own [lasagna code](https://softpanorama.org/SE/Anti_oo/lasagna_code.shtml) feeling like that meme with all the [spidermans pointing at each other](https://knowyourmeme.com/memes/spider-man-pointing-at-spider-man). However, something I have _rarely_ regretted was abstracting the data layer.

A common and perhaps noble reason I hear for a data layer abstraction is that it makes your database implementation easier to change. This is usually a naive reason. You're probably not going to change your databse implementation. But arguing against the data layer abstraction _because_ you're not going to change your database implementation is equally naive. Everyone is missing the point, here. **A data layer abstraction defines access patterns**.

Let's say you are building an supply chain application and have an API endpoint that supports the use case of adding a product to an existing shipment. In the handler for that endpoint, you might call this function:

```typescript
async function addToShipment(shipmentId, productId) {
  const newProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      region: true,
    },
  });

  const shipment = await prisma.shipment.findUnique({
    where: {
      id: shipmentId,
    },
    include: {
      products: {
        include: {
          region: true,
        },
      },
    },
  });

  shipment.products.forEach((shipmentproduct) => {
    if (!shipsFromSameWarhouse(shipmentproduct, newProduct)) {
      throw new Error("Cannot add product to shipment");
    }
  });

  // Add products to shipment...
}
```

This function calls the `shipsFromSameWarehose` function which might look like this:

```typescript
function shipsFromSameWarhouse(productA, productB) {
  return productA.region.id === productB.region.id;
}
```

In `addToShipment` we use the Primsa ORM to query for a product, and then for a shipment along with its products. In both cases, we include the product `region` because we need the region in order to determine if products ship from the same warehouse.

Let says your business requirements change slightly - now you have multiple distribution centers within the same region, and the `shipsFromSameWarhouse` function needs to change:

```typescript
function shipsFromSameWarhouse(productA, productB) {
  return (
    productA.region.id === productB.region.id &&
    productA.distributionCenter.id === productB.distributionCenter.id
  );
}
```

Now we need to go back to `addToShipment` and update our two Prisma queries to add `distributionCenter` to the `include` object for `product`.

```typescript
{
  include: {
    region: true,
    distributionCenter: true
  }
}
```

This isn't such a big deal, but if you are building a large application, `shipsFromSameWarhouse` might be called in lots of other use cases. We now have to go track down every Prisma query in those use cases and make changes to the `include` for `product` to make sure that we have the data needed to call `shipsFromSameWarehouse`.

Of course, if you are using TypeScript that will help identify all the places that need to change.

There are two access patterns here: querying for a shipment and querying for products with their region. In this code, our access patterns are implicit, but they exist.
