const menuTabs = document.querySelectorAll(".menu-tab");
const menuGrid = document.querySelector(".menu-grid");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

const menuItems = {
  coffee: [
    {
      name: "Honey oat latte",
      price: "$5.50",
      description: "Double espresso, steamed oat milk, a little wildflower honey.",
      image: "photo-1461023058943-07fcbe16d735",
      alt: "Latte topped with delicate milk art",
    },
    {
      name: "House pour-over",
      price: "$4.75",
      description: "Today’s single-origin, brewed slow and served with a bright finish.",
      image: "photo-1511920170033-f8396924c348",
      alt: "A cup of freshly brewed black coffee",
    },
    {
      name: "Maple cold brew",
      price: "$5.25",
      description: "Steeped for 18 hours, finished with a touch of maple cream.",
      image: "photo-1570968915860-54d5c301fa9f",
      alt: "Iced coffee with milk in a glass",
    },
  ],
  bakery: [
    {
      name: "Morning bun",
      price: "$4.25",
      description: "Buttery, flaky layers rolled in cinnamon and orange sugar.",
      image: "photo-1555507036-ab1f4038808a",
      alt: "Freshly baked pastry dusted with sugar",
    },
    {
      name: "Almond croissant",
      price: "$4.75",
      description: "Twice-baked with almond cream and toasted sliced almonds.",
      image: "photo-1555507036-ab1f4038808a",
      alt: "Golden croissant fresh from the bakery",
    },
    {
      name: "Seasonal fruit tart",
      price: "$6.00",
      description: "A crisp shell, vanilla custard, and whatever’s in season.",
      image: "photo-1488477181946-6428a0291777",
      alt: "A small fruit tart with fresh seasonal fruit",
    },
  ],
  brunch: [
    {
      name: "Avocado toast",
      price: "$12.00",
      description: "Sourdough, smashed avocado, chili crunch, and a jammy egg.",
      image: "photo-1525351484163-7529414344d8",
      alt: "A colorful brunch plate served on toast",
    },
    {
      name: "Garden grain bowl",
      price: "$14.00",
      description: "Warm grains, market greens, pickled onion, lemon tahini.",
      image: "photo-1512621776951-a57141f2eefd",
      alt: "A bowl of fresh greens and grains",
    },
    {
      name: "Buttermilk pancakes",
      price: "$13.00",
      description: "A tall stack with cultured butter and maple from up north.",
      image: "photo-1528207776546-365bb710ee93",
      alt: "A stack of pancakes with syrup and berries",
    },
  ],
};

function renderMenu(category) {
  const items = menuItems[category];
  if (!items) return;

  menuGrid.setAttribute("aria-labelledby", `tab-${category}`);
  menuGrid.innerHTML = items
    .map(
      (item, index) => `
        <article class="menu-card" data-category="${category}">
          <div class="menu-card-image">
            <img
              src="https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=700&q=80"
              alt="${item.alt}"
              loading="lazy"
            />
            <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
          </div>
          <div class="menu-card-copy">
            <div><h3>${item.name}</h3><span class="price">${item.price}</span></div>
            <p>${item.description}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    menuTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    renderMenu(tab.dataset.category);
  });
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
