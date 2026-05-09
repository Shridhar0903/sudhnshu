const mainItems = document.querySelectorAll(".ps-main-product-item");
const subMenus = document.querySelectorAll(".ps-submenu-panel");

mainItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const target = item.getAttribute("data-menu");

    /* REMOVE ACTIVE */
    mainItems.forEach((i) => i.classList.remove("active"));
    subMenus.forEach((menu) => menu.classList.remove("show"));

    /* ADD ACTIVE */
    item.classList.add("active");

    const targetMenu = document.getElementById(target);

    if (targetMenu) {
      targetMenu.classList.add("show");
    }
  });
});
