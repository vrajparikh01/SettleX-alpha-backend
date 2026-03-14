/**
 * Seed script to insert chain data into ChainList collection.
 * Run with: node src/scripts/seed_chains.js
 */

const mongoose = require('mongoose');
const config = require('../config/config');

const ChainList = require('../models/chain.model');

const chains = [
  {
    chain_id: 1,
    name: "Ethereum",
    currency: "ETH",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 56,
    name: "BNB Smart Chain",
    currency: "BNB",
    image: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 137,
    name: "Polygon",
    currency: "MATIC",
    image: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 43114,
    name: "Avalanche",
    currency: "AVAX",
    image: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 42161,
    name: "Arbitrum One",
    currency: "ETH",
    image: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 10,
    name: "Optimism",
    currency: "ETH",
    image: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 8453,
    name: "Base",
    currency: "ETH",
    image: "https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-product/Base_Network_Logo.svg",
    is_deleted: false,
  },
  {
    chain_id: 250,
    name: "Fantom",
    currency: "FTM",
    image: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
    is_deleted: false,
  },
  {
    chain_id: 324,
    name: "zkSync Era",
    currency: "ETH",
    image: "https://raw.githubusercontent.com/matter-labs/brand-assets/main/zksync-logo.svg",
    is_deleted: false,
  },
  {
    chain_id: 59144,
    name: "Linea",
    currency: "ETH",
    image: "https://raw.githubusercontent.com/MetaMask/contract-metadata/master/images/linea.svg",
    is_deleted: false,
  },
];

async function seedChains() {
  try {
    await mongoose.connect(config.mongoose.url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    for (const chain of chains) {
      const existing = await ChainList.findOne({ chain_id: chain.chain_id });
      if (existing) {
        console.log(`⏭️  Chain ${chain.chain_id} (${chain.name}) already exists, skipping.`);
      } else {
        await ChainList.create(chain);
        console.log(`✅ Inserted chain ${chain.chain_id} (${chain.name})`);
      }
    }

    console.log('\n🎉 Chain seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding chains:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedChains();
