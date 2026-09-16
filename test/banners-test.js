const assert = require("assert");
const bannersStore = require("../server/src/lib/bannersStore");

async function testBannersStore() {
  console.log("=== Testing Banners Store & Dynamic Advertisement Management ===");

  // 1. Seed & Get All
  await bannersStore.seedIfNeeded();
  const all = await bannersStore.getAll();
  assert(Array.isArray(all), "getAll() should return array");
  assert(all.length >= 3, "Initial seed should have at least 3 default banners");
  console.log("✓ Initial seed verified:", all.length, "banners loaded");

  // 2. Filter Active Banners
  const activeHero = await bannersStore.getActive("hero");
  assert(Array.isArray(activeHero), "getActive() should return array");
  assert(activeHero.length > 0, "Should find active hero banner");
  console.log("✓ Active hero banner filtering verified:", activeHero.map(b => b.title).join(", "));

  // 3. Create Custom Dynamic Banner
  const newBanner = {
    title: "Test Sale 2026",
    subtitle: "Special test banner generated dynamically",
    badge: "Limited Offer",
    image: "images/hero/test.jpg",
    link: "category.html?cat=iphone",
    btnText: "Claim Now",
    placement: "top_strip",
    category: "all",
    active: true,
    sortOrder: 10
  };
  const id = await bannersStore.uniqueId(newBanner.title);
  newBanner.id = id;

  const afterAdd = await bannersStore.upsert(newBanner);
  const fetched = await bannersStore.getById(id);
  assert(fetched !== null, "New banner should be created");
  assert.strictEqual(fetched.title, "Test Sale 2026");
  console.log("✓ Banner creation verified:", fetched.id);

  // 4. Update & Deactivate Banner
  const afterUpdate = await bannersStore.upsert(Object.assign({}, fetched, { active: false, badge: "Updated Offer" }));
  const fetchedUpdated = await bannersStore.getById(id);
  assert.strictEqual(fetchedUpdated.active, false);
  assert.strictEqual(fetchedUpdated.badge, "Updated Offer");
  console.log("✓ Banner update & deactivation verified");

  // 5. Remove Test Banner
  await bannersStore.remove(id);
  const fetchedAfterDel = await bannersStore.getById(id);
  assert.strictEqual(fetchedAfterDel, null, "Banner should be deleted");
  console.log("✓ Banner deletion verified");

  console.log("\nALL BANNERS STORE TESTS PASSED SUCCESSFULLY! 🎉\n");
}

testBannersStore().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
