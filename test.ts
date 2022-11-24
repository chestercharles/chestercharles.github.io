var prisma: any;

(async function () {
  function shipsFromSameWarhouse(productA, productB) {
    return productA.region.id === productB.region.id;
  }

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

    shipment.products.forEach((Shipmentproduct) => {
      if (!shipsFromSameWarhouse(Shipmentproduct, newProduct)) {
        throw new Error("Cannot add product to shipment");
      }
    });

    // Add products to shipment...
  }
})();

(async function () {
  function shipsFromSameWarhouse(productA, productB) {
    return (
      productA.manufacturer === productB.manufacturer &&
      productA.distributionCenter === productB.distributionCenter
    );
  }
})();

(async function () {
  function shipsFromSameWarhouse(productA, productB) {
    return (
      productA.manufacturer === productB.manufacturer &&
      productA.distributionCenter === productB.distributionCenter
    );
  }

  var prisma: any;
  var ShipmentRepo: any;

  const include = {
    include: {
      category: true,
    },
  };

  const ProductRepo = {
    async get(id) {
      return prisma.product.findUnique({
        where: {
          id,
        },
      });
    },
    async getMany(ids) {
      return prisma.product.findMany({
        where: {
          id: ids,
        },
        include,
      });
    },
  };

  async function addToShipment(
    shipmentId: string,
    productId: string
  ): Promise<void> {
    const newProduct = await ProductRepo.get(productId);
    const shipment = await ShipmentRepo.get(shipmentId);
    const productsInShipment = await ProductRepo.getMany(shipment.products);

    productsInShipment.forEach((Shipmentproduct) => {
      if (!shipsFromSameWarhouse(Shipmentproduct, newProduct)) {
        throw new Error("Cannot add product to shipment");
      }
    });

    // Add products to shipment...
  }
})();
