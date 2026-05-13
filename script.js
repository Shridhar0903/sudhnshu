document.addEventListener("DOMContentLoaded", function () {
  const psMenuToggle = document.getElementById("psMenuToggle");
  const psNav = document.getElementById("psNav");

  const psDropdown = document.getElementById("psProductsDropdown");
  const psToggle = document.getElementById("psProductsToggle");

  const psMainBox = document.querySelector(".ps-main-dropdown-box");
  const psSubBox = document.querySelector(".ps-sub-floating-box");

  const psMainItems = document.querySelectorAll(".ps-main-product-item");
  const psPanels = document.querySelectorAll(".ps-submenu-panel");

  // WHOLE MEGA MENU WRAPPER
  const psMegaMenu = document.querySelector(".ps-products-dropdown");

  /* =========================================
     INITIAL STATE
  ========================================= */

  if (psSubBox) {
    psSubBox.classList.remove("show");
  }

  /* =========================================
     RESET PANELS
  ========================================= */

  function resetPanels() {
    psMainItems.forEach((item) => {
      item.classList.remove("active");
    });

    psPanels.forEach((panel) => {
      panel.classList.remove("active");
    });
  }

  /* =========================================
     OPEN SUBMENU
  ========================================= */

  function openSubmenu(item) {
    const targetId = item.getAttribute("data-target");

    if (!targetId) return;

    // remove previous active
    resetPanels();

    // active current item
    item.classList.add("active");

    // show submenu box
    psSubBox.classList.add("show");

    // show target panel
    const targetPanel = document.getElementById(targetId);

    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  }

  /* =========================================
     CLICK ONLY MAIN PRODUCT ITEMS
  ========================================= */

  psMainItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      if (window.innerWidth > 991) {
        e.preventDefault();

        openSubmenu(item);
      }
    });
  });

  /* =========================================
     CLOSE ONLY WHEN LEAVING WHOLE MENU
  ========================================= */

  if (psMegaMenu) {
    psMegaMenu.addEventListener("mouseleave", function () {
      resetPanels();

      psSubBox.classList.remove("show");
    });
  }

  /* =========================================
     MOBILE MENU TOGGLE
  ========================================= */

  if (psMenuToggle && psNav) {
    psMenuToggle.addEventListener("click", function () {
      psNav.classList.toggle("active");
    });
  }

  /* =========================================
     MOBILE PRODUCT DROPDOWN
  ========================================= */

  // if (psToggle && psDropdown) {
  //   psToggle.addEventListener("click", function () {
  //     // OPEN DROPDOWN
  //     psDropdown.classList.toggle("open");

  //     // REDIRECT TO PRODUCT PAGE
  //     if (window.innerWidth <= 991) {
  //       window.location.href = "product.html";
  //     }
  //   });
  // }

  if (psToggle && psDropdown) {
    psToggle.addEventListener("click", function () {
      // ONLY REDIRECT
      window.location.href = "product.html";
    });
  }

  /* =========================================
     OUTSIDE CLICK CLOSE MOBILE
  ========================================= */

  document.addEventListener("click", function (e) {
    if (window.innerWidth <= 991 && psDropdown) {
      if (!psDropdown.contains(e.target)) {
        psDropdown.classList.remove("open");
      }
    }
  });

  /* =========================================
     RESIZE RESET
  ========================================= */

  window.addEventListener("resize", function () {
    if (window.innerWidth > 991 && psDropdown) {
      psDropdown.classList.remove("open");
    }
  });

  /* =========================================
     HEADER SCROLL EFFECT
  ========================================= */

  window.addEventListener("scroll", function () {
    const header = document.querySelector(".ps-header");

    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});
