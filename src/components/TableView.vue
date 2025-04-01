<template>
  <div class="container">
    <div class="row d-flex align-items-center">
      <div class="col-md-12">
        <h3 class="">Filter</h3>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label for="category">Category</label>
          <select
            class="form-control"
            id="category"
            v-model="selectedCategory"
            @change="applyFilter"
          >
            <option value="" selected>All</option>
            <option v-for="category in categories" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <button class="btn btn-success" @click="exportCSV">Export CSV</button>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Product Name</th>
          <th scope="col">Price</th>
          <th scope="col">Category</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="productData.length === 0">
          <td colspan="5" class="text-center">No products found</td>
        </tr>
        <tr v-for="(product, index) in paginatedProducts" :key="product.id">
          <td>{{ (currentPage - 1) * productsPerPage + index + 1 }}</td>
          <td class="col-md-4" scope="row">{{ product.title }}</td>
          <td>
            <span class="badge bg-dark text-warning rounded-full"
              >{{ product.price }}<i class="fa fa-usd"></i
            ></span>
          </td>
          <td>
            <span class="badge bg-primary">{{ product.category }} </span>
          </td>
          <td>
            <button
              class="btn btn-danger"
              @click="openConfirmationModal(product.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-between">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Total Price: {{ totalPrice }}</h5>
        </div>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="previousPage">Previous</button>
          </li>
          <li
            v-for="page in pages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="nextPage">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <ConfirmModal
    :show="showModal"
    :confirmMessage="confirmMessage"
    :id="selectedId"
    @cancel="handleCancel"
    @confirm="deleteProductByIds"
  >
  </ConfirmModal>
</template>
<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
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
      showModal: false,
      confirmMessage: "",
      selectedProduct: null,
      selectedId: null,
      selectedCategory: "",

      currentPage: 1,
      productsPerPage: 5,
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
    deleteProductByIds(id) {
      this.productData = this.productData.filter(
        (product) => product.id !== id
      );
      localStorage.setItem("products", JSON.stringify(this.productData));
      this.handleCancel();
      this.resetPagination();
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
  },
  watch: {
    productList: {
      handler(newVal) {
        if(newVal) {
          this.productData = newVal;
        }
      },
      immediate: true
    }
  },
};
</script>
