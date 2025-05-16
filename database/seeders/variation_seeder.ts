import Variation from '#models/variation'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const variations = {
  "28": [],
  "79": [
      {
          "id": 444,
          "sku": "helios-12inch-outer-packaging",
          "price": "2572.5",
          "name": "gatefoldJacket, reversePrint, n1000"
      },
      {
          "id": 443,
          "sku": "helios-12inch-outer-packaging",
          "price": "2528.4",
          "name": "gatefoldJacket, highGlossUVVarnish, n1000"
      },
      {
          "id": 442,
          "sku": "helios-12inch-outer-packaging",
          "price": "2446.5",
          "name": "gatefoldJacket, matteVarnish, n1000"
      },
      {
          "id": 441,
          "sku": "helios-12inch-outer-packaging",
          "price": "2446.5",
          "name": "gatefoldJacket, standardGloss, n1000"
      },
      {
          "id": 440,
          "sku": "helios-12inch-outer-packaging",
          "price": "2058",
          "name": "gatefoldJacket, reversePrint, n500"
      },
      {
          "id": 439,
          "sku": "helios-12inch-outer-packaging",
          "price": "2013.9",
          "name": "gatefoldJacket, highGlossUVVarnish, n500"
      },
      {
          "id": 438,
          "sku": "helios-12inch-outer-packaging",
          "price": "1932",
          "name": "gatefoldJacket, matteVarnish, n500"
      },
      {
          "id": 437,
          "sku": "helios-12inch-outer-packaging",
          "price": "1932",
          "name": "gatefoldJacket, standardGloss, n500"
      },
      {
          "id": 436,
          "sku": "helios-12inch-outer-packaging",
          "price": "651",
          "name": "wideSpineJacket, standardGloss, n500"
      },
      {
          "id": 435,
          "sku": "helios-12inch-outer-packaging",
          "price": "955.5",
          "name": "wideSpineJacket, reversePrint, n1000"
      },
      {
          "id": 434,
          "sku": "helios-12inch-outer-packaging",
          "price": "911.4",
          "name": "wideSpineJacket, highGlossUVVarnish, n1000"
      },
      {
          "id": 433,
          "sku": "helios-12inch-outer-packaging",
          "price": "829.5",
          "name": "wideSpineJacket, standardGloss, n1000"
      },
      {
          "id": 432,
          "sku": "helios-12inch-outer-packaging",
          "price": "829.5",
          "name": "wideSpineJacket, matteVarnish, n1000"
      },
      {
          "id": 431,
          "sku": "helios-12inch-outer-packaging",
          "price": "777",
          "name": "wideSpineJacket, reversePrint, n500"
      },
      {
          "id": 430,
          "sku": "helios-12inch-outer-packaging",
          "price": "732.9",
          "name": "wideSpineJacket, highGlossUVVarnish, n500"
      },
      {
          "id": 429,
          "sku": "helios-12inch-outer-packaging",
          "price": "651",
          "name": "wideSpineJacket, matteVarnish, n500"
      },
      {
          "id": 428,
          "sku": "helios-12inch-outer-packaging",
          "price": "955.5",
          "name": "standardJacket, reversePrint, n1000"
      },
      {
          "id": 427,
          "sku": "helios-12inch-outer-packaging",
          "price": "911.4",
          "name": "standardJacket, highGlossUVVarnish, n1000"
      },
      {
          "id": 426,
          "sku": "helios-12inch-outer-packaging",
          "price": "829.5",
          "name": "standardJacket, matteVarnish, n1000"
      },
      {
          "id": 425,
          "sku": "helios-12inch-outer-packaging",
          "price": "829.5",
          "name": "standardJacket, standardGloss, n1000"
      },
      {
          "id": 424,
          "sku": "helios-12inch-outer-packaging",
          "price": "777",
          "name": "standardJacket, reversePrint, n500"
      },
      {
          "id": 423,
          "sku": "helios-12inch-outer-packaging",
          "price": "732.9",
          "name": "standardJacket, highGlossUVVarnish, n500"
      },
      {
          "id": 422,
          "sku": "helios-12inch-outer-packaging",
          "price": "651",
          "name": "standardJacket, matteVarnish, n500"
      },
      {
          "id": 421,
          "sku": "helios-12inch-outer-packaging",
          "price": "651",
          "name": "standardJacket, standardGloss, n500"
      }
  ],
  "80": [
      {
          "id": 480,
          "sku": "helios-12inch-insert",
          "price": "723.45",
          "name": "n1000"
      },
      {
          "id": 479,
          "sku": "helios-12inch-insert",
          "price": "723.45",
          "name": "n900"
      },
      {
          "id": 478,
          "sku": "helios-12inch-insert",
          "price": "723.45",
          "name": "n800"
      },
      {
          "id": 477,
          "sku": "helios-12inch-insert",
          "price": "561.75",
          "name": "n700"
      },
      {
          "id": 476,
          "sku": "helios-12inch-insert",
          "price": "561.75",
          "name": "n600"
      },
      {
          "id": 475,
          "sku": "helios-12inch-insert",
          "price": "409.5",
          "name": "n500"
      },
      {
          "id": 474,
          "sku": "helios-12inch-insert",
          "price": "409.5",
          "name": "n400"
      },
      {
          "id": 473,
          "sku": "helios-12inch-insert",
          "price": "409.5",
          "name": "n300"
      },
      {
          "id": 472,
          "sku": "helios-12inch-insert",
          "price": "238.35",
          "name": "n200"
      },
      {
          "id": 471,
          "sku": "helios-12inch-insert",
          "price": "132.3",
          "name": "n100"
      }
  ],
  "81": [
      {
          "id": 416,
          "sku": "helios-12inch-polybag",
          "price": "0.16",
          "name": "polybag"
      },
      {
          "id": 415,
          "sku": "helios-12inch-polybag",
          "price": "0.16",
          "name": "resealablePolybag"
      },
      {
          "id": 414,
          "sku": "helios-12inch-polybag",
          "price": "0",
          "name": "none"
      }
  ],
  "82": [
      {
          "id": 413,
          "sku": "helios-12inch-test-press",
          "price": "5.25",
          "name": "single"
      },
      {
          "id": 412,
          "sku": "helios-12inch-test-press",
          "price": "10.5",
          "name": "double"
      }
  ],
  "83": [
      {
          "id": 411,
          "sku": "helios-12inch-color",
          "price": "2.1",
          "name": "black"
      },
      {
          "id": 410,
          "sku": "helios-12inch-color",
          "price": "2.78",
          "name": "color"
      }
  ],
  "86": [
      {
          "id": 409,
          "sku": "helios-12inch-weight",
          "price": "0.53",
          "name": "160g"
      },
      {
          "id": 408,
          "sku": "helios-12inch-weight",
          "price": "0.79",
          "name": "180g"
      }
  ],
  "87": [],
  "89": [
      {
          "id": 407,
          "sku": "helios-12inch-center-labels",
          "price": "168",
          "name": "n1000"
      }
  ],
  "102": [
      {
          "id": 406,
          "sku": "helios-12inch-assembly-option",
          "price": "0",
          "name": "placeRecordBehindJacket"
      },
      {
          "id": 405,
          "sku": "helios-12inch-assembly-option",
          "price": "0",
          "name": "insertRecordInJacket"
      }
  ],
  "280": [],
  "282": [],
  "283": [],
  "284": [],
  "285": [],
  "286": [],
  "342": [],
  "525": [
      {
          "id": 527,
          "sku": "helios-12inch-innersleeve",
          "price": "0.58",
          "name": "blackPolylinedSleeve"
      },
      {
          "id": 526,
          "sku": "helios-12inch-innersleeve",
          "price": "0.21",
          "name": "whitePaperSleeve"
      }
  ]
};

export default class extends BaseSeeder {
  static environment: string[] = ['development', 'production'];
  
  async run() {
    for (const productId of Object.keys(variations)) {
      const productVariations = variations[productId as keyof typeof variations];
      for (const variation of productVariations) {
        await Variation.updateOrCreate(
          { id: variation.id },
          {
            productId: Number(productId),
            sku: variation.sku,
            price: variation.price,
            name: variation.name,
          }
        );
      }
    }
  }
}
