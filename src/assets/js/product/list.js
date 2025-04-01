import ConfirmModal from "@/components/product/ConfirmModal.vue";
export default {
  name: "TableView",
  props: ["productList", "categories"],
  emits: ["deleteProduct"],
  components: {
    ConfirmModal: ConfirmModal,
  },
  data() {
    return {
      productData: [],
      categoriesData: [],
      showModal: false,
      confirmMessage: "",
      selectedProduct: null,
      selectedId: null,
      selectedCategory: "",
      currentPage: 1,
      productsPerPage: 5,
      orderByField: "title",
      orderByDirection: "asc",
    };
  },
  computed: {
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = startIndex + this.productsPerPage;
      return this.productData.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.productData.length / this.productsPerPage);
    },
    pages() {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    },
    totalPrice() {
      return this.paginatedProducts
        .reduce((total, product) => total + product.price, 0)
        .toFixed(2);
    },
  },
  methods: {
    resetPagination() {
      this.currentPage = 1;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage = this.currentPage + 1;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    openConfirmationModal(id) {
      this.selectedProduct = this.productData.find(
        (product) => product.id === id
      );
      this.confirmMessage = `Are you sure you want to delete product "${this.selectedProduct.title}" ?`;
      this.selectedId = id;
      this.showModal = true;
    },
    handleCancel() {
      this.selectedProduct = null;
      this.confirmMessage = "";
      this.selectedId = null;
      this.showModal = false;
    },
    getProducts() {
      return JSON.parse(localStorage.getItem("products"));
    },
    deleteCategory(category) {
      const isProductAvailable = this.getProducts().filter(
        (product) => product.category === category
      );
      if (isProductAvailable.length <= 0) {
        this.categoriesData = this.categoriesData.filter(
          (cat) => cat !== category
        );
        localStorage.setItem("categories", JSON.stringify(this.categoriesData));
        this.selectedCategory = "";
        this.applyFilter();
      }
    },
    deleteProductByIds(id) {
      const product = this.getProducts().find((product) => product.id === id);
      this.productData = this.getProducts().filter(
        (product) => product.id !== id
      );
      localStorage.setItem("products", JSON.stringify(this.productData));
      this.handleCancel();
      this.resetPagination();
      this.applyFilter();
      this.deleteCategory(product.category);
    },
    async applyFilter() {
      this.resetPagination();
      const filteredProducts = this.getProducts();
      if (this.selectedCategory) {
        this.productData = filteredProducts.filter(
          (product) => product.category === this.selectedCategory
        );
      } else {
        this.productData = filteredProducts;
      }
    },
    exportCSV() {
      const exportData = this.productData.reverse().map((product, index) => {
        return {
          title: product.title.replace(/\,/g, ""),
          price: product.price,
          category: product.category,
        };
      });
      exportData.unshift({
        title: "Product Name",
        price: "Price",
        category: "Category",
      });

      const csv = exportData
        .map((row) => Object.values(row).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "products.csv";
      link.click();
    },
    orderBy(column) {
      if (this.orderByField === column) {
        this.orderByDirection =
          this.orderByDirection === "asc" ? "desc" : "asc";
      } else {
        this.orderByField = column;
        this.orderByDirection = "asc";
      }
      this.productData.sort((a, b) => {
        if (this.orderByDirection === "asc") {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
    },
  },
  watch: {
    productList: {
      handler(newVal) {
        if (newVal) {
          this.productData = newVal;
        }
      },
      immediate: true,
    },
    categories: {
      handler(newVal) {
        if (newVal) {
          this.categoriesData = newVal;
        }
      },
      immediate: true,
    },
  },
};
